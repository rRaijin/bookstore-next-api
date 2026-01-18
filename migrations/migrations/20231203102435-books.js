import { ObjectId } from "mongodb";

export const up = async (db, client) => {
    const genres = await db.collection('genres').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();
    const authors = await db.collection('authors').find({}).toArray();
    const getAuthorId = (userEmail) => {
        const user = users.find(u => u.userEmail === userEmail);
        return authors.find(a => String(a.userId) === String(user._id))._id;
    }
    const getGenresIds = (nums) => {
        const result = [];
        nums.forEach(num => {
            let gId;
            switch (num) {
                case 1: gId = genres.find(g => g.title === 'Роман')._id; break;
                case 2: gId = genres.find(g => g.title === 'Детская литература')._id; break;
                case 3: gId = genres.find(g => g.title === 'Сатира')._id; break;
                case 4: gId = genres.find(g => g.title === 'Детектив')._id; break;
                case 5: gId = genres.find(g => g.title === 'Приключения')._id; break;
                case 6: gId = genres.find(g => g.title === 'Научная фантастика')._id; break;
                case 7: gId = genres.find(g => g.title === 'Новелла')._id; break;
            }
            result.push(new ObjectId(gId));
        });
        return result;
    }

    const items = [
        {
            "bookName": "Приключения Тома Сойера",
            "description": "«Приключения Тома Сойера» — вышедшая в 1876 году повесть Марка Твена о приключениях мальчика, живущего в небольшом американском городке Сент-Питерсберг в штате Миссури.",
            "year": 1876,
            "price": 500,
            "authorId": new ObjectId(getAuthorId('marktwen@gmail.com')),
            "picture": "tom_soyer.jpg",
            "pages": 191,
            "genres": getGenresIds([1, 2, 3]),
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "bookName": "Приключения Шерлока Холмса",
            "description": "Здесь будут жених, опасающийся мести бывшей возлюбленной, и невеста, брошенная в день венчания; загадочные апельсиновые зернышки и тайный код пляшущих человечков, смертоносный китобойный гарпун и рождественский гусь с сюрпризом…",
            "year": 1876,
            "price": 800,
            "authorId": new ObjectId(getAuthorId('konandoil@gmail.com')),
            "picture": "Adventures_of_sherlock_holmes.jpg",
            "pages": 160,
            "genres": getGenresIds([4]),
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "bookName": "Поллианна",
            "description": "Обычное описание книги",
            "year": 1876,
            "price": 1800,
            "authorId": new ObjectId(getAuthorId('elionorporter@gmail.com')),
            "picture": "poliana.jpg",
            "pages": 160,
            "genres": getGenresIds([1, 2]),
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "bookName": "Остров Сокровищ",
            "description": "«Остров Сокровищ» — роман шотландского писателя Роберта Стивенсона о приключениях, связанных с поиском сокровищ, спрятанных капитаном Флинтом на необитаемом острове.",
            "year": 1883,
            "price": 400,
            "authorId": new ObjectId(getAuthorId('luisstiwenson@gmail.com')),
            "picture": "treasureIsland.jpg",
            "pages": 260,
            "genres": getGenresIds([1, 2]),
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "bookName": "Пять недель на воздушном шаре",
            "description": "Первый приключенческий роман Жюля Верна.",
            "year": 1863,
            "price": 1400,
            "authorId": new ObjectId(getAuthorId('juliewern@gmail.com')),
            "picture": "Five_weeks_in_a_hot_air_balloon.jpg",
            "pages": 360,
            "genres": getGenresIds([1, 5]),
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "bookName": "Двадцать тысяч льё под водой",
            "description": "Профессор Аронакс и его друзья волею судьбы оказываются на борту подводного судна «Наутилус», которым управляет загадочный капитан Немо.",
            "year": 1863,
            "price": 1200,
            "authorId": new ObjectId(getAuthorId('juliewern@gmail.com')),
            "picture": "twenty_thousand_leagues_under_the_sea.jpg",
            "pages": 360,
            "genres": getGenresIds([1, 6]),
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
        {
            "bookName": "Маленький принц",
            "description": "Сказка рассказывает о Маленьком принце, который посещает различные планеты в космосе, включая Землю. Книга обращается к темам одиночества, дружбы, любви и утраты.",
            "year": 1943,
            "price": 200,
            "authorId": new ObjectId(getAuthorId('sentexuperi@gmail.com')),
            "picture": "a_little_prince.jpg",
            "pages": 60,
            "genres": getGenresIds([2, 7]),
            "createdAt" : new Date().getTime(),
            "updatedAt" : new Date().getTime()
        },
    ];

    return db.collection('books').insertMany(items);
}
