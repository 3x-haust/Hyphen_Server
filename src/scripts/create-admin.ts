import { DataSource } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import * as bcrypt from 'bcrypt';

async function createAdmin() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'hyphen',
    entities: [Admin],
    synchronize: false,
  });

  await dataSource.initialize();

  const adminRepository = dataSource.getRepository(Admin);

  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';

  const existingAdmin = await adminRepository.findOne({ where: { username } });
  if (existingAdmin) {
    console.log(`어드민 계정 "${username}"이 이미 존재합니다.`);
    await dataSource.destroy();
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = adminRepository.create({
    username,
    password: hashedPassword,
  });

  await adminRepository.save(admin);
  console.log(`어드민 계정이 생성되었습니다.`);
  console.log(`사용자명: ${username}`);
  console.log(`비밀번호: ${password}`);
  console.log('\n이 정보를 안전하게 보관하세요.');

  await dataSource.destroy();
  process.exit(0);
}

createAdmin().catch((error) => {
  console.error('어드민 계정 생성 중 오류가 발생했습니다:', error);
  process.exit(1);
});
