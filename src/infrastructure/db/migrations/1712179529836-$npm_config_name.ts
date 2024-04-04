import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712179529836 implements MigrationInterface {
    name = ' $npmConfigName1712179529836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "weather_receivers" ("email" character varying(100) NOT NULL, "city" character varying(500) NOT NULL, "hashCode" character varying(500) NOT NULL, "isConfirmed" boolean NOT NULL, "id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e5b79a9b99f2a5ebc2b7901ea97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "INDEX_WEATHER_EMAIL" ON "weather_receivers" ("email") `);
        await queryRunner.query(`CREATE TABLE "weathers" ("name" character varying(100) NOT NULL, "temperature" double precision NOT NULL, "windSpeed" double precision NOT NULL, "humidity" double precision NOT NULL, "date" TIMESTAMP NOT NULL, "icon" character varying(200) NOT NULL, "id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_485273a75c2a8fb4e68784f00fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "INDEX_WEATHER_NAME" ON "weathers" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."INDEX_WEATHER_NAME"`);
        await queryRunner.query(`DROP TABLE "weathers"`);
        await queryRunner.query(`DROP INDEX "public"."INDEX_WEATHER_EMAIL"`);
        await queryRunner.query(`DROP TABLE "weather_receivers"`);
    }

}
