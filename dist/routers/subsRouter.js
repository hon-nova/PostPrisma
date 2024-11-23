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
const db_1 = require("../db");
const router = express_1.default.Router();
router.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listss = yield (0, db_1.getPosts)(20);
    const subgroups = listss.map((post) => post.subgroup);
    const list = new Set(subgroups);
    const subs = Array.from(list).sort((a, b) => a.localeCompare(b));
    // console.log(`subs: `, subs)
    res.render('subs', { subs });
}));
router.get('/show/:subname', (req, res) => {
    const subName = req.params.subname;
    const posts = (0, db_1.getPosts)(20, subName);
    // console.log(`posts each sub: `, posts)	
    res.render("sub", { posts });
});
exports.default = router;
