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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs/promises");
var path = require("path");
var ts_morph_1 = require("ts-morph");
// Main function to analyze the project
function analyzeTypeScriptProject(projectPath) {
    return __awaiter(this, void 0, void 0, function () {
        var report, packageJsonPath, packageJson, _a, _b, tsConfigPath, project, _c, _d, _e, _f, tsFiles, _i, tsFiles_1, file, potentialEntryPoints, _g, potentialEntryPoints_1, entry, entryPath, sourceFiles, _h, sourceFiles_1, sourceFile, typeAliases, interfaces, error_1;
        var _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    report = {
                        projectName: '',
                        dependencies: {},
                        devDependencies: {},
                        tsConfig: 'No tsconfig.json found',
                        entryPoints: [],
                        modules: [],
                        typesAndInterfaces: [],
                    };
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 12, , 13]);
                    packageJsonPath = path.join(projectPath, 'package.json');
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs.readFile(packageJsonPath, 'utf-8')];
                case 2:
                    packageJson = _b.apply(_a, [_k.sent()]);
                    report.projectName = packageJson.name || 'Unnamed Project';
                    report.dependencies = packageJson.dependencies || {};
                    report.devDependencies = packageJson.devDependencies || {};
                    tsConfigPath = path.join(projectPath, 'tsconfig.json');
                    project = void 0;
                    _k.label = 3;
                case 3:
                    _k.trys.push([3, 5, , 6]);
                    _c = report;
                    _e = (_d = JSON).parse;
                    return [4 /*yield*/, fs.readFile(tsConfigPath, 'utf-8')];
                case 4:
                    _c.tsConfig = _e.apply(_d, [_k.sent()]);
                    project = new ts_morph_1.Project({
                        tsConfigFilePath: tsConfigPath,
                    });
                    return [3 /*break*/, 6];
                case 5:
                    _f = _k.sent();
                    console.warn('Warning: tsconfig.json not found. Using default configuration.');
                    project = new ts_morph_1.Project({
                        compilerOptions: {
                            target: 'es2018',
                            module: 'commonjs',
                            lib: ['es2018'],
                            allowJs: true,
                        },
                    });
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, findTypeScriptFiles(projectPath)];
                case 7:
                    tsFiles = _k.sent();
                    if (tsFiles.length === 0) {
                        console.warn('No TypeScript files found in the project.');
                        return [2 /*return*/, report];
                    }
                    // Add TypeScript files to the project
                    for (_i = 0, tsFiles_1 = tsFiles; _i < tsFiles_1.length; _i++) {
                        file = tsFiles_1[_i];
                        project.addSourceFileAtPath(file);
                    }
                    potentialEntryPoints = ['index.ts', 'main.ts', 'src/index.ts', 'src/main.ts'];
                    _g = 0, potentialEntryPoints_1 = potentialEntryPoints;
                    _k.label = 8;
                case 8:
                    if (!(_g < potentialEntryPoints_1.length)) return [3 /*break*/, 11];
                    entry = potentialEntryPoints_1[_g];
                    entryPath = path.join(projectPath, entry);
                    return [4 /*yield*/, fs.access(entryPath).then(function () { return true; }).catch(function () { return false; })];
                case 9:
                    if (_k.sent()) {
                        report.entryPoints.push(entry);
                    }
                    _k.label = 10;
                case 10:
                    _g++;
                    return [3 /*break*/, 8];
                case 11:
                    sourceFiles = project.getSourceFiles();
                    for (_h = 0, sourceFiles_1 = sourceFiles; _h < sourceFiles_1.length; _h++) {
                        sourceFile = sourceFiles_1[_h];
                        // Collect module paths
                        report.modules.push(sourceFile.getFilePath());
                        typeAliases = sourceFile.getTypeAliases().map(function (t) { return t.getName(); });
                        interfaces = sourceFile.getInterfaces().map(function (i) { return i.getName(); });
                        (_j = report.typesAndInterfaces).push.apply(_j, __spreadArray(__spreadArray([], typeAliases, false), interfaces, false));
                    }
                    return [2 /*return*/, report];
                case 12:
                    error_1 = _k.sent();
                    console.error('Error analyzing project:', error_1);
                    throw error_1;
                case 13: return [2 /*return*/];
            }
        });
    });
}
// Helper function to find TypeScript files recursively
function findTypeScriptFiles(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var files, entries, _i, entries_1, entry, fullPath, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    files = [];
                    return [4 /*yield*/, fs.readdir(dir, { withFileTypes: true })];
                case 1:
                    entries = _d.sent();
                    _i = 0, entries_1 = entries;
                    _d.label = 2;
                case 2:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 6];
                    entry = entries_1[_i];
                    fullPath = path.join(dir, entry.name);
                    if (!entry.isDirectory()) return [3 /*break*/, 4];
                    _b = (_a = files.push).apply;
                    _c = [files];
                    return [4 /*yield*/, findTypeScriptFiles(fullPath)];
                case 3:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    return [3 /*break*/, 5];
                case 4:
                    if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
                        files.push(fullPath);
                    }
                    _d.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/, files];
            }
        });
    });
}
// Function to print the report
function printReport(report) {
    console.log("# Project Analysis Report: ".concat(report.projectName));
    console.log('\n## Dependencies');
    console.log(JSON.stringify(report.dependencies, null, 2));
    console.log('\n## Dev Dependencies');
    console.log(JSON.stringify(report.devDependencies, null, 2));
    console.log('\n## TypeScript Configuration');
    console.log(JSON.stringify(report.tsConfig, null, 2));
    console.log('\n## Entry Points');
    console.log(report.entryPoints.length ? report.entryPoints.join('\n') : 'None found');
    console.log('\n## Modules');
    console.log(report.modules.length ? report.modules.join('\n') : 'None found');
    console.log('\n## Types and Interfaces');
    console.log(report.typesAndInterfaces.length ? report.typesAndInterfaces.join('\n') : 'None found');
}
// Run the analysis
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var projectPath, report;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectPath = process.argv[2] || '.';
                    return [4 /*yield*/, analyzeTypeScriptProject(projectPath)];
                case 1:
                    report = _a.sent();
                    printReport(report);
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
