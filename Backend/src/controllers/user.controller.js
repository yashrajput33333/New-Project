import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { Post } from "../models/post.model.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import fs from 'fs';

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { fullName, email, username, password } = req.body;

    // Validate required fields
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
  
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
  
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }
  
    const avatarFile = req.files?.avatar?.[0];
  
    if (!avatarFile || !avatarFile.buffer) {
      throw new ApiError(400, "Avatar file is required");
    }
  
    // Upload avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarFile.buffer, avatarFile.originalname);
    if (!avatar) {
      throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }
  
    // Create user
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      email,
      password,
      username: username.toLowerCase(),
    });
  
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
  
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }
  
    // 🔹 Generate JWT Token
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
  
    const options = {
        httpOnly: true,   // Prevent JavaScript access to cookies
        secure: process.env.NODE_ENV === "production",  // Only use secure cookies in production
        sameSite: "None"  // Required for cross-origin cookies
    };
  
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(201, { user: createdUser}, "User registered successfully"));
  });

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,   // Prevent JavaScript access to cookies
        secure: process.env.NODE_ENV === "production",  // Only use secure cookies in production
        sameSite: "None"  // Required for cross-origin cookies
    };
    

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    // Update the user's document by unsetting the refreshToken
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    // Configure cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure cookies are secure in production
        sameSite: "None", // Adjust as needed (Strict or Lax)
    };

    // Clear cookies and respond
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Ensure cookies are secure in production
            sameSite: "None", // Adjust as needed (Strict or Lax)
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave: false})
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})
const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "User not authenticated"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body
    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }
    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})
const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})
const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})



//Frontend specific Controllers
const getAllPosts = asyncHandler(async (req, res) => {
    let posts;

    if (req.user) {
        // Show all posts (active + inactive) for logged-in users
        posts = await Post.find().populate("owner", "name email").sort({ createdAt: -1 });
    } else {
        // Show only active posts for non-logged-in users
        posts = await Post.find({ status: true }).populate("owner", "name email").sort({ createdAt: -1 });
    }

    if (!posts || posts.length === 0) {
        return res.status(404).json(new ApiResponse(404, [], "No posts found"));
    }

    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
});



const getUserPosts = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json(new ApiResponse(401, [], "Unauthorized"));
    }

    const posts = await Post.find({ owner: userId }).sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
        return res.status(404).json(new ApiResponse(404, [], "No posts found for this user"));
    }

    return res.status(200).json(new ApiResponse(200, posts, "User's posts fetched successfully"));
});


const createPost = asyncHandler(async (req, res) => {
    const { title, slug, content, status } = req.body;
    const owner = req.user._id;
  
    if (!title || !slug || !content || !status) {
      throw new ApiError(400, "All fields are required");
    }
  
    let featuredImage = "";
    if (req.file) {
      try {
        // ✅ Upload file from buffer to Cloudinary
        const uploadResponse = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        if (!uploadResponse || !uploadResponse.url) {
          throw new ApiError(500, "Error uploading image");
        }
        featuredImage = uploadResponse.url;
      } catch (err) {
        console.error("Error uploading image:", err);
        throw new ApiError(500, "Image upload failed");
      }
    }
  
    const post = await Post.create({
      title,
      slug,
      content,
      status,
      owner,
      featuredImage,
    });
  
    return res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  });
  

  const updatePostBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    // 1. Find the post by slug
    const post = await Post.findOne({ slug });
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // 2. Check if the logged-in user is the owner of the post
    if (post.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this post");
    }

    // 3. Extract fields from the request body
    const { title, content, status } = req.body;

    // 4. Validate required fields
    if (!title || !content || !status) {
        throw new ApiError(400, "Title, content, and status are required");
    }

    // 5. Update post fields
    post.title = title;
    post.content = content;
    post.status = status === "active"; // Convert status to boolean

    // 6. Handle featured image update if a new file is uploaded
    if (req.file) {
        try {
            // Upload new image to Cloudinary directly from buffer
            const uploadResponse = await uploadOnCloudinary(
                req.file.buffer,
                req.file.originalname
            );

            if (!uploadResponse || !uploadResponse.url) {
                throw new ApiError(500, "Failed to upload image");
            }

            // Delete the old image from Cloudinary (if it exists)
            if (post.featuredImage) {
                // Extract public_id from the existing Cloudinary URL
                const publicId = post.featuredImage
                    .split("/")
                    .pop()
                    .split(".")[0];

                // Delete the old image from Cloudinary
                await deleteFromCloudinary(publicId);
            }

            // Update the featuredImage URL
            post.featuredImage = uploadResponse.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new ApiError(500, "Image upload failed");
        }
    }

    // 7. Save the updated post
    await post.save();

    // 8. Return the updated post
    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post updated successfully"));
});


const getPostBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });
    if (!post) throw new ApiError(404, "Post not found");

    res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
});

const deletePostBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const deletedPost = await Post.findOneAndDelete({ slug });
    if (!deletedPost) throw new ApiError(404, "Post not found");

    res.status(200).json(new ApiResponse(200, deletedPost, "Post deleted successfully"));
});




export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory,
    getAllPosts,
    createPost,
    updatePostBySlug,
    deletePostBySlug,
    getPostBySlug,
    getUserPosts
}