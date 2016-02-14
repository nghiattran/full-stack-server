var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId;
var crypto = require('crypto');


var UserSchema = new Schema({
	username: {
		type: String, 
		required: 'username is required',
		unique: true },
	password: {
		type: String, 
		required: 'password is required' },
    email: {
        type: String,
        required: 'email is required',
        lowercase: true,
        unique: true
    },
    auth: {},
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


// Validator
UserSchema
	.path('email')
	.validate(function (email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	}, 'Invalid email address.')


// Addon methods for user object
UserSchema.methods = {
	authenticate(password, hash, callback) {
		callback(hash === this.encryptPassword(password));
	},
	encryptPassword(password) {
		return crypto.createHash('sha256')
			.update(password)
			.digest('base64');
	}
}


exports = module.exports = mongoose.model('User', UserSchema);
