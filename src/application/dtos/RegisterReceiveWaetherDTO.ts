export class RegisterReceiveWeatherDTO {
  email: string;
  city: string;
  constructor(email: string, city: string) {
    this.email = email;
    this.city = city;
  }
}
