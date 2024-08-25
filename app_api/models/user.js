const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String

});



// Method to set the password on this record.
userSchema.methods.setPassword = function(password) {
    // Generate a 16-byte cryptographically random salt in hexadecimal format
    this.salt = crypto.randomBytes(16).toString('hex');
    
    // Derive a 64-byte hash from the password using the PBKDF2 algorithm
    // with 1000 iterations, using 'sha512' as the hash function
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to compare entered password against stored hash
userSchema.methods.validPassword = function(password) {
    // Recalculate the hash using the provided password and the stored salt
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    
    // Compare the recalculated hash with the stored hash and return true if they match
    return this.hash === hash;
};

// Method to generate a JSON Web Token for the current record
userSchema.methods.generateJWT = function() {
    return jwt.sign(
        { 
            // Payload for our JSON Web Token
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.JWT_SECRET, // Secret stored in .env file
        { expiresIn: '1h' } // Token expires an hour from creation
    );
};



const User = mongoose.model('users', userSchema);
module.exports = User;