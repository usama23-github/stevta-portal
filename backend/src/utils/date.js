import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const KARACHI_TIMEZONE = "Asia/Karachi";

export const formatTimeInKarachi = (date) => {
    if (!date) return null;

    return dayjs(date)
        .tz(KARACHI_TIMEZONE)
        .format("HH:mm");
};

export const formatDateTimeInKarachi = (date) => {
    if (!date) return null;

    return dayjs(date)
        .tz(KARACHI_TIMEZONE)
        .format("YYYY-MM-DD HH:mm:ss");
};