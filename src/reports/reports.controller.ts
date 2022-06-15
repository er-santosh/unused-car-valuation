import { GetEstimateDto } from './dtos/get-estimate.dto';
import { AdminGuard } from './../guards/admin.guard';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { ReportDto } from './dtos/report.dto';
import { AuthGuard } from './../guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('reports')
@Serialize(ReportDto) //serialize all routes
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  reportList() {
    return this.reportsService.allReports();
  }

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: number, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApprovalStatus(id, body.approved);
  }

  @Get('/get-estimate')
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.getEstimateValue(query);
  }
}
