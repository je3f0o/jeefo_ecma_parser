/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_property_name.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-21
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-object-initializer
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition } = require("@jeefo/parser");
const {
    is_open_square_bracket,
    is_close_square_bracket,
    parse_asignment_expression,
} = require("../../helpers");

module.exports = new AST_Node_Definition({
    id         : "Computed property name",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        if (! is_open_square_bracket(parser)) {
            parser.throw_unexpected_token();
        }
        parser.change_state("delimiter");
        const open_square_bracket = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        if (is_close_square_bracket(parser)) {
            parser.throw_unexpected_token();
        }
        const expression = parse_asignment_expression(parser);

        parser.expect(']', is_close_square_bracket);
        const close_square_bracket = parser.generate_next_node();

        node.open_square_bracket  = open_square_bracket;
        node.expression           = expression;
        node.close_square_bracket = close_square_bracket;
        node.start                = open_square_bracket.start;
        node.end                  = close_square_bracket.end;
    }
});
