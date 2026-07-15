export interface AttendanceReport {
  empNo: string;

  employeeName: string;

  designation: string;

  section: string;

  postingPlace: string;

  attendanceStatus: number;

  checkIn: string | null;

  checkOut: string | null;

  checkInStatus: number | null;

  checkOutStatus: number | null;

  workingHours: string | null;
}

export interface AttendanceMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AttendanceResponse {
  data: AttendanceReport[];
  meta: AttendanceMeta;
}