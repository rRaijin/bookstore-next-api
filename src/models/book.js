import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const bookSchema = new Schema({
    bookName: String,
    description: String,
    year: Number,
    price: Number,
    picture: String,
    pages: Number,
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    }]
}, {
    timestamps: true
});

export default mongoose.model('Book', bookSchema);
