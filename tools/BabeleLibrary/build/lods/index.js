"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeURI = exports.SPARQL = exports.QuadFactory = exports.RDFAnnotation = exports.RDFConverter = exports.formUrlEncoded = exports.checkQuad = exports.getID = void 0;
const utility_1 = require("./utility");
Object.defineProperty(exports, "getID", { enumerable: true, get: function () { return utility_1.getID; } });
Object.defineProperty(exports, "checkQuad", { enumerable: true, get: function () { return utility_1.checkQuad; } });
Object.defineProperty(exports, "formUrlEncoded", { enumerable: true, get: function () { return utility_1.formUrlEncoded; } });
const RDFConverter_1 = __importDefault(require("./RDFConverter"));
exports.RDFConverter = RDFConverter_1.default;
const RDFAnnotation_1 = __importDefault(require("./RDFAnnotation"));
exports.RDFAnnotation = RDFAnnotation_1.default;
const QuadFactory_1 = __importDefault(require("./QuadFactory"));
exports.QuadFactory = QuadFactory_1.default;
const SPARQL = __importStar(require("./sparql"));
exports.SPARQL = SPARQL;
const ChangeURI = __importStar(require("./changeUri"));
exports.ChangeURI = ChangeURI;
