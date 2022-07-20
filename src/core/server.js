const express = require("express");
const bodyParser = require("body-parser");
const {logger, getLogger} = require("../utils/winston");
const AppError = require("../model/application-error");
const BioValidator = require("./biovalidator-core")
const npid = require("npid");

class BioValidatorServer {
  constructor(port, localSchemaPath) {
    this.biovalidator = new BioValidator(localSchemaPath)
    this.port = port || process.env.BIOVALIDATOR_PORT || 3020;
    this.baseUrl = process.env.BIOVALIDATOR_BASE_URL || '/';
    this.logPath = process.env.BIOVALIDATOR_LOG_DIR || 'logs';
    this.pidPath = process.env.BIOVALIDATOR_PID_PATH || './server.pid';
  }

  withBaseUrl(baseUrl) {
    this.baseUrl = baseUrl || this.baseUrl;
    return this;
  }

  // withLogDir(logDir) {
  //   this.logPath = logDir || this.logPath;
  //   return this;
  // }

  withPid(pidPath) {
    this.pidPath = pidPath || this.pidPath;
    return this;
  }

  start() {
    this._configureServer()
        ._configureEndpoints()
        ._startServer()
        ._registerHooks();
  }

  _configureServer() {
    // this.logger = getLogger(this.logPath);
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
      let startTime = new Date().getTime();
      let inputSchema = req.body.schema;
      let inputObject = req.body.data;

      if (inputSchema && inputObject) {
        this.biovalidator.validate(inputSchema, inputObject).then((output) => {
          res.status(200).send(output);
          logger.info("New validation request, processed successfully in " + (new Date().getTime() - startTime) + "ms.");
        }).catch((error) => {
          res.status(500).send(error);
          logger.error("New validation request, server failed to process data: " + error);
        });
      } else {
        let appError = new AppError("Malformed data. Please provide both 'schema' and 'data' in request body.");
        res.status(400).send(appError);
        logger.info("New validation request, " + appError.error);
      }
    });

    this.router.get("/validate", (req, res) => {
      res.send({
        message: "ELIXIR biovalidator: Please use POST method to validate data against schema. See  Example POST " +
            "message structure 'example_post_body'. For more information and examples on how to use the validator " +
            "see https://github.com/elixir-europe/biovalidator",
        example_post_body: {
          schema: {},
          data: {}
        }
      });
    });

    return this;
  }

  _startServer() {
    this.app.listen(this.port, () => {
      logger.info(`---------------------------------------------`);
      logger.info(`------------ ELIXIR biovalidator ------------`);
      logger.info(`---------------------------------------------`);
      logger.info(`Started server on port ${this.port} with base URL ${this.baseUrl}`);
      logger.info(`PID file is available at ${this.pidPath}`);
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





