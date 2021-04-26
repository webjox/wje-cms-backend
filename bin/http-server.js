import gracefulShutdownMix from 'http-shutdown';
import config from '../config';
import httpServerApp from '../src/server';
import logger from 'winston';
import colors from 'colors';
import dashboardWebSocket from '../src/libs/dashboardWebSocket';

function onListen() {
  logger.info(`==== HTTP server succesfull run on port: ${config.httpPort} ====`);
  console.log(`==== HTTP server succesfull run on port: ${config.httpPort} ====`.green);
}

const nativeHttpSever = httpServerApp.listen(config.httpPort, onListen);
dashboardWebSocket.listen(nativeHttpSever);
const serverWithShutdown = gracefulShutdownMix(nativeHttpSever);

process.on('SIGINT', () => {
  console.log('Start Shutdown HttpServer');

  const shutdownCallBackErr = err => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    process.exit(0);
  };

  const timer = setTimeout(() => {
    logger.info('Force shutdown http server by timeout');
    serverWithShutdown.forceShutdown(err => shutdownCallbackErr(err));
  }, config.gracefulStopTimeout);

  serverWithShutdown.shutdown(err => {
    clearTimeout(timer);
    shutdownCallBackErr(err);
  });
});
