"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fake_db_1 = require("../fake-db");
const router = express_1.default.Router();
router.get('/list', (req, res) => {
    const list = new Set((0, fake_db_1.getPosts)(20).map(post => post.subgroup));
    const subs = Array.from(list).sort((a, b) => a.localeCompare(b));
    // console.log(`subs: `, subs)
    res.render('subs', { subs });
});
router.get('/show/:subname', (req, res) => {
    const subName = req.params.subname;
    const posts = (0, fake_db_1.getPosts)(20, subName);
    // console.log(`posts each sub: `, posts)	
    res.render("sub", { posts });
});
exports.default = router;
