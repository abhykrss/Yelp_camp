const express =  require('express');
const Router = express.Router({mergeParams : true});
const catchAsync = require('../utilities/catchAsync');
const reviews = require('../controllers/reviews')
const {validateReview , isReviewAuthor , IsLoggedIn} = require('../middleware');

Router.post('/', IsLoggedIn, validateReview, catchAsync(reviews.createNew));

Router.delete('/:reviewId',IsLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = Router;