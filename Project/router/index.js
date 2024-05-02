const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const mastersRouter = require("./mastersRouter");
const enrollmentRouter = require("./enrollmentRouter");
const classesRouter = require("./classesRouter");
const homeRouter = require("./homeRouter");
const authRouter = require("./authRouter")

router.use("/", homeRouter);
router.use("/auth", authRouter);
// router.use("/class", classesRouter);

module.exports = router;