import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { IWeatherReceiverRepository } from 'src/application/ports/IWeatherReceiverRepository';
import { WeatherReceiverEntity } from '../mapper/WeatherReceiverEntity';
import { WeatherReceiver } from 'src/domain/models/WeatherReceiverModel';

@Injectable()
export class WeatherReceiverRepository
  extends BaseRepository<WeatherReceiver>
  implements IWeatherReceiverRepository
{
  constructor(entityManager: EntityManager) {
    super(entityManager, WeatherReceiverEntity);
  }
}
