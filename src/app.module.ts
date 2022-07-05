import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    NewsModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // uploads: {
      //   maxFileSize: 10000000, // 10 MB
      //   maxFiles: 5,
      // },
      uploads: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
