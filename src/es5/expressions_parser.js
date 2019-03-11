/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expressions_parser.js
* Created at  : 2019-01-30
* Updated at  : 2019-02-01
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const assign                   = require("jeefo_utils/object/assign"),
      expressions_symbol_table = require("./expressions_symbol_table");

const print_error_token = parser => {
    let line = parser.tokenizer.streamer.string.
        split('\n')[parser.next_token.start.line - 1].
        replace(/\t/g, ' '.repeat(parser.tokenizer.tab_size));

    const spaces   = ' '.repeat(parser.next_token.start.virtual_column - 1);
    const pointers = '^'.repeat(parser.next_token.end.virtual_column - parser.next_token.start.virtual_column);
    line += `\n${ spaces }${ pointers }`;
    console.log(parser);
    //console.log(this.tokenizer.streamer.string.split('\n'));
    console.log(line);
};

class ExpressionsParser {
    constructor () {
        this.tokenizer         = null;
        this.symbol_table      = expressions_symbol_table;
        this.statements_parser = null;
    }

    prepare_next_symbol_definition () {
        this.next_token = this.tokenizer.get_next_token();

        if (this.next_token) {
            this.next_symbol_definition = this.statements_parser.
                symbol_table.get_symbol_definition(this.next_token, this.statements_parser);
            if (this.next_symbol_definition === null || this.next_symbol_definition.id === "Expression statement") {
                this.next_symbol_definition = this.symbol_table.get_symbol_definition(this.next_token, this);
            }
        } else {
            this.next_symbol_definition = null;
        }
    }

    get_next_symbol (left_precedence) {
        if (typeof left_precedence !== "number") {
            throw new Error("Invalid left precedence");
        }
        if (this.next_symbol_definition === null) {
            print_error_token(this);
            throw new SyntaxError("Undefined symbol");
        }

        LOOP:
        while (true) {
            // Left comments
            while (this.next_symbol_definition.id === "Comment") {
                this.current_symbol = this.next_symbol_definition.generate_new_symbol(this.next_token, this);
                this.prepare_next_symbol_definition();

                if (this.next_token === null) {
                    break LOOP;
                }
            }

            if (this.next_symbol_definition.precedence <= left_precedence) {
                break;
            }

            const current_token = this.next_token;
            this.current_symbol = this.next_symbol_definition.generate_new_symbol(this.next_token, this);

            // Store current state
            const cursor = this.tokenizer.streamer.get_cursor();
            if (current_token === this.next_token) {
                this.prepare_next_symbol_definition();
                if (this.next_token === null) {
                    break;
                }
            }

            // Right comments
            const current_symbol = this.current_symbol;
            while (this.next_symbol_definition.id === "Comment") {
                this.current_symbol = this.next_symbol_definition.generate_new_symbol(this.next_token, this);
                this.prepare_next_symbol_definition();

                if (this.next_token === null) {
                    this.current_symbol = current_symbol;
                    assign(this.tokenizer.streamer.cursor, cursor);
                    break LOOP;
                }
            }

            if (this.next_symbol_definition.precedence <= left_precedence) {
                this.current_symbol = current_symbol;
                assign(this.tokenizer.streamer.cursor, cursor);
                break;
            }

            // ASI
            if (this.next_symbol_definition.type === "Primitive" &&
                this.next_token.start.line > current_symbol.end.line) {
                this.current_symbol = current_symbol;
                assign(this.tokenizer.streamer.cursor, cursor);
                break;
            }
        }

        return this.current_symbol;
    }
}

module.exports = new ExpressionsParser();
