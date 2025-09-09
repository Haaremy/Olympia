"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../lib/db");
var gamesEntries_1 = require("./gamesEntries");
var teamEntries_1 = require("./teamEntries");
var gameSettings_1 = require("./gameSettings");
//const prisma = new PrismaClient()
function cleanDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.prisma.entries.deleteMany({})];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.$executeRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["DELETE FROM sqlite_sequence WHERE name='Entries'"], ["DELETE FROM sqlite_sequence WHERE name='Entries'"])))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.points.deleteMany({})];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.$executeRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["DELETE FROM sqlite_sequence WHERE name='Points'"], ["DELETE FROM sqlite_sequence WHERE name='Points'"])))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.language.deleteMany({})];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.$executeRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["DELETE FROM sqlite_sequence WHERE name='Language'"], ["DELETE FROM sqlite_sequence WHERE name='Language'"])))];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.team.deleteMany({})];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.$executeRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["DELETE FROM sqlite_sequence WHERE name='Team'"], ["DELETE FROM sqlite_sequence WHERE name='Team'"])))];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.game.deleteMany({})];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.$executeRaw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["DELETE FROM sqlite_sequence WHERE name='Game'"], ["DELETE FROM sqlite_sequence WHERE name='Game'"])))];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.gameSettings.deleteMany({})];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.$executeRaw(templateObject_6 || (templateObject_6 = __makeTemplateObject(["DELETE FROM sqlite_sequence WHERE name='GameSettings'"], ["DELETE FROM sqlite_sequence WHERE name='GameSettings'"])))];
                case 12:
                    _a.sent();
                    console.log('✅ Alle Datensätze wurden erfolgreich gelöscht!');
                    return [2 /*return*/];
            }
        });
    });
}
function seedDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, gamesEntries_1.gameEntries)()];
                case 1:
                    _a.sent();
                    console.log('✅ Seeded game with languages.');
                    return [4 /*yield*/, (0, teamEntries_1.teamEntries)()];
                case 2:
                    _a.sent();
                    console.log('✅ Seeded empty Teams.');
                    return [4 /*yield*/, (0, gameSettings_1.gameSettings)()];
                case 3:
                    _a.sent();
                    console.log('✅ Seeded Settings.');
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cleanDB()]; // Bereinige die Datenbank
                case 1:
                    _a.sent(); // Bereinige die Datenbank
                    return [4 /*yield*/, seedDB()]; // Füge neue Seed-Daten hinzu
                case 2:
                    _a.sent(); // Füge neue Seed-Daten hinzu
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return db_1.prisma.$disconnect(); })
    .catch(function (e) {
    console.error(e);
    db_1.prisma.$disconnect();
    process.exit(1);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
