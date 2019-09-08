/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : template_literal.js
* Created at  : 2019-05-27
* Updated at  : 2019-09-08
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition }            = require("@jeefo/parser");
const { is_close_curly }                 = require("../../helpers");
const { PRIMITIVE, TERMINATION }         = require("../enums/precedence_enum");
const { expression, primary_expression } = require("../enums/states_enum");

const template_string = new AST_Node_Definition({
	id         : "Template literal string",
    type       : "Primitive",
	precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const { streamer } = parser.tokenizer;
        const start        = streamer.clone_cursor_position();
        let length         = 0;
		let next_character = streamer.get_current_character();

        LOOP:
        while (true) {
            switch (next_character) {
                case '\\':
                    length += 1;
                    break;
                case '$':
                    if (streamer.at(start.index + length + 1) === '{') {
                        break LOOP;
                    }
                    break;
                case '`' : break LOOP;
                case null: parser.throw_unexpected_end_of_stream();
            }

            length += 1;
            next_character = streamer.at(start.index + length);
        }
        streamer.cursor.move(length - 1);

        node.value = streamer.substring_from_offset(start.index);
        node.start = start;
        node.end   = streamer.clone_cursor_position();
    }
});

const template_expression = new AST_Node_Definition({
	id         : "Template literal expression",
    type       : "Primitive",
	precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const { streamer } = parser.tokenizer;
        const start        = streamer.clone_cursor_position();

		streamer.cursor.move(1);
        parser.prepare_next_state("expression", true);

        const expression = parser.parse_next_node(TERMINATION);
        parser.expect('}', is_close_curly);

        node.expression = expression;
        node.start      = start;
        node.end        = streamer.clone_cursor_position();
    }
});

module.exports = {
    id         : "Template literal",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is : (token, { current_state }) => {
        return current_state === expression && token.id === "Backtick";
    },
    initialize : (node, current_token, parser) => {
        const body            = [];
        const { streamer }    = parser.tokenizer;
        const start_positioin = streamer.clone_cursor_position();
		let next_character = streamer.next();

        LOOP:
        while (true) {
            switch (next_character) {
                case '`' : break LOOP;
                case null: parser.throw_unexpected_end_of_stream();
            }

            if (next_character === '$' && streamer.is_next_character('{')) {
                body.push(template_expression.generate_new_node(parser));
            } else {
                body.push(template_string.generate_new_node(parser));
            }
            next_character = streamer.next();
        }

        node.body  = body;
        node.start = start_positioin;
        node.end   = streamer.clone_cursor_position();

        // It's important, since there is no real next token
        parser.next_token    = node;
        parser.current_state = primary_expression;
    }
};
