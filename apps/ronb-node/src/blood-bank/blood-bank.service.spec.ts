import { Test, TestingModule } from '@nestjs/testing';
import { BloodBankService } from './blood-bank.service';

describe('BloodBankService', () => {
  let service: BloodBankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BloodBankService],
    }).compile();

    service = module.get<BloodBankService>(BloodBankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
