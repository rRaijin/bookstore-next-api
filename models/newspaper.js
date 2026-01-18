import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const newspaperSchema = new Schema({
    newspaperName: String,
    description: String,
    year: Number,
    picture: String,
    editors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Publisher'
        }
    ]
    // publisher: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Publisher'
    // },
    
}, {
    timestamps: true
});

export default mongoose.model('Newspaper', newspaperSchema);
