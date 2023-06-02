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
exports.createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934 = void 0;
var createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934 = /** @class */ (function () {
    function createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934() {
        this.name = 'createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934';
    }
    createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("CREATE TABLE \"yellow_pages_email\" (\"id\" SERIAL NOT NULL, \"email\" character varying NOT NULL, \"yellowpagesId\" integer, CONSTRAINT \"PK_be1aa85a94e9bfd2537a7ebe6fc\" PRIMARY KEY (\"id\"))")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages\" ADD \"createdAt\" TIMESTAMP NOT NULL DEFAULT now()")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages\" ADD \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now()")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages\" ADD \"createdBy\" integer NOT NULL")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages\" ADD \"updatedBy\" integer NOT NULL")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_address\" ADD \"address\" character varying NOT NULL")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_phone_number\" DROP COLUMN \"phone_number\"")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_phone_number\" ADD \"phone_number\" bigint NOT NULL")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_phone_number\" ALTER COLUMN \"is_emergency\" SET DEFAULT false")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_email\" ADD CONSTRAINT \"FK_2ddbc926a5ea9260e2d446d69e4\" FOREIGN KEY (\"yellowpagesId\") REFERENCES \"yellow_pages\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_email\" DROP CONSTRAINT \"FK_2ddbc926a5ea9260e2d446d69e4\"")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_phone_number\" ALTER COLUMN \"is_emergency\" DROP DEFAULT")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_phone_number\" DROP COLUMN \"phone_number\"")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_phone_number\" ADD \"phone_number\" integer NOT NULL")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages_address\" DROP COLUMN \"address\"")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages\" DROP COLUMN \"updatedBy\"")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages\" DROP COLUMN \"createdBy\"")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages\" DROP COLUMN \"updatedAt\"")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"yellow_pages\" DROP COLUMN \"createdAt\"")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"yellow_pages_email\"")];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934;
}());
exports.createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934 = createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934;