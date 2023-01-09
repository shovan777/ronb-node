import { Test, TestingModule } from '@nestjs/testing';
import { YellowPagesService } from './yellow-pages.service';

describe('YellowPagesService', () => {
  let service: YellowPagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YellowPagesService],
    }).compile();

    service = module.get<YellowPagesService>(YellowPagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
