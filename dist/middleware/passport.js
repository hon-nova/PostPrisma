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
const localLogin = new passport_local_1.Strategy({
    usernameField: 'uname',
    passwordField: 'password'
}, (uname, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userController_1.getUserByEmailAndPassword)(uname, password);
    if (!user) {
        return done(null, false, { message: `Couldn't find user with username: ${uname}. Please try again.` });
    }
    if (user.password !== password) {
        return done(null, false, { message: `Password is incorrect.` });
    }
    return done(null, user);
}));
passport_1.default.serializeUser(function (user, done) {
    console.log(`user type Express.User: `, user);
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, userController_1.getUserById)(id);
        if (user) {
            done(null, user);
        }
        else {
            done({ message: "User Not Found." }, null);
        }
    });
});
exports.default = passport_1.default.use(localLogin);
