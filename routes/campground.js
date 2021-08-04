const express =  require('express');
const Router = express.Router({mergeParams : true});
const catchAsync = require('../utilities/catchAsync');
const campground = require('../models/campground');
const {IsLoggedIn , isAuthor ,validateReq} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

Router.route('/')
    .get( campgrounds.index)
    .post( IsLoggedIn,  upload.array('image'), validateReq, catchAsync(campgrounds.CreateNew));

Router.get('/new',IsLoggedIn, campgrounds.renderNewForm);

Router.route('/:id')
    .get(catchAsync(campgrounds.showPage))
    .put(IsLoggedIn, isAuthor, upload.array('image'), validateReq, catchAsync(campgrounds.updateCamp))
    .delete(IsLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

Router.get('/:id/edit',IsLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = Router;