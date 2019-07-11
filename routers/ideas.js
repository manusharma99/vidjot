const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

require('../models/Idea');
const Idea = mongoose.model('ideas');
module.exports = router;

//add ideas
router.get('/add',ensureAuthenticated,(req,res) =>{
    res.render('ideas/add');
});
//edit ideas
router.get('/edit/:id',ensureAuthenticated,(req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then( idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg','Not Authorized');
            res.redirect('/ideas');
        }
        else{
            res.render('ideas/edit',
        {idea:idea});
        }
    });
});

//index route
router.get('/',ensureAuthenticated,(req,res)=>{
    Idea.find({user : req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{ideas:ideas})
        
    }
    )
});

router.post('/', ensureAuthenticated,(req,res)=>{
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
            details:req.body.details,
           user:req.user.id
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
router.put('/:id',(req,res) => {
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
router.delete('/:id',ensureAuthenticated,(req,res)=>{
   Idea.remove({_id: req.params.id})
   .then(()=>{
       req.flash('success_msg','Idea is removed');
       res.redirect('/ideas');
   })
});