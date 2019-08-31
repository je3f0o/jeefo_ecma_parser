/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement_specs.js
* Created at  : 2019-02-20
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
    test_for_each,
    test_statement,
    test_substring,
    test_delimiter
} = require("../../helpers");

describe("If statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // if (true);
            {
                code   : "if (true);",
                source : "if (true);",

                keyword : (node, streamer) => {
                    test_keyword("if", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
                else_statement : node => {
                    expect(node).to.be(null);
                },
            },

            // if (true) /*comment*/ a /*comment*/\nb
            {
                code   : "if (true) /*comment*/ a",
                source : "if (true) /*comment*/ a /*comment*/\nb",

                keyword : (node, streamer) => {
                    test_keyword("if", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    expect(node.terminator).to.be(null);
                    test_substring("a", streamer, node);
                },
                else_statement : node => {
                    expect(node).to.be(null);
                },
            },

            // if (true); else if (false);
            {
                code   : "if (true); else if (false);",
                source : "if (true); else if (false);",

                keyword : (node, streamer) => {
                    test_keyword("if", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
                else_statement : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_keyword("else", null, node.keyword, streamer);

                    test_substring("if (false);", streamer, node.statement);
                    test_substring("else if (false);", streamer, node);
                },
            },

            // if (true); else;
            {
                code   : "if (true); else;",
                source : "if (true); else;",

                keyword : (node, streamer) => {
                    test_keyword("if", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
                else_statement : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_keyword("else", null, node.keyword, streamer);

                    test_substring(";", streamer, node.statement);
                    test_substring("else;", streamer, node);
                },
            },

            // /*a*/if/*b*/(/*c*/true/*d*/)/*e*/;/*f*/else/*g*/;
            {
                code   : "if/*b*/(/*c*/true/*d*/)/*e*/;/*f*/else/*g*/;",
                source : "/*a*/if/*b*/(/*c*/true/*d*/)/*e*/;/*f*/else/*g*/;",
                offset : "/*a*/".length,

                keyword : (node, streamer) => {
                    test_keyword("if", "/*a*/", node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", "/*b*/", node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", "/*d*/", node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("true", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
                else_statement : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_keyword("else", "/*f*/", node.keyword, streamer);

                    test_substring(";", streamer, node.statement);
                    test_substring("else/*g*/;", streamer, node);
                },
            },
        ];

        test_for_each(valid_test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(precedence_enum.TERMINATION);
            } catch (e) {}

            test_statement(node, "If");

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

            it("should be has correct Statement", () => {
                test_case.statement(node.statement, streamer);
            });

            it("should be has correct Else statement", () => {
                test_case.else_statement(node.else_statement, streamer);
            });

            test_range(test_case, node, streamer);
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // if
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

            // if ;
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

            // if /* comment */ a
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

            // if ()
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

            // if (/* comment */)
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

            // if (false)
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
        ];

        test_for_each(error_test_cases, test_case => {
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
