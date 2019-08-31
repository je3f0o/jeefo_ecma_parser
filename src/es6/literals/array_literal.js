/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_literal.js
* Created at  : 2019-08-24
* Updated at  : 2019-08-28
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

const { PRIMITIVE }           = require("../enums/precedence_enum");
const { is_expression }       = require("../../es5/helpers");
const { spread_element }      = require("../nodes");
const { terminal_definition } = require("../../common");
const {
    is_comma,
    is_delimiter_token,
    is_close_square_bracket,
    get_last_non_comment_node,
    parse_asignment_expression,
} = require("../../helpers");

module.exports = {
    id         : "Array literal",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is : (token, parser) => {
        if (is_expression(parser) && is_delimiter_token(token, '[')) {
            return get_last_non_comment_node(parser) === null;
        }
    },
    initialize : (node, token, parser) => {
        const open         = terminal_definition.generate_new_node(parser);
        const delimiters   = [];
        const prev_state   = parser.current_state;
        const element_list = [];

        parser.prepare_next_state("expression", true);
        while (! is_close_square_bracket(parser)) {
            if (parser.next_token.id === "Rest") {
                element_list.push(spread_element.generate_new_node(parser));
                if (! is_close_square_bracket(parser)) {
                    parser.throw_unexpected_token(
                        "Rest element must be last element"
                    );
                }
                break;
            } else if (is_comma(parser)) {
                delimiters.push(
                    terminal_definition.generate_new_node(parser)
                );
                parser.prepare_next_state("expression", true);
            } else {
                element_list.push(parse_asignment_expression(parser));
            }
        }
        const close = terminal_definition.generate_new_node(parser);

        node.open_square_bracket  = open;
        node.element_list         = element_list;
        node.delimiters           = delimiters;
        node.close_square_bracket = close;
        node.start                = open.start;
        node.end                  = close.end;

        const next_token = parser.look_ahead();
        const has_cover = (
            next_token &&
            next_token.id    === "Operator" &&
            next_token.value === '='
        );

        if (has_cover) {
            parser.prev_node  = node;
            parser.prev_state = prev_state;
            parser.change_state("binding_pattern");
        } else {
            parser.ending_index  = node.end.index;
            parser.current_state = prev_state;
        }
    }
};
