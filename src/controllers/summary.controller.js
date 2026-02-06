import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { validateQuery } from '../validation/validation.middleware.js';
import { querySummarySchema } from '../validation/transaction.schemas.js';

export const summaryController = (summaryService) => {
    const router = Router();

    router.get(
        '/',
        validateQuery(querySummarySchema),
        asyncHandler(async (req, res) => {
            const summary = await summaryService.getSummary(
                req.user,
                req.query
            );
            res.json(summary);
        })
    );

    return router;
};
