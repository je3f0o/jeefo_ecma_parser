/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_name.js
* Created at  : 2019-08-19
* Updated at  : 2019-08-29
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
const { PROPERTY_NAME }       = require("../enums/precedence_enum");
const {
    property_name,
    property_assign,
    method_definition,
} = require("../enums/states_enum");
const {
    identifier_name,
    terminal_definition,
} = require("../../common");
const {
    is_delimiter_token,
    is_open_square_bracket,
    is_close_square_bracket,
    parse_asignment_expression,
} = require("../../helpers");

const literal_property_names = ["Number", "String"];

const computed_property_name = new AST_Node_Definition({
    id         : "Computed property name",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        if (! is_open_square_bracket(parser)) {
            parser.throw_unexpected_token();
        }
        parser.change_state("delimiter");

        const open = terminal_definition.generate_new_node(parser);
        parser.prepare_next_state("expression", true);
        const expression = parse_asignment_expression(parser);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        parser.expect(']', is_close_square_bracket);
        const close = terminal_definition.generate_new_node(parser);

        node.open_square_bracket  = open;
        node.expression           = expression;
        node.close_square_bracket = close;
        node.start                = open.start;
        node.end                  = close.end;

        parser.ending_index = node.end.index;
    }
});

module.exports = {
    id         : "Property name",
    type       : "Expression",
    precedence : PROPERTY_NAME,

    is         : (_, parser) => parser.current_state === property_name,
    initialize : (node, token, parser) => {
        let name;

        if (token.id === "Identifier") {
            name = identifier_name.generate_new_node(parser);
        } else if (literal_property_names.includes(token.id)) {
            parser.change_state("expression");
            name = parser.generate_next_node();
        } else {
            name = computed_property_name.generate_new_node(parser);
        }

        node.name  = name;
        node.start = name.start;
        node.end   = name.end;

        const next_token = parser.look_ahead(true);
        if (is_delimiter_token(next_token, ':')) {
            parser.current_state = property_assign;
        } else {
            parser.current_state = method_definition;
        }
    }
};
