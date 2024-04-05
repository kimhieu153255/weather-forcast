import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { RegisterReceiveWeatherDTO } from 'src/application/dtos/RegisterReceiveWaetherDTO';

export class RegisterForcastVM {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'city',
    type: String,
    required: true,
  })
  city: string;

  static fromViewModel(
    registerReceiveWeatherDTO: RegisterReceiveWeatherDTO,
  ): RegisterReceiveWeatherDTO {
    return plainToClass(RegisterReceiveWeatherDTO, registerReceiveWeatherDTO);
  }
}
