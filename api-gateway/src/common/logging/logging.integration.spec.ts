import {
  BadRequestException,
  Controller,
  Get,
  Injectable,
  type INestApplication,
  Logger as NestLogger,
  Res,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { INTERNAL_SERVER_ERROR } from '@scheduling-app/shared-config';
import type { Response } from 'express';
import {
  Logger as PinoLogger,
  LoggerErrorInterceptor,
  LoggerModule,
} from 'nestjs-pino';
import { Writable } from 'node:stream';
import request from 'supertest';
import { GlobalExceptionFilter } from '../filters/global-exception.filter';
import { createPinoHttpOptions } from './pino-http.config';

const RESPONSE_COOKIE = 'session=response-cookie-secret';
const UNEXPECTED_ERROR_MESSAGE = 'Unexpected logging test error';

type LogRecord = {
  level: number;
  msg?: string;
  context?: string;
  event?: string;
  responseTime?: number;
  req?: {
    id?: string | number;
    method?: string;
    url?: string;
    headers?: Record<string, string>;
  };
  res?: {
    statusCode?: number;
    headers?: Record<string, string>;
  };
  err?: {
    type?: string;
    message?: string;
    stack?: string;
  };
};

@Injectable()
class LoggingTestService {
  private readonly logger = new NestLogger(LoggingTestService.name);

  execute() {
    this.logger.log(
      { event: 'logging.test_completed' },
      'Logging test completed',
    );

    return { success: true };
  }
}

@Controller('logging-test')
class LoggingTestController {
  constructor(private readonly service: LoggingTestService) {}

  @Get('success')
  success(@Res({ passthrough: true }) response: Response) {
    response.setHeader('Set-Cookie', RESPONSE_COOKIE);

    return this.service.execute();
  }

  @Get('bad-request')
  badRequest(): never {
    throw new BadRequestException({
      errorType: 'TEST_BAD_REQUEST',
    });
  }

  @Get('error')
  error(): never {
    throw new Error(UNEXPECTED_ERROR_MESSAGE);
  }
}

describe('structured logging integration', () => {
  let app: INestApplication;
  const logChunks: string[] = [];

  const destination = new Writable({
    write(chunk, _encoding, callback) {
      logChunks.push(chunk.toString());
      callback();
    },
  });

  const readLogs = (): LogRecord[] =>
    logChunks
      .join('')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as LogRecord);

  const responseLogsFor = (url: string): LogRecord[] =>
    readLogs().filter((log) => log.req?.url === url && log.res);

  const waitForLogs = () =>
    new Promise<void>((resolve) => setImmediate(resolve));

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          pinoHttp: [createPinoHttpOptions('test'), destination],
        }),
      ],
      controllers: [LoggingTestController],
      providers: [
        LoggingTestService,
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
        },
      ],
    }).compile();

    app = testingModule.createNestApplication({
      bufferLogs: true,
    });

    app.useLogger(app.get(PinoLogger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
    app.setGlobalPrefix('api');

    await app.init();

    logChunks.length = 0;
  });

  afterEach(() => {
    logChunks.length = 0;
  });

  afterAll(async () => {
    await app.close();
  });

  it('logs a successful response once and correlates the service log', async () => {
    const url = '/api/logging-test/success';
    const authorization = 'Bearer authorization-secret';
    const requestCookie = 'session=request-cookie-secret';

    await request(app.getHttpServer())
      .get(url)
      .set('Authorization', authorization)
      .set('Cookie', requestCookie)
      .expect(200, { success: true });

    await waitForLogs();

    const logs = readLogs();
    const responseLogs = responseLogsFor(url);
    const serviceLog = logs.find(
      ({ event }) => event === 'logging.test_completed',
    );

    expect(responseLogs).toHaveLength(1);
    expect(responseLogs[0]).toMatchObject({
      level: 30,
      msg: 'request completed',
      req: {
        method: 'GET',
        url,
      },
      res: {
        statusCode: 200,
      },
    });
    expect(responseLogs[0].responseTime).toEqual(expect.any(Number));

    expect(serviceLog).toMatchObject({
      level: 30,
      context: LoggingTestService.name,
      event: 'logging.test_completed',
      msg: 'Logging test completed',
    });

    expect(responseLogs[0].req?.id).toEqual(expect.anything());
    expect(serviceLog?.req?.id).toBe(responseLogs[0].req?.id);

    expect(responseLogs[0].req?.headers?.authorization).toBe('[REDACTED]');
    expect(responseLogs[0].req?.headers?.cookie).toBe('[REDACTED]');
    expect(responseLogs[0].res?.headers?.['set-cookie']).toBe('[REDACTED]');

    const serializedLogs = JSON.stringify(logs);

    for (const secret of [authorization, requestCookie, RESPONSE_COOKIE]) {
      expect(serializedLogs).not.toContain(secret);
    }
  });

  it('logs a client error at warn level with the original exception', async () => {
    const url = '/api/logging-test/bad-request';

    const response = await request(app.getHttpServer()).get(url).expect(400);

    await waitForLogs();

    expect(response.body).toEqual({
      statusCode: 400,
      errorType: 'TEST_BAD_REQUEST',
    });

    const responseLogs = responseLogsFor(url);

    expect(responseLogs).toHaveLength(1);
    expect(responseLogs[0]).toMatchObject({
      level: 40,
      req: {
        method: 'GET',
        url,
      },
      res: {
        statusCode: 400,
      },
      err: {
        type: 'BadRequestException',
      },
    });
    expect(responseLogs[0].err?.stack).toEqual(expect.any(String));
  });

  it('logs an unexpected error once at error level with its stack trace', async () => {
    const url = '/api/logging-test/error';

    const response = await request(app.getHttpServer()).get(url).expect(500);

    await waitForLogs();

    expect(response.body).toEqual({
      statusCode: 500,
      errorType: INTERNAL_SERVER_ERROR,
    });

    const logs = readLogs();
    const responseLogs = logs.filter((log) => log.req?.url === url && log.res);
    const logsContainingError = logs.filter((log) =>
      JSON.stringify(log).includes(UNEXPECTED_ERROR_MESSAGE),
    );

    expect(responseLogs).toHaveLength(1);
    expect(logsContainingError).toHaveLength(1);

    expect(responseLogs[0]).toMatchObject({
      level: 50,
      req: {
        method: 'GET',
        url,
      },
      res: {
        statusCode: 500,
      },
      err: {
        type: 'Error',
        message: UNEXPECTED_ERROR_MESSAGE,
      },
    });
    expect(responseLogs[0].err?.stack).toContain(UNEXPECTED_ERROR_MESSAGE);
  });
});
