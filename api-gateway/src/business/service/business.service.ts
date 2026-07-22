import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AddLocationDto,
  CreateBusinessDto,
  UpdateBusinessDto,
  UpdateLocationDto,
} from '@scheduling-app/shared-schemas';

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getBusinesses() {
    const result = await this.prismaService.business.findMany();

    this.logger.log(
      { event: 'business.requestedAll', businessCount: result.length },
      'Businesses retrieved',
    );

    return result;
  }

  async getBusinessById(id: string) {
    const result = await this.prismaService.business.findUniqueOrThrow({
      where: { id },
    });

    this.logger.log(
      { event: 'business.requested', businessId: result.id },
      'Business retrieved',
    );

    return result;
  }

  async createBusiness(business: CreateBusinessDto) {
    const result = await this.prismaService.business.create({ data: business });

    this.logger.log(
      { event: 'business.created', businessId: result.id },
      'Business created',
    );

    return result;
  }

  async addLocation(location: AddLocationDto) {
    const result = await this.prismaService.location.create({ data: location });

    this.logger.log(
      {
        event: 'location.created',
        locationId: result.id,
        businessId: result.businessId,
      },
      'Location created',
    );

    return result;
  }

  async updateBusiness(business: UpdateBusinessDto) {
    const { id, ...data } = business;
    const result = await this.prismaService.business.update({
      where: { id },
      data,
    });

    this.logger.log(
      { event: 'business.updated', businessId: id },
      'Business updated',
    );

    return result;
  }

  async updateLocation(location: UpdateLocationDto) {
    const { id, ...data } = location;
    const result = await this.prismaService.location.update({
      where: { id },
      data,
    });

    this.logger.log(
      { event: 'location.updated', locationId: id },
      'Location updated',
    );

    return result;
  }
}
