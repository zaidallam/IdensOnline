-- CreateTable
CREATE TABLE "Car" (
    "id" UUID NOT NULL,
    "vin" VARCHAR(17) NOT NULL,
    "license_plate" VARCHAR(10),
    "make" VARCHAR(50),
    "model" VARCHAR(50),
    "year" INTEGER,
    "color" VARCHAR(30),

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_cancelled" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,
    "car_id" UUID NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_appointment_fields" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_vin_key" ON "Car"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "Car_license_plate_key" ON "Car"("license_plate");

-- CreateIndex
CREATE UNIQUE INDEX "_appointment_fields_AB_unique" ON "_appointment_fields"("A", "B");

-- CreateIndex
CREATE INDEX "_appointment_fields_B_index" ON "_appointment_fields"("B");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_appointment_fields" ADD CONSTRAINT "_appointment_fields_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_appointment_fields" ADD CONSTRAINT "_appointment_fields_B_fkey" FOREIGN KEY ("B") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
