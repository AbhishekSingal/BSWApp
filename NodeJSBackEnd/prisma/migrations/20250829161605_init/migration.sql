/*
  Warnings:

  - Added the required column `hostel` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "dpcolor" TEXT NOT NULL DEFAULT '#36a8b2ff',
ADD COLUMN     "hostel" TEXT NOT NULL;
