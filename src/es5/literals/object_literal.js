/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal.js
* Created at  : 2019-03-23
* Updated at  : 2019-08-29
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.1.5
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { PRIMITIVE }           = require("../enums/precedence_enum");
const { is_expression }       = require("../helpers");
const { terminal_definition } = require("../../common");
const {
    is_close_curly,
    is_delimiter_token,
    get_last_non_comment_node,
    parse_asignment_expression,
} = require("../../helpers");

function parse_properties (parser, properties, delimiters) {
    while (! is_close_curly(parser)) {
        const property = parse_asignment_expression(parser);
        if (! property) {
            parser.throw_unexpected_token();
        }
        properties.push(property);

        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        }

        if (is_delimiter_token(parser.next_token, ',')) {
            delimiters.push(
                terminal_definition.generate_new_node(parser)
            );

            parser.prepare_next_state("property_list", true);
        }
    }
}

module.exports = {
    id         : "Object literal",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is : (token, parser) => {
        if (is_expression(parser) && is_delimiter_token(token, '{')) {
            return get_last_non_comment_node(parser) === null;
        }
    },
    initialize : (node, token, parser) => {
        const delimiters        = [];
        const properties        = [];
        const { current_state } = parser;

        const open = terminal_definition.generate_new_node(parser);
        parser.prepare_next_state("delimiter", true);
        if (! is_close_curly(parser)) {
            parser.change_state("property_list");
            parse_properties(parser, properties, delimiters);
        }
        const close = terminal_definition.generate_new_node(parser);

        node.open_curly_bracket  = open;
        node.properties          = properties;
        node.delimiters          = delimiters;
        node.close_curly_bracket = close;
        node.start               = open.start;
        node.end                 = close.end;

        parser.ending_index  = node.end.index;
        parser.current_state = current_state;
    }
};
