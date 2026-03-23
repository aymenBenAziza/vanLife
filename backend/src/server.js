import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

const bootstrap = async () => {
  await connectDatabase(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`VanLife backend listening on port ${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
