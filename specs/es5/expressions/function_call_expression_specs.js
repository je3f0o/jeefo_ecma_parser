/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression_specs.js
* Created at  : 2019-03-20
* Updated at  : 2019-03-20
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
      parser                   = require("../../../src/es5_parser.js"),
      test_substring           = require("../../helpers/test_substring"),
      precedence_enum          = require("../../../src/es5/enums/precedence_enum"),
      UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception");

describe("Function call expression >", () => {
    describe("Valid cases >", () => {
        // {{{1 test_callee (symbol, expectation, streamer)
        function test_callee (symbol, expectation, streamer) {
            expect(symbol).not.to.be(null);
            expect(symbol.id).to.be(expectation.id);
            expect(symbol.type).to.be(expectation.type);

            expectation.advanced(symbol, streamer);

            test_substring(expectation.str, streamer, symbol);
        }

        // {{{1 test_arguments_list (symbol, expectation, streamer)
        function test_arguments_list (symbol, expectation, streamer) {
            expect(symbol.id).to.be("Arguments list");
            expect(symbol.type).to.be("Expression");

            expectation.advanced(symbol);
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

            test_substring(expectation.str, streamer, symbol);
        }
        // }}}1

        const valid_test_cases = [
            // {{{1 fn()
            {
                code   : "fn()",
                source : "fn()",

                end : { char : ')', offset : 0 },

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                callee : {
                    id       : "Identifier",
                    str      : 'fn',
                    type     : "Primitive",
                    advanced : () => {}
                },

                args : {
                    id       : "Arguments list",
                    str      : "()",
                    type     : "Expression",
                    advanced : symbol => {
                        expect(symbol.expressions.length).to.be(0);
                    }
                },
            },

            // {{{1 fn(1, a, 'str', fn2());
            {
                code   : "fn(1, a, 'str', fn2())",
                source : "fn(1, a, 'str', fn2());",

                end : { char : ';', offset : 1 },

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                callee : {
                    id       : "Identifier",
                    str      : 'fn',
                    type     : "Primitive",
                    advanced : () => {}
                },

                args : {
                    id       : "Arguments list",
                    str      : "(1, a, 'str', fn2())",
                    type     : "Expression",
                    advanced : symbol => {
                        expect(symbol.expressions.length).to.be(4);
                    }
                },
            },

            // {{{1 /*pre*/fn/*a*/(/*b*/)
            {
                code   : "/*pre*/fn/*a*/(/*b*/)",
                source : "/*pre*/fn/*a*/(/*b*/)",

                end : { char : ')', offset : 0 },

                open : {
                    str     : "/*a*/(",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*a*/", streamer, comment);
                    }
                },

                close : {
                    str     : "/*b*/)",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*b*/", streamer, comment);
                    }
                },

                callee : {
                    id       : "Identifier",
                    str      : "/*pre*/fn",
                    type     : "Primitive",
                    advanced : (symbol, streamer) => {
                        expect(symbol.id).to.be("Identifier");
                        expect(symbol.type).to.be("Primitive");
                        expect(symbol.pre_comment).not.to.be(null);
                        test_substring("/*pre*/", streamer, symbol.pre_comment);
                    }
                },

                args : {
                    id       : "Arguments list",
                    str      : "/*a*/(/*b*/)",
                    type     : "Expression",
                    advanced : symbol => {
                        expect(symbol.expressions.length).to.be(0);
                    }
                },
            },
            // }}}1
        ];

        valid_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                let expr, symbol;
                const streamer = parser.tokenizer.streamer;
                try {
                    expr   = parser.get_next_symbol(precedence_enum.TERMINATION);
                    symbol = expr.expression;
                } catch (e) {}

                it("should be Function call expression", () => {
                    expect(symbol.id).to.be("Function call expression");
                    expect(symbol.type).to.be("Expression");
                    expect(symbol.precedence).to.be(19);
                });

                it("should be has correct callee", () => {
                    test_callee(symbol.callee, test_case.callee, streamer);
                });

                it("should be has correct Arguments list", () => {
                    test_arguments_list(symbol.arguments_list, test_case.args, streamer);
                });

                it("should be has correct open_parenthesis", () => {
                    test_open_parenthesis(symbol.arguments_list.open_parenthesis, test_case.open, streamer);
                });

                it("should be has correct close_parenthesis", () => {
                    test_close_parenthesis(symbol.arguments_list.close_parenthesis, test_case.close, streamer);
                });

                it(`should be in correct range`, () => {
                    const last_index = test_case.code.length - 1;

                    expect(streamer.substring_from_token(symbol)).to.be(test_case.code);
                    expect(streamer.get_current_character()).to.be(test_case.end.char);
                    expect(streamer.cursor.index).to.be(last_index + test_case.end.offset);
                });
            });
        });
    });

    describe("Invalid cases >", () => {
        return;
        const error_test_cases = [
            // {{{1 for
            {
                source : "for",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 for a
            {
                source : "for a",
                error : error => {
                    it("should be throw: Expected ( instead saw: a", () => {
                        expect(error.message).to.be("Expected ( instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 for (
            {
                source : "for (",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 for (;
            {
                source : "for (;",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 for (;;
            {
                source : "for (;;",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 for (;;)
            {
                source : "for (;;)",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 for (/*comment*/)
            {
                source : "for (/*comment*/)",
                error : error => {
                    it("should be throw: Missing expression", () => {
                        expect(error.message).to.be("Missing expression");
                    });

                    it("should be has token value: )", () => {
                        expect(error.token.value).to.be(")");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 for (x = a in b;
            {
                source : "for (x = a in b;",
                error : error => {
                    it("should be throw: Invalid `in` operator in for-loop's expression", () => {
                        expect(error.message).to.be("Invalid `in` operator in for-loop's expression");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 for (var x = a in b;
            {
                source : "for (var x = a in b;",
                error : error => {
                    it("should be throw: Invalid `in` operator in for-loop's expression", () => {
                        expect(error.message).to.be("Invalid `in` operator in for-loop's expression");
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
