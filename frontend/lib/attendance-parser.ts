export type AttendanceRecord = {
  id: string;
  employeeNo: string;
  name: string;
  date: string;
  status: "Present" | "Absent";
  checkIn: string;
  checkInStatus: "On Time" | "Late";
  checkOut: string;
  checkOutStatus: "On Time" | "Early" | "-";
  workingHours: string;
};

const OFFICE_START_HOUR = 9;
const OFFICE_END_HOUR = 17;

/**
 * ✅ Clean corrupted / Windows / UTF-16-like strings
 */
function cleanRawText(value: string): string {
  return value
    .replace(/\u0000/g, "") // remove NULL bytes (your main issue)
    .replace(/\r/g, "") // remove carriage returns
    .trim();
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateWorkingHours(start: Date, end: Date) {
  const diff = end.getTime() - start.getTime();

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  return `${hours}h ${minutes}m`;
}

/**
 * ✅ FINAL SAFE DATE PARSER
 * Handles: "2020-01-22 16:14:51"
 */
function parseDateTime(dateTimeString: string): Date | null {
  if (!dateTimeString) return null;

  const cleaned = cleanRawText(dateTimeString);

  // convert to ISO format
  const iso = cleaned.replace(" ", "T");

  const date = new Date(iso);

  if (isNaN(date.getTime())) {
    console.log("FAILED PARSE:", JSON.stringify(dateTimeString));
    return null;
  }

  return date;
}

/**
 * ✅ SAFE COLUMN SPLITTER (handles messy exports)
 */
function splitColumns(line: string): string[] {
  return cleanRawText(line)
    .replace(/\s{2,}/g, "\t") // normalize multiple spaces → tab
    .split("\t")
    .map((c) => c.trim())
    .filter(Boolean);
}

export function parseAttendanceText(text: string): AttendanceRecord[] {
  const lines = text.split("\n").map(cleanRawText).filter(Boolean);

  // remove header
  lines.shift();

  const groupedRecords: Record<
    string,
    {
      employeeNo: string;
      name: string;
      date: string;
      timestamp: Date;
    }[]
  > = {};

  for (const line of lines) {
    const cols = splitColumns(line);

    if (cols.length < 3) continue;

    const employeeNo = cols[2]?.trim();

    const dateTimeString = cols[cols.length - 1];
    const timestamp = parseDateTime(dateTimeString);

    if (!timestamp) continue;

    const date = `${timestamp.getFullYear()}-${String(
      timestamp.getMonth() + 1,
    ).padStart(2, "0")}-${String(timestamp.getDate()).padStart(2, "0")}`;

    const name = cols[3]?.trim() || "Unknown";

    // ignore invalid users
    if (employeeNo === "99999999" || name.toLowerCase() === "z") {
      continue;
    }

    const key = `${employeeNo}_${date}`;

    if (!groupedRecords[key]) {
      groupedRecords[key] = [];
    }

    groupedRecords[key].push({
      employeeNo,
      name,
      date,
      timestamp,
    });
  }

  const attendance: AttendanceRecord[] = [];

  Object.values(groupedRecords).forEach((records) => {
    records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const firstPunch = records[0];
    const lastPunch = records[records.length - 1];

    const checkIn = firstPunch.timestamp;

    const officeStart = new Date(checkIn);
    officeStart.setHours(OFFICE_START_HOUR, 0, 0, 0);

    const officeEnd = new Date(checkIn);
    officeEnd.setHours(OFFICE_END_HOUR, 0, 0, 0);

    const hasMultiplePunches = records.length > 1;

    const checkOut = hasMultiplePunches ? lastPunch.timestamp : null;

    attendance.push({
      id: `${firstPunch.employeeNo}_${firstPunch.date}`,
      employeeNo: firstPunch.employeeNo,
      name: firstPunch.name,
      date: firstPunch.date,
      status: "Present",
      checkIn: formatTime(checkIn),
      checkInStatus: checkIn > officeStart ? "Late" : "On Time",

      // ✅ FIXED CHECKOUT
      checkOut: checkOut ? formatTime(checkOut) : "-",
      checkOutStatus: checkOut
        ? checkOut < officeEnd
          ? "Early"
          : "On Time"
        : "-",

      // ✅ FIXED WORKING HOURS
      workingHours: checkOut
        ? calculateWorkingHours(checkIn, checkOut)
        : "Missing Checkout",
    });
  });

  return attendance.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
