import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalendarUpdateDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  count: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time'
  })
  date: string;
}

export class CalendarQueryDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time'
  })
  start_date: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time'
  })
  end_date: string;
}
