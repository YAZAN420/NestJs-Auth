// // src/common/filters/global-exception.filter.ts
// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   private readonly logger = new Logger(GlobalExceptionFilter.name);

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message: string | string[] = 'Internal server error';
//     let errorType = 'SystemException';

//     // 1. معالجة أخطاء NestJS والـ Business Logic
//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const exceptionResponse = exception.getResponse();
//       errorType = exception.constructor.name; // استخراج اسم الكلاس (مثل UserNotFoundException)

//       // التعامل مع أخطاء الـ DTO (class-validator) التي ترجع مصفوفة
//       if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
//         message = (exceptionResponse as any).message || exceptionResponse;
//       } else {
//         message = exceptionResponse as string;
//       }
//     }
//     // 2. هنا يمكنك إضافة قواعد لالتقاط أخطاء قاعدة البيانات
//     // else if (exception instanceof PrismaClientKnownRequestError) { ... }

//     // 3. تسجيل الخطأ باحترافية
//     this.logMessage(request, message, status, exception);

//     // 4. إرجاع استجابة موحدة ونظيفة جداً للـ Frontend
//     response.status(status).json({
//       success: false,
//       error: {
//         type: errorType,
//         statusCode: status,
//         message: message,
//         path: request.url,
//         timestamp: new Date().toISOString(),
//       },
//     });
//   }

//   private logMessage(
//     request: Request,
//     message: any,
//     status: number,
//     exception: unknown,
//   ) {
//     // إذا كان الخطأ من السيرفر (500)، نطبع الـ Stack Trace كاملة لمعرفة مكان الانهيار
//     if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
//       this.logger.error(
//         `[CRITICAL] ${request.method} ${request.url} - ${JSON.stringify(message)}`,
//         exception instanceof Error ? exception.stack : String(exception),
//       );
//     } else {
//       // إذا كان الخطأ من العميل (مثل إدخال خاطئ أو يوزر غير موجود)، نسجله كتحذير فقط
//       this.logger.warn(
//         `[${request.method}] ${request.url} - Status: ${status} - Error: ${JSON.stringify(message)}`,
//       );
//     }
//   }
// }
