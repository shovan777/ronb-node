import { Test, TestingModule } from '@nestjs/testing';
import { NewsCommentsResolver } from './comments.resolver';
import { NewsCommentsService } from './comments.service';

describe('NewsCommentsResolver', () => {
  let resolver: NewsCommentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsCommentsResolver, NewsCommentsService],
    }).compile();

    resolver = module.get<NewsCommentsResolver>(NewsCommentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
