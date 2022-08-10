import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateNewsParameters1660022679384 implements MigrationInterface {
  name = 'updateNewsParameters1660022679384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "news_comment" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "author" integer NOT NULL, "newsId" integer, CONSTRAINT "PK_6ae712e2600bc9b2acf0439100e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "news_reply" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "author" integer NOT NULL, "repliedTo" integer NOT NULL, "commentId" integer, CONSTRAINT "PK_a50cee5a5605c2d9e866e792916" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_comment" ADD CONSTRAINT "FK_21268b592f3f32258000ece48f7" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_reply" ADD CONSTRAINT "FK_347a7ccc0e7ac88136cb122a4e0" FOREIGN KEY ("commentId") REFERENCES "news_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news_reply" DROP CONSTRAINT "FK_347a7ccc0e7ac88136cb122a4e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_comment" DROP CONSTRAINT "FK_21268b592f3f32258000ece48f7"`,
    );
    await queryRunner.query(`DROP TABLE "news_reply"`);
    await queryRunner.query(`DROP TABLE "news_comment"`);
  }
}
