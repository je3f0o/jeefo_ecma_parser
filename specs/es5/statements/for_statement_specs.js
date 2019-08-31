/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement_specs.js
* Created at  : 2019-03-16
* Updated at  : 2019-08-08
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
const parser          = require("../parser.js");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

const {
    test_range,
    test_keyword,
    test_substring,
    test_delimiter
} = require("../../helpers");

describe("For statement >", () => {
    describe("Valid cases >", () => {
        function test_expression_no_in (string, node, streamer) {
            expect(node.id).to.be("Expression no in");
            expect(node.type).to.be("Expression");
            expect(node.precedence).to.be(-1);

            test_substring(string, streamer, node);
        }

        function test_variable_declaration (string, node, streamer) {
            expect(node.id).to.be("Variable declaration list no in");
            expect(node.type).to.be("Declaration");
            expect(node.precedence).to.be(-1);

            test_substring(string, streamer, node);
        }

        function test_condition (string, node, streamer) {
            expect(node.id).to.be("For expression's condition");
            expect(node.type).to.be("Expression");
            expect(node.precedence).to.be(-1);

            test_substring(string, streamer, node);
        }

        const valid_test_cases = [
            // for (;;);
            {
                code   : "for (;;);",
                source : "for (;;);",

                keyword : (node, streamer) => {
                    test_keyword("for", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For expression no in");
                    expect(node.type).to.be("Expression");
                    expect(node.precedence).to.be(-1);

                    test_expression_no_in(';', node.initializer, streamer);
                    test_condition(";", node.condition, streamer);
                    expect(node.update).to.be(null);

                    test_substring(";;", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', null, node, streamer);
                },

                statement : statement => expect(statement.id).to.be("Empty statement")
            },

            // for (i = 0; x < 5; i += 1);
            {
                code   : "for (i = 0; i < 5; i += 1);",
                source : "for (i = 0; i < 5; i += 1);",

                keyword : (node, streamer) => {
                    test_keyword("for", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For expression no in");
                    expect(node.type).to.be("Expression");
                    expect(node.precedence).to.be(-1);

                    test_expression_no_in("i = 0;", node.initializer, streamer);
                    test_condition("i < 5;", node.condition, streamer);
                    test_substring("i += 1", streamer, node.update);

                    test_substring("i = 0; i < 5; i += 1", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', null, node, streamer);
                },

                statement : statement => expect(statement.id).to.be("Empty statement")
            },

            // for (/*a*/;/*b*/;/*c*/);
            {
                code   : "for (/*a*/;/*b*/;/*c*/);",
                source : "for (/*a*/;/*b*/;/*c*/);",

                keyword : (node, streamer) => {
                    test_keyword("for", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For expression no in");
                    expect(node.type).to.be("Expression");
                    expect(node.precedence).to.be(-1);

                    test_expression_no_in(";", node.initializer, streamer);
                    test_condition(";", node.condition, streamer);
                    expect(node.update).to.be(null);

                    test_substring(";/*b*/;", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', "/*c*/", node, streamer);
                },

                statement : statement => expect(statement.id).to.be("Empty statement")
            },

            // for (0 /*a*/; 0 /*b*/; 0 /*c*/);
            {
                code   : "for (0 /*a*/; 0 /*b*/; 0 /*c*/);",
                source : "for (0 /*a*/; 0 /*b*/; 0 /*c*/);",

                keyword : (node, streamer) => {
                    test_keyword("for", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For expression no in");
                    expect(node.type).to.be("Expression");
                    expect(node.precedence).to.be(-1);

                    test_expression_no_in("0 /*a*/;", node.initializer, streamer);
                    test_condition("0 /*b*/;", node.condition, streamer);
                    test_substring("0", streamer, node.update);

                    test_substring("0 /*a*/; 0 /*b*/; 0", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', "/*c*/", node, streamer);
                },

                statement : statement => expect(statement.id).to.be("Empty statement")
            },

            // /*pre*/for/*a*/(/*b*/i=0/*c*/;/*d*/i<5/*e*/;/*f*/i+=1/*k*/)/*comment*/;;
            {
                code   : "for/*a*/(/*b*/i=0/*c*/;/*d*/i<5/*e*/;/*f*/i+=1/*k*/)/*comment*/;",
                source : "/*pre*/for/*a*/(/*b*/i=0/*c*/;/*d*/i<5/*e*/;/*f*/i+=1/*k*/)/*comment*/;;",
                offset : "/*pre*/".length,

                keyword : (node, streamer) => {
                    test_keyword("for", "/*pre*/", node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', "/*a*/", node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For expression no in");
                    expect(node.type).to.be("Expression");
                    expect(node.precedence).to.be(-1);

                    test_expression_no_in("i=0/*c*/;", node.initializer, streamer);
                    test_condition("i<5/*e*/;", node.condition, streamer);
                    test_substring("i+=1", streamer, node.update);

                    test_substring("i=0/*c*/;/*d*/i<5/*e*/;/*f*/i+=1", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', "/*k*/", node, streamer);
                },

                statement : (statement, streamer) => {
                    test_substring(";", streamer, statement);
                }
            },

            // for (var i = 0;;);
            {
                code   : "for (var i = 0;;);",
                source : "for (var i = 0;;);",

                keyword : (node, streamer) => {
                    test_keyword("for", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For expression no in");
                    expect(node.type).to.be("Expression");
                    expect(node.precedence).to.be(-1);

                    test_variable_declaration(
                        "var i = 0;", node.initializer, streamer
                    );
                    test_condition(";", node.condition, streamer);
                    expect(node.update).to.be(null);

                    test_substring("var i = 0;;", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', null, node, streamer);
                },

                statement : statement => {
                    expect(statement.id).to.be("Empty statement");
                }
            },
        ];

        valid_test_cases.forEach(test_case => {
            const text = test_case.source.replace(/\n/g, "\\n");
            describe(`Test against source text '${ text }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                const streamer = parser.tokenizer.streamer;
                let node;
                try {
                    node = parser.parse_next_node(
                        precedence_enum.TERMINATION
                    );
                } catch (e) {}

                it("should be For statement", () => {
                    expect(node.id).to.be("For statement");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(40);
                });

                it("should be has correct keyword", () => {
                    test_case.keyword(node.keyword, streamer);
                });

                it("should be has correct open_parenthesis", () => {
                    test_case.open(node.open_parenthesis, streamer);
                });

                it("should be has correct expression", () => {
                    test_case.expression(node.expression, streamer);
                });

                it("should be has correct close_parenthesis", () => {
                    test_case.close(node.close_parenthesis, streamer);
                });

                it("should be has correct statement", () => {
                    test_case.statement(node.statement, streamer);
                });

                test_range(test_case, node, streamer);
            });
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // for
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

            // for a
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

            // for (
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

            // for (;
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

            // for (;;
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

            // for (;;)
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

            // for (/*comment*/)
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

            // for (x = a in b;
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

            // for (var x = a in b;
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
        ];

        error_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source }'`, () => {
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
