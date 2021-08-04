const express = require('express');
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const Router = express.Router();
const user = require('../controllers/users');

Router.route('/register')
    .get(user.renderRegisterForm)
    .post(catchAsync(user.registration));

Router.route('/login')
    .get( user.renderLoginForm)
    .post( passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}) ,user.login);

Router.get('/logout',user.logout);

module.exports = Router;
