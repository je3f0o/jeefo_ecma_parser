/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : switch_statement_specs.js
* Created at  : 2019-04-02
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

const expect                   = require("expect.js");
const UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception");
const parser                   = require("../parser.js");
const test_keyword             = require("../../helpers/test_keyword");
const test_delimiter           = require("../../helpers/test_delimiter");
const test_substring           = require("../../helpers/test_substring");
const precedence_enum          = require("../../../src/es5/enums/precedence_enum");

describe("Switch statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // switch (a) {}
            {
                code   : "switch (a) {}",
                source : "switch (a) {}",

                keyword : (node, streamer) => {
                    test_keyword("switch", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("a", streamer, node);
                },
                case_block : (node, streamer) => {
                    expect(node.id).to.be("Case block");
                    expect(node.case_clauses.length).to.be(0);
                    test_substring("{}", streamer, node);
                },
            },

            // switch (a) { case a : case b : ; default: ; case c : }
            {
                code   : "switch (a) { case a : case b : ; default: ; case c : }",
                source : "switch (a) { case a : case b : ; default: ; case c : }",

                keyword : (node, streamer) => {
                    test_keyword("switch", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", null, node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("a", streamer, node);
                },
                case_block : (node, streamer) => {
                    expect(node.id).to.be("Case block");
                    expect(node.case_clauses.length).to.be(4);
                    test_substring("{ case a : case b : ; default: ; case c : }", streamer, node);
                },
            },

            // /*a*/switch/*b*/(/*c*/a/*d*/)/*e*/{/*f*/case/*g*/a/*h*/:/*k*/default/*l*/:/*m*/}
            {
                code   : "switch/*b*/(/*c*/a/*d*/)/*e*/{/*f*/case/*g*/a/*h*/:/*k*/default/*l*/:/*m*/}",
                source : "/*a*/switch/*b*/(/*c*/a/*d*/)/*e*/{/*f*/case/*g*/a/*h*/:/*k*/default/*l*/:/*m*/}",
                offset : "/*a*/".length,

                keyword : (node, streamer) => {
                    test_keyword("switch", "/*a*/", node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter("(", "/*b*/", node, streamer);
                },
                close : (node, streamer) => {
                    test_delimiter(")", "/*d*/", node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.type).to.be("Primitive");
                    test_substring("a", streamer, node);
                },
                case_block : (node, streamer) => {
                    expect(node.id).to.be("Case block");
                    expect(node.case_clauses.length).to.be(2);
                    test_substring("{/*f*/case/*g*/a/*h*/:/*k*/default/*l*/:/*m*/}", streamer, node);
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
                    node = parser.parse_next_node(precedence_enum.TERMINATION);
                } catch (e) {}

                it("should be Switch statement", () => {
                    expect(node.id).to.be("Switch statement");
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

                it("should be has correct case_block", () => {
                    test_case.case_block(node.case_block, streamer);
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
        return;
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
