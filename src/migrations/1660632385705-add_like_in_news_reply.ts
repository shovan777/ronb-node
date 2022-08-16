import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLikeInNewsReply1660632385705 implements MigrationInterface {
  name = 'addLikeInNewsReply1660632385705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_likes_news_reply" ("userId" integer NOT NULL, "replyId" integer NOT NULL, CONSTRAINT "PK_84a4eed01bd145d0d033d386ad0" PRIMARY KEY ("userId", "replyId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" ADD CONSTRAINT "FK_db82a9968a14aba47fb09e41239" FOREIGN KEY ("replyId") REFERENCES "news_reply"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_likes_news_reply" DROP CONSTRAINT "FK_db82a9968a14aba47fb09e41239"`,
    );
    await queryRunner.query(`DROP TABLE "user_likes_news_reply"`);
  }
}
