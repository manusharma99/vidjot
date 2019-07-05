const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//global variable
app.use(function(req,res,next){
    res.locals.success_msg =  req.flash('success_msg');
    res.locals.error_msg =  req.flash('error_msg');
    res.locals.errors = req.flash('error');
    next();
});

//method override 
app.use(methodOverride('_method'));

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://manusharma99:manu@9990738223@cluster0-ta5ng.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
.then(() => console.log('mongodb is connected'))
.catch(err => console.log(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');

//handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
 

//routes
app.get('/', (req,res) => {
    const title = 'WELCOME';
 res.render('home' , {title:title});
});

//About
app.get('/about', (req,res) => {
    res.render('about');
   });
//add ideas
app.get('/ideas/add',(req,res) =>{
    res.render('ideas/add');
});
//edit ideas
app.get('/ideas/edit/:id',(req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then( idea => {
        res.render('ideas/edit',
        {idea:idea});
    });
});

//index route
app.get('/ideas',(req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{ideas:ideas})
        
    }
    )
});

app.post('/ideas', (req,res)=>{
    let errors = [];
    if(!req.body.title)
    {
      errors.push({text:'please fill the title'});
    }
    if (!req.body.details)
    {
        errors.push({text:'please fill the details'});
    }
    if(errors.length > 0)
    {
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
     }
    else 
    {
        const newUser = {
            title:req.body.title,
            details:req.body.details
        }
    new Idea(newUser)
    .save()
    .then(idea =>{
        req.flash('success_msg','Idea is added');
        res.redirect('/ideas');
    })
    }
});

//put 
app.put('/ideas/:id',(req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea=>{
        idea.title=req.body.title;
        idea.details=req.body.details;
        idea.save()
        .then(idea=>{
            req.flash('success_msg','Idea is updated');
            res.redirect('/ideas');
        })

    })
    
});
//delete request
app.delete('/ideas/:id',(req,res)=>{
   Idea.remove({_id: req.params.id})
   .then(()=>{
       req.flash('success_msg','Idea is removed');
       res.redirect('/ideas');
   })
});
const port = 5000;
app.listen(port, () => {
    console.log('server started on port ' + port);
}); 