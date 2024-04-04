import { Module, OnModuleDestroy } from '@nestjs/common';
import { setEnvironment } from './infrastructure/env';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm';
import { HealthController } from './infrastructure/terminus';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { TerminusModule } from '@nestjs/terminus';
import { CacheService } from './infrastructure/cache';
import { HttpModule } from '@nestjs/axios';
import { Connection } from 'typeorm';
import { WeatherModule } from './infrastructure/ioc/Weather.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherReceiverModule } from './infrastructure/ioc/WeatherReceiver.module';

@Module({
  imports: [
    WeatherModule,
    WeatherReceiverModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
      load: [typeorm],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements OnModuleDestroy {
  constructor(private readonly connection: Connection) {}

  onModuleDestroy() {
    this.connection
      .destroy()
      .then(() => console.log('TypeORM connection closed.'));
  }
}
