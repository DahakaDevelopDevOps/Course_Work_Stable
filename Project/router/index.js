const Router = require("express");
const router = new Router();
const homeRouter = require("./homeRouter");
const authRouter = require("./authRouter")
const courseRouter = require("./courseRouter")
const profileRouter = require("./profileRouter")
const entryRouter = require("./entryRouter")
const adminRouter = require("./adminRouter");

router.use("/", homeRouter);
router.use("/auth", authRouter);
router.use("/courses", courseRouter);
router.use("/profile", profileRouter); 
router.use("/entry", entryRouter);
router.use("/admin", adminRouter);



module.exports = router;