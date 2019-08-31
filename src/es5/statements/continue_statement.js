/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : continue_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-04-02
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.7
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum     = require("../enums/states_enum"),
      precedence_enum = require("../enums/precedence_enum");

module.exports = {
	id         : "Continue statement",
	type       : "Statement",
	precedence : precedence_enum.STATEMENT,

	is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : require("./break_statement").initialize
};
