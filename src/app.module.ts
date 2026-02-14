import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoticesModule } from './notices/notices.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { Notice } from './entities/notice.entity';
import { Inquiry } from './entities/inquiry.entity';
import { Portfolio } from './entities/portfolio.entity';
import { Admin } from './entities/admin.entity';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'hyphen',
      entities: [Notice, Inquiry, Portfolio, Admin, RefreshToken],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    NoticesModule,
    InquiriesModule,
    PortfoliosModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
