import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1756495887614 implements MigrationInterface {
    name = 'InitialSchema1756495887614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "high_scores" ("id" SERIAL NOT NULL, "user_id" uuid NOT NULL, "score" integer NOT NULL, "achieved_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_da1bb900eb93df2f2d5103d8545" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5c6f9b5fa0fb282f669da24713" ON "high_scores" ("score") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "oauth_provider" character varying, "oauth_provider_id" character varying NOT NULL, "display_name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6aaff3e288c25ff605c1bb427df" UNIQUE ("oauth_provider_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "high_scores" ADD CONSTRAINT "FK_672239547c16097b9d73c71b717" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "high_scores" DROP CONSTRAINT "FK_672239547c16097b9d73c71b717"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c6f9b5fa0fb282f669da24713"`);
        await queryRunner.query(`DROP TABLE "high_scores"`);
    }

}
