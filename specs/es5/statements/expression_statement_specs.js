/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement_specs.js
* Created at  : 2019-02-22
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
      parser          = require("../../../src/es5/parser.js"),
      precedence_enum = require("../../../src/es5/enums/precedence_enum"),
      test_substring  = require("../../helpers/test_substring");

describe("Expression statement >", () => {
    const test_cases = [
        // null
        {
            code       : "null",
            source     : "null",
            expression : expression => {
                expect(expression.id).to.be("Null literal");
                expect(expression.value).to.be("null");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // true
        {
            code       : "true",
            source     : "true",
            expression : expression => {
                expect(expression.id).to.be("Boolean literal");
                expect(expression.value).to.be("true");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // false
        {
            code       : "false",
            source     : "false",
            expression : expression => {
                expect(expression.id).to.be("Boolean literal");
                expect(expression.value).to.be("false");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // undefined
        {
            code       : "undefined",
            source     : "undefined",
            expression : expression => {
                expect(expression.id).to.be("Undefined literal");
                expect(expression.value).to.be("undefined");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // identifier
        {
            code       : "identifier",
            source     : "identifier",
            expression : expression => {
                expect(expression.id).to.be("Identifier");
                expect(expression.value).to.be("identifier");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // 3.14
        {
            code       : "3.14",
            source     : "3.14",
            expression : expression => {
                expect(expression.id).to.be("Numeric literal");
                expect(expression.value).to.be("3.14");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // null \n null
        {
            code       : "null",
            source     : "null \n null",
            expression : expression => {
                expect(expression.id).to.be("Null literal");
                expect(expression.value).to.be("null");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // true \n false
        {
            code       : "true",
            source     : "true \n false",
            expression : expression => {
                expect(expression.id).to.be("Boolean literal");
                expect(expression.value).to.be("true");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // id \n something
        {
            code       : "id",
            source     : "id \n something",
            expression : expression => {
                expect(expression.id).to.be("Identifier");
                expect(expression.value).to.be("id");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // 3.14 \n something
        {
            code       : "3.14",
            source     : "3.14 \n something",
            expression : expression => {
                expect(expression.id).to.be("Numeric literal");
                expect(expression.value).to.be("3.14");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // id = value \n something
        {
            code       : "id = value",
            source     : "id = value \n something",
            expression : (expression, streamer) => {
                expect(expression.id).to.be("Assignment operator");

                expect(expression.left.id).to.be("Identifier");
                expect(expression.left.value).to.be("id");

                expect(expression.right.id).to.be("Identifier");
                expect(expression.right.value).to.be("value");

                expect(
                    streamer.substring_from_token(expression)
                ).to.be("id = value");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // /* pre comment */ id = value /* post comment */;
        {
            code       : "id = value /* post comment */;",
            source     : "/* pre comment */ id = value /* post comment */;",
            offset     : "/* pre comment */ ".length,
            expression : (expression, streamer) => {
                expect(expression.id).to.be("Assignment operator");

                expect(expression.left.id).to.be("Identifier");
                expect(expression.left.value).to.be("id");

                expect(expression.right.id).to.be("Identifier");
                expect(expression.right.value).to.be("value");

                expect(streamer.substring_from_token(expression)).to.be(
                    "id = value"
                );
            },
            terminator : (terminator, streamer) => {
                expect(terminator).not.to.be(null);
                expect(terminator.id).to.be("Delimiter");
                expect(terminator.type).to.be("Delimiter");
                expect(terminator.precedence).to.be(-1);
                expect(terminator.value).to.be(';');

                expect(terminator.pre_comment).not.to.be(null);
                test_substring("/* post comment */", streamer, terminator.pre_comment);
                test_substring(";", streamer, terminator);
            },
        },

        // id \n = \n value \n something
        {
            code       : "id \n = \n value",
            source     : "id \n = \n value \n something",
            expression : (expression, streamer) => {
                expect(expression.id).to.be("Assignment operator");

                expect(expression.left.id).to.be("Identifier");
                expect(expression.left.value).to.be("id");

                expect(expression.right.id).to.be("Identifier");
                expect(expression.right.value).to.be("value");

                expect(streamer.substring_from_token(expression)).to.be(
                    "id \n = \n value"
                );
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // 123 + num * 5.3 - 6 % true ** null
        {
            code       : "123 + num * 5.3 - 6\n /\n true ** null",
            source     : "123 + num * 5.3 - 6\n /\n true ** null",
            expression : (expression, streamer) => {
                expect(expression.id).to.be("Arithmetic operator");
                expect(expression.operator.value).to.be("-");

                // Left
                expect(expression.left.id).to.be("Arithmetic operator");
                expect(expression.left.operator.value).to.be("+");
                expect(
                    streamer.substring_from_token(expression.left)
                ).to.be("123 + num * 5.3");

                // Left -> left
                expect(expression.left.left.id).to.be("Numeric literal");
                expect(expression.left.left.value).to.be("123");
                // Left -> right
                expect(expression.left.right.id).to.be("Arithmetic operator");
                expect(expression.left.right.operator.value).to.be("*");
                expect(
                    streamer.substring_from_token(expression.left.right)
                ).to.be("num * 5.3");
                // Left -> right -> left
                expect(expression.left.right.left.id).to.be("Identifier");
                expect(expression.left.right.left.value).to.be("num");
                // Left -> right -> right
                expect(expression.left.right.right.id).to.be("Numeric literal");
                expect(expression.left.right.right.value).to.be("5.3");

                // Right
                expect(expression.right.id).to.be("Arithmetic operator");
                expect(expression.right.operator.value).to.be("/");
                expect(
                    streamer.substring_from_token(expression.right)
                ).to.be("6\n /\n true ** null");
                // Right -> left
                expect(expression.right.left.id).to.be("Numeric literal");
                expect(expression.right.left.value).to.be("6");
                // Right -> right
                expect(expression.right.right.id).to.be("Exponentiation operator");
                expect(expression.right.right.operator.value).to.be("**");
                expect(
                    streamer.substring_from_token(expression.right.right)
                ).to.be("true ** null");
                // Right -> right -> left
                expect(expression.right.right.left.id).to.be("Boolean literal");
                expect(expression.right.right.left.value).to.be("true");
                // Right -> right -> right
                expect(expression.right.right.right.id).to.be("Null literal");

                // Full expression
                expect(
                    streamer.substring_from_token(expression)
                ).to.be("123 + num * 5.3 - 6\n /\n true ** null");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },
    ];

    test_cases.forEach(test_case => {
        const text = test_case.source.replace(/\n/g, "\\n");
        describe(`Test against source text '${ text }'`, () => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.generate_next_node();
            } catch (e) {}

            it("should be Expression statement", () => {
                expect(node.id).to.be("Expression statement");
                expect(node.type).to.be("Statement");
                expect(node.precedence).to.be(precedence_enum.STATEMENT);
            });

            it("should be has correct expression", () => {
                test_case.expression(node.expression, streamer);
            });

            it("should be has correct terminator", () => {
                test_case.terminator(node.terminator, streamer);
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
