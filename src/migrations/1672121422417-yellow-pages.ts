import { MigrationInterface, QueryRunner } from "typeorm";

export class yellowPages1672121422417 implements MigrationInterface {
    name = 'yellowPages1672121422417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "yellow_pages_phone_number" ("id" SERIAL NOT NULL, "phone_number" integer NOT NULL, "is_emergency" boolean NOT NULL, "yellowpagesId" integer, CONSTRAINT "PK_5f7626bcfa041d152a04e8056df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" ADD CONSTRAINT "FK_4fc7042af6aacb49138803983eb" FOREIGN KEY ("yellowpagesId") REFERENCES "yellow_pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" DROP CONSTRAINT "FK_4fc7042af6aacb49138803983eb"`);
        await queryRunner.query(`DROP TABLE "yellow_pages_phone_number"`);
    }

}
