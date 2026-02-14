import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const admin = await this.adminRepository.findOne({ where: { username } });
    if (!admin) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return null;
    }
    const { password: _, ...result } = admin;
    return result;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(
        loginDto.username,
        loginDto.password,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { username: user.username, sub: user.id };
      const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
      const refresh_token = await this.generateRefreshToken(user.id);

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async generateRefreshToken(adminId: string): Promise<string> {
    const token = randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.save({
      token,
      adminId,
      expiresAt,
    });

    await this.cleanupExpiredTokens();

    return token;
  }

  async refreshAccessToken(refreshToken: string) {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['admin'],
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload = {
      username: tokenRecord.admin.username,
      sub: tokenRecord.admin.id,
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      access_token,
    };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepository.delete({ token: refreshToken });
  }

  async cleanupExpiredTokens() {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  async createAdmin(username: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.adminRepository.create({
      username,
      password: hashedPassword,
    });
    return await this.adminRepository.save(admin);
  }
}
