import { Request, Response } from 'express';

enum ROLES {
    ADMIN = 'admin',
    ASSISTANCE = 'assistance',
    MODERATOR = 'moderator',
    AUTHOR = 'author',
    CUSTOMER = 'customer',
    GUEST = 'guest',
}

enum ACCESS_STATUSES {
    ACTIVE = 'active',
    PENDING = 'pending',
    EXPIRED = 'expired',
}

const hasAccess = [ROLES.ADMIN, ROLES.ASSISTANCE];
const middleAccess = [ROLES.MODERATOR];

const sources = ['names', 'emails', 'phones'];

const allowedAppsIds: any[] = [
    {
        id: '12345',
        status: ACCESS_STATUSES.ACTIVE,
        tryCharge: 0,
        chargeDate: 123213213123,
        createdAt: 12312312312,
    },
    {
        id: 'abcde',
        status: ACCESS_STATUSES.PENDING,
        tryCharge: 1,
        chargeDate: 123213213123,
        createdAt: 12312312312,
    },
];

export default (req: Request, res: Response, next: Function) => {
    const { role, id, source } = req.query;
    console.log('MIDDLEWARE WORK. Request params: ', role, id, source);
    const errResp = (msg: string, code: number = 500) => res.json({ code, msg });
    if (allowedAppsIds.includes(id)) {
        console.log('This APP ID exists in our clients list');
        // const existClient = await ClientSession.find({clientId: id});
        // const clientUsage = await ClientUsage.find({clientId: id});
        const existsClient = allowedAppsIds.find((cl: any) => cl.id === id);
        if (existsClient) {
            if (existsClient.status === ACCESS_STATUSES.ACTIVE) {
                console.log('This ID APP allowed to use our API');
                // ClientUsage.updateOne({_id: clientUsage._id}, {$inc: {clientQueries: 1}});
            } else if (existsClient.status === ACCESS_STATUSES.PENDING) {
                console.log('This ID APP tepm allowed to use our API');
                // PayPal charge or another actions
                if (source !== 'names') {
                    errResp('Not allowed. Please contant with us 1234567.');
                }
            } else if (existsClient.status === ACCESS_STATUSES.EXPIRED) {
                errResp('Not allowed. Please contant with us 123.');
            }
        }
    } else {
        errResp('Not allowed. Please contant with us.');
    }

    next();
};
