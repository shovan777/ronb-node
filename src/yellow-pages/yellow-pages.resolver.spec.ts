import { Test, TestingModule } from '@nestjs/testing';
import { YellowPagesResolver } from './yellow-pages.resolver';

describe('YellowPagesResolver', () => {
  let resolver: YellowPagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YellowPagesResolver],
    }).compile();

    resolver = module.get<YellowPagesResolver>(YellowPagesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
