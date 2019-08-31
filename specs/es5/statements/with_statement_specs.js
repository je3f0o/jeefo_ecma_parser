/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : with_statement_specs.js
* Created at  : 2019-04-02
* Updated at  : 2019-08-07
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

const expect                   = require("expect.js");
const UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception");
const parser                   = require("../parser.js");
const test_keyword             = require("../../helpers/test_keyword");
const test_delimiter           = require("../../helpers/test_delimiter");
const test_substring           = require("../../helpers/test_substring");
const precedence_enum          = require("../../../src/es5/enums/precedence_enum");

describe("With statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // with (Math);
            {
                code   : "with (Math);",
                source : "with (Math);",

                keyword : (node, streamer) => {
                    test_keyword("with", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("Math", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
            },

            // with (Math) /*comment*/ a /*comment*/\nb
            {
                code   : "with (Math) /*comment*/ a",
                source : "with (Math) /*comment*/ a /*comment*/\nb",

                keyword : (node, streamer) => {
                    test_keyword("with", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("Math", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    expect(node.terminator).to.be(null);
                    test_substring("a", streamer, node);
                },
            },

            // /*a*/with/*b*/(/*c*/Math/*d*/)/*e*/;
            {
                code   : "with/*b*/(/*c*/Math/*d*/)/*e*/;",
                source : "/*a*/with/*b*/(/*c*/Math/*d*/)/*e*/;",
                offset : "/*a*/".length,

                keyword : (node, streamer) => {
                    test_keyword("with", "/*a*/", node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", "/*b*/", node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", "/*d*/", node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("Math", streamer, node);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
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

                it("should be With statement", () => {
                    expect(node.id).to.be("With statement");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(precedence_enum.STATEMENT);
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

                it("should be has correct Statement", () => {
                    test_case.statement(node.statement, streamer);
                });

                it(`should be in correct range`, () => {
                    let index = test_case.offset || 0;
                    index += test_case.code.length - 1;

                    test_substring(test_case.code, streamer, node);
                    expect(streamer.get_current_character()).to.be(
                        test_case.source.charAt(index)
                    );
                    expect(streamer.cursor.position.index).to.be(index);
                });
            });
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // with
            {
                source : "with",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // with ;
            {
                source : "with ;",
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

            // with /* comment */ a
            {
                source : "with /* comment */ a",
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

            // with ()
            {
                source : "with ()",
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

            // with (/* comment */)
            {
                source : "with (/* comment */)",
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

            // with (false
            {
                source : "with (false)",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // with (false)
            {
                source : "with (false)",
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
            const text = test_case.source;
            describe(`Test against source text '${ text }'`, () => {
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
