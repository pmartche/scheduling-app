/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Business` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_locationMembershipId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_businessId_fkey";

-- DropForeignKey
ALTER TABLE "LocationMembership" DROP CONSTRAINT "LocationMembership_customerId_fkey";

-- DropForeignKey
ALTER TABLE "LocationMembership" DROP CONSTRAINT "LocationMembership_locationId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Business_name_key" ON "Business"("name");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMembership" ADD CONSTRAINT "LocationMembership_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMembership" ADD CONSTRAINT "LocationMembership_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_locationMembershipId_fkey" FOREIGN KEY ("locationMembershipId") REFERENCES "LocationMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
