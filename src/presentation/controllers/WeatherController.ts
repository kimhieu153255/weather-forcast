import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { WeatherUseCases } from 'src/application/use-cases/WeatherUseCase';
import { SuccessInterceptor } from 'src/infrastructure/interceptors/success.interceptor';
import { BadRequestError } from '../errors/BadRequestError';
import { WeatherVM } from '../view-models/Weather/WeatherVM';
import { SuccessResponseDTO } from 'src/application/dtos/SuccessResponseDTO';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GetMoreForcastVM } from '../view-models/Weather/GetMoreForcastVM';

@ApiTags('Weather')
@Controller('weather')
@UseInterceptors(SuccessInterceptor)
export class WeatherController {
  constructor(private readonly weatherSevice: WeatherUseCases) {}

  @Get('get-current-weather')
  @ApiQuery({ name: 'city', type: String, required: true })
  @ApiOperation({ summary: 'Get current weather by city' })
  @ApiOkResponse({
    description: 'The current weather',
    type: WeatherVM,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request object',
    type: BadRequestError,
  })
  async getCurrentWeather(@Query('city') city: string) {
    const weather = await this.weatherSevice.getWeatherByCity(city);

    return new SuccessResponseDTO({
      message: 'Weather found',
      metadata: WeatherVM.toViewModel(weather),
    });
  }

  @Get('history')
  @ApiOperation({ summary: 'Get weather history' })
  @ApiOkResponse({
    description: 'The weather history',
    type: WeatherVM,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request object',
    type: BadRequestError,
  })
  async getHistory() {
    const weathers = await this.weatherSevice.getWeatherHistory();

    return new SuccessResponseDTO({
      message: 'Weather history found',
      metadata: weathers.map((weather) => WeatherVM.toViewModel(weather)),
    });
  }

  @Get('more-focast')
  @ApiOperation({ summary: 'Get more forecast by city' })
  @ApiOkResponse({
    description: 'The forecast weather',
    type: WeatherVM,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request object',
    type: BadRequestError,
  })
  async getMoreForecast(@Query() getMoreForcastVM: GetMoreForcastVM) {
    const weathers = await this.weatherSevice.getMoreWeather(
      GetMoreForcastVM.fromViewModel(getMoreForcastVM),
    );

    return new SuccessResponseDTO({
      message: 'Weather found',
      metadata: weathers.map((weather) => WeatherVM.toViewModel(weather)),
    });
  }

  @Get('save-current-weather')
  @ApiOperation({ summary: 'Save current weather' })
  @ApiOkResponse({
    description: 'The current weather',
    type: WeatherVM,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request object',
    type: BadRequestError,
  })
  async saveCurrentWeather(@Query('city') city: string) {
    const weather = await this.weatherSevice.saveCurrentWeather(city);

    return new SuccessResponseDTO({
      message: 'Weather saved',
      metadata: WeatherVM.toViewModel(weather),
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldHistory() {
    return await this.weatherSevice.deleteOldHistory();
  }
}
