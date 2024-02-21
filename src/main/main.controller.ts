import { Get, Controller, Param } from '@nestjs/common';
import { MainService } from './main.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('main')
@Controller('main')
export class MainController {
  constructor(private readonly tagService: MainService) { }

  @ApiOperation({ summary: '获取所有信息' })
  @Get('getAllPackages')
  async getAllPackages(): Promise<any[]> {
    return await this.tagService.getAllPackages();
  }
  
  @ApiOperation({ summary: '开锁关锁' })
  @Get('/lock/:lock_status')
  async lock(@Param('lock_status') lock_status: string): Promise<any[]> {
    return await this.tagService.lock(lock_status);
  }
}