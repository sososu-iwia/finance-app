export const healthCheck = (db) => {
  return async (req, res) => {
    try {
      if (db?.ping) {
        await db.ping();
      }

      res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      res.status(503).json({
        status: 'degraded',
        timestamp: new Date().toISOString(),
      });
    }
  };
};
