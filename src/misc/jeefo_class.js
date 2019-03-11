/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : jeefo_class.js
* Created at  : 2018-05-10
* Updated at  : 2019-01-02
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

/*
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
var getParamNames = function (func) {
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	return result === null ? [] : result;
};
*/

var JeefoClass = function () {
	this.create = function (name, BaseClass, prototype) {
		var Constructor;
		switch (typeof BaseClass) {
			case "function" :
				if (! prototype) {
					Constructor = BaseClass;
				}
				break;
			case "object" :
				if (BaseClass !== null) {
					if (Array.isArray(BaseClass)) {
						throw new Error("Invalid BaseClass");
					}
					prototype = BaseClass;
					BaseClass = null;
				}
				break;
		}
		switch (typeof prototype) {
			case "function" :
				Constructor = prototype;
				prototype = null;
				break;
			case "object" :
				if (prototype !== null) {
					if (Array.isArray(prototype)) {
						throw new Error("Invalid prototype");
					}
					if (prototype.constructor) {
						if (typeof prototype.constructor !== "function") {
							throw new Error("Invalid Constructor");
						}
						Constructor = prototype.constructor;
					}
				}
				break;
			default :
				prototype = null;
		}
		// jshint evil : true
		var NewClass = new Function("Constructor", "BaseClass", `return function ${ name } () {
	if (BaseClass) {
		this.Super = function () {
			BaseClass.apply(this, arguments);
		};
	}
	Constructor && Constructor.apply(this, arguments);
	delete this.Super;
}`)(prototype.constructor, BaseClass);
		// jshint evil : false
		/*
		var NewClass = function Class () {
			if (BaseClass) {
				this.Super = function () {
					BaseClass.apply(this, arguments);
				};
			}
			Constructor && Constructor.apply(this, arguments); // jshint ignore:line
			delete this.Super;
		};
		Object.defineProperty(NewClass, "name", { value : name });
		*/

		var new_prototype = BaseClass ? Object.create(BaseClass.prototype) : NewClass.prototype;
		if (prototype) {
			Object.assign(new_prototype, prototype);
		}

		if (BaseClass) {
			var Super = function (instance) {
				this.instance = instance;
			};
			Super.prototype = BaseClass.prototype._super ? new BaseClass.prototype._super() : Object.create(BaseClass.prototype);

			Object.keys(BaseClass.prototype).forEach(function (key) {
				Super.prototype[key] = function () {
					var result;
					//console.log(`name = ${ name }, method = ${ key }`);

					if (this.instance[key] === BaseClass.prototype[key]) {
						this.instance._super = BaseClass.prototype._super;
						result = this.instance._super()[key].apply(this, arguments);
					} else {
						if (BaseClass.prototype._super) {
							this.instance._super = BaseClass.prototype._super;
						} else {
							this.instance._super = null;
						}
						result = BaseClass.prototype[key].apply(this.instance, arguments);
					}

					if (this.instance.hasOwnProperty("_super")) {
						delete this.instance._super;
					}

					return result;
				};
			});

			new_prototype._super = function () {
				return new Super(this);
			};
		}

		NewClass.prototype = new_prototype;
		new_prototype.constructor = NewClass;

		return NewClass;
	};
};

module.exports = new JeefoClass();
