import { AppRoutes } from './apps/api/routes';
import { Server } from './apps/api/server';
import { envs } from './apps/api/shared/config/envs';
import { MongoDatabase } from './apps/api/shared/data/mongo-database';

(() => {
  main();
})();

async function main() {
  await MongoDatabase.connect({ mongoUrl: envs.MONGO_URL, dbName: envs.MONGO_DB_NAME });

  const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });

  server.start();
}
