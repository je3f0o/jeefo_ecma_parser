/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_specs.js
* Created at  : 2019-02-04
* Updated at  : 2019-02-25
* Author      : jeefo
* Purpose     : Easier to develop. Please make me happy :)
* Description : Describe what is Identifier and unit test every single case.
*             : Make sure it is working correctly.
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const expect = require("expect.js"),
      parser = require("../../../src/es5_parser.js");

describe("Identifier >", () => {
    const reserved_words = parser.symbol_table.get_reserved_words();

    const expression_reserved_words = [
        "null",
        "true",
        "false",
        "undefined",
    ];

    expression_reserved_words.forEach(reserved_word => {
        describe(`Test against reserved word '${ reserved_word }'`, () => {
            it("should not be Identifier", () => {
                parser.tokenizer.init(reserved_word);
                parser.prepare_next_state("expression");

                expect(parser.next_symbol_definition).not.to.be(null);
                expect(parser.next_symbol_definition.id).not.to.be("Identifier");
            });
        });
    });

    const statement_reserved_words = [
        "if",
        "do",
        "while",
        "function",
    ];

    statement_reserved_words.forEach(reserved_word => {
        describe(`Test against reserved word '${ reserved_word }'`, () => {
            it("should not be Identifier", () => {
                parser.tokenizer.init(reserved_word);
                parser.prepare_next_state();

                expect(reserved_words.includes(reserved_word)).to.be(true);
                expect(parser.next_symbol_definition).not.to.be(null);

                expect(parser.next_symbol_definition.id).not.to.be("Identifier");
                expect(parser.next_symbol_definition.id).not.to.be("Expression statement");
            });
        });
    });

    const other_reserved_words = [
        "in",
        "else",
        "catch",
        "finally",
        "instanceof",
    ];

    other_reserved_words.forEach(reserved_word => {
        describe(`Test against reserved word '${ reserved_word }'`, () => {
            it("should not be Identifier", () => {
                parser.tokenizer.init(reserved_word);
                parser.prepare_next_state();

                expect(reserved_words.includes(reserved_word)).to.be(true);
                expect(parser.next_symbol_definition).to.be(null);
            });
        });
    });

    const source = "identifier";
    describe(`Test against source text '${ source }'`, () => {
        parser.tokenizer.init(source);
        parser.prepare_next_state("expression");

        const streamer = parser.tokenizer.streamer;
        let symbol;
        try {
            symbol = parser.next_symbol_definition.generate_new_symbol(parser);
        } catch (e) {}

        it(`cursor index should be move ${ source.length } characters to right`, () => {
            expect(streamer.get_current_character()).to.be('r');
            expect(streamer.cursor.index).to.be(source.length - 1);
        });

        it(`should be in correct range`, () => {
            expect(streamer.substring_from_token(symbol)).to.be(source);
        });

        it("should be Identifier", () => {
            expect(symbol.id).to.be("Identifier");
            expect(symbol.token.value).to.be(source);
        });

        it("should be Primitive", () => {
            expect(symbol.type).to.be("Primitive");
            expect(symbol.precedence).to.be(31);
        });
    });
});
