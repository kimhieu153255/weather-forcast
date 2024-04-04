import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';

export class WeatherVM {
  @Expose()
  @ApiProperty({
    description: 'The id of the Weather',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The name of the City',
    example: 'London',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The temperature of the city',
    example: 25,
  })
  temperature: number;

  @Expose()
  @ApiProperty({
    description: 'The wind speed of the city',
    example: 10,
  })
  windSpeed: number;

  @Expose()
  @ApiProperty({
    description: 'The humidity of the city',
    example: 20,
  })
  humidity: number;

  @Expose()
  @ApiProperty({
    description: 'The crational date of the Weather',
    example: new Date(),
  })
  date: Date;

  @Expose()
  @ApiProperty({ description: 'The crational date of the Weather' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The date of the last Weather' })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ description: 'The icon of the Weather' })
  icon: string;

  static toViewModel(weather: WeatherVM): WeatherVM {
    return plainToClass(
      WeatherVM,
      {
        id: weather.id,
        name: weather.name,
        temperature: weather.temperature,
        windSpeed: weather.windSpeed,
        humidity: weather.humidity,
        date: weather.date,
        icon: weather.icon,
        createdAt: weather.createdAt,
        updatedAt: weather.updatedAt,
      },
      { excludeExtraneousValues: true },
    );
  }
}
