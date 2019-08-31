/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_statement.js
* Created at  : 2019-03-18
* Updated at  : 2019-08-26
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { STATEMENT }       = require("../enums/precedence_enum");
const { var_statement }   = require("../enums/states_enum");
const lexical_declaration = require("../declarations/lexical_declaration");

module.exports = {
    id         : "Variable statement",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (token, parser) => parser.current_state === var_statement,
    initialize : lexical_declaration.initialize
};
