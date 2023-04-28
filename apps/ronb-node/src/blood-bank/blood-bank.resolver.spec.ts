import { Test, TestingModule } from '@nestjs/testing';
import { BloodBankResolver } from './blood-bank.resolver';

describe('BloodBankResolver', () => {
  let resolver: BloodBankResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BloodBankResolver],
    }).compile();

    resolver = module.get<BloodBankResolver>(BloodBankResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
