/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : while_statement_specs.js
* Created at  : 2019-02-21
* Updated at  : 2019-03-11
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
      precedence_enum          = require("../../../src/es5/enums/precedence_enum"),
      UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception");

describe("While statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // {{{1 while (true);
            {
                code   : "while (true);",
                source : "while (true);",
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                expression : expression => {
                    expect(expression.id).to.be("Conditional expression");
                    expect(expression.type).to.be("Expression");

                    expect(expression.expression.id).to.be("Boolean literal");
                    expect(expression.expression.token.value).to.be("true");
                },
                statement : statement => {
                    expect(statement.id).to.be("Empty statement");
                    expect(statement.type).to.be("Statement");
                }
            },

            // {{{1 while (true) {}
            {
                code   : "while (true) {}",
                source : "while (true) {}",
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                expression : expression => {
                    expect(expression.id).to.be("Conditional expression");
                    expect(expression.type).to.be("Expression");

                    expect(expression.expression.id).to.be("Boolean literal");
                    expect(expression.expression.token.value).to.be("true");
                },
                statement : statement => {
                    expect(statement.id).to.be("Block statement");
                    expect(statement.type).to.be("Statement");
                }
            },

            // {{{1 "while (true) /*comment*/ a /*comment*/\nb",
            {
                code   : "while (true) /*comment*/ a",
                source : "while (true) /*comment*/ a /*comment*/\nb",
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                expression : expression => {
                    expect(expression.id).to.be("Conditional expression");
                    expect(expression.type).to.be("Expression");

                    expect(expression.expression.id).to.be("Boolean literal");
                    expect(expression.expression.token.value).to.be("true");
                },
                statement : (statement, streamer) => {
                    expect(statement.id).to.be("Expression statement");
                    expect(statement.type).to.be("Statement");

                    expect(streamer.substring_from_token(statement)).to.be("/*comment*/ a");
                }
            },

            // {{{1 /*a*/while/*b*/(/*c*/true/*d*/)/*e*/;
            {
                code   : "/*a*/while/*b*/(/*c*/true/*d*/)/*e*/;",
                source : "/*a*/while/*b*/(/*c*/true/*d*/)/*e*/;",
                pre_comment : (comment, streamer) => {
                    expect(streamer.substring_from_token(comment)).to.be("/*a*/");
                    expect(comment.value).to.be("a");
                    expect(comment.is_inline).to.be(false);
                },
                expression : (expression, streamer) => {
                    expect(expression.id).to.be("Conditional expression");
                    expect(expression.type).to.be("Expression");

                    expect(expression.expression.id).to.be("Boolean literal");
                    expect(expression.expression.token.value).to.be("true");
                    expect(streamer.substring_from_token(expression.expression.pre_comment)).to.be("/*c*/");
                    expect(streamer.substring_from_token(expression.expression)).to.be("/*c*/true");

                    expect(streamer.substring_from_token(expression.open_parenthesis)).to.be("/*b*/(");
                    expect(streamer.substring_from_token(expression.close_parenthesis)).to.be("/*d*/)");
                },
                statement : (statement, streamer) => {
                    expect(statement.id).to.be("Empty statement");
                    expect(statement.type).to.be("Statement");

                    expect(statement.pre_comment).not.to.be(null);
                    expect(streamer.substring_from_token(statement)).to.be("/*e*/;");
                }
            },
            // }}}1
        ];

        valid_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                const symbol   = parser.get_next_symbol(precedence_enum.TERMINATION);
                const streamer = parser.tokenizer.streamer;

                it("should be While statement", () => {
                    expect(symbol.id).to.be("While statement");
                    expect(symbol.type).to.be("Statement");
                });

                it("should be has correct pre_comment", () => {
                    test_case.pre_comment(symbol.pre_comment, streamer);
                });

                it("should be has correct Conditional expression", () => {
                    test_case.expression(symbol.expression, streamer);
                });

                it("should be has correct Statement", () => {
                    test_case.statement(symbol.statement, streamer);
                });

                it(`cursor index should be move ${ test_case.source.length } characters to right`, () => {
                    const last_index = test_case.code.length - 1;
                    expect(streamer.get_current_character()).to.be(test_case.source.charAt(last_index));
                    expect(streamer.cursor.index).to.be(last_index);
                });

                it(`should be in correct range`, () => {
                    expect(streamer.substring_from_token(symbol)).to.be(test_case.code);
                });
            });
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // {{{1 while
            {
                source : "while",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 while ;
            {
                source : "while ;",
                error : error => {
                    it("should be throw: Expected ( instead saw: ;", () => {
                        expect(error.message).to.be("Expected ( instead saw: ;");
                    });

                    it("should be has token value: ;", () => {
                        expect(error.token.value).to.be(";");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 while /* comment */ a
            {
                source : "while /* comment */ a",
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

            // {{{1 while ()
            {
                source : "while ()",
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

            // {{{1 while (/* comment */)
            {
                source : "while (/* comment */)",
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

            // {{{1 while (false)
            {
                source : "while (false)",
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
