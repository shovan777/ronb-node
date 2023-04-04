import { InputType, Field } from '@nestjs/graphql';
import { Upload } from '@app/shared/common/scalars/upload.scalar';
import { GeoJSONPointScalar } from '@app/shared/common/scalars/geojson/Point.scalar';
import { Point } from 'geojson';
import { PublishState as PublicToiletState } from '@app/shared/common/enum/publish_state.enum';

@InputType()
export class CreatePublicToiletInput {
  @Field({ description: 'PublicToilet name' })
  name: string;

  @Field({ description: 'Public Toilet content' })
  content: string;

  @Field({ description: 'Public Toilet address' })
  address: string;

  @Field(() => Upload, {
    description: 'Public Toilet Feature Image',
    nullable: true,
  })
  singleImage?: Upload;

  @Field(() => [Upload], { description: 'Public Toilet image', nullable: true })
  images?: Upload[];

  @Field(() => GeoJSONPointScalar, {
    description: 'Public Toilet location',
    nullable: true,
  })
  geopoint: Point;

  @Field(() => PublicToiletState, { description: 'Public Toilet State' })
  state?: PublicToiletState;
}
