import { setupServer } from 'msw/node'
import { rest } from 'msw';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const handler = rest.get('https://getitdone.force.com/CollectionDetail', (req, res, ctx) => {
    const id = req.url.searchParams.get('id');
    console.log('loading mock for', id)
    const html = readFileSync(resolve(`./src/mocks/${id}.html`), 'utf-8');
    return res(ctx.xml(html));
});

export const server = setupServer(handler);