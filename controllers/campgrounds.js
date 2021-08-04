const { cloudinary } = require('../cloudinary');
const campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.GeoApi;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});

module.exports.index = async(req,res)=>{
    const camp= await campground.find({});
    res.render('campgrounds/index', {camp});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.CreateNew = async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send();
    
    const camp = new campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.author = req.user._id;
    camp.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    await camp.save();
    console.log(camp);
    req.flash('success' ,'Successfully created a new campground');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showPage = async(req,res)=>{
    const campgrounds = await campground.findById(req.params.id).populate({
        path:'rating',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campgrounds){
        req.flash('error','Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campgrounds});
}

module.exports.renderEditForm = async(req,res)=>{
    const campgrounds = await campground.findById(req.params.id);
    if(!campgrounds){
        req.flash('error','Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campgrounds} );
}

module.exports.updateCamp = async(req,res)=>{
    const {id} = req.params;
    console.log(req.body);
    const campgrounds = await campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
    campgrounds.images.push(...imgs);
    await campgrounds.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campgrounds.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages}}}});
        console.log(campgrounds);
    }
    req.flash('success' ,'Successfully updated campground');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.deleteCamp = async(req,res) =>{
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success' ,'Successfully deleted campground');
    res.redirect('/campgrounds');
}