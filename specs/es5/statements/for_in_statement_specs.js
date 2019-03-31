/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_in_statement_specs.js
* Created at  : 2019-03-18
* Updated at  : 2019-03-31
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

const expect                   = require("expect.js"),
      UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception"),
      parser                   = require("../../../src/es5/parser.js"),
      test_substring           = require("../../helpers/test_substring"),
      precedence_enum          = require("../../../src/es5/enums/precedence_enum");

describe("For in statement >", () => {
    describe("Valid cases >", () => {
        // {{{1 test_identifier (symbol, str, streamer)
        function test_identifier (symbol, str, streamer) {
            expect(symbol).not.to.be(null);
            expect(symbol.id).to.be("Identifier");
            test_substring(str, streamer, symbol);
        }

        // {{{1 test_operator (symbol, expectation, streamer)
        function test_operator (symbol, expectation, streamer) {
            expect(symbol).not.to.be(null);
            expect(symbol.id).to.be("Operator");
            expect(symbol.type).to.be("Operator");

            // pre_comment
            expectation.comment(symbol.pre_comment, streamer);

            // token
            expect(symbol.token).not.to.be(null);
            expect(symbol.token.value).to.be("in");

            test_substring(expectation.str, streamer, symbol);
        }

        // {{{1 test_initializer (symbol, expectation, streamer)
        function test_initializer (symbol, expectation, streamer) {
            expect(symbol).not.to.be(null);
            expect(symbol.id).to.be(expectation.id);

            test_substring(expectation.str, streamer, symbol);
        }

        // {{{1 test_open_parenthesis (symbol, expectation, streamer)
        function test_open_parenthesis (symbol, expectation, streamer) {
            expect(symbol.id).to.be("Delimiter");
            expect(symbol.type).to.be("Delimiter");
            expectation.comment(symbol.pre_comment, streamer);
            test_substring(expectation.str, streamer, symbol);
        }

        // {{{1 test_close_parenthesis (symbol, expectation, streamer)
        function test_close_parenthesis (symbol, expectation, streamer) {
            expect(symbol.id).to.be("Delimiter");
            expect(symbol.type).to.be("Delimiter");
            expectation.comment(symbol.pre_comment, streamer);
            test_substring(expectation.str, streamer, symbol);
        }

        // {{{1 test_expression (symbol, expectation, streamer)
        function test_expression (symbol, expectation, streamer) {
            expect(symbol).not.to.be(null);
            expect(symbol.id).to.be(expectation.id);
            expect(symbol.type).to.be(expectation.type);

            expectation.advanced(symbol, streamer);

            test_substring(expectation.str, streamer, symbol);
        }
        // }}}1

        const valid_test_cases = [
            // {{{1 for (a in b);
            {
                code   : "for (a in b);",
                source : "for (a in b);",

                id : "a",
                op : {
                    str     : "in",
                    comment : comment => expect(comment).to.be(null)
                },
                expr : {
                    id   : "For in expression",
                    str  : "(a in b)",
                    type : "Expression",
                    advanced : () => {}
                },
                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },
                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },
                init : {
                    id  : "Identifier",
                    str : "b",
                },

                pre_comment : comment => expect(comment).to.be(null),

                statement : statement => expect(statement.id).to.be("Empty statement")
            },

            // {{{1 /*a*/for/*b*/(/*c*/a/*d*/in/*e*/1+2/*f*/)/*comment*/;;,
            {
                code   : "/*a*/for/*b*/(/*c*/a/*d*/in/*e*/1+2/*f*/)/*comment*/;",
                source : "/*a*/for/*b*/(/*c*/a/*d*/in/*e*/1+2/*f*/)/*comment*/;;",

                id : "/*c*/a",

                op : {
                    str     : "/*d*/in",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*d*/", streamer, comment);
                    }
                },

                expr : {
                    id   : "For in expression",
                    str  : "/*b*/(/*c*/a/*d*/in/*e*/1+2/*f*/)",
                    type : "Expression",
                    advanced : () => {}
                },

                open : {
                    str     : "/*b*/(",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*b*/", streamer, comment);
                    }
                },

                close : {
                    str     : "/*f*/)",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*f*/", streamer, comment);
                    }
                },

                init : {
                    id  : "Arithmetic operator",
                    str : "/*e*/1+2",
                },

                pre_comment : (comment, streamer) => {
                    expect(comment).not.to.be(null);
                    test_substring("/*a*/", streamer, comment);
                },

                statement : (statement, streamer) => {
                    expect(statement.id).to.be("Empty statement");
                    test_substring("/*comment*/", streamer, statement.pre_comment);
                    test_substring("/*comment*/;", streamer, statement);
                }
            },

            // {{{1 for (var a in 1 + 2);
            {
                code   : "for (var a in 1 + 2);",
                source : "for (var a in 1 + 2);",

                id : "a",

                op : {
                    str     : "in",
                    comment : comment => expect(comment).to.be(null)
                },

                expr : {
                    id   : "For in variable declaration",
                    str  : "(var a in 1 + 2)",
                    type : "Declaration",
                    advanced : symbol => {
                        expect(symbol.token).not.to.be(null);
                        expect(symbol.token.value).to.be("var");

                        expect(symbol.pre_comment_of_var).to.be(null);
                    }
                },

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                init : {
                    id  : "Arithmetic operator",
                    str : "1 + 2",
                },

                pre_comment : comment => expect(comment).to.be(null),

                statement : statement => expect(statement.id).to.be("Empty statement")
            },

            // {{{1 /*a*/for/*b*/(/*c*/var/*d*/a/*e*/in/*f*/1+2/*k*/)/*comment*/;;,
            {
                code   : "/*a*/for/*b*/(/*c*/var/*d*/a/*e*/in/*f*/1+2/*k*/)/*comment*/;",
                source : "/*a*/for/*b*/(/*c*/var/*d*/a/*e*/in/*f*/1+2/*k*/)/*comment*/;;",

                id : "/*d*/a",

                op : {
                    str     : "/*e*/in",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*e*/", streamer, comment);
                    }
                },

                expr : {
                    id   : "For in variable declaration",
                    str  : "/*b*/(/*c*/var/*d*/a/*e*/in/*f*/1+2/*k*/)",
                    type : "Declaration",
                    advanced : (symbol, streamer) => {
                        expect(symbol.token).not.to.be(null);
                        expect(symbol.token.value).to.be("var");

                        expect(symbol.pre_comment_of_var).not.to.be(null);
                        test_substring("/*c*/", streamer, symbol.pre_comment_of_var);
                    }
                },

                open : {
                    str     : "/*b*/(",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*b*/", streamer, comment);
                    }
                },

                close : {
                    str     : "/*k*/)",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*k*/", streamer, comment);
                    }
                },

                init : {
                    id  : "Arithmetic operator",
                    str : "/*f*/1+2",
                },

                pre_comment : (comment, streamer) => {
                    expect(comment).not.to.be(null);
                    test_substring("/*a*/", streamer, comment);
                },

                statement : (statement, streamer) => {
                    expect(statement.id).to.be("Empty statement");
                    test_substring("/*comment*/", streamer, statement.pre_comment);
                    test_substring("/*comment*/;", streamer, statement);
                }
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

                it("should be For statement", () => {
                    expect(symbol.id).to.be("For statement");
                    expect(symbol.type).to.be("Statement");
                    expect(symbol.precedence).to.be(31);
                    expect(symbol.token.value).to.be("for");
                });

                it("should be has correct pre_comment", () => {
                    test_case.pre_comment(symbol.pre_comment, streamer);
                });

                it("should be has correct open_parenthesis", () => {
                    test_open_parenthesis(symbol.expression.open_parenthesis, test_case.open, streamer);
                });

                it("should be has correct close_parenthesis", () => {
                    test_close_parenthesis(symbol.expression.close_parenthesis, test_case.close, streamer);
                });

                it("should be has correct expression", () => {
                    test_expression(symbol.expression, test_case.expr, streamer);
                });

                it("should be has correct identifier", () => {
                    test_identifier(symbol.expression.identifier, test_case.id, streamer);
                });

                it("should be has correct operator", () => {
                    test_operator(symbol.expression.operator, test_case.op, streamer);
                });

                it("should be has correct initializer", () => {
                    test_initializer(symbol.expression.initializer, test_case.init, streamer);
                });

                it("should be has correct statement", () => {
                    test_case.statement(symbol.statement, streamer);
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
            // {{{1 for ('a' in Object
            {
                source : "for ('a' in Object",
                error : error => {
                    it("should be throw: Expected identifier instead saw: 'a'", () => {
                        expect(error.message).to.be("Expected identifier instead saw: 'a'");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
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
