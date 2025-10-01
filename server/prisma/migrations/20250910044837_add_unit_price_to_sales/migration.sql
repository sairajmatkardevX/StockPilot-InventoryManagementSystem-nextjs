/*
  Warnings:

  - Added the required column `unitPrice` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Sales" ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;
