import express from "express";
import passport from "../middleware/passport";
const router = express.Router();

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

export default router;