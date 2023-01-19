import { MigrationInterface, QueryRunner } from "typeorm";

export class addLanguageChoiceNews1673605245471 implements MigrationInterface {
    name = 'addLanguageChoiceNews1673605245471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."news_language_enum" AS ENUM('nepali', 'english')`);
        await queryRunner.query(`ALTER TABLE "news" ADD "language" "public"."news_language_enum" NOT NULL DEFAULT 'nepali'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "language"`);
        await queryRunner.query(`DROP TYPE "public"."news_language_enum"`);
    }

}
