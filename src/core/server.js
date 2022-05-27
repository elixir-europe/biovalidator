const express = require("express");
const bodyParser = require("body-parser");
const logger = require("../utils/winston");
const AppError = require("../model/application-error");
const BioValidator = require("./biovalidator-core")
const npid = require("npid");

class BioValidatorServer {
  constructor(port, localSchemaPath) {
    this.biovalidator = new BioValidator(localSchemaPath)
    this.port = port || process.env.BIOVALIDATOR_PORT || 3020;
    this.baseUrl = process.env.BIOVALIDATOR_BASE_URL || '/';
    this.logPath = process.env.BIOVALIDATOR_LOG_DIR || './';
    this.pidPath = process.env.BIOVALIDATOR_PID_PATH || './server.pid';
  }

  withBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    return this;
  }

  withLogDir(logDir) {
    this.logPath = logDir;
    return this;
  }

  withPid(pidPath) {
    this.pidPath = pidPath;
    return this;
  }

  start() {
    this._configureServer()
        ._configureEndpoints()
        ._startServer()
        ._registerHooks();
  }

  _configureServer() {
    this.app = express();
    this.router = express.Router();
    this.router.use(express.static('src/views'));

    this.app.use(bodyParser.json());

    this.app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    this.app.use(function (err, req, res, next) {
      if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        let appError = new AppError("Received malformed JSON.");
        logger.log("info", appError.error);
        res.status(400).send(appError);
      } else {
        let appError = new AppError(err.message);
        logger.log("error", appError.error);
        res.status(err.status).send(appError);
      }
    });

    this.app.use(this.baseUrl, this.router);

    return this;
  }

  _configureEndpoints() {
    this.router.post("/validate", (req, res) => {
      let inputSchema = req.body.schema;
      let inputObject = req.body.object;

      if (inputSchema && inputObject) {
        this.biovalidator.runValidation(inputSchema, inputObject).then((output) => {
          res.status(200).send(output);
        }).catch((error) => {
          logger.error(error);
          res.status(500).send(error);
        });
      } else {
        let appError = new AppError("Invalid data. Please provide both 'schema' and 'object' in data.");
        logger.info(appError.error);
        res.status(400).send(appError);
      }
    });

    this.router.get("/validate", (req, res) => {
      res.send({
        message: "ELIXIR biovalidator: Please use POST method to validate data against schema. See  Example POST " +
            "message structure 'example_post_body'. For more information and examples on how to use the validator " +
            "see https://github.com/elixir-europe/biovalidator",
        example_post_body: {
          schema: {},
          object: {}
        }
      });
    });

    return this;
  }

  _startServer() {
    this.app.listen(this.port, () => {
      logger.info(`-- Started server on port ${this.port} --`);
      logger.info(`Writing logs to: ${this.logPath}`);
    });

    return this;
  }

  _registerHooks() {
    try {
      npid.create(this.pidPath).removeOnExit();
    } catch(err) {
      logger.log("Failed to create PID file. ", err);
      process.exit(1);
    }

    // Handles crt + c event
    process.on("SIGINT", () => {
      npid.remove(this.pidPath);
      process.exit();
    });

    // Handles kill -USR1 pid event
    process.on("SIGUSR1", () => {
      npid.remove(this.pidPath);
      process.exit();
    });
  }
}

module.exports = BioValidatorServer;





