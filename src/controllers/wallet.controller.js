import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';

export const walletController = (walletService) => {
  const router = Router();

  router.post(
    '/:id/add',
    asyncHandler(async (req, res) => {
      await walletService.addFunds(
        req.params.id,
        req.body.amount,
        req.user
      );
      res.sendStatus(204);
    })
  );

  router.post(
    '/:id/deduct',
    asyncHandler(async (req, res) => {
      await walletService.deductFunds(
        req.params.id,
        req.body.amount,
        req.user
      );
      res.sendStatus(204);
    })
  );

  return router;
};
