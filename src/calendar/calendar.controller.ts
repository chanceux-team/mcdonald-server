import { Get, Controller, Param, Post, Body, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CalendarUpdateDto, CalendarQueryDto } from './dto/index.dto';
import type { Calendar } from './interface'

@ApiBearerAuth()
@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly service: CalendarService) { }

  @ApiOperation({ summary: '获取Calendar数据（默认一年内）' })
  @Get()
  async getData(): Promise<Calendar[]> {
    return await this.service.get();
  }

  @ApiOperation({ summary: '获取时间段的累加数据' })
  @Get('counts')
  async getCountSum(@Query() query: CalendarQueryDto): Promise<number> {
    return await this.service.getCountSum(query);
  }

  @ApiOperation({ summary: '更新数据' })
  @Post()
  @ApiBody({ type: CalendarUpdateDto, required: false })
  @ApiConsumes('application/x-www-form-urlencoded')
  async update(@Body() updateDto: CalendarUpdateDto): Promise<Calendar> {
    return await this.service.updateCount(updateDto)
  }
}
