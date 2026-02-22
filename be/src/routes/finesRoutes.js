import express from 'express';
import { mysqlPool } from '../config/db.js';

const router = express.Router();

router.get('/unpaid', async (req, res, next) => {
  try {
    const [rows] = await mysqlPool.query(
      'SELECT * FROM fines WHERE is_paid = FALSE'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.put('/settle/:fine_id', async (req, res, next) => {
  try {
    const { fine_id } = req.params;
    const [result] = await mysqlPool.query(
      'UPDATE fines SET is_paid = TRUE WHERE fine_id = ?',
      [fine_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Fine not found.' });
    }
    res.json({ status: 'ok', message: 'Fine settled.' });
  } catch (err) {
    next(err);
  }
});

export default router;
