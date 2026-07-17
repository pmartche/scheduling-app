import { HttpAdapterHost } from '@nestjs/core';
import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import {
  INTERNAL_SERVER_ERROR,
  REQUIRED_RECORDS_NOT_FOUND,
} from '@scheduling-app/shared-config';
import { FieldErrors } from '@scheduling-app/shared-types';

const baseTestCondition = 'replies with response object, body, and status code';

// Condition 1
const testCondition1 = 'exception is HttpException';
const testCondition1Result = 'gets the status code from the exception arg';

// Subcondition 1
const testCondition1SubCondition1 =
  'exception response has an `errorType` property';
const testCondition1SubCondition1Result =
  'gets `errorType` value from `exception.getResponse().errorType` and adds it to the response body';

// Subcondition 1, sub-subcondition 1
const testCondition1SubCondition1SubSubCondition1 =
  'exception response has a non-string `errorType` property';
const testCondition1SubCondition1SubSubCondition1Result =
  'defaults `errorType` value to internal server error and adds it to the response body';

// Subcondition 2
const testCondition1SubCondition2 =
  'exception response has a `fieldErrors` property of type `FieldErrors`';
const testCondition1SubCondition2Result =
  'gets `fieldErrors` value from `exception.getResponse().fieldErrors` and adds it to the response body';

// Subcondition 2, sub-subcondition 2
const testCondition1SubCondition2SubSubCondition2 =
  'exception response has a `fieldErrors` property not of type `FieldErrors`';
const testCondition1SubCondition2SubSubCondition2Result =
  "doesn't add `fieldErrors` to the response body";

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
    errorType: unknown = INTERNAL_SERVER_ERROR,
    fieldErrors?: FieldErrors,
  ) {
    const responseBody = {
      statusCode,
      errorType:
        typeof errorType === 'string' ? errorType : INTERNAL_SERVER_ERROR,
      ...(fieldErrors === undefined ? {} : { fieldErrors }),
    };

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

  it(`${testCondition1SubCondition1SubSubCondition1Result} when ${testCondition1SubCondition1SubSubCondition1}`, () => {
    const errorType = 5;
    const exceptionResponse = { errorType };
    const statusCode = HttpStatus.NOT_FOUND;
    const exception = new HttpException(exceptionResponse, statusCode);

    executeTest(exception, statusCode, errorType);
  });

  it(`${testCondition1SubCondition2Result} when ${testCondition1SubCondition2}`, () => {
    const errorType = REQUIRED_RECORDS_NOT_FOUND;
    const fieldErrors: FieldErrors = { a: ['a', 'b'], b: ['c', 'd'] };
    const exceptionResponse = { errorType, fieldErrors };
    const statusCode = HttpStatus.NOT_FOUND;
    const exception = new HttpException(exceptionResponse, statusCode);

    executeTest(exception, statusCode, errorType, fieldErrors);
  });

  it(`${testCondition1SubCondition2SubSubCondition2Result} when ${testCondition1SubCondition2SubSubCondition2}`, () => {
    const errorType = REQUIRED_RECORDS_NOT_FOUND;
    const fieldErrors = { a: 'a', b: 'b' };
    const exceptionResponse = { errorType, fieldErrors };
    const statusCode = HttpStatus.NOT_FOUND;
    const exception = new HttpException(exceptionResponse, statusCode);

    executeTest(exception, statusCode, errorType);
  });
});
