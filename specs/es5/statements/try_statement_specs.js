/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : try_statement_specs.js
* Created at  : 2019-02-21
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

describe("Try statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // try {} catch (e) {}
            {
                code   : "try {} catch (e) {}",
                source : "try {} catch (e) {}",
                keyword : (node, streamer) => {
                    test_keyword("try", null, node, streamer);
                },
                block : (node, streamer) => {
                    expect(node.id).to.be("Block statement");
                    test_substring("{}", streamer, node);
                },
                handler : (node, streamer) => {
                    expect(node.id).to.be("Catch block");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(-1);

                    test_keyword("catch", null, node.keyword, streamer);

                    // Parameter
                    expect(node.parameter).not.to.be(null);
                    expect(node.parameter.id).to.be("Identifier");
                    expect(node.parameter.value).to.be('e');
                    test_substring("e", streamer, node.parameter);

                    // parenthesis
                    test_delimiter("(", null, node.open_parenthesis, streamer);
                    test_delimiter(")", null, node.close_parenthesis, streamer);

                    // Block
                    expect(node.block.id).to.be("Block statement");

                    test_substring("catch (e) {}", streamer, node);
                },
                finalizer : statement => {
                    expect(statement).to.be(null);
                }
            },

            // try {} finally {},
            {
                code   : "try {} finally {}",
                source : "try {} finally {}",
                keyword : (node, streamer) => {
                    test_keyword("try", null, node, streamer);
                },
                block : (node, streamer) => {
                    expect(node.id).to.be("Block statement");
                    test_substring("{}", streamer, node);
                },
                handler : node => {
                    expect(node).to.be(null);
                },
                finalizer : (node, streamer) => {
                    expect(node.id).to.be("Finally block");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(-1);

                    test_keyword("finally", null, node.keyword, streamer);

                    test_substring("finally {}", streamer, node);
                }
            },

            // try {} catch (e) {} finally {},
            {
                code   : "try {} catch (e) {} finally {}",
                source : "try {} catch (e) {} finally {}",
                keyword : (node, streamer) => {
                    test_keyword("try", null, node, streamer);
                },
                block : (node, streamer) => {
                    expect(node.id).to.be("Block statement");
                    test_substring("{}", streamer, node);
                },
                handler : (node, streamer) => {
                    expect(node.id).to.be("Catch block");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(-1);

                    test_keyword("catch", null, node.keyword, streamer);

                    // Parameter
                    expect(node.parameter).not.to.be(null);
                    expect(node.parameter.id).to.be("Identifier");
                    expect(node.parameter.value).to.be('e');
                    test_substring("e", streamer, node.parameter);

                    // parenthesis
                    test_delimiter("(", null, node.open_parenthesis, streamer);
                    test_delimiter(")", null, node.close_parenthesis, streamer);

                    // Block
                    expect(node.block.id).to.be("Block statement");

                    test_substring("catch (e) {}", streamer, node);
                },
                finalizer : (node, streamer) => {
                    expect(node.id).to.be("Finally block");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(-1);

                    test_keyword("finally", null, node.keyword, streamer);

                    test_substring("finally {}", streamer, node);
                }
            },

            // /*a*/try/*b*/{}/*c*/catch/*d*/(/*e*/e/*f*/)/*g*/{}/*h*/finally/*i*/{}
            {
                code   : "try/*b*/{}/*c*/catch/*d*/(/*e*/e/*f*/)/*g*/{}/*h*/finally/*i*/{}",
                source : "/*a*/try/*b*/{}/*c*/catch/*d*/(/*e*/e/*f*/)/*g*/{}/*h*/finally/*i*/{}",
                offset : "/*a*/".length,

                keyword : (node, streamer) => {
                    test_keyword("try", "/*a*/", node, streamer);
                },
                block : (node, streamer) => {
                    expect(node.id).to.be("Block statement");
                    test_substring("{}", streamer, node);
                },
                handler : (node, streamer) => {
                    expect(node.id).to.be("Catch block");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(-1);

                    test_keyword("catch", "/*c*/", node.keyword, streamer);

                    // Parameter
                    expect(node.parameter).not.to.be(null);
                    expect(node.parameter.id).to.be("Identifier");
                    expect(node.parameter.value).to.be('e');
                    test_substring("e", streamer, node.parameter);

                    // open parenthesis
                    test_delimiter("(", "/*d*/", node.open_parenthesis, streamer);
                    test_delimiter(")", "/*f*/", node.close_parenthesis, streamer);

                    // Block
                    expect(node.block.id).to.be("Block statement");

                    test_substring("catch/*d*/(/*e*/e/*f*/)/*g*/{}", streamer, node);
                },
                finalizer : (node, streamer) => {
                    expect(node.id).to.be("Finally block");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(-1);

                    test_keyword("finally", "/*h*/", node.keyword, streamer);

                    test_substring("finally/*i*/{}", streamer, node);
                }
            }
        ];

        test_for_each(valid_test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(precedence_enum.TERMINATION);
            } catch (e) {}

            test_statement(node, "Try");

            it("should be has correct keyword", () => {
                test_case.keyword(node.keyword, streamer);
            });

            it("should be has correct Block statement", () => {
                test_case.block(node.block, streamer);
            });

            it("should be has correct handler", () => {
                test_case.handler(node.handler, streamer);
            });

            it("should be has correct finalizer", () => {
                test_case.finalizer(node.finalizer, streamer);
            });

            test_range(test_case, node, streamer);
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // try
            {
                source : "try",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // try {}
            {
                source : "try {}",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // try /*c*/ a
            {
                source : "try /*c*/ a",
                error : error => {
                    it("should be throw: Expected { instead saw: a", () => {
                        expect(error.message).to.be("Expected { instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // try {} /*c*/ a
            {
                source : "try {} /*c*/ a",
                error : error => {
                    it("should be throw: Expected catch or finally after try instead saw: a", () => {
                        expect(error.message).to.be("Expected catch or finally after try instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // try {} catch
            {
                source : "try {} catch",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // try {} catch /*c*/ a
            {
                source : "try {} catch /*c*/ a",
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

            // try {} catch (/* comment */)
            {
                source : "try {} catch (/* comment */)",
                error : error => {
                    it("should be throw: Missing identifier", () => {
                        expect(error.message).to.be("Missing identifier");
                    });

                    it("should be has token value: )", () => {
                        expect(error.token.value).to.be(")");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // try {} catch (e)
            {
                source : "try {} catch (e)",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // try {} catch (e) /*c*/ a
            {
                source : "try {} catch (e) /*c*/ a",
                error : error => {
                    it("should be throw: Expected { instead saw: a", () => {
                        expect(error.message).to.be("Expected { instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // try {} finally
            {
                source : "try {} finally",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // try {} finally /*c*/ a
            {
                source : "try {} finally /*c*/ a",
                error : error => {
                    it("should be throw: Expected { instead saw: a", () => {
                        expect(error.message).to.be("Expected { instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // try {} catch (e) {} finally /*c*/ a
            {
                source : "try {} catch (e) {} finally /*c*/ a",
                error : error => {
                    it("should be throw: Expected { instead saw: a", () => {
                        expect(error.message).to.be("Expected { instead saw: a");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            }
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
