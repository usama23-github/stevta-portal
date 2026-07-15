-- CreateIndex
CREATE INDEX "Attendance_attendanceStatusId_idx" ON "Attendance"("attendanceStatusId");

-- CreateIndex
CREATE INDEX "Attendance_checkInStatusId_idx" ON "Attendance"("checkInStatusId");

-- CreateIndex
CREATE INDEX "Attendance_attendanceDate_attendanceStatusId_idx" ON "Attendance"("attendanceDate", "attendanceStatusId");

-- CreateIndex
CREATE INDEX "AttendanceLogs_empNo_idx" ON "AttendanceLogs"("empNo");

-- CreateIndex
CREATE INDEX "AttendanceLogs_dateTime_idx" ON "AttendanceLogs"("dateTime");

-- CreateIndex
CREATE INDEX "AttendanceLogs_empNo_dateTime_idx" ON "AttendanceLogs"("empNo", "dateTime");

-- CreateIndex
CREATE INDEX "Staff_empNo_idx" ON "Staff"("empNo");

-- CreateIndex
CREATE INDEX "Staff_name_idx" ON "Staff"("name");
