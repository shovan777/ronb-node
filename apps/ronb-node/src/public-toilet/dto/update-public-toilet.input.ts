import { CreatePublicToiletInput } from './create-public-toilet.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePublicToiletInput extends PartialType(
  CreatePublicToiletInput,
) {}
