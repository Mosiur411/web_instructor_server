const { Router } = require('express')
const { updateuserprofileController, getuserprofileController } = require('../controller/user.controller')
const userRoutes = Router()

userRoutes.get('/profile', getuserprofileController)
userRoutes.put('/updateProfile', updateuserprofileController)

module.exports = { userRoutes }
