import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AddLocationDto } from '../dto/add-location.dto';
import { UpdateBusinessDto } from '../dto/update-business.dto';

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
