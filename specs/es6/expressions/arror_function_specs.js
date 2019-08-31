/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arror_function_specs.js
* Created at  : 2019-08-17
* Updated at  : 2019-08-18
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
const precedence_enum = require("../../../src/es6/enums/precedence_enum");

const test_binding_rest_el = require("../helpers/test_binding_rest");

const {
    test_range,
    test_for_each,
    test_expression,
    test_substring,
} = require("../../helpers");

describe("Arrow function >", () => {
    const valid_test_cases = [
        // param => {}
        {
            code   : "param => {}",
            source : "param => {}",
            offset : 1,
            params : (node, streamer) => {
                expect(node.id).to.be("Arrow parameters");
                expect(node.list.length).to.be(1);
                expect(node.list[0].id).to.be("Identifier");
                test_substring("param", streamer, node);
            },
            arrow_token : (node, streamer) => {
                test_substring("=>", streamer, node);
            },
            body : (node, streamer) => {
                expect(node.id).to.be("Block statement");
                test_substring("{}", streamer, node);
            }
        },

        // param => expression
        {
            code   : "param => expression",
            source : "param => expression",
            offset : 1,
            params : (node, streamer) => {
                expect(node.id).to.be("Arrow parameters");
                expect(node.list.length).to.be(1);
                expect(node.list[0].id).to.be("Identifier");
                test_substring("param", streamer, node);
            },
            arrow_token : (node, streamer) => {
                test_substring("=>", streamer, node);
            },
            body : (node, streamer) => {
                expect(node.id).to.be("Identifier");
                test_substring("expression", streamer, node);
            }
        },

        // () => {}
        {
            code   : "() => {}",
            source : "() => {}",
            offset : 1,
            params : (node, streamer) => {
                expect(node.id).to.be("Arrow parameters");
                expect(node.list.length).to.be(0);
                test_substring("()", streamer, node);
            },
            arrow_token : (node, streamer) => {
                test_substring("=>", streamer, node);
            },
            body : (node, streamer) => {
                expect(node.id).to.be("Block statement");
                test_substring("{}", streamer, node);
            }
        },

        // () => expression
        {
            code   : "() => expression",
            source : "() => expression",
            offset : 1,
            params : (node, streamer) => {
                expect(node.id).to.be("Arrow parameters");
                expect(node.list.length).to.be(0);
                test_substring("()", streamer, node);
            },
            arrow_token : (node, streamer) => {
                test_substring("=>", streamer, node);
            },
            body : (node, streamer) => {
                expect(node.id).to.be("Identifier");
                test_substring("expression", streamer, node);
            }
        },

        // (param = default_value) => {}
        {
            code   : "(param = default_value) => {}",
            source : "(param = default_value) => {}",
            offset : 1,
            params : (node, streamer) => {
                expect(node.id).to.be("Arrow parameters");
                expect(node.list.length).to.be(1);
                expect(node.list[0].id).to.be("Assignment operator");
                test_substring("(param = default_value)", streamer, node);
            },
            arrow_token : (node, streamer) => {
                test_substring("=>", streamer, node);
            },
            body : (node, streamer) => {
                expect(node.id).to.be("Block statement");
                test_substring("{}", streamer, node);
            }
        },

        // (...rest) => {}
        {
            code   : "(...rest) => {}",
            source : "(...rest) => {}",
            offset : 1,
            params : (node, streamer) => {
                expect(node.id).to.be("Arrow parameters");
                expect(node.list.length).to.be(1);

                test_binding_rest_el({
                    str        : "...rest",
                    ellipsis   : "...",
                    identifier : "rest"
                }, node.list[0], streamer);

                test_substring("(...rest)", streamer, node);
            },
            arrow_token : (node, streamer) => {
                test_substring("=>", streamer, node);
            },
            body : (node, streamer) => {
                expect(node.id).to.be("Block statement");
                test_substring("{}", streamer, node);
            }
        },

    ];

    test_for_each(valid_test_cases, test_case => {
        parser.tokenizer.init(test_case.source);
        parser.prepare_next_state();

        const streamer = parser.tokenizer.streamer;
        let node;
        try {
            parser.change_state("expression");
            node = parser.parse_next_node(precedence_enum.COMMA);
        } catch (e) {}

        test_expression(
            node, "Arrow function", precedence_enum.ARROW_FUNCTION
        );

        it("should be has correct parameters", () => {
            test_case.params(node.parameters, streamer);
        });

        it("should be has correct arrow_token", () => {
            test_case.arrow_token(node.arrow_token, streamer);
        });

        it("should be has correct body", () => {
            test_case.body(node.body, streamer);
        });

        test_range(test_case, node, streamer);
    });

    describe("Invalid cases >", () => {
        return;
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
