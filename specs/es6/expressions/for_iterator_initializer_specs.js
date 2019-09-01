/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_iterator_initializer_specs.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-01
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

const expect                       = require("expect.js");
const { UnexpectedTokenException } = require("@jeefo/parser");

const parser = require("../parser.js");
const {
    test_range,
    test_for_each,
    test_declaration,
} = require("../../helpers");

describe("For iterator initializer >", () => {
    const valid_test_cases = [
        // var id;
        {
            code   : "var id;",
            source : "var id;",
            list (var_def_list) {
                expect(var_def_list.length).to.be(1);
                var_def_list.forEach(var_def => {
                    expect(var_def.id).to.be("Variable declaration no in");
                });
            },
            delimiters (delimiters) {
                expect(delimiters.length).to.be(0);
                delimiters.forEach(delimiter => {
                    expect(delimiter.id).to.be("Terminal symbol");
                    expect(delimiter.value).to.be(',');
                });
            },
            terminator (node) {
                expect(node).not.to.be(null);
                expect(node.id).to.be("Terminal symbol");
                expect(node.value).to.be(';');
            }
        },

        // var $var1, $var2;
        {
            code   : "var $var1, $var2;",
            source : "var $var1, $var2;",
            list (var_def_list) {
                expect(var_def_list.length).to.be(2);
                var_def_list.forEach(var_def => {
                    expect(var_def.id).to.be("Variable declaration no in");
                });
            },
            delimiters (delimiters) {
                expect(delimiters.length).to.be(1);
                delimiters.forEach(delimiter => {
                    expect(delimiter.id).to.be("Terminal symbol");
                    expect(delimiter.value).to.be(',');
                });
            },
            terminator (node) {
                expect(node).not.to.be(null);
                expect(node.id).to.be("Terminal symbol");
                expect(node.value).to.be(';');
            }
        },

        // var $var1 = value, {} = {}, [] = [];
        {
            code   : "var $var1 = value, {} = {}, [] = [];",
            source : "var $var1 = value, {} = {}, [] = [];",
            list (var_def_list) {
                expect(var_def_list.length).to.be(3);
                var_def_list.forEach(var_def => {
                    expect(var_def.id).to.be("Variable declaration no in");
                });
            },
            delimiters (delimiters) {
                expect(delimiters.length).to.be(2);
                delimiters.forEach(delimiter => {
                    expect(delimiter.id).to.be("Terminal symbol");
                    expect(delimiter.value).to.be(',');
                });
            },
            terminator (node) {
                expect(node).not.to.be(null);
                expect(node.id).to.be("Terminal symbol");
                expect(node.value).to.be(';');
            }
        },
    ];

    test_for_each(valid_test_cases, test_case => {
        parser.tokenizer.init(test_case.source);
        parser.prepare_next_state();

        const streamer = parser.tokenizer.streamer;
        let node;
        try {
            parser.change_state("statement");
            const keyword = parser.generate_next_node();

            parser.prepare_next_state("variable_declaration_no_in", true);
            const declaration = parser.generate_next_node();

            parser.set_prev_node({
                keyword, declaration,
                prev_node : parser.prev_node,
            });

            parser.change_state("variable_declaration_list_no_in");
            node = parser.generate_next_node();
        } catch (e) {}

        test_declaration("Variable declaration list no in", node);

        it("should be has correct keyword", () => {
            expect(node.keyword.id).to.be("Var keyword");
        });

        it("should be has correct list", () => {
            test_case.list(node.list);
        });

        it("should be has correct delimiters", () => {
            test_case.delimiters(node.delimiters);
        });

        it("should be has correct terminator", () => {
            test_case.terminator(node.terminator);
        });

        test_range(test_case, node, streamer);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // var id
            {
                source  : "var id",
                message : "Unexpected end of stream",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // var id, ,
            {
                source  : "var id, ,",
                message : "Unexpected token",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.an(UnexpectedTokenException);
                    });
                }
            },

            // var id, 123,
            {
                source  : "var id, 123,",
                message : "Unexpected token",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.an(UnexpectedTokenException);
                    });
                }
            },
        ];

        test_for_each(error_test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            try {
                parser.change_state("statement");
                const keyword = parser.generate_next_node();

                parser.prepare_next_state("variable_declaration_no_in", true);
                const declaration = parser.generate_next_node();

                parser.set_prev_node({
                    keyword, declaration,
                    prev_node : parser.prev_node,
                });

                parser.change_state("variable_declaration_list_no_in");
                parser.generate_next_node();

                expect("throw").to.be("failed");
            } catch (e) {
                test_case.error(e);
            }
        });
    });
});
