import { getModelForClass, prop, pre } from '@typegoose/typegoose';

@pre<GenreSchema>('save', function () {
    this.updatedAt = new Date().getTime();
    if (this.isNew) {
        this.createdAt = new Date().getTime();
    }
})
export class GenreSchema {
    @prop()
    public title: string;

    @prop()
    public description: string;

    @prop()
    public picture: string;

    @prop()
    public booksCnt: number;

    @prop()
    public createdAt: number;

    @prop()
    public updatedAt: number;
}

export const Genre = getModelForClass(GenreSchema, {
    schemaOptions: {
        collection: 'genres',
    },
});
