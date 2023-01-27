import { MigrationInterface, QueryRunner } from "typeorm";

export class createPublicToiletReviewEntity1674038684884 implements MigrationInterface {
    name = 'createPublicToiletReviewEntity1674038684884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public_toilet_review" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "rating" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "author" integer NOT NULL, "publicToiletId" integer, CONSTRAINT "PK_64328180539966e47618b3ac2ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ADD CONSTRAINT "FK_010d6e3863702fc26565d8691fe" FOREIGN KEY ("publicToiletId") REFERENCES "public_toilet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_toilet_review" DROP CONSTRAINT "FK_010d6e3863702fc26565d8691fe"`);
        await queryRunner.query(`DROP TABLE "public_toilet_review"`);
    }

}
