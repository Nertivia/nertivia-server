/*
  Warnings:

  - The primary key for the `Friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Friend` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipientId,requesterId]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "Friend_recipientId_requesterId_key" ON "Friend"("recipientId", "requesterId");
