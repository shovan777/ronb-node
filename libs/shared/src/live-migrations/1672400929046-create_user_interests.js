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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.createUserInterests1672400929046 = void 0;
var createUserInterests1672400929046 = /** @class */ (function () {
    function createUserInterests1672400929046() {
        this.name = 'createUserInterests1672400929046';
    }
    createUserInterests1672400929046.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("CREATE TABLE \"user_interests\" (\"userId\" integer NOT NULL, CONSTRAINT \"PK_2454ca172bd394ec6a5f17d8e4c\" PRIMARY KEY (\"userId\"))")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"user_interests_news_tags_tag\" (\"userInterestsUserId\" integer NOT NULL, \"tagId\" integer NOT NULL, CONSTRAINT \"PK_e6bacb1fa97810405329767b603\" PRIMARY KEY (\"userInterestsUserId\", \"tagId\"))")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_8c31761d878724a2ca346db58a\" ON \"user_interests_news_tags_tag\" (\"userInterestsUserId\") ")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_008ab229a69a9d85c945f2ff36\" ON \"user_interests_news_tags_tag\" (\"tagId\") ")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"user_interests_news_categories_news_category\" (\"userInterestsUserId\" integer NOT NULL, \"newsCategoryId\" integer NOT NULL, CONSTRAINT \"PK_640ae7e5e3bfcb0e6e3455c3988\" PRIMARY KEY (\"userInterestsUserId\", \"newsCategoryId\"))")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_58f175d65e43e6f863ed1b2a28\" ON \"user_interests_news_categories_news_category\" (\"userInterestsUserId\") ")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_dc629862465ce4d8af01af96b6\" ON \"user_interests_news_categories_news_category\" (\"newsCategoryId\") ")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_news_engagement\" DROP COLUMN \"engagementDuration\"")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_interests_news_tags_tag\" ADD CONSTRAINT \"FK_8c31761d878724a2ca346db58aa\" FOREIGN KEY (\"userInterestsUserId\") REFERENCES \"user_interests\"(\"userId\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_interests_news_tags_tag\" ADD CONSTRAINT \"FK_008ab229a69a9d85c945f2ff36a\" FOREIGN KEY (\"tagId\") REFERENCES \"tag\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_interests_news_categories_news_category\" ADD CONSTRAINT \"FK_58f175d65e43e6f863ed1b2a287\" FOREIGN KEY (\"userInterestsUserId\") REFERENCES \"user_interests\"(\"userId\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_interests_news_categories_news_category\" ADD CONSTRAINT \"FK_dc629862465ce4d8af01af96b69\" FOREIGN KEY (\"newsCategoryId\") REFERENCES \"news_category\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    createUserInterests1672400929046.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_interests_news_categories_news_category\" DROP CONSTRAINT \"FK_dc629862465ce4d8af01af96b69\"")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_interests_news_categories_news_category\" DROP CONSTRAINT \"FK_58f175d65e43e6f863ed1b2a287\"")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_interests_news_tags_tag\" DROP CONSTRAINT \"FK_008ab229a69a9d85c945f2ff36a\"")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_interests_news_tags_tag\" DROP CONSTRAINT \"FK_8c31761d878724a2ca346db58aa\"")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_news_engagement\" ADD \"engagementDuration\" integer")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_dc629862465ce4d8af01af96b6\"")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_58f175d65e43e6f863ed1b2a28\"")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"user_interests_news_categories_news_category\"")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_008ab229a69a9d85c945f2ff36\"")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_8c31761d878724a2ca346db58a\"")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"user_interests_news_tags_tag\"")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"user_interests\"")];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return createUserInterests1672400929046;
}());
exports.createUserInterests1672400929046 = createUserInterests1672400929046;
