import type { Options } from 'pino-http';

export function createPinoHttpOptions(
  environment = process.env.NODE_ENV,
): Options {
  const isDevelopment = environment === 'development';

  return {
    name: 'api-gateway',
    level: isDevelopment ? 'debug' : 'info',

    customLogLevel: (_request, response, error) => {
      if (response.statusCode >= 500) {
        return 'error';
      }

      if (response.statusCode >= 400) {
        return 'warn';
      }

      if (error) {
        return 'error';
      }

      return 'info';
    },

    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,

    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
        'req.body.password',
        'req.body.refreshToken',
      ],
      censor: '[REDACTED]',
    },
  };
}
