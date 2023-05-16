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
exports.newsTagsToiletMigration1660460891479 = void 0;
var newsTagsToiletMigration1660460891479 = /** @class */ (function () {
    function newsTagsToiletMigration1660460891479() {
        this.name = 'newsTagsToiletMigration1660460891479';
    }
    newsTagsToiletMigration1660460891479.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("CREATE TABLE \"tag\" (\"id\" SERIAL NOT NULL, \"name\" character varying(100) NOT NULL, CONSTRAINT \"UQ_6a9775008add570dc3e5a0bab7b\" UNIQUE (\"name\"), CONSTRAINT \"PK_8e4052373c579afc1471f526760\" PRIMARY KEY (\"id\"))")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"news_taggit\" (\"id\" SERIAL NOT NULL, \"tagId\" integer, \"newsId\" integer, CONSTRAINT \"PK_ebea5b7dee7b740d413818f1eac\" PRIMARY KEY (\"id\"))")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"news_category\" (\"id\" SERIAL NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(), \"createdBy\" integer NOT NULL, \"updatedBy\" integer NOT NULL, \"name\" character varying NOT NULL, \"description\" character varying, CONSTRAINT \"PK_aac53a9364896452e463139e4a0\" PRIMARY KEY (\"id\"))")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"news\" (\"id\" SERIAL NOT NULL, \"name\" character varying NOT NULL, \"title\" character varying, \"publishedAt\" TIMESTAMP, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(), \"createdBy\" integer NOT NULL, \"updatedBy\" integer NOT NULL, \"content\" character varying NOT NULL, \"singleImage\" character varying, \"link\" character varying, \"source\" character varying DEFAULT 'RONB', \"imgSource\" character varying, \"categoryId\" integer, CONSTRAINT \"PK_39a43dfcb6007180f04aff2357e\" PRIMARY KEY (\"id\"))")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"news_image\" (\"id\" SERIAL NOT NULL, \"imageURL\" character varying NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(), \"createdBy\" integer NOT NULL, \"updatedBy\" integer NOT NULL, \"newsId\" integer, CONSTRAINT \"PK_547fe26db8b47dd88ef50c63130\" PRIMARY KEY (\"id\"))")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"user_likes_news\" (\"userId\" integer NOT NULL, \"newsId\" integer NOT NULL, CONSTRAINT \"PK_e5f6c76330b01516a040665f749\" PRIMARY KEY (\"userId\", \"newsId\"))")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"news_comment\" (\"id\" SERIAL NOT NULL, \"content\" character varying NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(), \"author\" integer NOT NULL, \"newsId\" integer, CONSTRAINT \"PK_6ae712e2600bc9b2acf0439100e\" PRIMARY KEY (\"id\"))")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"news_reply\" (\"id\" SERIAL NOT NULL, \"content\" character varying NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(), \"author\" integer NOT NULL, \"repliedTo\" integer NOT NULL, \"commentId\" integer, CONSTRAINT \"PK_a50cee5a5605c2d9e866e792916\" PRIMARY KEY (\"id\"))")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"public_toilet\" (\"id\" SERIAL NOT NULL, \"name\" character varying NOT NULL, \"publishedAt\" TIMESTAMP, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(), \"createdBy\" integer NOT NULL, \"updatedBy\" integer NOT NULL, \"content\" character varying NOT NULL, \"address\" character varying NOT NULL, \"singleImage\" character varying, \"geopoint\" geography(Point,4326), CONSTRAINT \"PK_4c1ebb4c48b2b516aee60aac26f\" PRIMARY KEY (\"id\"))")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_de5c2876b0331da393bd97cd9c\" ON \"public_toilet\" USING GiST (\"geopoint\") ")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"public_toilet_image\" (\"id\" SERIAL NOT NULL, \"image\" character varying NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(), \"createdBy\" integer NOT NULL, \"updatedBy\" integer NOT NULL, \"publicToiletId\" integer, CONSTRAINT \"PK_5771d2932ca7baa50d0c1edcbf1\" PRIMARY KEY (\"id\"))")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_taggit\" ADD CONSTRAINT \"FK_37ada3e9928176a0c055ff343d6\" FOREIGN KEY (\"tagId\") REFERENCES \"tag\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_taggit\" ADD CONSTRAINT \"FK_460f86d5e86fdeeba68d3257fe0\" FOREIGN KEY (\"newsId\") REFERENCES \"news\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news\" ADD CONSTRAINT \"FK_12a76d9b0f635084194b2c6aa01\" FOREIGN KEY (\"categoryId\") REFERENCES \"news_category\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_image\" ADD CONSTRAINT \"FK_fe6247992e5bf6c15ad2b5e8fa6\" FOREIGN KEY (\"newsId\") REFERENCES \"news\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_likes_news\" ADD CONSTRAINT \"FK_b1df74557e5b8e3334f8bd2005f\" FOREIGN KEY (\"newsId\") REFERENCES \"news\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_comment\" ADD CONSTRAINT \"FK_21268b592f3f32258000ece48f7\" FOREIGN KEY (\"newsId\") REFERENCES \"news\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_reply\" ADD CONSTRAINT \"FK_347a7ccc0e7ac88136cb122a4e0\" FOREIGN KEY (\"commentId\") REFERENCES \"news_comment\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"public_toilet_image\" ADD CONSTRAINT \"FK_740cac07618837db008103f60e2\" FOREIGN KEY (\"publicToiletId\") REFERENCES \"public_toilet\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 19:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    newsTagsToiletMigration1660460891479.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("ALTER TABLE \"public_toilet_image\" DROP CONSTRAINT \"FK_740cac07618837db008103f60e2\"")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_reply\" DROP CONSTRAINT \"FK_347a7ccc0e7ac88136cb122a4e0\"")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_comment\" DROP CONSTRAINT \"FK_21268b592f3f32258000ece48f7\"")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_likes_news\" DROP CONSTRAINT \"FK_b1df74557e5b8e3334f8bd2005f\"")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_image\" DROP CONSTRAINT \"FK_fe6247992e5bf6c15ad2b5e8fa6\"")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news\" DROP CONSTRAINT \"FK_12a76d9b0f635084194b2c6aa01\"")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_taggit\" DROP CONSTRAINT \"FK_460f86d5e86fdeeba68d3257fe0\"")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"news_taggit\" DROP CONSTRAINT \"FK_37ada3e9928176a0c055ff343d6\"")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"public_toilet_image\"")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_de5c2876b0331da393bd97cd9c\"")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"public_toilet\"")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"news_reply\"")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"news_comment\"")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"user_likes_news\"")];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"news_image\"")];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"news\"")];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"news_category\"")];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"news_taggit\"")];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"tag\"")];
                    case 19:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return newsTagsToiletMigration1660460891479;
}());
exports.newsTagsToiletMigration1660460891479 = newsTagsToiletMigration1660460891479;
