import { Test } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { BusinessController } from '../controller/business.controller';
import { PrismaService } from '../../prisma/prisma.service';

describe('BusinessService', () => {
  let service: BusinessService;
  let prismaService: { business: { create: jest.Mock } };

  beforeEach(async () => {
    const prismaMock = { business: { create: jest.fn() } };

    const moduleRef = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        BusinessService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = moduleRef.get(BusinessService);
    prismaService = moduleRef.get(PrismaService);
  });

  describe('createBusiness', () => {
    it('creates a business when input is valid', async () => {
      const newBusinessName = 'New Biz';
      const result = { id: '1', name: newBusinessName };
      const properCreationObject = { data: { name: newBusinessName } };
      prismaService.business.create.mockResolvedValue(result);

      expect(await service.createBusiness({ name: newBusinessName })).toEqual(
        result
      );

      expect(prismaService.business.create).toHaveBeenCalledWith(
        properCreationObject
      );
    });
  });
});
