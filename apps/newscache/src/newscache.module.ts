import { Module } from '@nestjs/common';
import { NewscacheController } from './newscache.controller';
import { NewscacheService } from './newscache.service';

@Module({
  imports: [],
  controllers: [NewscacheController],
  providers: [NewscacheService],
})
export class NewscacheModule {}
