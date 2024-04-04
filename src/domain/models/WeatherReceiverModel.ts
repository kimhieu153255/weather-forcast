import { BaseModel } from './BaseModel';

export class WeatherReceiver extends BaseModel {
  email: string;
  city: string;
  hashCode: string;
  isConfirmed: boolean;

  constructor(
    email: string,
    city: string,
    hashCode: string,
    isConfirmed: boolean,
  ) {
    super();
    this.email = email;
    this.city = city;
    this.hashCode = hashCode;
    this.isConfirmed = isConfirmed;
  }
}
