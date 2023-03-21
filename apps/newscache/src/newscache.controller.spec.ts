import { Test, TestingModule } from '@nestjs/testing';
import { NewscacheController } from './newscache.controller';
import { NewscacheService } from './newscache.service';

describe('NewscacheController', () => {
  let newscacheController: NewscacheController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NewscacheController],
      providers: [NewscacheService],
    }).compile();

    newscacheController = app.get<NewscacheController>(NewscacheController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(newscacheController.getHello()).toBe('Hello World!');
    });
  });
});
