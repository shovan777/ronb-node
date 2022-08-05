import { MigrationInterface, QueryRunner } from "typeorm";

export class removeSlugFromTags1659611338321 implements MigrationInterface {
    name = 'removeSlugFromTags1659611338321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "UQ_3413aed3ecde54f832c4f44f045"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "slug"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD "slug" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "UQ_3413aed3ecde54f832c4f44f045" UNIQUE ("slug")`);
    }

}
