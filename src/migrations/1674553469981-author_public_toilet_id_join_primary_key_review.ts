import { MigrationInterface, QueryRunner } from "typeorm";

export class authorPublicToiletIdJoinPrimaryKeyReview1674553469981 implements MigrationInterface {
    name = 'authorPublicToiletIdJoinPrimaryKeyReview1674553469981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_toilet_review" DROP CONSTRAINT "PK_64328180539966e47618b3ac2ce"`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ADD CONSTRAINT "PK_313c6cf0883f400ea1c206a24a4" PRIMARY KEY ("id", "author", "publicToiletId")`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" DROP CONSTRAINT "FK_010d6e3863702fc26565d8691fe"`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ALTER COLUMN "publicToiletId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ADD CONSTRAINT "FK_010d6e3863702fc26565d8691fe" FOREIGN KEY ("publicToiletId") REFERENCES "public_toilet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_toilet_review" DROP CONSTRAINT "FK_010d6e3863702fc26565d8691fe"`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ALTER COLUMN "publicToiletId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ADD CONSTRAINT "FK_010d6e3863702fc26565d8691fe" FOREIGN KEY ("publicToiletId") REFERENCES "public_toilet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" DROP CONSTRAINT "PK_313c6cf0883f400ea1c206a24a4"`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ADD CONSTRAINT "PK_64328180539966e47618b3ac2ce" PRIMARY KEY ("id")`);
    }

}
