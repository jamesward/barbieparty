const Koa = require('koa');
const Router = require('koa-router');
const PgAsync = require('pg-async').default;
const send = require('koa-send');
const mount = require('koa-mount');
const body = require('koa-json-body');

const app = new Koa();

const pgAsync = process.env.DATABASE_URL !== undefined
  ? new PgAsync(process.env.DATABASE_URL)
  : new PgAsync('postgres://localhost:5432/barbieparty');

const router = new Router();

router.get('/', async ctx => {
  await send(ctx, 'public/index.html');
});

router.get('/contact', async ctx => {
  ctx.body = (await pgAsync.query(`SELECT * FROM salesforce.Contact`)).rows;
});

router.post('/contact', async ctx => {
  const sql = `INSERT INTO salesforce.Contact (firstname, lastname) VALUES ($1, $2) RETURNING sfid`;
  ctx.body = {sfid: (await pgAsync.value(sql, ctx.request.body.firstname, ctx.request.body.lastname))};
});

app.use(mount('/assets/salesforce-ux/design-system', async ctx => {
  await send(ctx, ctx.path, { root: 'node_modules/@salesforce-ux/design-system/assets' });
}));

app.use(mount('/assets/vue', async ctx => {
  await send(ctx, ctx.path, { root: 'node_modules/vue/dist' });
}));

app.use(mount('/assets/vue-resource', async ctx => {
  await send(ctx, ctx.path, { root: 'node_modules/vue-resource/dist' });
}));

app.use(body());

app.use(router.routes());

app.use(router.allowedMethods());

const port = process.env.PORT || 8200;
app.listen(port);

console.log('Listening at: http://localhost:' + port);
