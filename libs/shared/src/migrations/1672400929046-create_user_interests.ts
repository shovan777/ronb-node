import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserInterests1672400929046 implements MigrationInterface {
  name = 'createUserInterests1672400929046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_interests" ("userId" integer NOT NULL, CONSTRAINT "PK_2454ca172bd394ec6a5f17d8e4c" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_interests_news_tags_tag" ("userInterestsUserId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_e6bacb1fa97810405329767b603" PRIMARY KEY ("userInterestsUserId", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8c31761d878724a2ca346db58a" ON "user_interests_news_tags_tag" ("userInterestsUserId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_008ab229a69a9d85c945f2ff36" ON "user_interests_news_tags_tag" ("tagId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_interests_news_categories_news_category" ("userInterestsUserId" integer NOT NULL, "newsCategoryId" integer NOT NULL, CONSTRAINT "PK_640ae7e5e3bfcb0e6e3455c3988" PRIMARY KEY ("userInterestsUserId", "newsCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58f175d65e43e6f863ed1b2a28" ON "user_interests_news_categories_news_category" ("userInterestsUserId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc629862465ce4d8af01af96b6" ON "user_interests_news_categories_news_category" ("newsCategoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_news_engagement" DROP COLUMN "engagementDuration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_interests_news_tags_tag" ADD CONSTRAINT "FK_8c31761d878724a2ca346db58aa" FOREIGN KEY ("userInterestsUserId") REFERENCES "user_interests"("userId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_interests_news_tags_tag" ADD CONSTRAINT "FK_008ab229a69a9d85c945f2ff36a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_interests_news_categories_news_category" ADD CONSTRAINT "FK_58f175d65e43e6f863ed1b2a287" FOREIGN KEY ("userInterestsUserId") REFERENCES "user_interests"("userId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_interests_news_categories_news_category" ADD CONSTRAINT "FK_dc629862465ce4d8af01af96b69" FOREIGN KEY ("newsCategoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_interests_news_categories_news_category" DROP CONSTRAINT "FK_dc629862465ce4d8af01af96b69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_interests_news_categories_news_category" DROP CONSTRAINT "FK_58f175d65e43e6f863ed1b2a287"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_interests_news_tags_tag" DROP CONSTRAINT "FK_008ab229a69a9d85c945f2ff36a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_interests_news_tags_tag" DROP CONSTRAINT "FK_8c31761d878724a2ca346db58aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_news_engagement" ADD "engagementDuration" integer`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc629862465ce4d8af01af96b6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58f175d65e43e6f863ed1b2a28"`,
    );
    await queryRunner.query(
      `DROP TABLE "user_interests_news_categories_news_category"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_008ab229a69a9d85c945f2ff36"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8c31761d878724a2ca346db58a"`,
    );
    await queryRunner.query(`DROP TABLE "user_interests_news_tags_tag"`);
    await queryRunner.query(`DROP TABLE "user_interests"`);
  }
}
