var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
  title:{
    type: String,
    required:true
  },
  details:{
      type: String,
      required:true
  },
  date:{ 
      type:Date,
      default:Date.now
  },
  user:{
    type: String,
    required:true
  }
});

mongoose.model('ideas',SomeModelSchema);