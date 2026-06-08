import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import {
    hashPassword,
    comparePassword,
    generateToken,
} from "./auth.utils.js";

export const registerUser = async ({ email, password }) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: "STAFF",
        },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    return user;
};

export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
        throw new Error("Account is inactive");
    }

    const isValidPassword = await comparePassword(
        password,
        user.password
    );

    if (!isValidPassword) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            officeId: user.officeId,
            instituteId: user.instituteId,
            staffId: user.staffId,
        },
    };
};

export const logoutUser = async () => {
    return {
        message: "Logged out successfully",
    };
};
