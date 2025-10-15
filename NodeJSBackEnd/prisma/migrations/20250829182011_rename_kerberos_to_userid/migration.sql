/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `kerberos` on the `User` table. All the data in the column will be lost.
  - Added the required column `userid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "kerberos",
ADD COLUMN     "userid" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userid");
