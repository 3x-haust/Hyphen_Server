import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePortfolioDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

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
