import { PublishState } from '../enum/publish_state.enum';

export const checkIfObjectIsPublished = (state: string) => {
  if (state === PublishState.PUBLISHED) {
    return true;
  }
  return false;
};
