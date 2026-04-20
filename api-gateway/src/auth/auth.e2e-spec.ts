import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    // Enable global validation pipe (matches your production setup)
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    prisma = app.get(PrismaService);

    // Clean up the test database before tests
    await prisma.customer.deleteMany();
  });

  afterAll(async () => {
    // Optionally clean up after tests
    await prisma.customer.deleteMany();
    await app.close();
  });

  it('should hash a password correctly', async () => {
    const password = 'mypassword';
    const response = await request(app.getHttpServer())
      .post('/auth/hash-test') // This endpoint is just for testing; you can create it
      .send({ password })
      .expect(201);

    expect(response.body.hash).toBeDefined();
    expect(response.body.hash).not.toEqual(password);
  });

  it('should register a new user', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.email).toBe(email);

    // Confirm user exists in database
    const user = await prisma.customer.findUnique({ where: { email } });
    expect(user).toBeTruthy();
  });

  it('should login an existing user and return a JWT', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    expect(typeof res.body.accessToken).toBe('string');
  });
});
