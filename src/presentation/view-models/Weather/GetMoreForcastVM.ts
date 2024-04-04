import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GetMoreForcastDTO } from 'src/application/dtos/GetMoreForcastDTO';

export class GetMoreForcastVM {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'The count of the Weather',
    example: 5,
  })
  count: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the City',
    example: 'London',
  })
  city: string;

  public static fromViewModel(
    getMoreForcastVM: GetMoreForcastVM,
  ): GetMoreForcastDTO {
    return new GetMoreForcastDTO(
      parseInt(getMoreForcastVM.count.toString()),
      getMoreForcastVM.city,
    );
  }
}
