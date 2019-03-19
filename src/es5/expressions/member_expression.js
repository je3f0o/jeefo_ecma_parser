/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-19
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const operator_definition     = require("../common/operator_definition"),
      is_expression           = require("../helpers/is_expression"),
      prepare_next_expression = require("../helpers/prepare_next_expression");

module.exports = {
    id         : "Member expression",
	type       : "Expression",
	precedence : 19,

    is : (current_token, parser) =>
        is_expression(parser) && current_token.value === '.',

	initialize : (symbol, current_token, parser) => {
        const object   = parser.current_symbol;
        const operator = operator_definition.generate_new_symbol(parser);

        prepare_next_expression(parser, true);
        parser.expect("identifier", parser => parser.next_symbol_definition.id === "Identifier");
        const property = parser.get_next_symbol(symbol.precedence);

        symbol.object   = object;
        symbol.operator = operator;
        symbol.property = property;
        symbol.start    = object.start;
        symbol.end      = property.end;
    },
};
