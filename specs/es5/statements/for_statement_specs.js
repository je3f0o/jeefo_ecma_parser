/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement_specs.js
* Created at  : 2019-03-16
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
      test_substring           = require("../../helpers/test_substring"),
      precedence_enum          = require("../../../src/es5/enums/precedence_enum"),
      UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception");

describe("For statement >", () => {
    describe("Valid cases >", () => {
        // {{{1 test_initializer (symbol, expectation, streamer)
        function test_initializer (symbol, expectation, streamer) {
            expect(symbol).not.to.be(null);
            expect(symbol.id).to.be(expectation.id);
            expect(symbol.type).to.be(expectation.type);

            expectation.advanced(symbol, streamer);

            test_substring(expectation.str, streamer, symbol);
        }

        // {{{1 test_condition (symbol, expectation, streamer)
        function test_condition (symbol, expectation, streamer) {
            expect(symbol).not.to.be(null);
            expect(symbol.id).to.be("For expression's condition");

            expectation.advanced(symbol, streamer);

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
            // {{{1 for (;;);
            {
                code   : "for (;;);",
                source : "for (;;);",

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                expr : {
                    id   : "For expression no in",
                    str  : '(;;)',
                    type : "Expression",
                },

                init : {
                    id       : "Expression no in",
                    str      : ';',
                    type     : "Expression",
                    advanced : symbol => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).to.be(null);
                        expect(symbol.post_comment).to.be(null);
                    }
                },

                condition : {
                    str : ';',
                    advanced : symbol => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).to.be(null);
                        expect(symbol.post_comment).to.be(null);
                    }
                },

                update : symbol => {
                    expect(symbol).to.be(null);
                },

                pre_comment : comment => expect(comment).to.be(null),

                statement : statement => {
                    expect(statement.id).to.be("Empty statement");
                },
            },

            // {{{1 for (i = 0; x < 5; i += 1);
            {
                code   : "for (i = 0; i < 5; i += 1);",
                source : "for (i = 0; i < 5; i += 1);",

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                expr : {
                    id   : "For expression no in",
                    str  : '(i = 0; i < 5; i += 1)',
                    type : "Expression",
                },

                init : {
                    id       : "Expression no in",
                    str      : 'i = 0;',
                    type     : "Expression",
                    advanced : (symbol, streamer) => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).not.to.be(null);
                        expect(symbol.post_comment).to.be(null);

                        test_substring("i = 0", streamer, symbol.expression);
                    }
                },

                condition : {
                    str : 'i < 5;',
                    advanced : (symbol, streamer) => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).not.to.be(null);
                        expect(symbol.post_comment).to.be(null);

                        test_substring("i < 5", streamer, symbol.expression);
                    }
                },

                update : (symbol, streamer) => {
                    expect(symbol).not.to.be(null);
                    test_substring("i += 1", streamer, symbol);
                },

                pre_comment : comment => expect(comment).to.be(null),

                statement : statement => {
                    expect(statement.id).to.be("Empty statement");
                },
            },

            // {{{1 for (/*a*/;/*a*/;/*a*/);
            {
                code   : "for (/*a*/;/*b*/;/*c*/);",
                source : "for (/*a*/;/*b*/;/*c*/);",

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : "/*c*/)",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*c*/", streamer, comment);
                    }
                },

                expr : {
                    id   : "For expression no in",
                    str  : '(/*a*/;/*b*/;/*c*/)',
                    type : "Expression",
                },

                init : {
                    id       : "Expression no in",
                    str      : '/*a*/;',
                    type     : "Expression",
                    advanced : (symbol, streamer) => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).to.be(null);
                        expect(symbol.post_comment).not.to.be(null);

                        test_substring("/*a*/", streamer, symbol.post_comment);
                    }
                },

                condition : {
                    str      : '/*b*/;',
                    advanced : (symbol, streamer) => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).to.be(null);
                        expect(symbol.post_comment).not.to.be(null);

                        test_substring("/*b*/", streamer, symbol.post_comment);
                    }
                },

                update : symbol => {
                    expect(symbol).to.be(null);
                },

                pre_comment : comment => expect(comment).to.be(null),

                statement : statement => {
                    expect(statement.id).to.be("Empty statement");
                },
            },
            // {{{1 for (0 /*a*/; 0 /*b*/; 0 /*c*/);
            {
                code   : "for (0 /*a*/; 0 /*b*/; 0 /*c*/);",
                source : "for (0 /*a*/; 0 /*b*/; 0 /*c*/);",

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : "/*c*/)",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*c*/", streamer, comment);
                    }
                },

                expr : {
                    id   : "For expression no in",
                    str  : '(0 /*a*/; 0 /*b*/; 0 /*c*/)',
                    type : "Expression",
                },

                init : {
                    id       : "Expression no in",
                    str      : '0 /*a*/;',
                    type     : "Expression",
                    advanced : (symbol, streamer) => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).not.to.be(null);
                        expect(symbol.post_comment).not.to.be(null);

                        test_substring("0", streamer, symbol.expression);
                        test_substring("/*a*/", streamer, symbol.post_comment);
                    }
                },

                condition : {
                    str      : '0 /*b*/;',
                    advanced : (symbol, streamer) => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).not.to.be(null);
                        expect(symbol.post_comment).not.to.be(null);

                        test_substring("0", streamer, symbol.expression);
                        test_substring("/*b*/", streamer, symbol.post_comment);
                    }
                },

                update : (symbol, streamer) => {
                    expect(symbol).not.to.be(null);
                    test_substring("0", streamer, symbol);
                },

                pre_comment : comment => expect(comment).to.be(null),

                statement : statement => {
                    expect(statement.id).to.be("Empty statement");
                },
            },

            // {{{1 /*pre*/for/*a*/(/*b*/i=0/*c*/;/*d*/i<5/*e*/;/*f*/i+=1/*k*/)/*comment*/;;,
            {
                code   : "/*pre*/for/*a*/(/*b*/i=0/*c*/;/*d*/i<5/*e*/;/*f*/i+=1/*k*/)/*comment*/;",
                source : "/*pre*/for/*a*/(/*b*/i=0/*c*/;/*d*/i<5/*e*/;/*f*/i+=1/*k*/)/*comment*/;;",

                open : {
                    str     : "/*a*/(",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*a*/", streamer, comment);
                    }
                },

                close : {
                    str     : "/*k*/)",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*k*/", streamer, comment);
                    }
                },

                expr : {
                    id   : "For expression no in",
                    str  : "/*a*/(/*b*/i=0/*c*/;/*d*/i<5/*e*/;/*f*/i+=1/*k*/)",
                    type : "Expression",
                },

                init : {
                    id       : "Expression no in",
                    str      : "/*b*/i=0/*c*/;",
                    type     : "Expression",
                    advanced : (symbol, streamer) => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).not.to.be(null);
                        expect(symbol.post_comment).not.to.be(null);

                        test_substring("/*b*/i=0", streamer, symbol.expression);
                        test_substring("/*c*/", streamer, symbol.post_comment);
                    }
                },

                condition : {
                    str      : "/*d*/i<5/*e*/;",
                    advanced : (symbol, streamer) => {
                        expect(symbol).not.to.be(null);
                        expect(symbol.expression).not.to.be(null);
                        expect(symbol.post_comment).not.to.be(null);

                        test_substring("/*d*/i<5", streamer, symbol.expression);
                        test_substring("/*e*/", streamer, symbol.post_comment);
                    }
                },

                update : (symbol, streamer) => {
                    expect(symbol).not.to.be(null);
                    test_substring("/*f*/i+=1", streamer, symbol);
                },

                pre_comment : (comment, streamer) => {
                    expect(comment).not.to.be(null);
                    expect(streamer.substring_from_token(comment)).to.be("/*pre*/");
                },

                statement : (statement, streamer) => {
                    expect(statement.id).to.be("Empty statement");
                    expect(statement.pre_comment).not.to.be(null);

                    test_substring("/*comment*/", streamer, statement.pre_comment);
                    test_substring("/*comment*/;", streamer, statement);
                },
            },

            // {{{1 for (var i = 0;;);
            {
                code   : "for (var i = 0;;);",
                source : "for (var i = 0;;);",

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                expr : {
                    id   : "For expression no in",
                    str  : '(var i = 0;;)',
                    type : "Expression",
                },

                init : {
                    id       : "Variable declaration list no in",
                    str      : 'var i = 0;',
                    type     : "Declaration",
                    advanced : (symbol, streamer) => {
                        expect(symbol).not.to.be(null);

                        expect(symbol.token).not.to.be(null);
                        expect(symbol.token.value).to.be("var");

                        expect(symbol.list.length).to.be(1);

                        expect(symbol.pre_comment_of_var).to.be(null);

                        test_substring("i = 0", streamer, symbol.list[0]);
                        test_substring("var i = 0;", streamer, symbol);
                    }
                },

                condition : {
                    str      : ';',
                    advanced : () => {}
                },

                update : symbol => {
                    expect(symbol).to.be(null);
                },

                pre_comment : comment => expect(comment).to.be(null),

                statement : statement => {
                    expect(statement.id).to.be("Empty statement");
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

                it("should be has correct init", () => {
                    test_initializer(symbol.expression.initializer, test_case.init, streamer);
                });

                it("should be has correct condition", () => {
                    test_condition(symbol.expression.condition, test_case.condition, streamer);
                });

                it("should be has correct update", () => {
                    test_case.update(symbol.expression.update, streamer);
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
