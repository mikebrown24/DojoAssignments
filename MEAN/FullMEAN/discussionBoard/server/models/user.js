var mongoose = require("mongoose");
var bcrypt = require("bcryptjs")
var regrex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//TODO: firstname,lastname,email,birthday
var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        validate: {
            validator: function (value) {
                return regrex_email.test(value);
            },
            message: "Email is invalid."
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 24,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test(value);
            },
            message: "Password failed validation, you must have at least 1 number, uppercase and special character"
        },
    },
    birthday: {
        type: Date,
        required: true,
        default: Date.now(),
        validate: {
            validator: function (value) {
                return value < Date.now();
            },
            message: "Birthday should be in the past"
        }
    }
}, { timestamps: true });

var topicSchema = mongoose.Schema({
    _user: {
        type: String,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        ref: 'Topic',
        required: true,
        minlength: 1,
        maxlength: 1000,
    },
    description: {
        type: String,
        ref: 'Topic',
        required: true,
        minlength: 5,
        maxlength: 1000,
    },
    category: {
        type: String,
        ref: 'Topic',
        required: true,
    },
    posts: {
        type: String,
        ref: 'Post',
    }
}, { timestamps: true });

var commentSchema = mongoose.Schema({
    _user: {
        type: String,
        ref: 'User',
        required: true
    },
    _topic: {
        type: String,
        ref: 'Topic',
        required: true
    },
    comment: {
        type: String,
        minlength: 1,
        maxlength: 1000,
        required: true,
    }
}, { timestamps: true });

var postSchema = mongoose.Schema({
  content: { type: String, required: true, minlength: 3},
  user: { type: String },
  user_id: { type: String },
  like: [],
  dislike: [],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.pre('hashSync', function (done) {
    this.password = this.generateHash(this.password);
    done();
})

mongoose.model('User', userSchema);
mongoose.model('Topic', topicSchema);
mongoose.model('Comment', commentSchema);
mongoose.model('Post', postSchema);