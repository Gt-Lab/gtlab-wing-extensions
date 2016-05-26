"use strict";
var MyClass = (function () {
    function MyClass() {
    }
    MyClass.prototype.print = function () {
        alert('implements test');
    };
    return MyClass;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyClass;
