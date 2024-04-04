import { Injectable } from '@nestjs/common';

import { IRepository } from './IRepository';
import { WeatherReceiver } from 'src/domain/models/WeatherReceiverModel';

@Injectable()
export abstract class IWeatherReceiverRepository extends IRepository<WeatherReceiver> {}
