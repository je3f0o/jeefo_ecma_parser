/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression.js
* Created at  : 2019-09-08
* Updated at  : 2020-09-01
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

const {COMMA} = require("../enums/precedence_enum");
const {
    expression,
    expression_expression,
} = require("../enums/states_enum");
const {
    is_comma,
    is_terminator,
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

const init = (node, list, delimiters) => {
    node.list       = list;
    node.delimiters = delimiters;
    node.start      = list[0].start;
    node.end        = list[list.length - 1].end;
};

const parse_expressions = (list, delimiters, parser) => {
    parser.change_state("assignment_expression");
    while (! parser.is_terminated) {
        const expr = parser.generate_next_node();
        list.push(expr);

        if (! parser.is_terminated && is_comma(parser)) {
            parser.change_state("punctuator");
            delimiters.push(parser.generate_next_node());
            parser.prepare_next_state("assignment_expression", true);
        } else break;
    }
};

module.exports = {
    id         : "Expression",
    type       : "Expression",
    precedence : COMMA,

    is (token, parser) {
        switch (parser.current_state) {
            case expression :
                if (! is_delimiter_token(token, ',')) return;
                const last = get_last_non_comment_node(parser);
                return last && last.precedence >= COMMA;
            case expression_expression: return true;
        }
    },

    initialize (node, token, parser) {
        const left = get_last_non_comment_node(parser, true);

        parser.expect(',', is_comma);
        parser.change_state("punctuator");
        const delimiter = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        const right = parser.generate_next_node();

        node.left      = left;
        node.delimiter = delimiter;
        node.right     = right;
        node.start     = left.start;
        node.end       = right.end;

        parser.end(node);
        parser.current_state = expression;
    },

    refine (node, expr, parser) {
        // TODO: rework
        debugger
        let list, delimiters;
        switch (expr.id) {
            case "Cover parenthesized expression and arrow parameter list" :
                ({
                    expression : {
                        list, delimiters
                    }
                } = expr);
                break;
            case "For header":
                list       = [];
                delimiters = [];
                list.push(parser.refine("assignment_expression", expr));
                if (is_comma(parser)) {
                    parser.change_state("punctuator");
                    delimiters.push(parser.generate_next_node());
                    parser.prepare_next_state("assignment_expression", true);
                    parse_expressions(list, delimiters, parser);
                } else if (! is_terminator(parser)) {
                    console.log(expr);
                    debugger
                }
                break;
            case "Assignment expression":
                debugger
                parser.set_prev_state(expr);
                parser.change_state("assignment_expression");
                list.push(parser.generate_next_node("assignment_expression", expr));
                break;
            default:
                debugger
                parser.throw_unexpected_refine(node, expr);
        }
        init(node, list, delimiters);
    }
};
