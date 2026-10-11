import { AppError } from "../../../shared/errors/AppError.js";
import { deleteUserById, findUserById, } from "../repositories/user.repository.js";
export const getMe = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new AppError("User not Found", 400);
    }
    return user;
};
export const deleteMe = async (userId) => {
    const row = await deleteUserById(userId);
    if (!row) {
        throw new AppError("User not Found", 400);
    }
    return;
};
