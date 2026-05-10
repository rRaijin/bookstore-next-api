import { Request, Response, NextFunction } from 'express';

type ParsedSearch = {
    type: string;
    sort: 'asc' | 'desc';
    limit: number;
};

function parseSearchString(raw: string): Record<string, string> {
    return raw
        .split('|')
        .reduce((acc, pair) => {
            const [key, value] = pair.split(':');
            if (key && value) acc[key.trim()] = value.trim();
            return acc;
        }, {} as Record<string, string>);
}

const ALLOWED_TYPES = ['user', 'product', 'order'];

export default (req: Request, res: Response, next: NextFunction) => {
    const raw = req.query.search as string;

    console.log('searchMiddleware. Raw string:', raw);

    const err = (msg: string) => res.status(400).json({ error: msg });

    if (!raw) {
        return err('Missing "search" query param. Example: ?search=type:user|sort:asc|limit:10');
    }

    const params = parseSearchString(raw);
    console.log('Parsed params:', params);

    if (!params.type) {
        return err('Missing "type". Allowed: user, product, order');
    }

    if (!ALLOWED_TYPES.includes(params.type)) {
        return err(`Unknown type "${params.type}". Allowed: ${ALLOWED_TYPES.join(', ')}`);
    }

    const sort = params.sort ?? 'asc';

    if (sort !== 'asc' && sort !== 'desc') {
        return err('Invalid sort. Use "asc" or "desc"');
    }

    const limit = parseInt(params.limit ?? '20', 10);

    if (isNaN(limit) || limit < 1 || limit > 100) {
        return err('Invalid limit. Must be a number between 1 and 100');
    }

    res.locals.search = { type: params.type, sort, limit } as ParsedSearch;

    console.log('Result:', res.locals.search);
    next();
};