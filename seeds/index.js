const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex : true,
    useUnifiedTopology: true
});

const db =  mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=>{
    console.log("Database Connected");
})

const sample = (array)  => array[Math.floor(Math.random()*array.length)];



const seedDB = async () =>{
    await campground.deleteMany({});
    for(let i = 0 ; i < 300 ; i++ ){
        const randomPrice = Math.floor(Math.random()*30 + 10) ;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new campground({
            author: '60e009ad55953824b4ef081a',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            price : randomPrice,
            geometry: { type: 'Point', coordinates: [ 
                  cities[random1000].longitude,
                  cities[random1000].latitude ] },
            images: [
              {
    
                url: 'https://res.cloudinary.com/diybubvgc/image/upload/v1625480975/YelpCamp/zfm2dpszfiv2eseqgtiu.jpg',
                filename: 'YelpCamp/zfm2dpszfiv2eseqgtiu'
              },
              {
    
                url: 'https://res.cloudinary.com/diybubvgc/image/upload/v1625480975/YelpCamp/zfm2dpszfiv2eseqgtiu.jpg',
                filename: 'YelpCamp/zfm2dpszfiv2eseqgtiu'
              },
              {
    
                url: 'https://res.cloudinary.com/diybubvgc/image/upload/v1625480975/YelpCamp/zfm2dpszfiv2eseqgtiu.jpg',
                filename: 'YelpCamp/zfm2dpszfiv2eseqgtiu'
              }
            ],
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur reprehenderit, cum doloremque unde porro distinctio. Repellat accusantium, quis recusandae error dolorem incidunt quibusdam praesentium. Eum nesciunt soluta, animi porro quod id numquam? Veritatis nihil maxime laboriosam, quas corrupti consequatur ab atque asperiores omnis minus neque est! Laboriosam quae saepe a!'
        });
        await camp.save();
    }
    

}
seedDB().then(()=>{
    mongoose.connection.close();
});