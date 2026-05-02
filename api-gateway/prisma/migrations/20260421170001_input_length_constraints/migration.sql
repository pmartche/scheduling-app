/*
  Warnings:

  - You are about to alter the column `name` on the `Business` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `firstName` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `lastName` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `name` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `address` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `city` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `postalCode` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `country` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "name" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "name" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "postalCode" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(50);
