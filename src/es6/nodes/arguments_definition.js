/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arguments_definition.js
* Created at  : 2019-08-27
* Updated at  : 2019-08-27
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

const { AST_Node_Definition } = require("@jeefo/parser");
const { spread_element }      = require("./spread_element");
const {
    is_close_parenthesis,
    parse_asignment_expression,
} = require("../../helpers");
const { terminal_definition : terminal } = require("../../common");

const parse_arguments = (list, delimiters, parser) => {
    while (! is_close_parenthesis(parser)) {
        if (parser.next_token.id === "Rest") {
            list.push(spread_element.generate_new_node(parser));
        } else {
            const expression = parse_asignment_expression(parser);
            if (! expression) {
                parser.throw_unexpected_token();
            }
            list.push(expression);
        }

        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        } else if (parser.next_token.id !== "Delimiter") {
            parser.throw_unexpected_token();
        }

        switch (parser.next_token.value) {
            case ',' :
                delimiters.push(terminal.generate_new_node(parser));
                parser.prepare_next_state("expression", true);
                break;
            case ')' : return;
            default :
                parser.throw_unexpected_token();
        }
    }
};

module.exports = new AST_Node_Definition({
    id         : "Arguments",
	type       : "Expression",
	precedence : -1,

    is         : () => {},
	initialize : (node, token, parser) => {
        const list       = [];
        const delimiters = [];

        const open = terminal.generate_new_node(parser);
        parser.prepare_next_state("expression", true);
        if (! is_close_parenthesis(parser)) {
            parse_arguments(list, delimiters, parser);
        }
        const close = terminal.generate_new_node(parser);

        node.open_parenthesis  = open;
        node.list              = list;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;
    },
});
