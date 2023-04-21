import { MigrationInterface, QueryRunner } from "typeorm";

export class publicToiletReviewRemoveId1674553545485 implements MigrationInterface {
    name = 'publicToiletReviewRemoveId1674553545485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_toilet_review" DROP CONSTRAINT "PK_313c6cf0883f400ea1c206a24a4"`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ADD CONSTRAINT "PK_a949136fddb4c467bb75aaa90e9" PRIMARY KEY ("author", "publicToiletId")`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" DROP COLUMN "id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" DROP CONSTRAINT "PK_a949136fddb4c467bb75aaa90e9"`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ADD CONSTRAINT "PK_313c6cf0883f400ea1c206a24a4" PRIMARY KEY ("id", "author", "publicToiletId")`);
    }

}
