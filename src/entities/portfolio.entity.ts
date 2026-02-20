import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  heroImage: string;

  @Column({ type: 'text', nullable: true })
  images: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  date: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'int', nullable: true })
  participantsCount: number;

  @Column({ type: 'int', nullable: true })
  sponsorsCount: number;

  @Column({ type: 'text', nullable: true })
  links: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  galleryFolder: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
