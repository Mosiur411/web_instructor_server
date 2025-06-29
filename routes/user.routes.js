const { Router } = require('express')
const { upload } = require('../middleware/files.middleware')
const { updateuserprofileController, getuserprofileController } = require('../controller/user.controller')
const userRoutes = Router()

userRoutes.get('/profile', getuserprofileController)
userRoutes.put('/updateProfile', upload.single('image'), updateuserprofileController)

module.exports = { userRoutes }
