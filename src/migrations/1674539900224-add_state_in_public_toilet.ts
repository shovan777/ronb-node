import { MigrationInterface, QueryRunner } from "typeorm";

export class addStateInPublicToilet1674539900224 implements MigrationInterface {
    name = 'addStateInPublicToilet1674539900224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."public_toilet_state_enum" AS ENUM('draft', 'published', 'reviewed')`);
        await queryRunner.query(`ALTER TABLE "public_toilet" ADD "state" "public"."public_toilet_state_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ALTER COLUMN "rating" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_toilet_review" ALTER COLUMN "rating" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public_toilet" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE "public"."public_toilet_state_enum"`);
    }

}
