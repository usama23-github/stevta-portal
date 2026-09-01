import { PrismaClient } from "@prisma/client";
import {
    formatTimeInKarachi,
    formatDateTimeInKarachi,
} from "../../utils/date.js";

const prisma = new PrismaClient();

const parseTime = (time) => {
    if (!time) {
        throw new Error("Time is required");
    }

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
        throw new Error(`Invalid time format: ${time}. Expected HH:mm`);
    }

    const [hours, minutes] = time.split(":").map(Number);

    // Date object used for PostgreSQL TIME field
    const date = new Date(1970, 0, 1);
    date.setHours(hours, minutes, 0, 0);

    return date;
};

const parseDate = (date) => {
    if (!date) {
        return null;
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`Invalid date: ${date}`);
    }

    return parsed;
};

export const createShiftService = async (data) => {
    const {
        name,
        timings = [],
    } = data;

    if (!name || !name.trim()) {
        throw new Error("Shift name is required");
    }

    if (!Array.isArray(timings)) {
        throw new Error("Timings must be an array");
    }

    // Check duplicate shift name
    const existingShift = await prisma.shift.findFirst({
        where: {
            name: {
                equals: name.trim(),
                mode: "insensitive",
            },
        },
    });

    if (existingShift) {
        throw new Error("Shift with this name already exists");
    }

    const shift = await prisma.$transaction(async (tx) => {
        const newShift = await tx.shift.create({
            data: {
                name: name.trim(),
            },
        });

        if (timings.length > 0) {
            const timingData = timings.map((timing) => ({
                shiftId: newShift.id,

                postingPlaceId: Number(timing.postingPlaceId),

                regionId:
                    timing.regionId !== undefined &&
                        timing.regionId !== null &&
                        timing.regionId !== ""
                        ? Number(timing.regionId)
                        : null,

                districtId:
                    timing.districtId !== undefined &&
                        timing.districtId !== null &&
                        timing.districtId !== ""
                        ? Number(timing.districtId)
                        : null,

                shiftStartTime: parseTime(timing.shiftStartTime),
                checkInOnTime: parseTime(timing.checkInOnTime),
                checkInLate: parseTime(timing.checkInLate),
                checkOutEarly: parseTime(timing.checkOutEarly),
                checkOutOnTime: parseTime(timing.checkOutOnTime),
                absentTime: parseTime(timing.absentTime),

                effectiveFrom: parseDate(timing.effectiveFrom),
                effectiveTo: parseDate(timing.effectiveTo),
            }));

            await tx.shiftTiming.createMany({
                data: timingData,
            });
        }

        return tx.shift.findUnique({
            where: {
                id: newShift.id,
            },
            include: {
                shiftTimings: true,
            },
        });
    });

    return shift;
};

export const deleteShiftTimingService = async (timingId) => {
    if (!timingId) {
        throw new Error("Shift timing ID is required");
    }

    const shiftTiming = await prisma.shiftTiming.findUnique({
        where: {
            id: timingId,
        },
    });

    if (!shiftTiming) {
        throw new Error("Shift timing not found");
    }

    await prisma.shiftTiming.delete({
        where: {
            id: timingId,
        },
    });

    return {
        id: timingId,
    };
};

export const getAllShiftTimingsService = async () => {
    const timings = await prisma.shiftTiming.findMany({
        include: {
            shift: true,
            postingPlace: true,
            region: true,
            district: true,
        },
        orderBy: [
            {
                shiftId: "asc",
            },
            {
                effectiveFrom: "desc",
            },
        ],
    });

    return timings.map((timing) => ({
        ...timing,

        shiftStartTime: formatTimeInKarachi(timing.shiftStartTime),
        checkInOnTime: formatTimeInKarachi(timing.checkInOnTime),
        checkInLate: formatTimeInKarachi(timing.checkInLate),
        checkOutEarly: formatTimeInKarachi(timing.checkOutEarly),
        checkOutOnTime: formatTimeInKarachi(timing.checkOutOnTime),
        absentTime: formatTimeInKarachi(timing.absentTime),

        effectiveFrom: formatDateTimeInKarachi(timing.effectiveFrom),
        effectiveTo: formatDateTimeInKarachi(timing.effectiveTo),
    }));
};