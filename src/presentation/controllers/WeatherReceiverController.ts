import { Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessInterceptor } from 'src/infrastructure/interceptors/success.interceptor';
import { BadRequestError } from '../errors/BadRequestError';
import { WeatherVM } from '../view-models/Weather/WeatherVM';
import { SuccessResponseDTO } from 'src/application/dtos/SuccessResponseDTO';
import { WeatherReceiverUseCases } from 'src/application/use-cases/WeatherReceiverUseCase';
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('Receiver')
@Controller('receiver')
@UseInterceptors(SuccessInterceptor)
export class WeatherReceiverController {
  constructor(
    private readonly weatherReceiverSevice: WeatherReceiverUseCases,
  ) {}

  @Post('receive-weather')
  @ApiOperation({ summary: 'Receive weather data' })
  @ApiQuery({ name: 'email', type: String, required: true })
  @ApiQuery({ name: 'city', type: String, required: true })
  @ApiOkResponse({
    description: 'The weather data',
    type: WeatherVM,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request object',
    type: BadRequestError,
  })
  async receiveWeather(
    @Query('email') email: string,
    @Query('city') city: string,
  ) {
    const token = await this.weatherReceiverSevice.registerReceiveWeather({
      email,
      city,
    });

    return new SuccessResponseDTO({
      message: 'Weather data received',
      metadata: { token },
    });
  }

  @Get('confirm')
  @ApiOperation({ summary: 'Confirm weather data' })
  @ApiQuery({ name: 'token', type: String, required: true })
  @ApiOkResponse({
    description: 'The weather data',
    type: WeatherVM,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request object',
    type: BadRequestError,
  })
  async confirmWeather(@Query('token') token: string) {
    await this.weatherReceiverSevice.confirmReceiver(token);

    return new SuccessResponseDTO({
      message: 'Weather data confirmed',
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM, { name: 'Sent weather' })
  async sentWeather() {
    await this.weatherReceiverSevice.sentWeather();
  }
}
