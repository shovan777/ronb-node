/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "recommendation";

export interface GetNewsRecommendationRequest {
  userId: number;
}

export interface GetNewsRecommendationResponse {
  /** array of news ids */
  newsIds: number[];
}

export const RECOMMENDATION_PACKAGE_NAME = "recommendation";

export interface NewsRecommendationServiceClient {
  getNewsRecommendation(request: GetNewsRecommendationRequest): Observable<GetNewsRecommendationResponse>;
}

export interface NewsRecommendationServiceController {
  getNewsRecommendation(
    request: GetNewsRecommendationRequest,
  ): Promise<GetNewsRecommendationResponse> | Observable<GetNewsRecommendationResponse> | GetNewsRecommendationResponse;
}

export function NewsRecommendationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getNewsRecommendation"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("NewsRecommendationService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("NewsRecommendationService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const NEWS_RECOMMENDATION_SERVICE_NAME = "NewsRecommendationService";
