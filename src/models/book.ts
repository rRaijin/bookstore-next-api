import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose';
import { AuthorSchema } from './author';
import { GenreSchema } from './genre';
import { getMongoId } from '@/lib/utils';

@pre<BookSchema>('save', function () {
    this.updatedAt = new Date().getTime();
    if (this.isNew) {
        this.createdAt = new Date().getTime();
    }
})
export class BookSchema {
    @prop()
    public bookName: string;

    @prop()
    public description: string;

    @prop()
    public year: number;

    @prop()
    public price: number;

    @prop()
    public picture: string;

    @prop()
    public pages: number;

    @prop({ ref: () => AuthorSchema })
    public authorId: Ref<AuthorSchema>;

    @prop({ ref: () => GenreSchema })
    public genres: Ref<GenreSchema>[];

    @prop()
    public createdAt: number;

    @prop()
    public updatedAt: number;

    public static getFullBook(bookId: string) {
        console.log('BOOK ID: ', bookId);
        return Book.aggregate([
            {
                $match: {
                    _id: getMongoId(bookId),
                },
            },
            {
                $lookup: {
                    from: 'authors',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'authorId',
                },
            },
            {
                $unwind: '$authorId',
            },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genres',
                    foreignField: '_id',
                    as: 'genres',
                },
            },
            // {
            //     $project: {
            //         _id: 1,
            //         bookName: 1,
            //         description: 1,
            //         year: 1,
            //         price: 1,
            //         authorObj: 1,
            //         picture: 1,
            //         pages: 1,
            //         genres: 1,
            //         createdAt: 1,
            //         updatedAt: 1,
            //     },
            // },
        ]).then((items) => {
            return items[0];
        });
    }
}

export const Book = getModelForClass(BookSchema, {
    schemaOptions: {
        collection: 'books',
    },
});
