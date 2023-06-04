import { Test, TestingModule } from '@nestjs/testing';
import { DatacollectorController } from './datacollector.controller';
import { DatacollectorService } from './datacollector.service';

describe('DatacollectorController', () => {
  let datacollectorController: DatacollectorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DatacollectorController],
      providers: [DatacollectorService],
    }).compile();

    datacollectorController = app.get<DatacollectorController>(
      DatacollectorController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(datacollectorController.getHello()).toBe('Hello World!');
    });
  });
});
