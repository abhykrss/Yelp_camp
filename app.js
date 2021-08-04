// Pre-requisites --->
if(process.env.NODE_ENV!== "production"){
    require('dotenv').config();
}

const express            = require('express');
const app                = express();
const path               = require('path');
const mongoose           = require('mongoose');
const ejsMate            = require('ejs-mate');
const ExpressError       = require('./utilities/ExpressError');
const methodOverride     = require('method-override');
const session            = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

const MongoDBStore = require('connect-mongo');
const dbUrl = process.env.DB_key || 'mongodb://localhost:27017/yelp-camp';
//Routes --->

const campRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');

//EJS Engine --->

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.path('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended : 'true'}));
app.use(methodOverride('_method'));

//Mongoose database Connection --->
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex : true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const db =  mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=>{
    console.log("DATABASE CONNECTED")
});

//Session configuration --->
const secret = process.env.SECRET || 'secret';
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret:'secret',
    touchAfter: 24*60*60
});

store.on("error",function(e){
    console.log("Session Store Error",e);
})

const sessionConfig = {
    store,
    name:'session',
    secret,
    resave : false,
    saveUninitialized :true,
    cookie:{
        httpOnly : true,
        expires : Date.now() + 1000*3600*24*7,
        maxAge : 1000*3600*24*7
    }
}
app.use(session(sessionConfig));

//Public Directory --->

app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy:false}));


//Passport Set-up --->

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash middleware --->

app.use(flash());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//Routes Starts here---->

app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/review', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req,res)=>{
    res.render('home')
});

app.all('*', (req, res, next)=>{
    next(new ExpressError('Invalid Request', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh  Boy! Something went wrong"
    res.status(statusCode).render('./partials/error', {err})
});

const port = process.env.PORT || 3000
app.listen(port , ()=>{
     console.log("SERVER RESPONDING!")
});