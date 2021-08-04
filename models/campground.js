const mongoose = require('mongoose');
const review = require('./reviewSchema');
const schema = mongoose.Schema;

 
const imageSchema = new schema({
    url:String,
    filename:String
});
const opts={toJSON:{virtuals:true}};

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});

const campgroundSchema = new schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location:String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    rating:[
        {
            type: schema.Types.ObjectId,
            ref :'Review'
        }
    ]
} , opts);

campgroundSchema.virtual('properties.popUp').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a><strong><p>${this.description.substring(0,15)}</p>`;
});

campgroundSchema.post('findOneAndDelete' , async(doc)=>{
    if(doc){
        await review.deleteMany({
            _id : {
                $in: doc.rating
            }
        })
    }
})

module.exports = mongoose.model('Campgrounds',campgroundSchema);