import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BusinessService {
  constructor(private prismaService: PrismaService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  createBusiness(business: CreateBusinessDto) {
    return this.prismaService.business.create({ data: business });
  }
}
