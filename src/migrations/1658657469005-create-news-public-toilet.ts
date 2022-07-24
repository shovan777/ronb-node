import { MigrationInterface, QueryRunner } from "typeorm";

export class createNewsPublicToilet1658657469005 implements MigrationInterface {
    name = 'createNewsPublicToilet1658657469005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "title" character varying, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "content" character varying NOT NULL, "singleImage" character varying, "category" integer, "link" character varying, "source" character varying DEFAULT 'RONB', "imgSource" character varying, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_image" ("id" SERIAL NOT NULL, "imageURL" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "newsId" integer, CONSTRAINT "PK_547fe26db8b47dd88ef50c63130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public_toilet" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "content" character varying NOT NULL, "address" character varying NOT NULL, "singleImage" character varying, "geopoint" geography(Point,4326), CONSTRAINT "PK_4c1ebb4c48b2b516aee60aac26f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_de5c2876b0331da393bd97cd9c" ON "public_toilet" USING GiST ("geopoint") `);
        await queryRunner.query(`CREATE TABLE "public_toilet_image" ("id" SERIAL NOT NULL, "image" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "publicToiletId" integer, CONSTRAINT "PK_5771d2932ca7baa50d0c1edcbf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "news_image" ADD CONSTRAINT "FK_fe6247992e5bf6c15ad2b5e8fa6" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_toilet_image" ADD CONSTRAINT "FK_740cac07618837db008103f60e2" FOREIGN KEY ("publicToiletId") REFERENCES "public_toilet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_toilet_image" DROP CONSTRAINT "FK_740cac07618837db008103f60e2"`);
        await queryRunner.query(`ALTER TABLE "news_image" DROP CONSTRAINT "FK_fe6247992e5bf6c15ad2b5e8fa6"`);
        await queryRunner.query(`DROP TABLE "public_toilet_image"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_de5c2876b0331da393bd97cd9c"`);
        await queryRunner.query(`DROP TABLE "public_toilet"`);
        await queryRunner.query(`DROP TABLE "news_image"`);
        await queryRunner.query(`DROP TABLE "news"`);
    }

}
