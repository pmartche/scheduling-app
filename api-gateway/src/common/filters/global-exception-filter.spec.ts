import { HttpAdapterHost } from '@nestjs/core';
import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import {
  INTERNAL_SERVER_ERROR,
  REQUIRED_RECORDS_NOT_FOUND,
} from '@scheduling-app/shared-config';

const baseTestCondition =
  'replies with response object, response body, and status code';
const testCondition1 = 'exception is HttpException';
const testCondition1Result = 'gets the status code from the exception arg';
const testCondition1SubCondition1 =
  'exception response has an `errorType` property';
const testCondition1SubCondition1Result =
  'gets `errorType` value from `exception.getResponse().errorType`';

describe('GlobalExceptionFilter', () => {
  let globalExceptionFilter: GlobalExceptionFilter;

  const reply = jest.fn();

  const httpAdapterHost = {
    httpAdapter: { reply },
  } as unknown as HttpAdapterHost;

  beforeEach(() => {
    jest.clearAllMocks();
    globalExceptionFilter = new GlobalExceptionFilter(httpAdapterHost);
  });

  const response = {};

  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;

  function executeTest(
    exception: unknown,
    statusCode: HttpStatus,
    errorType = INTERNAL_SERVER_ERROR,
  ) {
    const responseBody = { statusCode, errorType };

    globalExceptionFilter.catch(exception, host);

    expect(reply).toHaveBeenCalledWith(response, responseBody, statusCode);
    expect(reply).toHaveBeenCalledTimes(1);
  }

  it(baseTestCondition, () =>
    executeTest(new Error(), HttpStatus.INTERNAL_SERVER_ERROR),
  );

  it(`${testCondition1Result} when ${testCondition1}`, () => {
    const exceptionResponse = 'response';
    const statusCode = HttpStatus.BAD_REQUEST;
    const exception = new HttpException(exceptionResponse, statusCode);

    executeTest(exception, statusCode);
  });

  it(`${testCondition1SubCondition1Result} when ${testCondition1SubCondition1}`, () => {
    const errorType = REQUIRED_RECORDS_NOT_FOUND;
    const exceptionResponse = { errorType };
    const statusCode = HttpStatus.NOT_FOUND;
    const exception = new HttpException(exceptionResponse, statusCode);

    executeTest(exception, statusCode, errorType);
  });
});
