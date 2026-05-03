import { IsUUID } from 'class-validator';

export class AddLocationDto {
  @IsUUID()
  businessId!: string;
  name!: string;
  email!: string;
  address!: string;
  city!: string;
  postalCode!: string;
  country!: string;
}
