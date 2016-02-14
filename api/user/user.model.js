var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	username: String,
	password: String,
    email: {
        type: String,
        lowercase: true
    },
    auth: {}
});

exports = mongoose.model('User', UserSchema);