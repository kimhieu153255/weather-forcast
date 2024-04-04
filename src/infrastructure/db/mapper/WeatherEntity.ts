import { EntitySchema } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Weather } from 'src/domain/models/WeatherModel';

export const WeatherEntity = new EntitySchema<Weather>({
  name: 'Weather',
  tableName: 'weathers',
  target: Weather,

  columns: {
    name: {
      type: String,
      length: 100,
    },
    temperature: {
      type: 'float',
    },
    windSpeed: {
      type: 'float',
    },
    humidity: {
      type: 'float',
    },
    date: {
      type: Date,
    },
    icon: {
      type: String,
      length: 200,
    },
    ...BaseEntity,
  },

  orderBy: {
    createdAt: 'ASC',
  },

  indices: [
    {
      name: 'INDEX_WEATHER_NAME',
      unique: false,
      columns: ['name'],
    },
  ],
});
