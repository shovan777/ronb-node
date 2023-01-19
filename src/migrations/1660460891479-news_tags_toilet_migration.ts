import { MigrationInterface, QueryRunner } from "typeorm";

export class newsTagsToiletMigration1660460891479 implements MigrationInterface {
    name = 'newsTagsToiletMigration1660460891479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_taggit" ("id" SERIAL NOT NULL, "tagId" integer, "newsId" integer, CONSTRAINT "PK_ebea5b7dee7b740d413818f1eac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_aac53a9364896452e463139e4a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "title" character varying, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "content" character varying NOT NULL, "singleImage" character varying, "link" character varying, "source" character varying DEFAULT 'RONB', "imgSource" character varying, "categoryId" integer, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_image" ("id" SERIAL NOT NULL, "imageURL" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "newsId" integer, CONSTRAINT "PK_547fe26db8b47dd88ef50c63130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_likes_news" ("userId" integer NOT NULL, "newsId" integer NOT NULL, CONSTRAINT "PK_e5f6c76330b01516a040665f749" PRIMARY KEY ("userId", "newsId"))`);
        await queryRunner.query(`CREATE TABLE "news_comment" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "author" integer NOT NULL, "newsId" integer, CONSTRAINT "PK_6ae712e2600bc9b2acf0439100e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_reply" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "author" integer NOT NULL, "repliedTo" integer NOT NULL, "commentId" integer, CONSTRAINT "PK_a50cee5a5605c2d9e866e792916" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public_toilet" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "content" character varying NOT NULL, "address" character varying NOT NULL, "singleImage" character varying, "geopoint" geography(Point,4326), CONSTRAINT "PK_4c1ebb4c48b2b516aee60aac26f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_de5c2876b0331da393bd97cd9c" ON "public_toilet" USING GiST ("geopoint") `);
        await queryRunner.query(`CREATE TABLE "public_toilet_image" ("id" SERIAL NOT NULL, "image" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "publicToiletId" integer, CONSTRAINT "PK_5771d2932ca7baa50d0c1edcbf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "news_taggit" ADD CONSTRAINT "FK_37ada3e9928176a0c055ff343d6" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_taggit" ADD CONSTRAINT "FK_460f86d5e86fdeeba68d3257fe0" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_12a76d9b0f635084194b2c6aa01" FOREIGN KEY ("categoryId") REFERENCES "news_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_image" ADD CONSTRAINT "FK_fe6247992e5bf6c15ad2b5e8fa6" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_likes_news" ADD CONSTRAINT "FK_b1df74557e5b8e3334f8bd2005f" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_comment" ADD CONSTRAINT "FK_21268b592f3f32258000ece48f7" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_reply" ADD CONSTRAINT "FK_347a7ccc0e7ac88136cb122a4e0" FOREIGN KEY ("commentId") REFERENCES "news_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_toilet_image" ADD CONSTRAINT "FK_740cac07618837db008103f60e2" FOREIGN KEY ("publicToiletId") REFERENCES "public_toilet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_toilet_image" DROP CONSTRAINT "FK_740cac07618837db008103f60e2"`);
        await queryRunner.query(`ALTER TABLE "news_reply" DROP CONSTRAINT "FK_347a7ccc0e7ac88136cb122a4e0"`);
        await queryRunner.query(`ALTER TABLE "news_comment" DROP CONSTRAINT "FK_21268b592f3f32258000ece48f7"`);
        await queryRunner.query(`ALTER TABLE "user_likes_news" DROP CONSTRAINT "FK_b1df74557e5b8e3334f8bd2005f"`);
        await queryRunner.query(`ALTER TABLE "news_image" DROP CONSTRAINT "FK_fe6247992e5bf6c15ad2b5e8fa6"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_12a76d9b0f635084194b2c6aa01"`);
        await queryRunner.query(`ALTER TABLE "news_taggit" DROP CONSTRAINT "FK_460f86d5e86fdeeba68d3257fe0"`);
        await queryRunner.query(`ALTER TABLE "news_taggit" DROP CONSTRAINT "FK_37ada3e9928176a0c055ff343d6"`);
        await queryRunner.query(`DROP TABLE "public_toilet_image"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_de5c2876b0331da393bd97cd9c"`);
        await queryRunner.query(`DROP TABLE "public_toilet"`);
        await queryRunner.query(`DROP TABLE "news_reply"`);
        await queryRunner.query(`DROP TABLE "news_comment"`);
        await queryRunner.query(`DROP TABLE "user_likes_news"`);
        await queryRunner.query(`DROP TABLE "news_image"`);
        await queryRunner.query(`DROP TABLE "news"`);
        await queryRunner.query(`DROP TABLE "news_category"`);
        await queryRunner.query(`DROP TABLE "news_taggit"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
