import { ObjectId } from 'mongodb';

export const up = async (db, client) => {
    const users = await db.collection('users').find({}).toArray();
    const uId = (email) => users.find((u) => u.userEmail === email)._id;

    const items = [
        {
            userId: new ObjectId(uId('marktwen@gmail.com')),
            picture: 'Mark_Twain.jpg',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            bio: 'американский писатель, журналист и общественный деятель. Его творчество охватывает множество жанров: юмор, сатиру, философскую фантастику, публицистику.',
        },
        {
            userId: new ObjectId(uId('djordjoruell@gmail.com')),
            picture: 'George_Orwell.jpg',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            bio: 'британский писатель, журналист и литературный критик, радиоведущий, автор мемуаров, публицист. Его работы отличаются простым стилем изложения, критикой тоталитаризма и поддержкой демократического социализма.',
        },
        {
            userId: new ObjectId(uId('konandoil@gmail.com')),
            picture: 'Arthur_Conan_Doyle.png',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            bio: 'английский писатель (по образованию врач) ирландского происхождения, автор многочисленных приключенческих, исторических, публицистических, фантастических и юмористических произведений.',
        },
        {
            userId: new ObjectId(uId('elionorporter@gmail.com')),
            picture: 'EleanorH.Porter.jpg',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            bio: 'американская писательница, специализирующаяся на детской литературе и романах.',
        },
        {
            userId: new ObjectId(uId('luisstiwenson@gmail.com')),
            picture: 'Robert_Louis_Stevenson.jpg',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            bio: 'британский писатель, поэт, автор приключенческих романов и повестей, крупнейший представитель английского неоромантизма.',
        },
        {
            userId: new ObjectId(uId('juliewern@gmail.com')),
            picture: 'Jules_verne.jpg',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            bio: 'французский писатель, автор романов «Дети капитана Гранта», «Капитан Немо» и других приключенческих историй, многие из которых были экранизированы.',
        },
        {
            userId: new ObjectId(uId('sentexuperi@gmail.com')),
            picture: 'Sent-Ekzyuperi.jpg',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            bio: 'французский писатель, журналист, поэт, сценарист и профессиональный лётчик.',
        },
    ];

    return db.collection('authors').insertMany(items);
};
