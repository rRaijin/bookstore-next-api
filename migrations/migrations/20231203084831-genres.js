export const up = async (db, client) => {
    const items = [
        {
            title: 'Роман',
            description:
                'художественное произведение большого объема, в котором развернуто повествуется о событиях в жизни главных действующих лиц и их судьбах',
            picture: 'novel.png',
            booksCnt: 0,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        },
        {
            title: 'Детская литература',
            description:
                'литература, специально предназначенная для детей до 16 лет и осуществляющая языком художественных образов задачи воспитания и образования детей.',
            picture: 'childrens-literature.png',
            booksCnt: 0,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        },
        {
            title: 'Сатира',
            description:
                'острое проявление комического в литературе и искусстве, обличающее пороки как отдельных людей, так и всего общества или государственного строя.',
            picture: 'satire.png',
            booksCnt: 0,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        },
        {
            title: 'Детектив',
            description: 'жанр остросюжетной литературы, который повествует о расследовании загадочного случая, чаще всего преступления.',
            picture: 'detective.png',
            booksCnt: 0,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        },
        {
            title: 'Приключения',
            description:
                'жанр романа, сформировавшийся в середине XIX века на волне романтизма и неоромантизма с характерным для них стремлением бежать от мещанской повседневности в мир экзотики и героизма.',
            picture: 'adventures.png',
            booksCnt: 0,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        },
        {
            title: 'Научная фантастика',
            description:
                'фантастический жанр в литературе, сюжет которого строится на развитии событий, ставших возможными в результате вымышленных научных открытий и технологий.',
            picture: 'science-fiction.png',
            booksCnt: 0,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        },
        {
            title: 'Новелла',
            description:
                ' малый повествовательный жанр, по объему близкий к рассказу. Для него характерны остросюжетность, неожиданный финал и отсутствие четкой авторской позиции.',
            picture: 'short-story.png',
            booksCnt: 0,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        },
    ];

    return db.collection('genres').insertMany(items);
};
