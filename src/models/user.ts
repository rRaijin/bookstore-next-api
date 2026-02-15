import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    isAuthor: {
        type: Boolean
    }
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('User', userSchema);
