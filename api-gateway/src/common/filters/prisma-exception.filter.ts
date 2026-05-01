import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { mapPrismaErrorToResponse } from './filter-helper-functions';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const { code } = exception;
    const { statusCode, errorType } = mapPrismaErrorToResponse(code);

    return response.status(statusCode).json({ statusCode, errorType });
  }
}
