import { Test, TestingModule } from '@nestjs/testing';
import { NewsCommentsService } from './comments.service';

describe('NewsCommentsService', () => {
  let service: NewsCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsCommentsService],
    }).compile();

    service = module.get<NewsCommentsService>(NewsCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
