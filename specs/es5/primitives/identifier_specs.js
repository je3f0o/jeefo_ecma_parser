/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_specs.js
* Created at  : 2019-02-04
* Updated at  : 2019-08-05
* Author      : jeefo
* Purpose     : Easier to develop. Please make me happy :)
* Description : Describe what is Identifier and unit test every single case.
*             : Make sure it is working correctly.
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const expect          = require("expect.js");
const parser          = require("../parser.js");
const test_source     = require("../../helpers/test_source");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

describe("Identifier >", () => {
    const reserved_words = parser.ast_node_table.get_reserved_words();

    const primitive_reserved_words = [
        "null",
        "true",
        "false",
        "undefined",
    ];

    primitive_reserved_words.forEach(reserved_word => {
        describe(`Test against reserved word: '${ reserved_word }'`, () => {
            it("should not be Identifier", () => {
                parser.tokenizer.init(reserved_word);
                parser.prepare_next_state("expression");

                expect(parser.next_node_definition).not.to.be(null);
                expect(parser.next_node_definition.id).not.to.be("Identifier");
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
        describe(`Test against reserved word: '${ reserved_word }'`, () => {
            it("should not be Identifier", () => {
                parser.tokenizer.init(reserved_word);
                parser.prepare_next_state();

                expect(reserved_words.includes(reserved_word)).to.be(true);
                expect(parser.next_node_definition).not.to.be(null);

                expect(parser.next_node_definition.id).not.to.be("Identifier");
                expect(parser.next_node_definition.id).not.to.be("Expression statement");
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
        describe(`Test against reserved word: '${ reserved_word }'`, () => {
            it("should not be Identifier", () => {
                parser.tokenizer.init(reserved_word);
                parser.prepare_next_state();

                expect(reserved_words.includes(reserved_word)).to.be(true);
                expect(parser.next_node_definition).to.be(null);
            });
        });
    });

    const source = "identifier";
    test_source(source, () => {
        parser.tokenizer.init(source);
        parser.prepare_next_state("expression");

        const streamer = parser.tokenizer.streamer;
        let node;
        try {
            node = parser.generate_next_node();
        } catch (e) {}

        it(`cursor index should be move ${ source.length } characters to right`, () => {
            expect(streamer.get_current_character()).to.be('r');
            expect(streamer.cursor.position.index).to.be(source.length - 1);
        });

        it(`should be in correct range`, () => {
            expect(streamer.substring_from_token(node)).to.be(source);
        });

        it("should be Identifier", () => {
            expect(node.id).to.be("Identifier");
            expect(node.value).to.be(source);
        });

        it("should be Primitive", () => {
            expect(node.type).to.be("Primitive");
            expect(node.precedence).to.be(precedence_enum.PRIMITIVE);
        });
    });
});
