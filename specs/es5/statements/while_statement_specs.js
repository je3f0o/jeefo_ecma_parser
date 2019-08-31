/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : while_statement_specs.js
* Created at  : 2019-02-21
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

const expect                   = require("expect.js"),
      UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception"),
      parser                   = require("../parser.js"),
      test_keyword             = require("../../helpers/test_keyword"),
      test_delimiter           = require("../../helpers/test_delimiter"),
      test_substring           = require("../../helpers/test_substring"),
      precedence_enum          = require("../../../src/es5/enums/precedence_enum");

describe("While statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // while (true);
            {
                code   : "while (true);",
                source : "while (true);",

                keyword : (node, streamer) => {
                    test_keyword("while", null, node, streamer);
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
            },

            // while (true) /*comment*/ a /*comment*/\nb
            {
                code   : "while (true) /*comment*/ a",
                source : "while (true) /*comment*/ a /*comment*/\nb",

                keyword : (node, streamer) => {
                    test_keyword("while", null, node, streamer);
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
            },

            // /*a*/while/*b*/(/*c*/true/*d*/)/*e*/;
            {
                code   : "while/*b*/(/*c*/true/*d*/)/*e*/;",
                source : "/*a*/while/*b*/(/*c*/true/*d*/)/*e*/;",
                offset : "/*a*/".length,

                keyword : (node, streamer) => {
                    test_keyword("while", "/*a*/", node, streamer);
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
                } catch (e) {
                    console.log(e);
                    process.exit();
                    }

                it("should be While statement", () => {
                    expect(node.id).to.be("While statement");
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
                    let index = (test_case.offset || 0);
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
            // while
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

            // while ;
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

            // while /* comment */ a
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

            // while ()
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

            // while (/* comment */)
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

            // while (false
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

            // while (false)
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
