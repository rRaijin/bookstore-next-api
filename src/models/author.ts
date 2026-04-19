import { getModelForClass, prop, pre, Ref, index } from '@typegoose/typegoose';
import { UserSchema } from './user';

@pre<AuthorSchema>('save', function () {
    this.updatedAt = new Date().getTime();
    if (this.isNew) {
        this.createdAt = new Date().getTime();
    }
})
@index({ createdAt: -1 })
@index({ age: 1, createdAt: -1 })
export class AuthorSchema {
    @prop({ ref: () => UserSchema })
    public userId: Ref<UserSchema>;

    @prop()
    public age: number;

    @prop()
    public picture: string;

    @prop()
    public bio: string;

    @prop()
    public createdAt: number;

    @prop()
    public updatedAt: number;
}

export const Author = getModelForClass(AuthorSchema, {
    schemaOptions: {
        collection: 'authors',
        versionKey: false,
    },
});
