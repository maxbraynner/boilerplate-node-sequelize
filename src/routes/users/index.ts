import { Router } from "express";
import { Scope } from "../../enums/Scope";
import UserValidator from "./users.validator";
import userController from "./users.controller";
import Auth from "../../middlewares/auth";
import { wraper } from "../../utils/requestWraper";

const router = Router();

/**
 * restrict routers
 */
router.post(
    "/",
    Auth(Scope.ADMIN),
    UserValidator().create(),
    wraper(userController.create)
);

router.get("/:id", Auth(), wraper(userController.findById));

router.get("/", Auth(Scope.ADMIN), wraper(userController.find));

router.put("/:id", Auth(Scope.ADMIN), wraper(userController.update));

router.delete("/:id", Auth(Scope.ADMIN), wraper(userController.delete));

router.get(
    "/email/:email",
    Auth(Scope.ADMIN),
    wraper(userController.isEmailAvailable)
);

// this route require a token provided by env variable ADMIN_TOKEN
router.put("/admin/:uid", wraper(userController.createAdmin));

export default router;
