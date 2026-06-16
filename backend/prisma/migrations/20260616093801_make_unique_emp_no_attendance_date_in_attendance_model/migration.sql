/*
  Warnings:

  - A unique constraint covering the columns `[empNo,attendanceDate]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendance_empNo_attendanceDate_key" ON "Attendance"("empNo", "attendanceDate");
