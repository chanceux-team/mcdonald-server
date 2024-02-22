import { Get, Controller, Param, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CalendarUpdateDto } from './dto/index.dto';

@ApiBearerAuth()
@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly service: CalendarService) { }

  @ApiOperation({ summary: '获取一年内的数据' })
  @Get()
  async getData(): Promise<any[]> {
    return await this.service.get();
  }

  @ApiOperation({ summary: '更新数据' })
  @Post()
  @ApiBody({ type: CalendarUpdateDto, required: false })
  @ApiConsumes('application/x-www-form-urlencoded')
  async update(@Body() updateDto: CalendarUpdateDto): Promise<any[]> {
    return await this.service.updateCount(updateDto)
  }
}
