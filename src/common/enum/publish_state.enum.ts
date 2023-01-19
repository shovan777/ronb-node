import { registerEnumType } from '@nestjs/graphql';

export enum PublishState {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REVIEWED = 'reviewed',
}

registerEnumType(PublishState, {
  name: 'State',
});
