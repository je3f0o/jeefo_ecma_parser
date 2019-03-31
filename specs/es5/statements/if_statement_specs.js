/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement_specs.js
* Created at  : 2019-02-20
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
      precedence_enum          = require("../../../src/es5/enums/precedence_enum");

describe("If statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // {{{1 if (true);
            {
                code   : "if (true);",
                source : "if (true);",
                pre_comment : comment => {
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
                },
                else_statement : statement => {
                    expect(statement).to.be(null);
                }
            },

            // {{{1 if (true) {}
            {
                code   : "if (true) {}",
                source : "if (true) {}",
                pre_comment : comment => {
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
                },
                else_statement : statement => {
                    expect(statement).to.be(null);
                }
            },

            // {{{1 "if (true) /*comment*/ a /*comment*/\nb",
            {
                code   : "if (true) /*comment*/ a",
                source : "if (true) /*comment*/ a /*comment*/\nb",
                pre_comment : comment => {
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

                    expect(streamer.substring_from_token(statement)).to.be("/*comment*/ a");
                },
                else_statement : statement => {
                    expect(statement).to.be(null);
                }
            },

            // {{{1 if (true); else if (false);
            {
                code   : "if (true); else if (false);",
                source : "if (true); else if (false);",
                pre_comment : comment => {
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
                },
                else_statement : (statement, streamer) => {
                    expect(statement.id).to.be("Else statement");
                    expect(statement.statement.id).to.be("If statement");

                    expect(streamer.substring_from_token(statement)).to.be("else if (false);");
                    expect(streamer.substring_from_token(statement.statement)).to.be("if (false);");
                }
            },

            // {{{1 if (true); else;
            {
                code   : "if (true); else;",
                source : "if (true); else;",
                pre_comment : comment => {
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
                },
                else_statement : (statement, streamer) => {
                    expect(statement.id).to.be("Else statement");
                    expect(statement.statement.id).to.be("Empty statement");

                    expect(streamer.substring_from_token(statement)).to.be("else;");
                    expect(streamer.substring_from_token(statement.statement)).to.be(";");
                }
            },

            // {{{1 /*a*/if/*b*/(/*c*/true/*d*/)/*e*/;/*f*/else/*g*/;
            {
                code   : "/*a*/if/*b*/(/*c*/true/*d*/)/*e*/;/*f*/else/*g*/;",
                source : "/*a*/if/*b*/(/*c*/true/*d*/)/*e*/;/*f*/else/*g*/;",
                pre_comment : (comment, streamer) => {
                    expect(streamer.substring_from_token(comment)).to.be("/*a*/");
                    expect(comment.value).to.be("a");
                    expect(comment.is_inline).to.be(false);
                },
                expression : (expression, streamer) => {
                    expect(expression.id).to.be("Surrounded expression");
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
                },
                else_statement : (statement, streamer) => {
                    expect(statement.id).to.be("Else statement");
                    expect(statement.statement.id).to.be("Empty statement");

                    expect(streamer.substring_from_token(statement)).to.be("/*f*/else/*g*/;");
                    expect(streamer.substring_from_token(statement.statement)).to.be("/*g*/;");
                }
            },
            // }}}1
        ];

        valid_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                let symbol;
                try {
                    symbol = parser.get_next_symbol(precedence_enum.TERMINATION);
                } catch (e) {}
                const streamer = parser.tokenizer.streamer;

                it("should be If statement", () => {
                    expect(symbol.id).to.be("If statement");
                    expect(symbol.type).to.be("Statement");
                });

                it("should be has correct pre_comment", () => {
                    test_case.pre_comment(symbol.pre_comment, streamer);
                });

                it("should be has correct Surrounded expression", () => {
                    test_case.expression(symbol.expression, streamer);
                });

                it("should be has correct Statement", () => {
                    test_case.statement(symbol.statement, streamer);
                });

                it("should be has correct Else statement", () => {
                    test_case.else_statement(symbol.else_statement, streamer);
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
            // {{{1 if
            {
                source : "if",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // {{{1 if ;
            {
                source : "if ;",
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

            // {{{1 if /* comment */ a
            {
                source : "if /* comment */ a",
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

            // {{{1 if ()
            {
                source : "if ()",
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

            // {{{1 if (/* comment */)
            {
                source : "if (/* comment */)",
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

            // {{{1 if (false)
            {
                source : "if (false)",
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
