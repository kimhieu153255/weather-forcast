import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherReceiverUseCases } from 'src/application/use-cases/WeatherReceiverUseCase';
import { IWeatherReceiverRepository } from 'src/application/ports/IWeatherReceiverRepository';
import { MailModule } from './Mail.module';
import { WeatherReceiverController } from 'src/presentation/controllers/WeatherReceiverController';
import { JwtModule } from '@nestjs/jwt';
import { WeatherReceiverRepository } from '../db/repository/WeatherReceiverRepository';
import { IWeatherRepository } from 'src/application/ports/IWeatherRepository';
import { WeatherRepository } from '../db/repository/WeatherRepository';
import { WeatherUseCases } from 'src/application/use-cases/WeatherUseCase';

@Module({
  imports: [
    ConfigModule,
    MailModule,
    JwtModule.register({
      signOptions: {
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
  ],
  controllers: [WeatherReceiverController],
  providers: [
    WeatherReceiverUseCases,
    WeatherUseCases,
    {
      provide: IWeatherReceiverRepository,
      useClass: WeatherReceiverRepository,
    },
    {
      provide: IWeatherRepository,
      useClass: WeatherRepository,
    },
  ],
})
export class WeatherReceiverModule {}
