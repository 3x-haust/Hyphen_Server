import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  heroImage?: string;

  @IsString()
  @IsOptional()
  images?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  participantsCount?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sponsorsCount?: number;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  galleryFolder?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
