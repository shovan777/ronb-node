import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNewsStatusAndPinnedFields1661508763753
  implements MigrationInterface
{
  name = 'addNewsStatusAndPinnedFields1661508763753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news" ADD "pinned" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."news_state_enum" AS ENUM('draft', 'published', 'reviewed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD "state" "public"."news_state_enum" NOT NULL DEFAULT 'draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "state"`);
    await queryRunner.query(`DROP TYPE "public"."news_state_enum"`);
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "pinned"`);
  }
}
