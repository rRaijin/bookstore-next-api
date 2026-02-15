import { getModelForClass, prop, pre } from '@typegoose/typegoose';

@pre<UserSchema>('save', function () {
    this.updatedAt = new Date().getTime();
    if (this.isNew) {
        this.createdAt = new Date().getTime();
    }
})
export class UserSchema {
    @prop({ required: true })
    public firstName: string;

    @prop()
    public lastName: string;

    @prop({ unique: true })
    public userEmail: string;

    @prop({ minlength: 8 })
    public password: string;

    @prop({ default: false })
    public isAuthor: boolean;

    @prop()
    public createdAt: number;

    @prop()
    public updatedAt: number;
}

export const User = getModelForClass(UserSchema, { schemaOptions: { collection: 'users' } });
