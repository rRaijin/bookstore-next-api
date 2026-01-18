import mongoose from "mongoose";

const Schema = mongoose.Schema;
const publisherSchema = new Schema({
    userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    bio: String,
    year: Number,
    picture: String,
    pseudonym: String,
    isEditorInChief: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
}, {
    timestamps: true
});

export default mongoose.model('Publisher', publisherSchema);
