import { registerEnumType } from '@nestjs/graphql';

export enum State {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    REVIEWED = 'reviewed',
  }

registerEnumType(State, {
  name: 'State',
});