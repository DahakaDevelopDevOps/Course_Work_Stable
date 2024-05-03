const Router = require("express");
const router = new Router();
const homeRouter = require("./homeRouter");
const authRouter = require("./authRouter")
const courseRouter = require("./courseRouter")

router.use("/", homeRouter);
router.use("/auth", authRouter);
router.use("/courses", courseRouter);
// router.use("/profile", profileRouter); //штука со статистикой



module.exports = router;