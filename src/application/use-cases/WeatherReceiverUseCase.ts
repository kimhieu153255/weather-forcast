import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { registerReceiveWeatherDTO } from '../dtos/RegisterReceiveWaetherDTO';
import { IMailService } from '../ports/IMailService';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IWeatherReceiverRepository } from '../ports/IWeatherReceiverRepository';
import { WeatherReceiver } from 'src/domain/models/WeatherReceiverModel';
import { EntityNotFoundException } from 'src/domain/exceptions/EntityNotFoundException';
import { WeatherUseCases } from './WeatherUseCase';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherReceiverUseCases {
  private readonly logger = new Logger(WeatherReceiverUseCases.name);

  constructor(
    private mailService: IMailService,
    private jwtService: JwtService,
    private weatherReceiverRepository: IWeatherReceiverRepository,
    private weatherService: WeatherUseCases,
    private configService: ConfigService,
  ) {}

  async registerReceiveWeather(
    registerReceiveWeather: registerReceiveWeatherDTO,
  ): Promise<string> {
    this.logger.log(`Registering to receive weather`);

    const receiver = await this.weatherReceiverRepository.findOne({
      where: { email: registerReceiveWeather.email },
    });

    if (receiver && receiver.isConfirmed) {
      throw new ForbiddenException('User already registered');
    }

    if (receiver && !receiver.isConfirmed) {
      await this.weatherReceiverRepository.delete(receiver.id);
    }

    const token = this.signToken(
      { email: registerReceiveWeather.email },
      { secret: 'secret' },
    );
    console.log(token);
    const receiverEntity = new WeatherReceiver(
      registerReceiveWeather.email,
      registerReceiveWeather.city,
      token,
      false,
    );

    await this.weatherReceiverRepository.save(receiverEntity);

    await this.mailService.sendMail(
      registerReceiveWeather.email,
      'Weather Registration',
      `${this.configService.get<string>('URL_BE')}receiver/confirm?token=${token}`,
    );
    return token;
  }

  signToken(payload: object | Buffer, options?: JwtSignOptions): string {
    const token = this.jwtService.sign(payload, options);

    return token;
  }

  async verifyPayload(token: string): Promise<WeatherReceiver> {
    const payload = await this.jwtService.verify(token, { secret: 'secret' });

    console.log(payload);

    const receiver = await this.weatherReceiverRepository.findOne({
      where: { email: payload.email },
    });

    if (!receiver) {
      throw new EntityNotFoundException('Receiver Not found');
    }

    if (receiver.isConfirmed) {
      throw new ForbiddenException('User confirmed');
    }

    return receiver;
  }

  async confirmReceiver(token: string): Promise<void> {
    const payload = await this.verifyPayload(token);

    console.log(payload);
    if (!payload) {
      throw new EntityNotFoundException('Receiver Not found');
    }

    const receiver = await this.weatherReceiverRepository.findOne({
      where: { email: payload.email },
    });

    if (!receiver) {
      throw new EntityNotFoundException('Receiver Not found');
    }

    if (receiver.isConfirmed) {
      throw new ForbiddenException('User already confirmed');
    }

    receiver.isConfirmed = true;

    await this.weatherReceiverRepository.save(receiver);

    return;
  }

  async sentWeather(): Promise<void> {
    this.logger.log(`Sending weather`);

    const receivers = await this.weatherReceiverRepository.find({
      where: { isConfirmed: true },
    });
    if (receivers.length === 0) {
      return;
    }

    for (const receiver of receivers) {
      const weather = await this.weatherService.getWeatherByCity(receiver.city);

      await this.mailService.sendMail(
        receiver.email,
        'Weather',
        `The weather in ${weather.name} is ${weather.temperature}°C, wind speed is ${weather.windSpeed} km/h, humidity is ${weather.humidity}%`,
      );
    }

    return;
  }
}
