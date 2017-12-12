# JSON Schema Validator

This repository contains a prototype (at this point) of a validator using [JSON Schema](http://json-schema.org/) 
draft-07 for the Unified Submission Interface (USI) project.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
To be able to run this project you'll need to have [Node.js](https://nodejs.org/en/about/) and [npm](https://www.npmjs.com/) installed in your machine.
npm is distributed with Node.js which means that when you download Node.js, you automatically get npm installed on your computer.

### Installing

#### Node.js / npm
- Get Node.js: https://nodejs.org/en/

- If you use [Homebrew](https://brew.sh/) you can install node by doing:
```
brew install node
```

After installation check that everything is correctly installed and which versions you are running:
```
node -v
npm -v
```

#### Project
Clone project and install dependencies:
```
git clone https://github.com/EMBL-EBI-SUBS/json-schema-validator.git
cd json-schema-validator
npm install
```

### Executing
At this date (29/11/2017) the project has a very basic structure, to run it all you need to do is run the following command from within the project directory:
```
node server.js
```

### Development
For developement purposes using [nodemon](https://nodemon.io/) is useful. It reloads the application everytime something changes on save time.

## License
 For more details about licensing see the [LICENSE](LICENSE.md).