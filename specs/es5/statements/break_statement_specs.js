/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : break_statement_specs.js
* Created at  : 2019-03-01
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
      test_substring           = require("../../helpers/test_substring"),
      test_delimiter           = require("../../helpers/test_delimiter"),
      precedence_enum          = require("../../../src/es5/enums/precedence_enum");

describe("Break statement >", () => {
    const test = test_cases => {
        test_cases.forEach(test_case => {
            const text = test_case.source.replace(/\n/g, "\\n");
            describe(`Test against source text '${ text }'`, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                const streamer = parser.tokenizer.streamer;
                let node;
                try {
                    node = parser.parse_next_node(precedence_enum.TERMINATION);
                } catch (e) {}

                it("should be Break statement", () => {
                    expect(node.id).to.be("Break statement");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(40);
                });

                it("should be has correct keyword", () => {
                    test_case.keyword(node.keyword, streamer);
                });

                it("should be has correct identifier", () => {
                    test_case.identifier(node.identifier, streamer);
                });

                it("should be has correct terminator", () => {
                    test_case.terminator(node.terminator, streamer);
                });

                it(`should be in correct range`, () => {
                    const last_index = test_case.code.length - 1;

                    test_substring(test_case.code, streamer, node);
                    expect(streamer.get_current_character()).to.be(test_case.source.charAt(last_index));
                    expect(streamer.cursor.position.index).to.be(last_index);
                });
            });
        });
    };

    describe("Semicolon terminated >", () => {
        test([
            // break;
            {
                code   : "break;",
                source : "break;",

                keyword : (node, streamer) => {
                    test_keyword("break", null, node, streamer);
                },
                identifier : node => {
                    expect(node).to.be(null);
                },
                terminator : (node, streamer) => {
                    test_delimiter(';', null, node, streamer);
                }
            },

            // break /*a*/ label /*b*/;
            {
                code   : "break /*a*/ label /*b*/;",
                source : "break /*a*/ label /*b*/;",

                keyword : (node, streamer) => {
                    test_keyword("break", null, node, streamer);
                },
                identifier : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring("label", streamer, node);
                },
                terminator : (node, streamer) => {
                    test_delimiter(';', "/*b*/", node, streamer);
                }
            },
        ]);
    });

    describe("Automatic semicolon insertion >", () => {
        test([
            // break
            {
                code   : "break",
                source : "break",

                keyword : (node, streamer) => {
                    test_keyword("break", null, node, streamer);
                },
                identifier : node => {
                    expect(node).to.be(null);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },

            // break\n label;
            {
                code   : "break",
                source : "break\n label;",

                keyword : (node, streamer) => {
                    test_keyword("break", null, node, streamer);
                },
                identifier : node => {
                    expect(node).to.be(null);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },

            // break label\n;
            {
                code   : "break label",
                source : "break label\n;",

                keyword : (node, streamer) => {
                    test_keyword("break", null, node, streamer);
                },
                identifier : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring("label", streamer, node);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },
        ]);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // break 123;
            {
                source : "break 123;",
                error : error => {
                    it("should be throw: Expected an identifier instead saw: 123", () => {
                        expect(error.message).to.be("Expected an identifier instead saw: 123");
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
            const text = test_case.source.replace(/\n/g, "\\n");
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
