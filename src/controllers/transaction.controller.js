import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { validate, validateQuery } from '../validation/validation.middleware.js';
import {
    createTransactionSchema,
    updateTransactionSchema,
    queryTransactionSchema,
} from '../validation/transaction.schemas.js';

export const transactionController = (transactionService) => {
    const router = Router();

    router.get(
        '/',
        validateQuery(queryTransactionSchema),
        asyncHandler(async (req, res) => {
            const transactions = await transactionService.findAll(
                req.user.userId,
                req.query
            );
            res.json(transactions);
        })
    );

    router.post(
        '/',
        validate(createTransactionSchema),
        asyncHandler(async (req, res) => {
            const transaction = await transactionService.create(
                req.user.userId,
                req.body
            );
            res.status(201).json(transaction);
        })
    );

    router.get(
        '/:id',
        asyncHandler(async (req, res) => {
            const transaction = await transactionService.findById(
                req.user.userId,
                req.params.id
            );
            res.json(transaction);
        })
    );

    router.put(
        '/:id',
        validate(updateTransactionSchema),
        asyncHandler(async (req, res) => {
            const transaction = await transactionService.update(
                req.user.userId,
                req.params.id,
                req.body
            );
            res.json(transaction);
        })
    );

    router.delete(
        '/:id',
        asyncHandler(async (req, res) => {
            await transactionService.delete(req.user.userId, req.params.id);
            res.sendStatus(204);
        })
    );

    return router;
};
