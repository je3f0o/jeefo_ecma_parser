/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : continue_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-31
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum = require("../enums/states_enum");

module.exports = {
	id         : "Continue statement",
	type       : "Statement",
	precedence : 31,

	is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : require("./break_statement").initialize
};
