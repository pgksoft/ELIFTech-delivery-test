import { connectToMongo } from '@db/connect-to-mongo';
import { config } from '@env/index';
import APP_TITLE from '@infra/const/app-title';
import { createApp } from '@infra/create-app';
import { logger } from '@logger/index';
import { setupProcessHandlers } from '@helpers/setup-process-handlers';

setupProcessHandlers();

const main = async () => {
  await connectToMongo();
  const app = createApp();
  app.listen(config.port, () => {
    logger.info(`${APP_TITLE.launchServer} ${APP_TITLE.localUrl}:${config.port}`);
    //   logger.info(
    //     `${APP_TITLE.aboutDocs} ${APP_TITLE.localUrl}:${config.port}${apiUnAuthUrl.apiDocsV1}`,
    //   );
  });
};

main().catch((err) => {
  logger.error({ err }, APP_TITLE.startupError);
  process.exit(1);
});
