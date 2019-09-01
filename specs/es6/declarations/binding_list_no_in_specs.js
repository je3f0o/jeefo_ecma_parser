/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_list_no_in.js
* Created at  : 2019-09-01
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
    test_terminal,
    test_for_each,
    test_declaration,
} = require("../../helpers");

describe("Binding list no in >", () => {
    const valid_test_cases = [
        // for (let id;;);
        {
            code   : "id",
            source : "for (let id;;);",
            list (list) {
                expect(list.length).to.be(1);
                list.forEach(node => {
                    expect(node.id).to.be("Lexical binding no in");
                });
            },
            delimiters (delimiters) {
                expect(delimiters.length).to.be(0);
                delimiters.forEach(delimiter => {
                    test_terminal(delimiter, ',');
                });
            },
        },

        // for (let $var1, $var2;;);
        {
            code   : "$var1, $var2",
            source : "for (let $var1, $var2;;);",
            list (list) {
                expect(list.length).to.be(2);
                list.forEach(node => {
                    expect(node.id).to.be("Lexical binding no in");
                });
            },
            delimiters (delimiters) {
                expect(delimiters.length).to.be(1);
                delimiters.forEach(delimiter => {
                    test_terminal(delimiter, ',');
                });
            },
        },

        // for (let $var1 = value, {} = {}, [] = [];;);
        {
            code   : "$var1 = value, {} = {}, [] = []",
            source : "for (let $var1 = value, {} = {}, [] = [];;);",
            list (list) {
                expect(list.length).to.be(3);
                list.forEach(node => {
                    expect(node.id).to.be("Lexical binding no in");
                });
            },
            delimiters (delimiters) {
                expect(delimiters.length).to.be(2);
                delimiters.forEach(delimiter => {
                    test_terminal(delimiter, ',');
                });
            },
        },
    ];

    test_for_each(valid_test_cases, test_case => {
        parser.tokenizer.init(test_case.source);
        const streamer = parser.tokenizer.streamer;

        let node;
        try {
            parser.prepare_next_state();
            const for_stmt = parser.generate_next_node();
            node = for_stmt.expression.initializer.binding_list;
        } catch (e) {}

        test_declaration("Binding list no in", node);

        it("should be has correct list", () => {
            test_case.list(node.list);
        });

        it("should be has correct delimiters", () => {
            test_case.delimiters(node.delimiters);
        });

        test_range(test_case, node, streamer);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // for (let id
            {
                source  : "for (let id",
                message : "Unexpected end of stream",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // for (let id, ,
            {
                source  : "for (let id, ,",
                message : "Unexpected token",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.a(UnexpectedTokenException);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // for (let id, 123
            {
                source  : "for (let id, 123",
                message : "Unexpected token",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.a(UnexpectedTokenException);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // for (let $var1, $var2,
            {
                source  : "for (let $var1, $var2,",
                message : "Unexpected end of stream",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },
        ];

        test_for_each(error_test_cases, test_case => {
            parser.tokenizer.init(test_case.source);

            try {
                parser.prepare_next_state();
                parser.generate_next_node();
                expect("throw").to.be("failed");
            } catch (e) {
                test_case.error(e);
            }
        });
    });
});
