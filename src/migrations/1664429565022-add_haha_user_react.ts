import { MigrationInterface, QueryRunner } from 'typeorm';

export class addHahaUserReact1664429565022 implements MigrationInterface {
  name = 'addHahaUserReact1664429565022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."user_likes_news_comment_react_enum" RENAME TO "user_likes_news_comment_react_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_likes_news_comment_react_enum" AS ENUM('love', 'haha', 'sad', 'angry', 'wow')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_comment" ALTER COLUMN "react" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_comment" ALTER COLUMN "react" TYPE "public"."user_likes_news_comment_react_enum" USING "react"::"text"::"public"."user_likes_news_comment_react_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_comment" ALTER COLUMN "react" SET DEFAULT 'love'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_likes_news_comment_react_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."user_likes_news_reply_react_enum" RENAME TO "user_likes_news_reply_react_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_likes_news_reply_react_enum" AS ENUM('love', 'haha', 'sad', 'angry', 'wow')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" ALTER COLUMN "react" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" ALTER COLUMN "react" TYPE "public"."user_likes_news_reply_react_enum" USING "react"::"text"::"public"."user_likes_news_reply_react_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" ALTER COLUMN "react" SET DEFAULT 'love'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_likes_news_reply_react_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_likes_news_reply_react_enum_old" AS ENUM('love', 'haha', 'sad', 'angry')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" ALTER COLUMN "react" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" ALTER COLUMN "react" TYPE "public"."user_likes_news_reply_react_enum_old" USING "react"::"text"::"public"."user_likes_news_reply_react_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" ALTER COLUMN "react" SET DEFAULT 'love'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_likes_news_reply_react_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."user_likes_news_reply_react_enum_old" RENAME TO "user_likes_news_reply_react_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_likes_news_comment_react_enum_old" AS ENUM('love', 'haha', 'sad', 'angry')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_comment" ALTER COLUMN "react" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_comment" ALTER COLUMN "react" TYPE "public"."user_likes_news_comment_react_enum_old" USING "react"::"text"::"public"."user_likes_news_comment_react_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_comment" ALTER COLUMN "react" SET DEFAULT 'love'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_likes_news_comment_react_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."user_likes_news_comment_react_enum_old" RENAME TO "user_likes_news_comment_react_enum"`,
    );
  }
}
