"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./middleware/passport"));
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.use(express_1.default.static("public"));
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
const indexRoute_1 = __importDefault(require("./routers/indexRoute"));
const authRoute_1 = __importDefault(require("./routers/authRoute"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/', indexRoute_1.default);
app.use('/auth', authRoute_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});
