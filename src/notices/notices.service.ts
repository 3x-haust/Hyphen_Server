import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from '../entities/notice.entity';
import { CreateNoticeDto } from '../dto/create-notice.dto';
import { UpdateNoticeDto } from '../dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private noticesRepository: Repository<Notice>,
  ) {}

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const notice = this.noticesRepository.create(createNoticeDto);
    return await this.noticesRepository.save(notice);
  }

  async findAll(isActive?: boolean): Promise<Notice[]> {
    if (isActive !== undefined) {
      return await this.noticesRepository.find({
        where: { isActive },
        order: { createdAt: 'DESC' },
      });
    }
    return await this.noticesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notice> {
    const notice = await this.noticesRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }
    return notice;
  }

  async update(id: string, updateNoticeDto: UpdateNoticeDto): Promise<Notice> {
    const notice = await this.findOne(id);
    Object.assign(notice, updateNoticeDto);
    return await this.noticesRepository.save(notice);
  }

  async remove(id: string): Promise<void> {
    const notice = await this.findOne(id);
    await this.noticesRepository.remove(notice);
  }
}
