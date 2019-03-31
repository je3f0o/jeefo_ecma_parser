/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement_specs.js
* Created at  : 2019-02-22
* Updated at  : 2019-03-31
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const expect          = require("expect.js"),
      parser          = require("../../../src/es5/parser.js"),
      precedence_enum = require("../../../src/es5/enums/precedence_enum"),
      test_substring  = require("../../helpers/test_substring");

describe("Expression statement >", () => {
    const test_cases = [
        // {{{1 null
        {
            code       : "null",
            source     : "null",
            expression : expression => {
                expect(expression.id).to.be("Null literal");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 true
        {
            code       : "true",
            source     : "true",
            expression : expression => {
                expect(expression.id).to.be("Boolean literal");
                expect(expression.token.value).to.be("true");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 false
        {
            code       : "false",
            source     : "false",
            expression : expression => {
                expect(expression.id).to.be("Boolean literal");
                expect(expression.token.value).to.be("false");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 undefined
        {
            code       : "undefined",
            source     : "undefined",
            expression : expression => {
                expect(expression.id).to.be("Undefined literal");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 identifier
        {
            code       : "identifier",
            source     : "identifier",
            expression : expression => {
                expect(expression.id).to.be("Identifier");
                expect(expression.token.value).to.be("identifier");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 3.14
        {
            code       : "3.14",
            source     : "3.14",
            expression : expression => {
                expect(expression.id).to.be("Numeric literal");
                expect(expression.token.value).to.be("3.14");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 null \n null
        {
            code       : "null",
            source     : "null \n null",
            expression : expression => {
                expect(expression.id).to.be("Null literal");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 true \n false
        {
            code       : "true",
            source     : "true \n false",
            expression : expression => {
                expect(expression.id).to.be("Boolean literal");
                expect(expression.token.value).to.be("true");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 id \n something
        {
            code       : "id",
            source     : "id \n something",
            expression : expression => {
                expect(expression.id).to.be("Identifier");
                expect(expression.token.value).to.be("id");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 3.14 \n something
        {
            code       : "3.14",
            source     : "3.14 \n something",
            expression : expression => {
                expect(expression.id).to.be("Numeric literal");
                expect(expression.token.value).to.be("3.14");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 id = value \n something
        {
            code       : "id = value",
            source     : "id = value \n something",
            expression : (expression, streamer) => {
                expect(expression.id).to.be("Assignment operator");

                expect(expression.left.id).to.be("Identifier");
                expect(expression.left.token.value).to.be("id");

                expect(expression.right.id).to.be("Identifier");
                expect(expression.right.token.value).to.be("value");

                expect(streamer.substring_from_token(expression)).to.be("id = value");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 /* pre comment */ id = value /* post comment */;
        {
            code       : "/* pre comment */ id = value /* post comment */;",
            source     : "/* pre comment */ id = value /* post comment */;",
            expression : (expression, streamer) => {
                expect(expression.id).to.be("Assignment operator");

                expect(expression.left.id).to.be("Identifier");
                expect(expression.left.token.value).to.be("id");

                expect(expression.right.id).to.be("Identifier");
                expect(expression.right.token.value).to.be("value");

                expect(streamer.substring_from_token(expression)).to.be("/* pre comment */ id = value");
            },
            terminator : (terminator, streamer) => {
                expect(terminator).not.to.be(null);
                expect(terminator.id).to.be("Delimiter");
                expect(terminator.type).to.be("Delimiter");
                expect(terminator.precedence).to.be(-1);
                expect(terminator.token.value).to.be(';');

                expect(terminator.pre_comment).not.to.be(null);
                test_substring("/* post comment */", streamer, terminator.pre_comment);
                test_substring("/* post comment */;", streamer, terminator);
            },
        },

        // {{{1 id \n = \n value \n something
        {
            code       : "id \n = \n value",
            source     : "id \n = \n value \n something",
            expression : (expression, streamer) => {
                expect(expression.id).to.be("Assignment operator");

                expect(expression.left.id).to.be("Identifier");
                expect(expression.left.token.value).to.be("id");

                expect(expression.right.id).to.be("Identifier");
                expect(expression.right.token.value).to.be("value");

                expect(streamer.substring_from_token(expression)).to.be("id \n = \n value");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },

        // {{{1 123 + num * 5.3 - 6 % true ** null
        {
            code       : "123 + num * 5.3 - 6 % true ** null",
            source     : "123 + num * 5.3 - 6 % true ** null",
            expression : (expression, streamer) => {
                expect(expression.id).to.be("Arithmetic operator");
                expect(expression.operator).to.be("-");

                // Left
                expect(expression.left.id).to.be("Arithmetic operator");
                expect(expression.left.operator).to.be("+");
                expect(streamer.substring_from_token(expression.left)).to.be("123 + num * 5.3");

                // Left -> left
                expect(expression.left.left.id).to.be("Numeric literal");
                expect(expression.left.left.token.value).to.be("123");
                // Left -> right
                expect(expression.left.right.id).to.be("Arithmetic operator");
                expect(expression.left.right.operator).to.be("*");
                expect(streamer.substring_from_token(expression.left.right)).to.be("num * 5.3");
                // Left -> right -> left
                expect(expression.left.right.left.id).to.be("Identifier");
                expect(expression.left.right.left.token.value).to.be("num");
                // Left -> right -> right
                expect(expression.left.right.right.id).to.be("Numeric literal");
                expect(expression.left.right.right.token.value).to.be("5.3");

                // Right
                expect(expression.right.id).to.be("Arithmetic operator");
                expect(expression.right.operator).to.be("%");
                expect(streamer.substring_from_token(expression.right)).to.be("6 % true ** null");
                // Right -> left
                expect(expression.right.left.id).to.be("Numeric literal");
                expect(expression.right.left.token.value).to.be("6");
                // Right -> right
                expect(expression.right.right.id).to.be("Exponentiation operator");
                expect(expression.right.right.operator).to.be("**");
                expect(streamer.substring_from_token(expression.right.right)).to.be("true ** null");
                // Right -> right -> left
                expect(expression.right.right.left.id).to.be("Boolean literal");
                expect(expression.right.right.left.token.value).to.be("true");
                // Right -> right -> right
                expect(expression.right.right.right.id).to.be("Null literal");

                // Full expression
                expect(streamer.substring_from_token(expression)).to.be("123 + num * 5.3 - 6 % true ** null");
            },
            terminator : terminator => {
                expect(terminator).to.be(null);
            },
        },
        // }}}1
    ];

    test_cases.forEach(test_case => {
        describe(`Test against source text '${ test_case.source.replace(/\n/g, "\\n") }'`, () => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let symbol;
            try {
                symbol = parser.next_symbol_definition.generate_new_symbol(parser);
            } catch (e) {}

            it("should be Expression statement", () => {
                expect(symbol.id).to.be("Expression statement");
                expect(symbol.type).to.be("Statement");
                expect(symbol.precedence).to.be(precedence_enum.STATEMENT);
            });

            it("should be has correct expression", () => {
                test_case.expression(symbol.expression, streamer);
            });

            it("should be has correct terminator", () => {
                test_case.terminator(symbol.terminator, streamer);
            });

            it(`cursor index should be move ${ test_case.code.length } characters to right`, () => {
                const last_index = test_case.code.length - 1;
                expect(streamer.get_current_character()).to.be(test_case.source.charAt(last_index));
                expect(streamer.cursor.index).to.be(last_index);
            });

            it(`should be in correct range`, () => {
                expect(streamer.substring_from_token(symbol)).to.be(test_case.code);
            });
        });
    });
});
