import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Portfolio } from '../entities/portfolio.entity';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private portfoliosRepository: Repository<Portfolio>,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const portfolio = this.portfoliosRepository.create(createPortfolioDto);
    return await this.portfoliosRepository.save(portfolio);
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    query?: string,
    category?: string,
  ): Promise<{
    items: Portfolio[];
    page: number;
    pageSize: number;
    total: number;
    hasNext: boolean;
  }> {
    const skip = (page - 1) * pageSize;
    
    const queryBuilder = this.portfoliosRepository
      .createQueryBuilder('portfolio')
      .where('portfolio.isActive = :isActive', { isActive: true });

    if (query) {
      queryBuilder.andWhere('portfolio.name LIKE :query', { query: `%${query}%` });
    }

    if (category) {
      queryBuilder.andWhere('portfolio.category = :category', { category });
    }

    queryBuilder
      .orderBy('portfolio.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      page,
      pageSize,
      total,
      hasNext: skip + items.length < total,
    };
  }

  async findOne(id: string): Promise<Portfolio> {
    const portfolio = await this.portfoliosRepository.findOne({
      where: { id },
    });
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
    return portfolio;
  }

  async findBySlug(slug: string): Promise<Portfolio> {
    const portfolio = await this.portfoliosRepository.findOne({
      where: { slug },
    });
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with slug ${slug} not found`);
    }
    return portfolio;
  }

  async update(
    id: string,
    updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<Portfolio> {
    const portfolio = await this.findOne(id);
    Object.assign(portfolio, updatePortfolioDto);
    return await this.portfoliosRepository.save(portfolio);
  }

  async remove(id: string): Promise<void> {
    const portfolio = await this.findOne(id);
    await this.portfoliosRepository.remove(portfolio);
  }
}
