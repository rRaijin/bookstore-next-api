import mongoose from 'mongoose';

export const getMongoId = (id: string) => {
    const ObjectId = mongoose.Types.ObjectId;
    return ObjectId.createFromHexString(id);
};
