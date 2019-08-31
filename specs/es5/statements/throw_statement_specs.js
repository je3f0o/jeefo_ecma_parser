/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : throw_statement_specs.js
* Created at  : 2019-04-02
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
    test_source,
    test_keyword,
    test_substring,
    test_delimiter
} = require("../../helpers");

describe("Throw statement >", () => {
    const test = test_cases => {
        test_cases.forEach(test_case => test_source(test_case.source, () => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(precedence_enum.TERMINATION);
            } catch (e) {}

            it("should be Return statement", () => {
                expect(node.id).to.be("Throw statement");
                expect(node.type).to.be("Statement");
                expect(node.precedence).to.be(precedence_enum.STATEMENT);
            });

            it("should be has correct keyword", () => {
                test_case.keyword(node.keyword, streamer);
            });

            it("should be has correct expression", () => {
                test_case.expression(node.expression, streamer);
            });

            it("should be has correct terminator", () => {
                test_case.terminator(node.terminator, streamer);
            });

            test_range(test_case, node, streamer);
        }));
    };

    describe("Semicolon terminated >", () => {
        test([
            // throw 123;
            {
                code   : "throw 123;",
                source : "throw 123;",

                keyword : (node, streamer) => {
                    test_keyword("throw", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring("123", streamer, node);
                },
                terminator : (node, streamer) => {
                    test_delimiter(';', null, node, streamer);
                }
            },

            // throw /*a*/ a + b + c /*b*/;
            {
                code   : "throw /*a*/ a + b + c /*b*/;",
                source : "throw /*a*/ a + b + c /*b*/;",

                keyword : (node, streamer) => {
                    test_keyword("throw", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring("a + b + c", streamer, node);
                },
                terminator : (node, streamer) => {
                    test_delimiter(';', "/*b*/", node, streamer);
                }
            },
        ]);
    });

    describe("Automatic semicolon insertion >", () => {
        test([
            // throw
            {
                code   : "throw 123",
                source : "throw 123",

                keyword : (node, streamer) => {
                    test_keyword("throw", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring("123", streamer, node);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },

            // throw 1 + 2\n;
            {
                code   : "throw 1 + 2",
                source : "throw 1 + 2\n;",

                keyword : (keyword, streamer) => {
                    test_keyword("throw", null, keyword, streamer);
                },
                expression : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring("1 + 2", streamer, node);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },

            // throw 1\n +\n 2\n;
            {
                code   : "throw 1\n +\n 2",
                source : "throw 1\n +\n 2\n;",

                keyword : (node, streamer) => {
                    test_keyword("throw", null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring("1\n +\n 2", streamer, node);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },
        ]);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // throw
            {
                source : "throw",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // throw;
            {
                source : "throw;",
                error : error => {
                    it("should be throw: Unexpected token", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be has token value: ;", () => {
                        expect(error.token.value).to.be(";");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // throw\n 123;
            {
                source : "throw\n 123;",
                error : error => {
                    it("should be throw: Illegal newline after throw", () => {
                        expect(error.message).to.be("Illegal newline after throw");
                    });

                    it("should be has token value: 123", () => {
                        expect(error.token.value).to.be("123");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },
        ];

        error_test_cases.forEach(test_case => {
            test_source(test_case.source, () => {
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
