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

  @ApiPropertyOptional({
    enum: ['increment', 'decrement'],
  })
  operation: 'increment' | 'decrement';
}
