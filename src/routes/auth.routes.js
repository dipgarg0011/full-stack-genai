const {Router} = require('express');
const authRouter = Router()
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @desc clear the token cookie to logout a user
 * @access Public
 */
authRouter.get("/logout",authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @desc Get the logged in user's details
 * @access Private
 */
 authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)


module.exports= authRouter