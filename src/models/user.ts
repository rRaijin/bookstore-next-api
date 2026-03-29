import { getModelForClass, prop, pre, DocumentType } from '@typegoose/typegoose';

const blockedEmails = ['mail.ru'];

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

    public static newUser(options: any) {
        const user = new User();
        // additional logic
        // user.x = 1
        return user.saveUser(options);
    }

    // В старом @typegoose здесь стоит декоратор @instanceMethod
    public saveUser(this: DocumentType<UserSchema>, options: any) {
        const item: any = this;
        // {"firstName": "Vasya", "userEmail": "some@gameil.com"}
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                if (key === 'userEmail') {
                    item[key] = item[key] ? item[key].toLowerCase() : item[key];
                    // vasYA@mail.ru => vasya@mail.ru

                    // Проверяем имейл на блок
                    // const blockedEmails = await BlackEmailsList.find({}, {'userEmail': 1});
                    if (blockedEmails.indexOf(item[key]) !== -1) {
                        return;
                    }
                } else {
                    item[key] = options[key];
                }
            } else {
                console.log('BAD FORM|DATA');
                return;
            }
        }
        return this.save().then((user) => {
            return {
                ...user.toObject(),
            };
        });
    }
}

export const User = getModelForClass(UserSchema, { schemaOptions: { collection: 'users' } });
