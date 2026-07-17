import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AddLocationDto,
  CreateBusinessDto,
  UpdateBusinessDto,
} from '@scheduling-app/shared-schemas';

@Injectable()
export class BusinessService {
  constructor(private prismaService: PrismaService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  createBusiness(business: CreateBusinessDto) {
    return this.prismaService.business.create({ data: business });
  }

  addLocation(location: AddLocationDto) {
    return this.prismaService.location.create({ data: location });
  }

  updateBusiness(business: UpdateBusinessDto) {
    const { id, ...data } = business;
    return this.prismaService.business.update({
      where: { id },
      data,
    });
  }
}
