import { ApproveReportDto } from './dtos/approve-report.dto';
import { User } from './../users/user.entity';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private repo: Repository<Report>,
  ) {}

  allReports() {
    return this.repo.find({
      relations: ['user'],
    });
  }
  create(body: CreateReportDto, user: User) {
    const report = this.repo.create(body);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApprovalStatus(id: number, approved: boolean) {
    const report = await this.repo.findOne({
      relations: ['user'],
      where: { id },
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }
}
