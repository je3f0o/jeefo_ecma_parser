/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : keyword_definition.js
* Created at  : 2019-03-24
* Updated at  : 2019-03-24
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
    id         : "Keyword",
    type       : "Keyword",
    precedence : -1,

    is         : () => {},
    initialize : operator_definition.initialize
});
