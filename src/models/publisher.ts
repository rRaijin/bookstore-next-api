import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose';
import { UserSchema } from './user'; // путь поправь

@pre<PublisherSchema>('save', function () {
    this.updatedAt = new Date().getTime();
    if (this.isNew) {
        this.createdAt = new Date().getTime();
    }
})
export class PublisherSchema {
    @prop({ ref: () => UserSchema })
    public userId: Ref<UserSchema>;

    @prop()
    public bio: string;

    @prop()
    public year: number;

    @prop()
    public picture: string;

    @prop()
    public pseudonym: string;

    @prop({ default: false })
    public isEditorInChief: boolean;

    @prop()
    public createdAt: number;

    @prop()
    public updatedAt: number;
}

export const Publisher = getModelForClass(PublisherSchema, {
    schemaOptions: {
        collection: 'publishers',
    },
});
