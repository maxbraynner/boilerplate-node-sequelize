'use strict';

import { Router } from "express";
import { transaction } from "../middlewares/transaction";

// import sub-routers
import users from "./users";

const router = Router();

// mount express paths, any addition middleware can be added as well.
// ex. router.use('/pathway', middleware_function, sub-router);

/**
 * Health check
 */
router.get('/', (req, res)=>{
    res.sendStatus(200);
});

/**
 * Transaction middleware
 * rollback on error
 */
router.use(transaction);

router.use('/users', users);

// Export the router
export default router;