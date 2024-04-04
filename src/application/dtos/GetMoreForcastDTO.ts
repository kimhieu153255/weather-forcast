export class GetMoreForcastDTO {
  count: number;
  city: string;
  constructor(count: number, city: string) {
    this.count = count;
    this.city = city;
  }
}
