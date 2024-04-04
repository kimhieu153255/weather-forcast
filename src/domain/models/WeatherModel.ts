import { BaseModel } from './BaseModel';

export class Weather extends BaseModel {
  temperature: number;
  windSpeed: number;
  humidity: number;
  name: string;
  date: Date;
  icon: string;

  constructor(
    name: string,
    temperature: number,
    windSpeed: number,
    humidity: number,
    date: Date,
    icon: string,
  ) {
    super();
    this.name = name;
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.date = date;
    this.icon = icon;
  }

  equals(entity: Weather): boolean {
    return this.id === entity.id;
  }
}
