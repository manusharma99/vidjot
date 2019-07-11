const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('users');
module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done)=>
    {
     User.findOne({
         email:email
     }).then(user=>{
         if(!user){
             return done(null,false,{message:'User not found'});
             console.log(req.body);
            }
            else{
                bcrypt.compare(password,user.password,(err,match)=>{
                    if (err) throw err;
                    if (match){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message:'password incorrect'});
                    }
                })
            }

     })
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
      
}