import { MigrationInterface, QueryRunner } from "typeorm";

export class 01Init1753301003301 implements MigrationInterface {
    name = '01Init1753301003301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tours" ALTER COLUMN "ratings_average" SET DEFAULT '4.5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tours" ALTER COLUMN "ratings_average" SET DEFAULT 4.5`);
    }

}
