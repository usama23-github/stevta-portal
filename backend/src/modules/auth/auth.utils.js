import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      officeId: user.officeId,
      instituteId: user.instituteId,
      staffId: user.staffId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
