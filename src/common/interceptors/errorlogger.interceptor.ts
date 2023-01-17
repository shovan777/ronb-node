/*
https://docs.nestjs.com/interceptors#interceptors
*/

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before...');
    // before request processing here
    return next.handle().pipe(
      // tap(() => console.log(`After request is processed`))
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }
}
