# mongodb-dirtycache-top
MongoDB tool to list collections with dirtiest WiredTiger cache.

Similar to [mongotop] (https://docs.mongodb.com/manual/reference/program/mongotop), this tool shows which database collections have the highest value in bytes of the WiredTiger dirty cache.

## Installation

Clone this repository and run the following command inside the project root folder to install all the needed project dependencies:

    $ npm install

## Usage

The usage documentation can be found running the tool with the help flag:

    $ node index.js --help

## License

MIT