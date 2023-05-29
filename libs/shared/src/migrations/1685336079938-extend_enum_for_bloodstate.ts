import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendEnumForBloodstate1685336079938 implements MigrationInterface {
    name = 'ExtendEnumForBloodstate1685336079938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."blood_request_state_enum" RENAME TO "blood_request_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."blood_request_state_enum" AS ENUM('draft', 'published', 'reviewed', 'complete', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "blood_request" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "blood_request" ALTER COLUMN "state" TYPE "public"."blood_request_state_enum" USING "state"::"text"::"public"."blood_request_state_enum"`);
        await queryRunner.query(`ALTER TABLE "blood_request" ALTER COLUMN "state" SET DEFAULT 'draft'`);
        await queryRunner.query(`DROP TYPE "public"."blood_request_state_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."blood_request_state_enum_old" AS ENUM('draft', 'published', 'reviewed')`);
        await queryRunner.query(`ALTER TABLE "blood_request" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "blood_request" ALTER COLUMN "state" TYPE "public"."blood_request_state_enum_old" USING "state"::"text"::"public"."blood_request_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "blood_request" ALTER COLUMN "state" SET DEFAULT 'draft'`);
        await queryRunner.query(`DROP TYPE "public"."blood_request_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."blood_request_state_enum_old" RENAME TO "blood_request_state_enum"`);
    }

}
