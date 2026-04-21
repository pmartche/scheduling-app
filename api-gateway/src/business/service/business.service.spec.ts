import { Test } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { BusinessController } from '../controller/business.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AddLocationDto } from '../dto/add-location.dto';

describe('BusinessService', () => {
  let service: BusinessService;
  let prismaService: {
    business: { create: jest.Mock; update: jest.Mock };
    location: { create: jest.Mock };
  };

  beforeEach(async () => {
    const prismaMock = {
      business: { create: jest.fn(), update: jest.fn() },
      location: { create: jest.fn() },
    };

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
    const newBusiness = { name: 'New Biz' };

    it('creates a business when input is valid', async () => {
      const prismaCreationObject = { data: newBusiness };
      const result = { id: '1', ...newBusiness };

      prismaService.business.create.mockResolvedValue(result);

      expect(await service.createBusiness(newBusiness)).toEqual(result);

      expect(prismaService.business.create).toHaveBeenCalledWith(
        prismaCreationObject
      );

      expect(prismaService.business.create).toHaveBeenCalledTimes(1);
    });

    it('propagates prisma errors', async () => {
      const error = new Error('DB failure');
      prismaService.business.create.mockRejectedValue(error);

      await expect(service.createBusiness(newBusiness)).rejects.toThrow(error);
    });
  });

  describe('addLocation', () => {
    const newLocation: AddLocationDto = {
      businessId: '12345',
      name: 'Downtown branch',
      email: 'abc@def.com',
      address: '123 Avenue Road',
      city: 'Toronto',
      postalCode: '1A1 A1A',
      country: 'Canada',
    };

    it('adds a location when input is valid', async () => {
      const prismaCreationObject = { data: newLocation };
      const result = { id: '1', ...newLocation };

      prismaService.location.create.mockResolvedValue(result);

      expect(await service.addLocation(newLocation)).toEqual(result);

      expect(prismaService.location.create).toHaveBeenCalledWith(
        prismaCreationObject
      );

      expect(prismaService.location.create).toHaveBeenCalledTimes(1);
    });

    it('propagates prisma errors', async () => {
      const error = new Error('Prisma Error');

      prismaService.location.create.mockRejectedValue(error);

      await expect(service.addLocation(newLocation)).rejects.toThrow(error);
    });
  });
});
