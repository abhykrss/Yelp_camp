const campground = require('../models/campground');
const Review = require('../models/reviewSchema');

module.exports.createNew = async(req,res)=>{
    const {id} = await req.params;
    const review = new Review(req.body.review);
    const camp = await campground.findById(id);
    review.author = req.user._id;
    camp.rating.push(review);
    await camp.save();
    await review.save(); 
    req.flash('success' ,'Successfully created a review');
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const{id, reviewId} = req.params;
    await campground.findByIdAndUpdate(id, {$pull: {rating: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' ,'Successfully Deleted a review');
    res.redirect(`/campgrounds/${id}`);
}