/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : continue_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.7
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement } = require("../enums/states_enum");
const { STATEMENT } = require("../enums/precedence_enum");

module.exports = {
	id         : "Continue statement",
	type       : "Statement",
	precedence : STATEMENT,

	is         : (_, { current_state : s }) => s === statement,
    initialize : require("./break_statement").initialize
};
