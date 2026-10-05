import { isUniqueViolation } from "../../../helper/postgresError.js";
import { AppError } from "../../shared/errors/AppError.js";
import { hashPassword } from "../utils/crypto.js";
import { createUser } from "../../user/user.repository.js";
export const register = async (data) => {
    const { email, password } = data;
    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await hashPassword(password);
    try {
        const result = await createUser(normalizedEmail, hashedPassword);
        return {
            id: result.id,
            email: result.email,
            role: result.role,
            created_at: result.created_at,
        };
    }
    catch (error) {
        console.error("Register error: ", error);
        if (isUniqueViolation(error, "users_email_key")) {
            throw new AppError("Email already registered", 409);
        }
        throw new AppError("Internal Server Error", 500);
    }
};
