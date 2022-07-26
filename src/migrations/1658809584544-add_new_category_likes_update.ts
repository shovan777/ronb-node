import { MigrationInterface, QueryRunner } from "typeorm";

export class addNewCategoryLikesUpdate1658809584544 implements MigrationInterface {
    name = 'addNewCategoryLikesUpdate1658809584544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" RENAME COLUMN "category" TO "categoryId"`);
        await queryRunner.query(`CREATE TABLE "base_entity" ("id" SERIAL NOT NULL, CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "creator_base_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, CONSTRAINT "PK_33c2fa989143f43476742bcbd41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_aac53a9364896452e463139e4a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_likes_news" ("userId" integer NOT NULL, "newsId" integer NOT NULL, CONSTRAINT "PK_e5f6c76330b01516a040665f749" PRIMARY KEY ("userId", "newsId"))`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_12a76d9b0f635084194b2c6aa01" FOREIGN KEY ("categoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_likes_news" ADD CONSTRAINT "FK_b1df74557e5b8e3334f8bd2005f" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_likes_news" DROP CONSTRAINT "FK_b1df74557e5b8e3334f8bd2005f"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_12a76d9b0f635084194b2c6aa01"`);
        await queryRunner.query(`DROP TABLE "user_likes_news"`);
        await queryRunner.query(`DROP TABLE "news_category"`);
        await queryRunner.query(`DROP TABLE "creator_base_entity"`);
        await queryRunner.query(`DROP TABLE "base_entity"`);
        await queryRunner.query(`ALTER TABLE "news" RENAME COLUMN "categoryId" TO "category"`);
    }

}
