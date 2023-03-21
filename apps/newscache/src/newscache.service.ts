import { Injectable } from '@nestjs/common';

@Injectable()
export class NewscacheService {
  getHello(): string {
    return 'Hello World!';
  }
}
