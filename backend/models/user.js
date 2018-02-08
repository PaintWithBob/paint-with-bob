var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

  email: {
  		type: String,
  		required: true
  	},
  	hash: {
  		type: String,
  		required: true
  	},
  	dateJoined: {
  		type: Date,
  		default: Date.now
  	},
    username: {
      type: String,
      required: false
    },
    banned: {
      type: Boolean,
      required: false
    },
    paintings: [{
      type: String,
      required: false
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User"
    }]

});

//Models
module.exports = mongoose.model('User', userSchema);
