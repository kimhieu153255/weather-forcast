import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { Weather } from 'src/domain/models/WeatherModel';
import { IWeatherRepository } from 'src/application/ports/IWeatherRepository';
import { WeatherEntity } from '../mapper/WeatherEntity';

@Injectable()
export class WeatherRepository
  extends BaseRepository<Weather>
  implements IWeatherRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, WeatherEntity);
  }
}
