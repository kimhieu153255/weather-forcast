import { Injectable } from '@nestjs/common';

import { IRepository } from './IRepository';
import { Weather } from 'src/domain/models/WeatherModel';

@Injectable()
export abstract class IWeatherRepository extends IRepository<Weather> {}
