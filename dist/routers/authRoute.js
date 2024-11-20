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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../middleware/passport"));
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
router.get('/login', checkAuth_1.forwardAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //message here
    const messages = req.session.messages || [];
    req.session.messages = [];
    res.render("login", { messages });
}));
router.post("/login", (req, res, next) => {
    passport_1.default.authenticate("local", { failureRedirect: "auth/login", failureMessage: true }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.messages = info
                ? [info.message]
                : ["Login failed"];
            return res.redirect("/auth/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/");
        });
    })(req, res, next);
});
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    res.redirect('/');
});
exports.default = router;
