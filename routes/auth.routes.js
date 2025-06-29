
const { Router } = require('express');
const { authLoginController, authLogoutController, refreshTokenController, authregisterController} = require('../controller/auth.controller');
const authRoutes = Router()


authRoutes.post('/register',  authregisterController) 
authRoutes.post("/login", authLoginController);
authRoutes.post("/logout", authLogoutController);
authRoutes.post("/refresh-token", refreshTokenController);

module.exports = { authRoutes }