'use strict';

module.exports = {
  plugins: [
    "plugins/markdown",
  ],
  source: {
    include: "src/js",
  },
  opts: {
    destination: "docs",
    encoding: "utf-8",
    recurse: true,
    readme: "README.md",
  }

};
