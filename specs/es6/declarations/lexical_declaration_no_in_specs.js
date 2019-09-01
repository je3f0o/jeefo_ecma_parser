/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_declaration_no_in_specs.js
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

describe("Lexical declaration no in >", () => {
    const valid_test_cases = [
        // for (let id;;);
        {
            code   : "let id;",
            source : "for (let id;;);",
            keyword (node) {
                test_terminal(node, "let");
            },
        },

        // for (let $var1, $var2;;);
        {
            code   : "let $var1, $var2;",
            source : "for (let $var1, $var2;;);",
            keyword (node) {
                test_terminal(node, "let");
            },
        },

        // for (let $var1 = value, {} = {}, [] = [];;);
        {
            code   : "let $var1 = value, {} = {}, [] = [];",
            source : "for (let $var1 = value, {} = {}, [] = [];;);",
            keyword (node) {
                test_terminal(node, "let");
            },
        },

        // for (const id = value;;);
        {
            code   : "const id = value;",
            source : "for (const id = value;;);",
            keyword (node) {
                test_terminal(node, "const");
            },
        },

        // for (const $var1 = value, $var2 = value;;);
        {
            code   : "const $var1 = value, $var2 = value;",
            source : "for (const $var1 = value, $var2 = value;;);",
            keyword (node) {
                test_terminal(node, "const");
            },
        },

        // for (const $var1 = value, {} = {}, [] = [];;);
        {
            code   : "const $var1 = value, {} = {}, [] = [];",
            source : "for (const $var1 = value, {} = {}, [] = [];;);",
            keyword (node) {
                test_terminal(node, "const");
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
            node = for_stmt.expression.initializer;
        } catch (e) {}

        test_declaration("Lexical declaration no in", node);

        it("should be has correct keyword", () => {
            test_case.keyword(node.keyword);
        });

        it("should be has correct binding list", () => {
            expect(node.binding_list.id).to.be("Binding list no in");
        });

        it("should be has correct terminator", () => {
            test_terminal(node.terminator, ';');
        });

        test_range(test_case, node, streamer);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // for (const id;
            {
                source  : "for (const id;",
                message : "Missing initializer in const declaration",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // for (const {};
            {
                source  : "for (const {};",
                message : "Missing initializer in destructuring declaration",
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

            // for (const [];
            {
                source  : "for (const [];",
                message : "Missing initializer in destructuring declaration",
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
