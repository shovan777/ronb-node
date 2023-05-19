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
exports.bloodBank1679288113274 = void 0;
var bloodBank1679288113274 = /** @class */ (function () {
    function bloodBank1679288113274() {
        this.name = 'bloodBank1679288113274';
    }
    bloodBank1679288113274.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("CREATE TABLE \"base_province\" (\"id\" SERIAL NOT NULL, \"name\" character varying NOT NULL, CONSTRAINT \"PK_751789ea0f109fb96dfb6262e47\" PRIMARY KEY (\"id\"))")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"base_district\" (\"id\" SERIAL NOT NULL, \"name\" character varying NOT NULL, \"provinceId\" integer, CONSTRAINT \"PK_b2fb271e37260563be492fbf65b\" PRIMARY KEY (\"id\"))")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"blood_request_address\" (\"id\" SERIAL NOT NULL, \"address\" character varying NOT NULL, \"districtId\" integer, \"provinceId\" integer, CONSTRAINT \"PK_34867abd93b6767a6bc129098ad\" PRIMARY KEY (\"id\"))")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TYPE \"public\".\"blood_request_bloodgroup_enum\" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Don''t Know')")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TYPE \"public\".\"blood_request_state_enum\" AS ENUM('draft', 'published', 'reviewed')")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"blood_request\" (\"id\" SERIAL NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"updatedAt\" TIMESTAMP NOT NULL DEFAULT now(), \"createdBy\" integer NOT NULL, \"updatedBy\" integer NOT NULL, \"bloodGroup\" \"public\".\"blood_request_bloodgroup_enum\" NOT NULL, \"amount\" numeric(3,2) NOT NULL, \"phoneNumber\" bigint NOT NULL, \"donationDate\" TIMESTAMP NOT NULL, \"state\" \"public\".\"blood_request_state_enum\" NOT NULL DEFAULT 'draft', \"acceptors\" integer array, \"addressId\" integer, CONSTRAINT \"REL_7115c1b1928067e94c237bb45e\" UNIQUE (\"addressId\"), CONSTRAINT \"PK_dde563c617bd6830f54952d61d1\" PRIMARY KEY (\"id\"))")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"base_district\" ADD CONSTRAINT \"FK_87b86e01eafbaceaf876b859f78\" FOREIGN KEY (\"provinceId\") REFERENCES \"base_province\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"blood_request_address\" ADD CONSTRAINT \"FK_22e423ec838316c14b35717305f\" FOREIGN KEY (\"districtId\") REFERENCES \"base_district\"(\"id\") ON DELETE SET NULL ON UPDATE NO ACTION")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"blood_request_address\" ADD CONSTRAINT \"FK_e6f4d43b3d163b4eb12f01aacb2\" FOREIGN KEY (\"provinceId\") REFERENCES \"base_province\"(\"id\") ON DELETE SET NULL ON UPDATE NO ACTION")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"blood_request\" ADD CONSTRAINT \"FK_7115c1b1928067e94c237bb45e6\" FOREIGN KEY (\"addressId\") REFERENCES \"blood_request_address\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    bloodBank1679288113274.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("ALTER TABLE \"blood_request\" DROP CONSTRAINT \"FK_7115c1b1928067e94c237bb45e6\"")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"blood_request_address\" DROP CONSTRAINT \"FK_e6f4d43b3d163b4eb12f01aacb2\"")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"blood_request_address\" DROP CONSTRAINT \"FK_22e423ec838316c14b35717305f\"")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"base_district\" DROP CONSTRAINT \"FK_87b86e01eafbaceaf876b859f78\"")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"blood_request\"")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TYPE \"public\".\"blood_request_state_enum\"")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TYPE \"public\".\"blood_request_bloodgroup_enum\"")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"blood_request_address\"")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"base_district\"")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"base_province\"")];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return bloodBank1679288113274;
}());
exports.bloodBank1679288113274 = bloodBank1679288113274;
