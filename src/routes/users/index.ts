'use strict';

import { Router } from "express";

import { AuthRequest } from "../../interfaces";
import { Scope } from "../../enums/scope";
import UserValidator from "./users.validator"
import UserController from "./users.controller"
import Auth from "../../middleware/auth"

const router = Router();

/**
 * restrict routers
 */
router.post('/', Auth(Scope.ADMIN), UserValidator().create(),
    (req: AuthRequest, res, next) => {
        UserController().create(req, res).catch(next);
    });

router.get('/:id', Auth(Scope.ADMIN),
    (req: AuthRequest, res, next) => {
        UserController().findById(req, res).catch(next);
    });

router.get('/', Auth(Scope.ADMIN),
    (req: AuthRequest, res, next) => {
        UserController().find(req, res).catch(next);
    });

router.get('/get/profile', Auth(),
    (req: AuthRequest, res, next) => {
        UserController().profile(req, res).catch(next);
    });

router.put('/:id', Auth(Scope.ADMIN), UserValidator().change(),
    (req: AuthRequest, res, next) => {
        UserController().update(req, res).catch(next);
    });

router.delete('/:id', Auth(Scope.ADMIN),
    (req: AuthRequest, res, next) => {
        UserController().delete(req, res).catch(next);
    });

router.get('/email/:email', Auth(Scope.ADMIN),
    (req, res, next) => {
        UserController().isEmailAvailable(req, res).catch(next);
    });

// this route require a token provided by env variable ADMIN_TOKEN
router.put('/admin/:uid',
    (req: AuthRequest, res, next) => {
        UserController().createAdmin(req, res).catch(next);
    });

export default router;