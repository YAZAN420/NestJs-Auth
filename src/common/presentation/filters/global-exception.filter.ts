import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const method = request.method;
    const url = request.originalUrl;

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'An error occurred in the interior rooms';
    let errorType = 'InternalServerError';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      errorType = exception.name;

      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        message = (exceptionResponse as Record<string, unknown>).message as
          | string
          | string[];
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = exception.message;
      }
    } else if (this.isMongoDuplicateKeyError(exception)) {
      httpStatus = HttpStatus.CONFLICT;
      message = 'Sorry, this record already exists in the system.';
      errorType = 'DuplicateKeyError';
    } else if (exception instanceof Error) {
      this.logger.error(
        `[${method}] ${url} - ${exception.message}`,
        exception.stack,
      );
    }

    response.status(httpStatus).json({
      success: false,
      statusCode: httpStatus,
      error: errorType,
      message,
      timestamp: new Date().toISOString(),
      path: url,
    });
  }

  private isMongoDuplicateKeyError(
    error: unknown,
  ): error is { name: 'MongoServerError'; code: number } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as Record<string, unknown>).name === 'MongoServerError' &&
      'code' in error &&
      (error as Record<string, unknown>).code === 11000
    );
  }
}
