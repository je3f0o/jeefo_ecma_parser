/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : instanceof_expression.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var InstanceofExpression = function () {};
InstanceofExpression.prototype = require("./binary").make("InstanceofExpression", 11);

module.exports = {
	is          : function (token) { return token.name === "instanceof"; },
	token_type  : "Identifier",
	Constructor : InstanceofExpression
};
