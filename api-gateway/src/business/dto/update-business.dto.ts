import { IsUUID } from 'class-validator';

export class UpdateBusinessDto {
  @IsUUID()
  id!: string;
  name!: string;
}
