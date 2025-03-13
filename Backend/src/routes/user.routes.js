import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserChannelProfile, 
    getWatchHistory,
    createPost,
    updatePostBySlug,
    deletePostBySlug,
    getAllPosts,
    getPostBySlug,
    getUserPosts
 } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

router.route("/posts").post(verifyJWT,upload.single("featuredImage"), createPost); 
router.route("/posts").get(getAllPosts); 

router.route("/posts/slug/:slug").get(getPostBySlug).put(verifyJWT,upload.single("featuredImage"),updatePostBySlug).delete(deletePostBySlug);
router.route('/my-posts').get(verifyJWT,getUserPosts);

export default router
