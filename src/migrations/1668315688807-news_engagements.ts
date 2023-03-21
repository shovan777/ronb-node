import { MigrationInterface, QueryRunner } from "typeorm";

export class newsEngagements1668315688807 implements MigrationInterface {
    name = 'newsEngagements1668315688807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_news_engagement" ("userId" integer NOT NULL, "newsId" integer NOT NULL, "hasRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2a0b35fd108222c2e596b74ba0d" PRIMARY KEY ("userId", "newsId"))`);
        await queryRunner.query(`ALTER TABLE "user_news_engagement" ADD CONSTRAINT "FK_29c69fa0d6448a416a3652cc76b" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_news_engagement" DROP CONSTRAINT "FK_29c69fa0d6448a416a3652cc76b"`);
        await queryRunner.query(`DROP TABLE "user_news_engagement"`);
    }

}
