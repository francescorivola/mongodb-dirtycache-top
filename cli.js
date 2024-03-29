#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const { program } = require('commander');
const packageJson = require('./package.json');
const prettyBytes = require('pretty-bytes');

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description)
  .option('-h, --host [value]', 'Set host', String, 'localhost')
  .option('-P, --port [value]', 'Set port', Number, 27017)
  .option('-u, --username [value]', 'Set username')
  .option('-p, --password [value]', 'Set password')
  .requiredOption('-d, --database [value]', 'Set database (required)')
  .option('-c, --collections [value]', 'Set collections name separated by comma. If not specified will inspect all database collections', (value) => value.split(','))
  .option('-i, --interval <n>', 'Set refresh interval in milliseconds', Number, 1000)
  .parse(process.argv);

const { host, port, username, password, database, collections, interval } = program.opts();

const format = n => (isNaN(n) ? n : prettyBytes(n)).padStart(15, ' ');

async function run() {
    const url = `mongodb://${host}:${port}`;
    const client = new MongoClient(url, Object.assign({},
        (username && password) ? {
            auth: {
                username,
                password
            }
        } : {}));
    await client.connect();
    const db = client.db(database);
    const admin = db.admin();

    const collectionsName = !collections ? await getAllDatabaseCollectionNames(db) : collections;
    const colls = collectionsName.map(c => db.collection(c));

    async function runAtInterval() {
        try {
            const stats = await Promise.all([
                admin.serverStatus(),
                ...colls.map(c => c.stats({indexDetails: 1}))
            ]);
            stats.map(s => {
                if (!s.ns) {
                    return {
                        ns: 'Mongo Server Total Dirty Cache',
                        totalDirty: s.wiredTiger.cache['tracked dirty bytes in the cache'],
                        dataDirty: 'Data',
                        indexDirty: 'Indexes'
                    };
                }

                const dataDirty = s.wiredTiger.cache['tracked dirty bytes in the cache'];
                const indexDirty = Object.keys(s.indexDetails)
                    .map(k => s.indexDetails[k].cache['tracked dirty bytes in the cache'])
                    .reduce((a, b) => a + b, 0);

                return {
                    ns: s.ns,
                    totalDirty: dataDirty + indexDirty,
                    dataDirty,
                    indexDirty
                };
            })
            .sort((a, b) => a.totalDirty > b.totalDirty ? -1 : a.totalDirty < b.totalDirty ? 1 : 0)
            .filter(s => s.totalDirty > 0)
            .forEach(s => console.log(`${s.ns.padEnd(40, ' ')}${format(s.totalDirty)}${format(s.dataDirty)}${format(s.indexDirty)}`));
            console.log(''.padEnd(85, '-'));
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    setInterval(runAtInterval, interval);
}

async function getAllDatabaseCollectionNames(db) {
    return (await db.listCollections().toArray())
        .map(c => c.name)
        .filter(c => !c.startsWith('system.'));
}

run().catch(error => {
    console.error(error);
    process.exit(1);
});
