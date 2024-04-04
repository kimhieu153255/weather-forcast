import { WeatherReceiver } from 'src/domain/models/WeatherReceiverModel';
import { EntitySchema } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export const WeatherReceiverEntity = new EntitySchema<WeatherReceiver>({
  name: 'WeatherReceiver',
  tableName: 'weather_receivers',
  target: WeatherReceiver,

  columns: {
    email: {
      type: String,
      length: 100,
    },
    city: {
      type: String,
      length: 500,
    },
    hashCode: {
      type: String,
      length: 500,
    },
    isConfirmed: {
      type: Boolean,
    },
    ...BaseEntity,
  },

  orderBy: {
    createdAt: 'ASC',
  },

  indices: [
    {
      name: 'INDEX_WEATHER_EMAIL',
      unique: false,
      columns: ['email'],
    },
  ],

  relations: {},
});
