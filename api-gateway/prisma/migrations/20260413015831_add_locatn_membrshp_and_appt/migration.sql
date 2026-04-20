-- CreateTable
CREATE TABLE "LocationMembership" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "LocationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "locationMembershipId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocationMembership" ADD CONSTRAINT "LocationMembership_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationMembership" ADD CONSTRAINT "LocationMembership_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_locationMembershipId_fkey" FOREIGN KEY ("locationMembershipId") REFERENCES "LocationMembership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Appointment"
ADD CONSTRAINT "Appointment_valid_time"
CHECK ("endTime" > "startTime");

CREATE OR REPLACE FUNCTION prevent_appointment_overlap()
RETURNS TRIGGER
AS $$
DECLARE
  new_location_id TEXT;
  new_customer_id TEXT;
BEGIN
  SELECT lm."locationId", lm."customerId"
  INTO new_location_id, new_customer_id
  FROM "LocationMembership" lm
  WHERE lm."id" = NEW."locationMembershipId";

  IF new_location_id IS NULL OR new_customer_id IS NULL THEN
    RAISE EXCEPTION 'Invalid locationMembershipId: %', NEW."locationMembershipId";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "Appointment" a
    JOIN "LocationMembership" lm
      ON lm."id" = a."locationMembershipId"
    WHERE a."id" <> NEW."id"
      AND lm."locationId" = new_location_id
      AND NEW."startTime" < a."endTime"
      AND NEW."endTime" > a."startTime"
  ) THEN
    RAISE EXCEPTION 'Appointment overlaps another appointment for this location';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "Appointment" a
    JOIN "LocationMembership" lm
      ON lm."id" = a."locationMembershipId"
    WHERE a."id" <> NEW."id"
      AND lm."customerId" = new_customer_id
      AND NEW."startTime" < a."endTime"
      AND NEW."endTime" > a."startTime"
  ) THEN
    RAISE EXCEPTION 'Appointment overlaps another appointment for this customer';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_appointment_overlap ON "Appointment";

CREATE TRIGGER trg_prevent_appointment_overlap
BEFORE INSERT OR UPDATE
ON "Appointment"
FOR EACH ROW
EXECUTE FUNCTION prevent_appointment_overlap();