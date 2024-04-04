export class registerReceiveWeatherDTO {
  email: string;
  city: string;
  constructor(email: string, city: string) {
    this.email = email;
    this.city = city;
  }
}
