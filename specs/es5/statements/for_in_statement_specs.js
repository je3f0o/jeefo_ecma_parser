/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_in_statement_specs.js
* Created at  : 2019-03-18
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

describe("For in statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // for (a in b);
            {
                code   : "for (a in b);",
                source : "for (a in b);",

                keyword : (node, streamer) => {
                    test_keyword("for", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For in expression");
                    expect(node.type).to.be("Expression");
                    expect(node.precedence).to.be(-1);

                    test_substring("a", streamer, node.identifier);
                    test_substring("in", streamer, node.in_operator);
                    test_substring("b", streamer, node.initializer);

                    test_substring("a in b", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', null, node, streamer);
                },

                statement : statement => expect(statement.id).to.be("Empty statement")
            },

            // /*a*/for/*b*/(/*c*/a/*d*/in/*e*/1+2/*f*/)/*comment*/;;,
            {
                code   : "for/*b*/(/*c*/a/*d*/in/*e*/1+2/*f*/)/*comment*/;",
                source : "/*a*/for/*b*/(/*c*/a/*d*/in/*e*/1+2/*f*/)/*comment*/;;",
                offset : "/*a*/".length,

                keyword : (node, streamer) => {
                    test_keyword("for", "/*a*/", node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', "/*b*/", node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For in expression");
                    expect(node.type).to.be("Expression");
                    expect(node.precedence).to.be(-1);

                    test_substring("a", streamer, node.identifier);
                    test_substring("in", streamer, node.in_operator);
                    test_substring("1+2", streamer, node.initializer);

                    test_substring("a/*d*/in/*e*/1+2", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', "/*f*/", node, streamer);
                },

                statement : (statement, streamer) => {
                    test_substring(";", streamer, statement);
                }
            },

            // for (var a in b in c);
            {
                code   : "for (var a in b in c);",
                source : "for (var a in b in c);",

                keyword : (node, streamer) => {
                    test_keyword("for", null, node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', null, node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For in variable declaration");
                    expect(node.type).to.be("Declaration");
                    expect(node.precedence).to.be(-1);

                    test_substring("var", streamer, node.keyword);
                    test_substring("a", streamer, node.identifier);
                    test_substring("in", streamer, node.in_operator);
                    test_substring("b in c", streamer, node.initializer);

                    test_substring("var a in b in c", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', null, node, streamer);
                },

                statement : statement => expect(statement.id).to.be("Empty statement")
            },

            // /*a*/for/*b*/(/*c*/var/*d*/a/*e*/in/*f*/1+2/*k*/)/*comment*/;;,
            {
                code   : "for/*b*/(/*c*/var/*d*/a/*e*/in/*f*/1+2/*k*/)/*comment*/;",
                source : "/*a*/for/*b*/(/*c*/var/*d*/a/*e*/in/*f*/1+2/*k*/)/*comment*/;;",
                offset : "/*a*/".length,

                keyword : (node, streamer) => {
                    test_keyword("for", "/*a*/", node, streamer);
                },
                open : (node, streamer) => {
                    test_delimiter('(', "/*b*/", node, streamer);
                },
                expression : (node, streamer) => {
                    expect(node.id).to.be("For in variable declaration");
                    expect(node.type).to.be("Declaration");
                    expect(node.precedence).to.be(-1);

                    test_substring("var", streamer, node.keyword);
                    test_substring("a", streamer, node.identifier);
                    test_substring("in", streamer, node.in_operator);
                    test_substring("1+2", streamer, node.initializer);

                    test_substring("var/*d*/a/*e*/in/*f*/1+2", streamer, node);
                },
                close : (node, streamer) => {
                    test_delimiter(')', "/*k*/", node, streamer);
                },

                statement : (statement, streamer) => {
                    test_substring(";", streamer, statement);
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
                    node = parser.parse_next_node(precedence_enum.TERMINATION);
                } catch (e) {}

                it("should be For statement", () => {
                    expect(node.id).to.be("For statement");
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

                it("should be has correct statement", () => {
                    test_case.statement(node.statement, streamer);
                });

                it(`should be in correct range`, () => {
                    let index = test_case.offset || 0;
                    index += test_case.code.length - 1;

                    expect(streamer.substring_from_token(node)).to.be(
                        test_case.code
                    );
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
            // for ('a' in Object
            {
                source : "for ('a' in Object",
                error : error => {
                    it("should be throw: Invalid left-hand side in for-loop", () => {
                        expect(error.message).to.be("Invalid left-hand side in for-loop");
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
