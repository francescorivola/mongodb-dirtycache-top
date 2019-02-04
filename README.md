# mongodb-dirtycache-top

[![Greenkeeper badge](https://badges.greenkeeper.io/francescorivola/mongodb-dirtycache-top.svg)](https://greenkeeper.io/)

[ ![CodeFactor](https://www.codefactor.io/repository/github/francescorivola/mongodb-dirtycache-top/badge)](https://www.codefactor.io/repository/github/francescorivola/mongodb-dirtycache-top)

MongoDB tool to list collections with dirtiest WiredTiger cache.

Similar to [mongotop](https://docs.mongodb.com/manual/reference/program/mongotop), this tool shows which database collections have the highest value in bytes of the WiredTiger dirty cache.

## Installation

Clone this repository and run the following command inside the project root folder:

    $ npm install

## Usage

The usage documentation can be found running the tool with the help flag:

    $ node index.js --help

Output:

```
Usage: index [options]

MongoDB tool to list collections with dirtiest WiredTiger cache.

Options:
  -V, --version              output the version number
  -h, --host [value]         Set host (required)
  -u, --username [value]     Set username (required)
  -p, --password [value]     Set password (required)
  -d, --database [value]     Set database (required)
  -c, --collections [value]  Set collections name separated by comma. If not specified will inspect all database collections
  -i, --interval <n>         Set refresh interval in milliseconds (default: 1000)
  -h, --help                 output usage information
```

## License

MIT
