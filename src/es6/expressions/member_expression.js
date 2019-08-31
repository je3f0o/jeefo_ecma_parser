/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_expression.js
* Created at  : 2019-08-22
* Updated at  : 2019-08-23
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

const { MEMBER_EXPRESSION } = require("../enums/precedence_enum");
const {
    identifier_name,
    terminal_definition,
} = require("../../common");
const {
    is_expression,
    prepare_next_expression
} = require("../../es5/helpers");
const {
    is_identifier_name,
    get_last_non_comment_node,
} = require("../../helpers");

const is_member = (token, parser) => {
    if (is_expression(parser)) {
        return token.id === "Operator" && token.value === '.';
    }
};

module.exports = {
    id         : "Member expression",
	type       : "Expression",
	precedence : MEMBER_EXPRESSION,

    is : (token, parser) => {
        if (is_member(token, parser)) {
            return get_last_non_comment_node(parser) !== null;
        }
    },
	initialize : (node, token, parser) => {
        const object   = parser.prev_node;
        const operator = terminal_definition.generate_new_node(parser);

        prepare_next_expression(parser, true);
        parser.expect("IdentifierName", is_identifier_name);
        const property = identifier_name.generate_new_node(parser);

        node.object   = object;
        node.operator = operator;
        node.property = property;
        node.start    = object.start;
        node.end      = property.end;

        parser.next_token = token;
    },
};
