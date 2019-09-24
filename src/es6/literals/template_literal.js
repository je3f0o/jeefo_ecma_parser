/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : template_literal.js
* Created at  : 2019-05-27
* Updated at  : 2019-09-25
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
        const start        = (
            parser.template_start ||
            streamer.clone_cursor_position()
        );
        delete parser.template_start;

        let length         = 0;
        let current_index  = start.index;
        let virtual_length = 0;
        let next_character = streamer.get_current_character();
        let end;

        LOOP:
        while (true) {
            switch (next_character) {
                case '\t' :
                    virtual_length += streamer.tab_size - 1;
                    break;
                case '\n' :
                    streamer.cursor.move(length);
                    if (start.index === streamer.cursor.position.index) {
                        streamer.cursor.position.line -= 1;
                    }
                    next_character = streamer.get_next_character();
                    if (next_character === '`') {
                        end = streamer.clone_cursor_position();
                        break LOOP;
                    }
                    next_character = streamer.next();
                    current_index  = streamer.cursor.position.index;
                    length = virtual_length = 0;
                    continue LOOP;
                case '\\':
                    length         += 1;
                    virtual_length += 1;
                    break;
                case null: parser.throw_unexpected_end_of_stream();
            }

            next_character = streamer.at(current_index + length + 1);
            switch (next_character) {
                case '$':
                    if (streamer.at(current_index + length + 2) === '{') {
                        break LOOP;
                    }
                    break;
                case '`':
                    break LOOP;
            }
            length         += 1;
            virtual_length += 1;
        }
        if (! end) {
            streamer.cursor.move(length, virtual_length);
        }

        node.value = streamer.substring_from_offset(start.index);
        node.start = start;
        node.end   = end || streamer.clone_cursor_position();
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
        const body           = [];
        const { streamer }   = parser.tokenizer;
        const start_position = streamer.clone_cursor_position();
		let next_character = streamer.get_next_character();
        if (next_character !== '\n') {
            streamer.cursor.move(1);
        }

        LOOP:
        while (true) {
            switch (next_character) {
                case '\n':
                    streamer.cursor.move(1);
                    parser.template_start = streamer.clone_cursor_position();
                    streamer.cursor.move(-1);
                    streamer.next();
                    break;
                case '`' : break LOOP;
                case null:
                    parser.throw_unexpected_end_of_stream();
                    break;
            }

            if (next_character === '$' && streamer.is_next_character('{')) {
                body.push(template_expression.generate_new_node(parser));
            } else {
                body.push(template_string.generate_new_node(parser));
            }
            next_character = streamer.next();
        }

        node.body  = body;
        node.start = start_position;
        node.end   = streamer.clone_cursor_position();

        // It's important, since there is no real next token
        parser.next_token    = node;
        parser.current_state = primary_expression;
    }
};
