import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose';
import { PublisherSchema } from './publisher';

@pre<NewspaperSchema>('save', function () {
    this.updatedAt = new Date().getTime();
    if (this.isNew) {
        this.createdAt = new Date().getTime();
    }
})
export class NewspaperSchema {
    @prop()
    public newspaperName: string;

    @prop()
    public description: string;

    @prop()
    public year: number;

    @prop()
    public picture: string;

    @prop({ ref: () => PublisherSchema, type: () => [PublisherSchema] })
    public editors: Ref<PublisherSchema>[];

    // @prop({ ref: () => PublisherSchema })
    // public publisher: Ref<PublisherSchema>;

    @prop()
    public createdAt: number;

    @prop()
    public updatedAt: number;
}

export const Newspaper = getModelForClass(NewspaperSchema, {
    schemaOptions: {
        collection: 'newspapers',
    },
});
