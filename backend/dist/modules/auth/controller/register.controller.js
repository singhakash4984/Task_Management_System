import { register } from "../service/register.service.js";
export const registerController = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await register(data);
        return res.status(201).json({
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
