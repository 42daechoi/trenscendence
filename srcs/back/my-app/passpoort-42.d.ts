declare module 'passport-42' {

    // Load modules.
var Strategy = require('./strategy');

// Expose Strategy.
exports = module.exports = Strategy;

// Exports.
exports.Strategy = Strategy;

}
