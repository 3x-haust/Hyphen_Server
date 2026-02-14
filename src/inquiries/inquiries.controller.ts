import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from '../dto/create-inquiry.dto';
import { AnswerInquiryDto } from '../dto/answer-inquiry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiriesService.create(createInquiryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.inquiriesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(id);
  }

  @Post(':id/answer')
  @UseGuards(JwtAuthGuard)
  answer(@Param('id') id: string, @Body() answerInquiryDto: AnswerInquiryDto) {
    return this.inquiriesService.answer(id, answerInquiryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.inquiriesService.remove(id);
  }
}
