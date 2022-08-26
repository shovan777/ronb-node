import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeNameAddTitleRequired1661505886498
  implements MigrationInterface
{
  name = 'removeNameAddTitleRequired1661505886498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "name"`);
    await queryRunner.query(
      `UPDATE "news" SET "title"='please add title' WHERE "title" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ALTER COLUMN "title" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news" ALTER COLUMN "title" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD "name" character varying NOT NULL`,
    );
  }
}
