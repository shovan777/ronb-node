import { MigrationInterface, QueryRunner } from "typeorm";

export class addOncascadeSetNullToDistrict1677232141022 implements MigrationInterface {
    name = 'addOncascadeSetNullToDistrict1677232141022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP CONSTRAINT "FK_bc0a3c3c43a3b6f811c9f74686c"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP CONSTRAINT "FK_973ae59b4eb51fa0bcde37631c5"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD CONSTRAINT "FK_973ae59b4eb51fa0bcde37631c5" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD CONSTRAINT "FK_bc0a3c3c43a3b6f811c9f74686c" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP CONSTRAINT "FK_bc0a3c3c43a3b6f811c9f74686c"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP CONSTRAINT "FK_973ae59b4eb51fa0bcde37631c5"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD CONSTRAINT "FK_973ae59b4eb51fa0bcde37631c5" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD CONSTRAINT "FK_bc0a3c3c43a3b6f811c9f74686c" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
