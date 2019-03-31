/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : block_statement.js
* Created at  : 2019-03-30
* Updated at  : 2019-03-30
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const expect          = require("expect.js"),
      parser          = require("../../../src/es5/parser.js"),
      test_substring  = require("../../helpers/test_substring"),
      precedence_enum = require("../../../src/es5/enums/precedence_enum");

describe("Block statement >", () => {
    describe("Valid cases >", () => {
        // {{{1 test_open_curly_bracket (symbol, expectation, streamer)
        function test_open_curly_bracket (symbol, expectation, streamer) {
            expect(symbol.id).to.be("Delimiter");
            expect(symbol.type).to.be("Delimiter");
            expect(symbol.precedence).to.be(-1);
            expectation.comment(symbol.pre_comment, streamer);
            test_substring(expectation.str, streamer, symbol);
        }

        // {{{1 test_close_curly_bracket (symbol, expectation, streamer)
        function test_close_curly_bracket (symbol, expectation, streamer) {
            expect(symbol.id).to.be("Delimiter");
            expect(symbol.type).to.be("Delimiter");
            expect(symbol.precedence).to.be(-1);
            expectation.comment(symbol.pre_comment, streamer);
            test_substring(expectation.str, streamer, symbol);
        }
        // }}}1

        const valid_test_cases = [
            // {{{1 {}
            {
                code   : "{}",
                source : "{}",

                statements : statements => {
                    expect(statements.length).to.be(0);
                },
                open : {
                    str     : "{",
                    comment : comment => expect(comment).to.be(null)
                },
                close : {
                    str     : "}",
                    comment : comment => expect(comment).to.be(null)
                },
            },

            // {{{1 { a = 1; }
            {
                code   : "{ a = 1 }",
                source : "{ a = 1 }",

                statements : (statements, streamer) => {
                    expect(statements.length).to.be(1);

                    expect(statements[0].id).to.be("Expression statement");
                    test_substring("a = 1", streamer, statements[0]);
                },
                open : {
                    str     : "{",
                    comment : comment => expect(comment).to.be(null)
                },
                close : {
                    str     : "}",
                    comment : comment => expect(comment).to.be(null)
                },
            },

            // {{{1 { a : 1 }
            {
                code   : "{ a : 1 }",
                source : "{ a : 1 }",

                statements : (statements, streamer) => {
                    expect(statements.length).to.be(1);

                    expect(statements[0].id).to.be("Labelled statement");
                    test_substring("a : 1", streamer, statements[0]);
                },
                open : {
                    str     : "{",
                    comment : comment => expect(comment).to.be(null)
                },
                close : {
                    str     : "}",
                    comment : comment => expect(comment).to.be(null)
                },
            },

            // {{{1 { a : 1\n b : 2 }
            {
                code   : "{ a : 1\n b : 2 }",
                source : "{ a : 1\n b : 2 }",

                statements : (statements, streamer) => {
                    expect(statements.length).to.be(2);

                    expect(statements[0].id).to.be("Labelled statement");
                    test_substring("a : 1", streamer, statements[0]);

                    expect(statements[1].id).to.be("Labelled statement");
                    test_substring("b : 2", streamer, statements[1]);
                },
                open : {
                    str     : "{",
                    comment : comment => expect(comment).to.be(null)
                },
                close : {
                    str     : "}",
                    comment : comment => expect(comment).to.be(null)
                },
            },

            // {{{1 { // comment\n }
            {
                code   : "{ // comment\n }",
                source : "{ // comment\n }",

                statements : statements => {
                    expect(statements.length).to.be(0);
                },
                open : {
                    str     : "{",
                    comment : comment => expect(comment).to.be(null)
                },
                close : {
                    str     : "// comment\n }",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("// comment\n", streamer, comment);
                    }
                },
            },

            // {{{1 /*a*/ { /*b*/a + b /*c*/ }
            {
                code   : "/*a*/ { /*b*/a + b /*c*/ }",
                source : "/*a*/ { /*b*/a + b /*c*/ }",

                statements : (statements, streamer) => {
                    expect(statements.length).to.be(1);

                    expect(statements[0].id).to.be("Expression statement");
                    test_substring("/*b*/a + b", streamer, statements[0]);
                },
                open : {
                    str     : "/*a*/ {",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*a*/", streamer, comment);
                    }
                },
                close : {
                    str     : "/*c*/ }",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*c*/", streamer, comment);
                    }
                },
            },
            // }}}1
        ];

        valid_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                let symbol;
                const streamer = parser.tokenizer.streamer;
                try {
                    symbol = parser.get_next_symbol(precedence_enum.TERMINATION);
                } catch (e) {}

                it("should be Block statement", () => {
                    expect(symbol.id).to.be("Block statement");
                    expect(symbol.type).to.be("Statement");
                    expect(symbol.precedence).to.be(31);
                });

                it("should be has correct open_curly_bracket", () => {
                    test_open_curly_bracket(symbol.open_curly_bracket, test_case.open, streamer);
                });

                it("should be has correct close_curly_bracket", () => {
                    test_close_curly_bracket(symbol.close_curly_bracket, test_case.close, streamer);
                });

                it("should be has correct statements", () => {
                    test_case.statements(symbol.statements, streamer);
                });

                it(`should be in correct range`, () => {
                    const last_index = test_case.code.length - 1;

                    expect(streamer.substring_from_token(symbol)).to.be(test_case.code);
                    expect(streamer.get_current_character()).to.be(test_case.source.charAt(last_index));
                    expect(streamer.cursor.index).to.be(last_index);
                });
            });
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // {{{1 {
            {
                source : "{",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },
            // }}}1
        ];

        error_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                try {
                    parser.get_next_symbol(precedence_enum.TERMINATION);
                    expect("throw").to.be("failed");
                } catch (e) {
                    test_case.error(e);
                }
            });
        });
    });
});
