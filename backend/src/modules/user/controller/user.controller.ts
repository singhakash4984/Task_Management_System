import { Request, Response, NextFunction } from "express";
import { deleteMe, getMe } from "../services/user.service.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unauthorised", 401);
    }
    const user = await getMe(userId);
    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("Unautorized !!!");
    }
    await deleteMe(userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
