var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId;
var crypto = require('crypto');

/**
 * Schema for user
 */
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
  isActivated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Set indexes
UserSchema.index({ username: 1, email: 1 });

// Validators

/**
 * Validators for email
 */
UserSchema
	.path('email')
	.validate(function (email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	}, 'Invalid email address.')


// Addon methods for user object
UserSchema.methods = {

  /**
   * Check if the password is match with hash password
   * @param  {[type]}   password Password string
   * @param  {[type]}   hash     Password has from database
   * @param  {Function} next     Callback
   * @return {[type]}            [description]
   */
	authenticate(password, hash, next) {
    if (next) {
      next(hash === this.encryptPassword(password));
    } else {
      return hash === this.encryptPassword(password);
    }
	},

  /**
   * Hash the password
   * @param  {[type]} password Password string
   * @return {[type]}          [description]
   */
	encryptPassword(password) {
		return crypto.createHash('sha256')
			.update(password)
			.digest('base64');
	}
}


exports = module.exports = mongoose.model('User', UserSchema);
