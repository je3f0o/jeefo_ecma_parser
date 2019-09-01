/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration.js
* Created at  : 2019-09-01
* Updated at  : 2019-09-01
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { DECLARATION }          = require("../enums/precedence_enum");
const lexical_binding          = require("./lexical_binding");
const { variable_declaration } = require("../enums/states_enum");

module.exports = {
    id         : "Variable declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : (_, parser) => parser.current_state === variable_declaration,
    initialize : lexical_binding.initialize
};
