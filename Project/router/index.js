const Router = require("express");
const router = new Router();
const homeRouter = require("./homeRouter");
const authRouter = require("./authRouter")
const courseRouter = require("./courseRouter")
const profileRouter = require("./profileRouter")

router.use("/", homeRouter);
router.use("/auth", authRouter);
router.use("/courses", courseRouter);
router.use("/profile", profileRouter); //штука со статистикой
//router.use("/entry", entryRouter);



module.exports = router;