import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { PrismaExceptionFilter } from '../common/filters/prisma-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'api-gateway',
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:standard',
                },
              },

        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers.set-cookie',
            'req.body.password',
            'req.body.refreshToken',
          ],
          censor: '[REDACTED]',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}
