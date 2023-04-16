/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "news";

export interface UserId {
  id: number;
}

export interface BeginCachingResponse {
  success: boolean;
}

export const NEWS_PACKAGE_NAME = "news";

export interface NewsCachingServiceClient {
  beginCaching(request: UserId): Observable<BeginCachingResponse>;
}

export interface NewsCachingServiceController {
  beginCaching(
    request: UserId,
  ): Promise<BeginCachingResponse> | Observable<BeginCachingResponse> | BeginCachingResponse;
}

export function NewsCachingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["beginCaching"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("NewsCachingService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("NewsCachingService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const NEWS_CACHING_SERVICE_NAME = "NewsCachingService";
