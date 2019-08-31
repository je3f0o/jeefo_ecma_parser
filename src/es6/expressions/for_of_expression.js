/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_of_expression.js
* Created at  : 2019-08-29
* Updated at  : 2019-08-29
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

const { EXPRESSION }        = require("../enums/precedence_enum");
const for_in_expression     = require("./for_in_expression");
const { for_of_expression } = require("../enums/states_enum");

module.exports = {
    id         : "For of expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === for_of_expression,
    initialize : for_in_expression.initialize
};
