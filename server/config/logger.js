const {createLogger, format, transports } = require('winston');

const morgan = require('morgan');
const stripFinalNewLine = require('strip-final-newline');

const logger = createLogger({
  format: format.simple(),
  transports: [new transports.Console()],
});

morgan.token('id', (req) => req.id);

const requestFormat = ':remote-addr [:date[iso]] :id ":method :url" :status';

const requests = morgan(requestFormat, {
  stream: {
    write: (message) => {
      // Remove all line breaks
      const log = stripFinalNewLine(message);
      return logger.info(log);
    },
  },
});

logger.requests = requests;

logger.header = (req) => {
  const date = new Date().toISOString();
  return `${req.ip} [${date}] ${req.id} "${req.method} ${req.originalUrl}"`;
};

module.exports = logger;
