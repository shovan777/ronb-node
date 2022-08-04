import { MigrationInterface, QueryRunner } from "typeorm";

export class createNewTagsWithRelation1659075085846 implements MigrationInterface {
    name = 'createNewTagsWithRelation1659075085846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news_taggit" ("id" SERIAL NOT NULL, "tagId" integer, "newsId" integer, CONSTRAINT "PK_ebea5b7dee7b740d413818f1eac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "news_taggit" ADD CONSTRAINT "FK_37ada3e9928176a0c055ff343d6" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_taggit" ADD CONSTRAINT "FK_460f86d5e86fdeeba68d3257fe0" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_taggit" DROP CONSTRAINT "FK_460f86d5e86fdeeba68d3257fe0"`);
        await queryRunner.query(`ALTER TABLE "news_taggit" DROP CONSTRAINT "FK_37ada3e9928176a0c055ff343d6"`);
        await queryRunner.query(`DROP TABLE "news_taggit"`);
    }

}
