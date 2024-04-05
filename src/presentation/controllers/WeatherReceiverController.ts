import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
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
import { RegisterForcastVM } from '../view-models/Weather/RegiterForcastVM';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();

@ApiTags('Receiver')
@Controller('receiver')
@UseInterceptors(SuccessInterceptor)
export class WeatherReceiverController {
  constructor(
    private readonly weatherReceiverSevice: WeatherReceiverUseCases,
  ) {}

  @Post('receive-weather')
  @ApiOperation({ summary: 'Receive weather data' })
  @ApiBody({ type: RegisterForcastVM })
  @ApiOkResponse({
    description: 'The weather data',
    type: WeatherVM,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request object',
    type: BadRequestError,
  })
  async receiveWeather(@Body() registerReceiveWeather: RegisterForcastVM) {
    const token = await this.weatherReceiverSevice.registerReceiveWeather(
      RegisterForcastVM.fromViewModel(registerReceiveWeather),
    );

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
  @Redirect(`${configService.get<string>('URL_FE')}confirm/success`, 200)
  async confirmWeather(@Query('token') token: string) {
    console.log(configService.get<string>('URL_FE'));
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
