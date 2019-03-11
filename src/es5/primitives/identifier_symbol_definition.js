/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_symbol_definition.js
* Created at  : 2019-02-02
* Updated at  : 2019-02-02
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const SymbolDefinition = require("../../symbol_definition");

module.exports = new SymbolDefinition({
    id         : "Identifier",
    type       : "Primitive",
    precedence : 31,

    is         : is_primitive,
    initialize : primitive_initiliazer
});
