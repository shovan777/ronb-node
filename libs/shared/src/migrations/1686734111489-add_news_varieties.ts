import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewsVarieties1686734111489 implements MigrationInterface {
  name = 'AddNewsVarieties1686734111489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."news_variety_enum" AS ENUM('default', 'topTen', 'movieRelease', 'sharePrice', 'goldPrice', 'achievement', 'summary_news', 'lostNFound')`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD "variety" "public"."news_variety_enum" NOT NULL DEFAULT 'default'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "variety"`);
    await queryRunner.query(`DROP TYPE "public"."news_variety_enum"`);
  }
}
