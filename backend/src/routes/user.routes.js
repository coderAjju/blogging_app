import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { updateUserInfo ,deleteUser,signOut,getAllUsers,userDeleteByAdmin,getSpecificUser} from '../controller/user.controller.js';

const router = express.Router()

router.post("/update/:userId",protectRoute,updateUserInfo)
router.delete("/delete/:userId" ,protectRoute,deleteUser)
router.get("/signout",protectRoute,signOut);
router.get("/getusers",protectRoute,getAllUsers);
router.delete("/deleteUser/:userId",protectRoute,userDeleteByAdmin);
router.get("/:userId",protectRoute,getSpecificUser);
export default router;