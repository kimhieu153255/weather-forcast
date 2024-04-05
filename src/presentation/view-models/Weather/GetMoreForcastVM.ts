import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GetMoreForcastDTO } from 'src/application/dtos/GetMoreForcastDTO';

export class GetMoreForcastVM {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    name: 'count',
    type: Number,
    required: true,
  })
  count: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'city',
    type: String,
    required: true,
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
