/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiter_definition.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-19
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const SymbolDefinition    = require("@jeefo/parser/src/symbol_definition"),
      operator_definition = require("./operator_definition");

module.exports = new SymbolDefinition({
    id         : "Delimiter",
    type       : "Delimiter",
    precedence : -1,

    is         : () => {},
    initialize : operator_definition.initialize,
});
