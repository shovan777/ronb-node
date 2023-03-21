import { MigrationInterface, QueryRunner } from "typeorm";

export class addLikesInNewsComment1660568383928 implements MigrationInterface {
    name = 'addLikesInNewsComment1660568383928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_likes_news_comment" ("userId" integer NOT NULL, "commentId" integer NOT NULL, CONSTRAINT "PK_5bc450c875453e96343baa52683" PRIMARY KEY ("userId", "commentId"))`);
        await queryRunner.query(`ALTER TABLE "user_likes_news_comment" ADD CONSTRAINT "FK_f766e93aafbbd64eb1ca7d67e3b" FOREIGN KEY ("commentId") REFERENCES "news_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_likes_news_comment" DROP CONSTRAINT "FK_f766e93aafbbd64eb1ca7d67e3b"`);
        await queryRunner.query(`DROP TABLE "user_likes_news_comment"`);
    }

}
