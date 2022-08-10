import { MigrationInterface, QueryRunner } from 'typeorm';

export class cascadeDeleteNewsCommentsNReplies1660113922661
  implements MigrationInterface
{
  name = 'cascadeDeleteNewsCommentsNReplies1660113922661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news_comment" DROP CONSTRAINT "FK_21268b592f3f32258000ece48f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_reply" DROP CONSTRAINT "FK_347a7ccc0e7ac88136cb122a4e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_comment" ADD CONSTRAINT "FK_21268b592f3f32258000ece48f7" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_reply" ADD CONSTRAINT "FK_347a7ccc0e7ac88136cb122a4e0" FOREIGN KEY ("commentId") REFERENCES "news_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news_reply" DROP CONSTRAINT "FK_347a7ccc0e7ac88136cb122a4e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_comment" DROP CONSTRAINT "FK_21268b592f3f32258000ece48f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_reply" ADD CONSTRAINT "FK_347a7ccc0e7ac88136cb122a4e0" FOREIGN KEY ("commentId") REFERENCES "news_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_comment" ADD CONSTRAINT "FK_21268b592f3f32258000ece48f7" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
