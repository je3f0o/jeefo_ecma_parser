/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_statement_specs.js
* Created at  : 2019-03-18
* Updated at  : 2019-08-12
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
} = require("../../helpers");

describe("Variable statement >", () => {
    const test = test_cases => {
        test_for_each(test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(precedence_enum.TERMINATION);
            } catch (e) {}

            test_statement(node, "Variable");

            it("should be has correct keyword", () => {
                test_keyword("var", null, node.keyword, streamer);
            });

            it("should be expected declaration list", () => {
                test_case.list(node.list, streamer);
            });

            it("should be has correct terminator", () => {
                test_case.terminator(node.terminator, streamer);
            });

            test_range(test_case, node, streamer);
        });
    };

    describe("Semicolon terminated >", () => {
        const test_cases = [
            // var a;
            {
                code   : "var a;",
                source : "var a;",
                list   : (list, streamer) => {
                    expect(list.length).to.be(1);
                    expect(list[0].id).to.be("Variable declarator");
                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.value).to.be("a");
                    expect(list[0].assign_operator).to.be(null);
                    expect(list[0].initializer).to.be(null);

                    test_substring("a", streamer, list[0]);
                },
                terminator : (terminator, streamer) => {
                    expect(terminator).not.to.be(null);
                    expect(terminator.id).to.be("Delimiter");
                    expect(terminator.type).to.be("Delimiter");
                    expect(terminator.precedence).to.be(-1);
                    expect(terminator.pre_comment).to.be(null);
                    expect(terminator.value).to.be(";");

                    test_substring(";", streamer, terminator);
                }
            },

            // var a, b,c;
            {
                code   : "var a, b,c;",
                source : "var a, b,c;",
                list : (list, streamer) => {
                    expect(list.length).to.be(3);

                    "abc".split('').forEach((character, index) => {
                        expect(list[index].id).to.be("Variable declarator");
                        expect(list[index].identifier.id).to.be("Identifier");
                        expect(list[index].identifier.value).to.be(character);
                        expect(list[index].assign_operator).to.be(null);
                        expect(list[index].initializer).to.be(null);

                        test_substring(character, streamer, list[index]);
                    });
                },
                terminator : (terminator, streamer) => {
                    expect(terminator).not.to.be(null);
                    expect(terminator.id).to.be("Delimiter");
                    expect(terminator.type).to.be("Delimiter");
                    expect(terminator.precedence).to.be(-1);
                    expect(terminator.pre_comment).to.be(null);
                    expect(terminator.value).to.be(";");

                    test_substring(";", streamer, terminator);
                }
            },

            // var a /*a*/\n,\n pi /*b*/ = /*c*/ 3.14 /*d*/;
            {
                code   : "var a /*a*/\n,\n pi /*b*/ = /*c*/ 3.14 + 5 /*d*/;",
                source : "var a /*a*/\n,\n pi /*b*/ = /*c*/ 3.14 + 5 /*d*/;",
                list : (list, streamer) => {
                    expect(list.length).to.be(2);

                    // declarator 0
                    expect(list[0].id).to.be("Variable declarator");

                    expect(list[0].identifier.id).to.be("Identifier");
                    expect(list[0].identifier.pre_comment).to.be(null);
                    expect(list[0].identifier.value).to.be("a");
                    expect(list[0].assign_operator).to.be(null);
                    expect(list[0].initializer).to.be(null);

                    test_substring("a", streamer, list[0]);

                    // declarator 1
                    expect(list[1].id).to.be("Variable declarator");
                    expect(list[1].identifier.id).to.be("Identifier");
                    expect(list[1].identifier.pre_comment).to.be(null);
                    expect(list[1].identifier.value).to.be("pi");

                    expect(list[1].assign_operator).not.to.be(null);
                    expect(list[1].assign_operator.pre_comment).not.to.be(null);
                    test_substring("/*b*/", streamer, list[1].assign_operator.pre_comment);
                    test_substring("=", streamer, list[1].assign_operator);

                    expect(list[1].initializer).not.to.be(null);
                    test_substring("3.14 + 5", streamer, list[1].initializer);

                    test_substring("pi /*b*/ = /*c*/ 3.14 + 5", streamer, list[1]);
                },
                terminator : (terminator, streamer) => {
                    expect(terminator).not.to.be(null);
                    expect(terminator.id).to.be("Delimiter");
                    expect(terminator.type).to.be("Delimiter");
                    expect(terminator.precedence).to.be(-1);
                    expect(terminator.pre_comment).not.to.be(null);
                    expect(terminator.value).to.be(";");

                    test_substring("/*d*/", streamer, terminator.pre_comment);
                    test_substring(";", streamer, terminator);
                }
            },
        ];

        test(test_cases);
    });

    describe("Automatic semicolon insertion >", () => {
        const test_terminator = terminator => {
            expect(terminator).to.be(null);
        };

        const test_cases = [
            // var id
            {
                code   : "var id",
                source : "var id",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);
                    test_substring("id", streamer, list[0]);
                },
                terminator : test_terminator,
            },

            // var\nterminated\nb = 2
            {
                code   : "var\nterminated",
                source : "var\nterminated\nb = 2",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);
                    test_substring("terminated", streamer, list[0]);
                },
                terminator : test_terminator,
            },

            // var pi = 3.14\n, terminated\nb=2;
            {
                code   : "var pi = 3.14\n, terminated",
                source : "var pi = 3.14\n, terminated\nb=2;",
                list : (list, streamer) => {
                    expect(list.length).to.be(2);
                    test_substring("pi = 3.14", streamer, list[0]);
                    test_substring("terminated", streamer, list[1]);
                },
                terminator : test_terminator,
            },

            // var pi = 3.14\n terminated
            {
                code   : "var pi = 3.14",
                source : "var pi = 3.14\n terminated",
                list : (list, streamer) => {
                    expect(list.length).to.be(1);
                    test_substring("pi = 3.14", streamer, list[0]);
                },
                terminator : test_terminator,
            },

            // var a /*a*/, pi /*b*/ = /*c*/ 3.14 + 5  /*comment doesn't matter*/
            {
                code   : "var a /*a*/, pi /*b*/ = /*c*/ 3.14 + 5",
                source : "var a /*a*/, pi /*b*/ = /*c*/ 3.14 + 5 /*comment doesn't matter*/",
                list : (list, streamer) => {
                    expect(list.length).to.be(2);
                    test_substring("a", streamer, list[0]);
                    test_substring("pi /*b*/ = /*c*/ 3.14 + 5", streamer, list[1]);
                },
                terminator : test_terminator,
            },
        ];

        test(test_cases);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // var
            {
                source : "var",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // var a a
            {
                source : "var a a",
                error : error => {
                    it("should be throw: Unexpected token", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be has token value: a", () => {
                        expect(error.token.value).to.be("a");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // var a =
            {
                source : "var a =",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // var a,
            {
                source : "var a,",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // var 3
            {
                source : "var 3",
                error : error => {
                    it("should be throw: Expected identifier instead saw: 3", () => {
                        expect(error.message).to.be("Expected identifier instead saw: 3");
                    });

                    it("should be has token value: 3", () => {
                        expect(error.token.value).to.be("3");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },

            // var a, ,
            {
                source : "var a, ,",
                error : error => {
                    it("should be throw: Expected identifier instead saw: ,", () => {
                        expect(error.message).to.be("Expected identifier instead saw: ,");
                    });

                    it("should be has token value: ,", () => {
                        expect(error.token.value).to.be(",");
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
