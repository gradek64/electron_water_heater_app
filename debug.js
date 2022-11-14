const debugging = !!process.env.DEBUG;
const chalk = require('chalk');

const debug = (text, color = 'blue') =>
  debugging ? console.log(chalk[color](text)) : null;
module.exports = { debug };
