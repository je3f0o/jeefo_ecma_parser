/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : do_while_statement_specs.js
* Created at  : 2019-02-21
* Updated at  : 2019-03-19
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

describe("Do while statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // {{{1 do ; while (true)
            {
                code   : "do ; while (true)",
                source : "do ; while (true)",
                asi    : true,
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                inner_comment : comment => {
                    expect(comment).to.be(null);
                },
                post_comment : comment => {
                    expect(comment).to.be(null);
                },
                expression : expression => {
                    expect(expression.id).to.be("Surrounded expression");
                    expect(expression.type).to.be("Expression");

                    expect(expression.expression.id).to.be("Boolean literal");
                    expect(expression.expression.token.value).to.be("true");
                },
                statement : statement => {
                    expect(statement.id).to.be("Empty statement");
                    expect(statement.type).to.be("Statement");
                }
            },

            // {{{1 do {} while (true);
            {
                code   : "do {} while (true);",
                source : "do {} while (true);",
                asi    : false,
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                inner_comment : comment => {
                    expect(comment).to.be(null);
                },
                post_comment : comment => {
                    expect(comment).to.be(null);
                },
                expression : expression => {
                    expect(expression.id).to.be("Surrounded expression");
                    expect(expression.type).to.be("Expression");

                    expect(expression.expression.id).to.be("Boolean literal");
                    expect(expression.expression.token.value).to.be("true");
                },
                statement : statement => {
                    expect(statement.id).to.be("Block statement");
                    expect(statement.type).to.be("Statement");
                }
            },

            // {{{1 do while(false); while (true)
            {
                code   : "do while(false); while (true)",
                source : "do while(false); while (true)",
                asi    : true,
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                inner_comment : comment => {
                    expect(comment).to.be(null);
                },
                post_comment : comment => {
                    expect(comment).to.be(null);
                },
                expression : expression => {
                    expect(expression.id).to.be("Surrounded expression");
                    expect(expression.type).to.be("Expression");

                    expect(expression.expression.id).to.be("Boolean literal");
                    expect(expression.expression.token.value).to.be("true");
                },
                statement : (statement, streamer) => {
                    expect(statement.id).to.be("While statement");
                    expect(statement.type).to.be("Statement");

                    expect(streamer.substring_from_token(statement)).to.be("while(false);");
                }
            },

            // {{{1 do /* comment */ a\n while (true) b
            {
                code   : "do /* comment */ a\n while (true)",
                source : "do /* comment */ a\n while (true) b",
                asi    : true,
                pre_comment : comment => {
                    expect(comment).to.be(null);
                },
                inner_comment : comment => {
                    expect(comment).to.be(null);
                },
                post_comment : comment => {
                    expect(comment).to.be(null);
                },
                expression : expression => {
                    expect(expression.id).to.be("Surrounded expression");
                    expect(expression.type).to.be("Expression");

                    expect(expression.expression.id).to.be("Boolean literal");
                    expect(expression.expression.token.value).to.be("true");
                },
                statement : (statement, streamer) => {
                    expect(statement.id).to.be("Expression statement");
                    expect(statement.type).to.be("Statement");

                    expect(streamer.substring_from_token(statement)).to.be("/* comment */ a");
                }
            },

            // {{{1 /*a*/do/*b*/a\n/*c*/while/*d*/(/*e*/true/*f*/)//g\n; b
            {
                code   : "/*a*/do/*b*/a\n/*c*/while/*d*/(/*e*/true/*f*/)//g\n;",
                source : "/*a*/do/*b*/a\n/*c*/while/*d*/(/*e*/true/*f*/)//g\n; b",
                asi    : false,
                pre_comment : (comment, streamer) => {
                    expect(streamer.substring_from_token(comment)).to.be("/*a*/");
                    expect(comment.value).to.be("a");
                    expect(comment.is_inline).to.be(false);
                },
                inner_comment : (comment, streamer) => {
                    expect(streamer.substring_from_token(comment)).to.be("/*c*/");
                    expect(comment.value).to.be("c");
                    expect(comment.is_inline).to.be(false);
                },
                post_comment : (comment, streamer) => {
                    expect(streamer.substring_from_token(comment)).to.be("//g\n");
                    expect(comment.value).to.be("g");
                    expect(comment.is_inline).to.be(true);
                },
                expression : (expression, streamer) => {
                    expect(expression.id).to.be("Surrounded expression");
                    expect(expression.type).to.be("Expression");

                    expect(expression.expression.id).to.be("Boolean literal");
                    expect(expression.expression.token.value).to.be("true");
                    expect(streamer.substring_from_token(expression.expression.pre_comment)).to.be("/*e*/");
                    expect(streamer.substring_from_token(expression.expression)).to.be("/*e*/true");

                    expect(streamer.substring_from_token(expression.open_parenthesis)).to.be("/*d*/(");
                    expect(streamer.substring_from_token(expression.close_parenthesis)).to.be("/*f*/)");
                },
                statement : (statement, streamer) => {
                    expect(statement.id).to.be("Expression statement");
                    expect(statement.type).to.be("Statement");

                    expect(statement.pre_comment).not.to.be(null);
                    expect(streamer.substring_from_token(statement)).to.be("/*b*/a");
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

                it("should be Do while statement", () => {
                    expect(symbol.id).to.be("Do while statement");
                    expect(symbol.type).to.be("Statement");
                    expect(symbol.precedence).to.be(31);
                });

                it("should be has correct pre_comment", () => {
                    test_case.pre_comment(symbol.pre_comment, streamer);
                });

                it("should be has correct inner_comment", () => {
                    test_case.inner_comment(symbol.inner_comment, streamer);
                });

                it("should be has correct post_comment", () => {
                    test_case.post_comment(symbol.post_comment, streamer);
                });

                it("should be has correct expression", () => {
                    test_case.expression(symbol.expression, streamer);
                });

                it("should be has correct statement", () => {
                    test_case.statement(symbol.statement, streamer);
                });

                it("should be right ASI", () => {
                    expect(symbol.ASI).to.be(test_case.asi);
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
            // {{{1 do
            {
                source : "do",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 do while(false);
            {
                source : "do while(false);",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 do while(false); a
            {
                source : "do while(false); a",
                error : error => {
                    it("should be throw: Expected while instead saw: a", () => {
                        expect(error.message).to.be("Expected while instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // {{{1 do; while();
            {
                source : "do; while();",
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

            // {{{1 do; while (/* comment */);
            {
                source : "do; while (/* comment */);",
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

            // {{{1 do; while
            {
                source : "do; while",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 do\n while(false);
            {
                source : "do\n while(false);",
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
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
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
