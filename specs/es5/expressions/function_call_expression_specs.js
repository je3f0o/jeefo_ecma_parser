/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression_specs.js
* Created at  : 2019-03-20
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

const expect          = require("expect.js");
const parser          = require("../parser.js");
const test_source     = require("../../helpers/test_source");
const test_substring  = require("../../helpers/test_substring");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

describe("Function call expression >", () => {
    describe("Valid cases >", () => {
        function test_callee (node, expectation, streamer) {
            expect(node).not.to.be(null);
            expect(node.id).to.be(expectation.id);
            expect(node.type).to.be(expectation.type);

            expectation.test(node, streamer);

            test_substring(expectation.str, streamer, node);
        }

        function test_open_parenthesis (node, expectation, streamer) {
            expect(node.id).to.be("Delimiter");
            expect(node.type).to.be("Delimiter");
            expectation.comment(node.pre_comment, streamer);
            test_substring(expectation.str, streamer, node);
        }
        const test_close_parenthesis = test_open_parenthesis;

        const valid_test_cases = [
            // fn()
            {
                code   : "fn()",
                source : "fn()",

                end : { char : ')', offset : 0 },

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                callee : {
                    id   : "Identifier",
                    str  : 'fn',
                    type : "Primitive",
                    test : () => {}
                },

                args       : 0,
                delimiters : 0
            },

            // fn(1, a, 'str', fn2());
            {
                code   : "fn(1, a, 'str', fn2())",
                source : "fn(1, a, 'str', fn2());",

                end : { char : ';', offset : 1 },

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                callee : {
                    id   : "Identifier",
                    str  : 'fn',
                    type : "Primitive",
                    test : () => {}
                },

                args       : 4,
                delimiters : 3
            },

            // (function (){})();
            {
                code   : "(function (){})()",
                source : "(function (){})();",

                end : { char : ';', offset : 1 },

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                callee : {
                    id   : "Grouping expression",
                    str  : "(function (){})",
                    type : "Expression",
                    test : () => {}
                },

                args       : 0,
                delimiters : 0
            },

            // !function (){}();
            {
                code   : "function (){}()",
                source : "!function (){}();",

                end : { char : ';', offset : 2 },

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                callee : {
                    id   : "Function expression",
                    str  : "function (){}",
                    type : "Expression",
                    test : () => {}
                },

                args       : 0,
                delimiters : 0
            },

            // fn()();
            {
                code   : "fn()()",
                source : "fn()();",

                end : { char : ';', offset : 1 },

                open : {
                    str     : "(",
                    comment : comment => expect(comment).to.be(null)
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                callee : {
                    id   : "Function call expression",
                    str  : "fn()",
                    type : "Expression",
                    test : () => {}
                },

                args       : 0,
                delimiters : 0
            },

            // /*pre*/fn/*a*/(/*b*/)
            {
                code   : "fn/*a*/(/*b*/)",
                source : "/*pre*/fn/*a*/(/*b*/)",

                end : { char : ')', offset : 7 },

                open : {
                    str     : "(",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*a*/", streamer, comment);
                    }
                },

                close : {
                    str     : ")",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*b*/", streamer, comment);
                    }
                },

                callee : {
                    id   : "Identifier",
                    str  : "fn",
                    type : "Primitive",
                    test : (node, streamer) => {
                        expect(node.id).to.be("Identifier");
                        expect(node.type).to.be("Primitive");
                        expect(node.pre_comment).not.to.be(null);
                        test_substring("/*pre*/", streamer, node.pre_comment);
                    }
                },

                args       : 0,
                delimiters : 0
            },

            // /*pre*/fn/*a*/(/*b*/b,/*c*/c)
            {
                code   : "fn/*a*/(/*b*/b,/*c*/c)",
                source : "/*pre*/fn/*a*/(/*b*/b,/*c*/c)",

                end : { char : ')', offset : 7 },

                open : {
                    str     : "(",
                    comment : (comment, streamer) => {
                        expect(comment).not.to.be(null);
                        test_substring("/*a*/", streamer, comment);
                    }
                },

                close : {
                    str     : ")",
                    comment : comment => expect(comment).to.be(null)
                },

                callee : {
                    id   : "Identifier",
                    str  : "fn",
                    type : "Primitive",
                    test : (node, streamer) => {
                        expect(node.id).to.be("Identifier");
                        expect(node.type).to.be("Primitive");
                        expect(node.pre_comment).not.to.be(null);
                        test_substring("/*pre*/", streamer, node.pre_comment);
                    }
                },

                args       : 2,
                delimiters : 1
            },
        ];

        valid_test_cases.forEach(test_case => {
            test_source(test_case.source, () => {
                parser.tokenizer.init(test_case.source);
                parser.prepare_next_state();

                let expr, node;
                const streamer = parser.tokenizer.streamer;
                try {
                    expr = parser.parse_next_node(precedence_enum.TERMINATION);
                    node = expr.expression;
                    if (node.id === "Logical not operator") {
                        node = node.expression;
                    }
                } catch (e) {}

                it("should be Function call expression", () => {
                    expect(node.id).to.be("Function call expression");
                    expect(node.type).to.be("Expression");
                    expect(node.precedence).to.be(
                        precedence_enum.FUNCTION_CALL
                    );
                });

                it("should be has correct callee", () => {
                    test_callee(node.callee, test_case.callee, streamer);
                });

                it("should be has correct Arguments list", () => {
                    expect(node.arguments_list.length).to.be(test_case.args);
                });

                it("should be has correct Argument delimiters", () => {
                    expect(node.argument_delimiters.length).to.be(
                        test_case.delimiters
                    );
                });

                it("should be has correct open_parenthesis", () => {
                    test_open_parenthesis(
                        node.open_parenthesis, test_case.open, streamer
                    );
                });

                it("should be has correct close_parenthesis", () => {
                    test_close_parenthesis(
                        node.close_parenthesis, test_case.close, streamer
                    );
                });

                it(`should be in correct range`, () => {
                    const last_index = test_case.code.length - 1;

                    expect(streamer.substring_from_token(node)).to.be(test_case.code);
                    expect(streamer.get_current_character()).to.be(test_case.end.char);
                    expect(streamer.cursor.position.index).to.be(last_index + test_case.end.offset);
                });
            });
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            {
                source : "fn(",
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
