import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { PrismaExceptionFilter } from '../common/filters/prisma-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { createPinoHttpOptions } from '../common/logging/pino-http.config';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LoggerModule.forRoot({
      pinoHttp: createPinoHttpOptions(),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}
