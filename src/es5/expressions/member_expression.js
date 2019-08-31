/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { is_expression }     = require("../helpers");
const { MEMBER_EXPRESSION } = require("../enums/precedence_enum");
const {
    is_identifier_name,
    is_reference_operator,
} = require("../../helpers");
const {
    identifier_name,
    terminal_definition,
} = require("../../common");

module.exports = {
    id         : "Member expression",
	type       : "Expression",
	precedence : MEMBER_EXPRESSION,

    is : (token, parser) => {
        return is_expression(parser) && is_reference_operator(token);
    },
	initialize : (node, current_token, parser) => {
        const object   = parser.prev_node;
        const operator = terminal_definition.generate_new_node(parser);

        const { current_state } = parser;
        parser.prepare_next_state("expression", true);
        parser.expect("IdentifierName", is_identifier_name);
        const property = identifier_name.generate_new_node(parser);

        node.object   = object;
        node.operator = operator;
        node.property = property;
        node.start    = object.start;
        node.end      = property.end;

        parser.ending_index  = node.end.index;
        parser.current_state = current_state;
    },
};
