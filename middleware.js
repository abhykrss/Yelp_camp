const ExpressError = require('./utilities/ExpressError');
const {campgroundSchema, reviewSchema} = require('./models/joiSchema');
const campground = require('./models/campground');
const Review = require('./models/reviewSchema');

module.exports.IsLoggedIn = (req,res,next)=> {
    if(!req.isAuthenticated()){
        req.session.returnTo =req.originalUrl;
        req.flash('error','You should log in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateReq = (req, res, next) =>{
    const {error} = campgroundSchema.validate(req.body);
    
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const camp = await campground.findById(id);
    console.log(req.user._id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error','You are not the author of the post');
        return res.redirect(`/campgrounds${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You are not the author of the post');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    const{error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}