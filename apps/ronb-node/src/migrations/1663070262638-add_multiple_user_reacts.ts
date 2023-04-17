import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMultipleUserReacts1663070262638 implements MigrationInterface {
  name = 'addMultipleUserReacts1663070262638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_likes_news_comment_react_enum" AS ENUM('love', 'haha', 'sad', 'angry')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_comment" ADD "react" "public"."user_likes_news_comment_react_enum" NOT NULL DEFAULT 'love'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_likes_news_reply_react_enum" AS ENUM('love', 'haha', 'sad', 'angry')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" ADD "react" "public"."user_likes_news_reply_react_enum" NOT NULL DEFAULT 'love'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" DROP COLUMN "react"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_likes_news_reply_react_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_comment" DROP COLUMN "react"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_likes_news_comment_react_enum"`,
    );
  }
}
