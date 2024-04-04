import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IWeatherRepository } from '../ports/IWeatherRepository';
import { Weather } from 'src/domain/models/WeatherModel';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EntityNotFoundException } from 'src/domain/exceptions/EntityNotFoundException';
import { FindOptionsWhere, LessThan } from 'typeorm';
import { GetMoreForcastDTO } from '../dtos/GetMoreForcastDTO';

@Injectable()
export class WeatherUseCases {
  private readonly logger = new Logger(WeatherUseCases.name);
  constructor(
    private weatherRepository: IWeatherRepository,
    private configService: ConfigService,
  ) {}

  async getWeatherHistory(): Promise<Weather[]> {
    this.logger.log(`Getting all weather`);

    return this.weatherRepository.find();
  }

  async saveWeather(weather: Weather): Promise<Weather> {
    this.logger.log(`Saving weather for city: ${weather.name}`);

    return await this.weatherRepository.save(weather);
  }

  async deleteOldHistory(): Promise<void> {
    this.logger.log(`Deleting old weather history`);
    const now = new Date();
    now.setDate(now.getDate() - 1);

    try {
      const criteria: FindOptionsWhere<Weather> = {
        createdAt: LessThan(now),
      };
      await this.weatherRepository.delete(criteria);
    } catch (error) {
      this.logger.error(`Error deleting old weather history: ${error.message}`);
      throw error;
    }

    return;
  }

  async getWeatherByCity(city: string): Promise<Weather> {
    this.logger.log(`Getting weather for city: ${city}`);

    const res = await axios
      .get(
        `${this.configService.get<string>('WEATHER_URL')}current.json?key=${this.configService.get<string>('WEATHER_API_KEY')}&q=${city}&lang=en`,
      )
      .then((res) => res.data);
    if (!res.location) throw new EntityNotFoundException('City not found');

    const result = await this.weatherRepository.save(
      new Weather(
        res.location.name,
        res.current.temp_c,
        res.current.wind_kph,
        res.current.humidity,
        new Date(),
        res.current.condition.icon,
      ),
    );
    if (!result) throw new InternalServerErrorException('Error saving weather');

    return result;
  }

  async getMoreWeather(
    getMoreForcastDTO: GetMoreForcastDTO,
  ): Promise<Weather[]> {
    this.logger.log(`Getting ${getMoreForcastDTO.count} more weather`);

    const res = await axios
      .get(
        `${this.configService.get<string>('WEATHER_URL')}forecast.json?key=${this.configService.get<string>('WEATHER_API_KEY')}&days=${getMoreForcastDTO.count + 1}&hour=24&q=${getMoreForcastDTO.city}&lang=en`,
      )
      .then((res) => res.data);
    if (!res.forecast) throw new EntityNotFoundException('City not found');

    return res.forecast.forecastday.map(
      (weather: any) =>
        new Weather(
          getMoreForcastDTO.city,
          weather.day.avgtemp_c,
          weather.day.maxwind_kph,
          weather.day.avghumidity,
          new Date(weather.date),
          weather.day.condition.icon,
        ),
    );
  }
}
