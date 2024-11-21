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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userController_1 = require("../controller/userController");
// ⭐ TODO: Passport Types
const localLogin = new passport_local_1.Strategy({
    usernameField: "uname",
    passwordField: "password",
}, (uname, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists in databse
    const user = yield (0, userController_1.getUserByEmailIdAndPassword)(uname, password);
    return user
        ? done(null, user)
        : done(null, false, {
            message: "Your login details are not valid. Please try again.",
        });
}));
// ⭐ TODO: Passport Types
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, userController_1.getUserById)(id);
        if (user) {
            done(null, user);
        }
        else {
            done({ message: "User not found" }, null);
        }
    });
});
exports.default = passport_1.default.use(localLogin);
