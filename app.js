const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static files
app.use(express.static(path.join(__dirname,'public')));

//global variable
app.use(function(req,res,next){
    res.locals.success_msg =  req.flash('success_msg');
    res.locals.error_msg =  req.flash('error_msg');
    res.locals.errors = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//method override 
app.use(methodOverride('_method'));

//mongoose
mongoose.connect('mongodb+srv://manusharma99:manu@9990738223@cluster0-ta5ng.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
.then(() => console.log('mongodb is connected'))
.catch(err => console.log(err));


//handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
 
//load routes for ideas
const ideas = require('./routers/ideas');
const users = require('./routers/users');

//passport
require('./config/passport')(passport);

//routes
app.get('/', (req,res) => {
    const title = 'WELCOME';
 res.render('home' , {title:title});
});

//About
app.get('/about', (req,res) => {
    res.render('about');
   });




//use of routes
app.use('/ideas',ideas);
app.use('/users',users);

const port = 5000;
app.listen(port, () => {
    console.log('server started on port ' + port);
}); 