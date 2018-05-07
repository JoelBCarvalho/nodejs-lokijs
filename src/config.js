module.exports = {
  db: {
    name: 'pack.db',
    dir:  'db',
    collection: process.env.COLLECTION_NAME || 'packRepo'
  },
  log: {
    dir: 'logs',
    file: 'output.log'
  },
  files: {
    dir: 'files',
    files_regex: '%TY-%Tm-%Td\t%s\t%p\n',
    secret: 'pixelhide'
  },
  server: {
    port: process.env.PORT || 8080
  },
  api: process.env.API || 'https://test.sioslife.com/api',
};


