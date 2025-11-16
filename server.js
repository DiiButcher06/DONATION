import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { getPool } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// Endpoint to record a “payment”
app.post('/pay', async (req, res) => {
  const { amount } = req.body; // amount in KSh

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const pool = await getPool();
    const conn = await pool.getConnection();
    try {
      const session_id = 'demo_' + Date.now();

      const insertSql = `
        INSERT INTO payments (session_id, amount, currency, status, created_at)
        VALUES (:session_id, :amount, :currency, :status, SYSTIMESTAMP)
      `;

      await conn.execute(insertSql, {
        session_id,
        amount: amount,
        currency: 'KSh',
        status: 'paid'
      }, { autoCommit: true });

      res.json({ message: 'Payment recorded in Oracle!', session_id });
    } finally {
      await conn.close();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
