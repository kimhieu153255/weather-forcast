import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IWeatherRepository } from 'src/application/ports/IWeatherRepository';
import { WeatherUseCases } from 'src/application/use-cases/WeatherUseCase';
import { WeatherController } from 'src/presentation/controllers/WeatherController';
import { WeatherRepository } from '../db/repository/WeatherRepository';

@Module({
  imports: [ConfigModule],
  controllers: [WeatherController],
  providers: [
    WeatherUseCases,
    { provide: IWeatherRepository, useClass: WeatherRepository },
  ],
})
export class WeatherModule {}
