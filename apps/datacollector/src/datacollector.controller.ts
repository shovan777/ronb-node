import { Controller, Get } from '@nestjs/common';
import { DatacollectorService } from './datacollector.service';
import { RecommendationData } from './interfaces/recommendations.interface';

@Controller()
export class DatacollectorController {
  constructor(private readonly datacollectorService: DatacollectorService) {}

  @Get('rec')
  getHello(): Promise<RecommendationData> {
    return this.datacollectorService.getRecommendationData();
  }
}
