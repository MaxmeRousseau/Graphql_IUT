/*
  Warnings:

  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - Added the required column `date_debut` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_fin` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "date",
ADD COLUMN     "date_debut" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "date_fin" TIMESTAMP(3) NOT NULL;
