
var mongoose = require('mongoose');



const recordReset=mongoose.Schema({
    Email:{
      type:String,
      require:true,
    },
    key:{
      type:String,
      require:true,
    }
}
)

module.exports=mongoose.model('recordReset',recordReset)