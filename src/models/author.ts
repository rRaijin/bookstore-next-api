import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const authorSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        picture: String,
        bio: String,
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export default mongoose.model('Author', authorSchema);
