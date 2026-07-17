import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { INTERNAL_SERVER_ERROR } from '@scheduling-app/shared-config';
import {
  FieldErrors,
  type ApiErrorResponse,
} from '@scheduling-app/shared-types';
import { isFieldErrors, isObject } from './filter-helper-functions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const httpContext = host.switchToHttp();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorType = INTERNAL_SERVER_ERROR;
    let fieldErrors: FieldErrors | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const response = exception.getResponse();

      if (isObject(response)) {
        if ('errorType' in response && typeof response.errorType === 'string')
          errorType = response.errorType;

        if ('fieldErrors' in response && isFieldErrors(response.fieldErrors))
          fieldErrors = response.fieldErrors;
      }
    }

    const responseBody: ApiErrorResponse = isFieldErrors(fieldErrors)
      ? { statusCode, errorType, fieldErrors }
      : { statusCode, errorType };

    httpAdapter.reply(httpContext.getResponse(), responseBody, statusCode);
  }
}
