import { Router } from "express";
import authRouter from "./modules/auth/routes/auth.route.js";
import userRouter from "./modules/user/routes/user.route.js";
import taskRouter from "./modules/task/task.route.js";

const router = Router() ;

router.use('/auth',authRouter) ;
router.use('users',userRouter) ;
router.use('/tasks',taskRouter) ;

export default router ;