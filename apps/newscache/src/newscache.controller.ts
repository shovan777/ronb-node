import { Controller, Get } from '@nestjs/common';
import { NewscacheService } from './newscache.service';

@Controller()
export class NewscacheController {
  constructor(private readonly newscacheService: NewscacheService) {}

  @Get()
  getHello(): string {
    return this.newscacheService.getHello();
  }
}
