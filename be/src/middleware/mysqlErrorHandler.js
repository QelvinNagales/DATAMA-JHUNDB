/**
 * Global error handler for MySQL and other errors.
 * MySQL trigger errors (errno 1644) are returned as 400 with { status, message } for the frontend.
 */
export default function mysqlErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.errno === 1644) {
    return res.status(400).json({
      status: 'error',
      message: err.message || 'A database constraint was violated.',
    });
  }

  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    return res.status(409).json({
      status: 'error',
      message: err.message || 'Duplicate entry.',
    });
  }

  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({
      status: 'error',
      message: 'Database temporarily unavailable.',
    });
  }

  const isMySql = err.sqlMessage !== undefined || err.errno !== undefined;
  if (isMySql) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'A database error occurred.',
    });
  }

  return res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error.',
  });
}
