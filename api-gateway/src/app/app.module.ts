import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { PrismaExceptionFilter } from '../common/filters/prisma-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}
