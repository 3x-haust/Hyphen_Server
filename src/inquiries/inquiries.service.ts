import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from '../entities/inquiry.entity';
import { CreateInquiryDto } from '../dto/create-inquiry.dto';
import { AnswerInquiryDto } from '../dto/answer-inquiry.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiriesRepository: Repository<Inquiry>,
    private mailService: MailService,
  ) {}

  async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    const inquiry = this.inquiriesRepository.create(createInquiryDto);
    return await this.inquiriesRepository.save(inquiry);
  }

  async findAll(): Promise<Inquiry[]> {
    return await this.inquiriesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Inquiry> {
    const inquiry = await this.inquiriesRepository.findOne({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException(`Inquiry with ID ${id} not found`);
    }
    return inquiry;
  }

  async answer(
    id: string,
    answerInquiryDto: AnswerInquiryDto,
  ): Promise<Inquiry> {
    const inquiry = await this.findOne(id);
    inquiry.answer = answerInquiryDto.answer;
    inquiry.isAnswered = true;
    const savedInquiry = await this.inquiriesRepository.save(inquiry);

    try {
      await this.mailService.sendInquiryAnswer(
        inquiry.email,
        inquiry.subject,
        inquiry.message,
        answerInquiryDto.answer,
      );
    } catch (error) {}

    return savedInquiry;
  }

  async remove(id: string): Promise<void> {
    const inquiry = await this.findOne(id);
    await this.inquiriesRepository.remove(inquiry);
  }
}
