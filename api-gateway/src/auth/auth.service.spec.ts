import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get(AuthService);
  });

  it('should hash a password', async () => {
    const password = 'super-secret';

    const hash = await service.hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(password);
  });

  it('should validate a correct password', async () => {
    const password = 'super-secret';

    const hash = await service.hashPassword(password);
    const isValid = await service.validatePassword(password, hash);

    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const password = 'super-secret';
    const wrongPassword = 'wrong-password';

    const hash = await service.hashPassword(password);
    const isValid = await service.validatePassword(wrongPassword, hash);

    expect(isValid).toBe(false);
  });
});
