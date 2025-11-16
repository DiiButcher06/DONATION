import oracledb from 'oracledb';
import 'dotenv/config';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function getPool() {
  return await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTIONSTRING,
    poolMin: 1,
    poolMax: 4,
    poolIncrement: 1
  });
}
