/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : return_statement_specs.js
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

const expect          = require("expect.js"),
      parser          = require("../parser.js"),
      test_keyword    = require("../../helpers/test_keyword"),
      test_substring  = require("../../helpers/test_substring"),
      test_delimiter  = require("../../helpers/test_delimiter"),
      precedence_enum = require("../../../src/es5/enums/precedence_enum");

describe("Return statement >", () => {
    const test = test_cases => {
        test_cases.forEach(test_case => {
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

                it("should be Return statement", () => {
                    expect(node.id).to.be("Return statement");
                    expect(node.type).to.be("Statement");
                    expect(node.precedence).to.be(40);
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

                it(`should be in correct range`, () => {
                    const last_index = test_case.code.length - 1;

                    test_substring(test_case.code, streamer, node);
                    expect(streamer.get_current_character()).to.be(
                        test_case.source.charAt(last_index)
                    );
                    expect(streamer.cursor.position.index).to.be(last_index);
                });
            });
        });
    };

    describe("Semicolon terminated >", () => {
        test([
            // return;
            {
                code   : "return;",
                source : "return;",

                keyword : (keyword, streamer) => {
                    test_keyword("return", null, keyword, streamer);
                },
                expression : expression => {
                    expect(expression).to.be(null);
                },
                terminator : (terminator, streamer) => {
                    test_delimiter(';', null, terminator, streamer);
                }
            },

            // return /*a*/ a + b + c /*b*/;
            {
                code   : "return /*a*/ a + b + c /*b*/;",
                source : "return /*a*/ a + b + c /*b*/;",

                keyword : (keyword, streamer) => {
                    test_keyword("return", null, keyword, streamer);
                },
                expression : (expression, streamer) => {
                    expect(expression).not.to.be(null);
                    test_substring("a + b + c", streamer, expression);
                },
                terminator : (terminator, streamer) => {
                    test_delimiter(';', "/*b*/", terminator, streamer);
                }
            },
        ]);
    });

    describe("Automatic semicolon insertion >", () => {
        test([
            // return
            {
                code   : "return",
                source : "return",

                keyword : (keyword, streamer) => {
                    test_keyword("return", null, keyword, streamer);
                },
                expression : expression => {
                    expect(expression).to.be(null);
                },
                terminator : terminator => {
                    expect(terminator).to.be(null);
                }
            },

            // return\n 1 + 2;
            {
                code   : "return",
                source : "return\n 1 + 2;",

                keyword : (keyword, streamer) => {
                    test_keyword("return", null, keyword, streamer);
                },
                expression : expression => {
                    expect(expression).to.be(null);
                },
                terminator : terminator => {
                    expect(terminator).to.be(null);
                }
            },

            // return 1\n +\n 2\n;
            {
                code   : "return 1\n +\n 2",
                source : "return 1\n +\n 2\n;",

                keyword : (keyword, streamer) => {
                    test_keyword("return", null, keyword, streamer);
                },
                expression : (expression, streamer) => {
                    expect(expression).not.to.be(null);
                    test_substring("1\n +\n 2", streamer, expression);
                },
                terminator : terminator => {
                    expect(terminator).to.be(null);
                }
            },
        ]);
    });
});
