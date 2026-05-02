import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { INTERNAL_SERVER_ERROR } from '@scheduling-app/shared-config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const httpContext = host.switchToHttp();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorType = INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const response = exception.getResponse();

      if (
        typeof response === 'object' &&
        response !== null &&
        'errorType' in response &&
        typeof response.errorType === 'string'
      )
        errorType = response.errorType;
    }

    const responseBody = { statusCode, errorType };

    httpAdapter.reply(httpContext.getResponse(), responseBody, statusCode);
  }
}
