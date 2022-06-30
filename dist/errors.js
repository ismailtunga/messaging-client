"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnauthorized = exports.handleNotFound = void 0;
const handleNotFound = (func, returnValue) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        return yield func();
    }
    catch (err) {
        if (((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            return returnValue;
        }
        else {
            throw err;
        }
    }
});
exports.handleNotFound = handleNotFound;
const handleUnauthorized = (func, returnValue) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        return yield func();
    }
    catch (err) {
        if (((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
            return returnValue;
        }
        else {
            throw err;
        }
    }
});
exports.handleUnauthorized = handleUnauthorized;
