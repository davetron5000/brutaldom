'use strict';

module.exports = {
  plugins: [
    "plugins/markdown",
  ],
  source: {
    include: "src/js",
  },
  markdown: {
    hardwrap: false, // This is important, otherwise some features might not work.
    idInHeadings: true // This is important, otherwise some features might not work.
  },
  opts: {
    destination: "docs",
    encoding: "utf-8",
    recurse: true,
    readme: "README.md",
    template: "node_modules/better-docs",
  },
  templates: {
    "cleverLinks": true,
    "search": true,
    "better-docs": {
    },
  },
};
