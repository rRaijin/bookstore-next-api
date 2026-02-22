import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose';
import { AuthorSchema } from './author';
import { GenreSchema } from './genre';

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

    @prop({ ref: () => GenreSchema, type: () => [GenreSchema] })
    public genres: Ref<GenreSchema>[];

    @prop()
    public createdAt: number;

    @prop()
    public updatedAt: number;
}

export const Book = getModelForClass(BookSchema, {
    schemaOptions: {
        collection: 'books',
    },
});
