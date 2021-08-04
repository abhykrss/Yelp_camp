const User = require('../models/user');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/userRegister');
}

module.exports.registration = async(req,res)=>{
    try{
        const {username, email, password} = req.body;
        const u = new User({email,username});
        const user = await User.register(u,password);
        req.login(user,err=>{
            if(err) return next(err);
            req.flash('success','Successfully registered');
            res.redirect('/campgrounds');
        })
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }

}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/userLogin');
}

module.exports.login = (req,res)=>{
    req.flash('success','Welcome Back USER');
    const url = req.session.returnTo||'/campgrounds';
    delete req.session.returnTo;
    res.redirect(url);
}

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','Logged You out!');
    res.redirect('/campgrounds');
}