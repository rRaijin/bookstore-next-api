export const up = async (db, client) => {
    const items = [
        {
            "firstName": "Марк",
            "lastName": "Твен",
            "userEmail": "marktwen@gmail.com",
            "isAuthor": true,
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "firstName": "Джордж",
            "lastName": "Оруэлл",
            "userEmail": "djordjoruell@gmail.com",
            "isAuthor": true,
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "firstName": "Артур",
            "lastName": "Конан Дойл",
            "userEmail": "konandoil@gmail.com",
            "isAuthor": true,
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "firstName": "Элинор",
            "lastName": "Портер",
            "userEmail": "elionorporter@gmail.com",
            "isAuthor": true,
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "firstName": "Роберт",
            "lastName": "Льюис Стивенсон",
            "userEmail": "luisstiwenson@gmail.com",
            "isAuthor": true,
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "firstName": "Жуль",
            "lastName": "Верн",
            "userEmail": "juliewern@gmail.com",
            "isAuthor": true,
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "firstName": "Антуан де",
            "lastName": "Сент-Экзюпери",
            "userEmail": "sentexuperi@gmail.com",
            "isAuthor": true,
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        }
    ];

    return db.collection('users').insertMany(items);
}
