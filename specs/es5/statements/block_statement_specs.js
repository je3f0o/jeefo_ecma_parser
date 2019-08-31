/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : block_statement_specs.js
* Created at  : 2019-03-30
* Updated at  : 2019-08-06
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

const expect          = require("expect.js");
const parser          = require("../parser.js");
const test_source     = require("../../helpers/test_source");
const test_substring  = require("../../helpers/test_substring");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

describe("Block statement >", () => {
    describe("Valid cases >", () => {
        // test_open_curly_bracket (node, expectation, streamer)
        function test_open_curly_bracket (node, expectation, streamer) {
            expect(node.id).to.be("Delimiter");
            expect(node.type).to.be("Delimiter");
            expect(node.precedence).to.be(-1);
            expectation.comment(node.pre_comment, streamer);
            test_substring(expectation.str, streamer, node);
        }

        // test_close_curly_bracket (node, expectation, streamer)
        const test_close_curly_bracket = test_open_curly_bracket;

        const valid_test_cases = [
            // {}
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

            // { a = 1; }
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

            // { a : 1 }
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

            // { a : 1\n b : 2 }
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

            // { // comment\n }
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
                    str     : "}",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("// comment\n", streamer, comment);
                    }
                },
            },

            // /*a*/ { /*b*/a + b /*c*/ }
            {
                code   : "{ /*b*/a + b /*c*/ }",
                source : "/*a*/ { /*b*/a + b /*c*/ }",

                statements : (statements, streamer) => {
                    expect(statements.length).to.be(1);

                    expect(statements[0].id).to.be("Expression statement");
                    test_substring(
                        "/*b*/",
                        streamer,
                        statements[0].expression.left.pre_comment
                    );
                    test_substring("a + b", streamer, statements[0]);
                },
                open : {
                    str     : "{",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*a*/", streamer, comment);
                    }
                },
                close : {
                    str     : "}",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*c*/", streamer, comment);
                    }
                },
            },
        ];

        valid_test_cases.forEach(test_case => {
            test_source(test_case.source, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                let node;
                const streamer = parser.tokenizer.streamer;
                try {
                    node = parser.parse_next_node(precedence_enum.TERMINATION);
                } catch (e) {
                    console.log(e);
                    process.exit();
                }

                it("should be Block statement", () => {
                    expect(node.id).to.be("Block statement");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(precedence_enum.STATEMENT);
                });

                it("should be has correct open_curly_bracket", () => {
                    test_open_curly_bracket(
                        node.open_curly_bracket, test_case.open, streamer
                    );
                });

                it("should be has correct close_curly_bracket", () => {
                    test_close_curly_bracket(
                        node.close_curly_bracket, test_case.close, streamer
                    );
                });

                it("should be has correct statements", () => {
                    test_case.statements(node.statements, streamer);
                });

                it(`should be in correct range`, () => {
                    const last_index = test_case.source.length - 1;

                    expect(streamer.substring_from_token(node)).to.be(test_case.code);
                    expect(streamer.get_current_character()).to.be(
                        test_case.source.charAt(last_index)
                    );
                    expect(streamer.cursor.position.index).to.be(last_index);
                });
            });
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // {
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
        ];

        error_test_cases.forEach(test_case => {
            test_source(test_case.source, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                try {
                    parser.parse_next_node(precedence_enum.TERMINATION);
                    expect("throw").to.be("failed");
                } catch (e) {
                    test_case.error(e);
                }
            });
        });
    });
});
