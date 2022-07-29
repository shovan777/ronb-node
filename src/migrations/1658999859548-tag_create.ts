import { MigrationInterface, QueryRunner } from "typeorm";

export class tagCreate1658999859548 implements MigrationInterface {
    name = 'tagCreate1658999859548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "UQ_3413aed3ecde54f832c4f44f045" UNIQUE ("slug"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
