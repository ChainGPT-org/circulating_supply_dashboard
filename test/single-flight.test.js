// Offline check: upstream (Etherscan) is stubbed; no network calls.
const test = require('node:test'), assert = require('node:assert/strict'), Module = require('node:module');
let calls = 0;
const fakeAxios = { create: () => ({ get: async url => {
  calls++; await new Promise(r => setTimeout(r, 20));
  return { data: { result: url.includes('tokensupply') ? '900000000000000000000000000' : '1000000000000000000' } };
} }) };
const load = Module._load;
Module._load = function (request, ...rest) { return request === 'axios' ? fakeAxios : load.call(this, request, ...rest); };
const express = require('express'), listen = express.application.listen;
let server;
express.application.listen = function (_port, cb) { server = listen.call(this, 0, '127.0.0.1', cb); return server; };
Object.assign(process.env, { CGPT_MAX_SUPPLY: '1000000000', CGPT_CONTRACT_ADDRESS: '0xtest', BSCSCAN_API_KEY: 'test' });
require('../index.js');
const get = path => fetch(`http://127.0.0.1:${server.address().port}${path}`).then(async r => [r.status, await r.text()]);

test.after(() => { server.closeAllConnections(); server.close(); });

test('concurrent cold requests share one upstream refresh and keep response values', async () => {
  await new Promise(r => server.listening ? r() : server.once('listening', r));
  const results = await Promise.all([...Array(20)].flatMap(() => [get('/supply'), get('/'), get('/burn'), get('/totalsupply')]));
  assert.equal(calls, 10); // 9 balances + 1 total supply, not 9 per request
  const [supply, home, burn, total] = results.slice(0, 4);
  assert.deepEqual(supply, [200, '899999991']);
  assert.deepEqual(burn, [200, (100000000).toLocaleString()]);
  assert.deepEqual(total, [200, '900000000']);
  assert.equal(home[0], 200); assert.match(home[1], /Live Circulating Supply of \$CGPT: 899,999,991/);
});
