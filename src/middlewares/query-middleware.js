export function parseQuery(req, res, next) {
  const { limit = 10, offset = 0 } = req.query;
  req.query = { limit: parseInt(limit, 10), offset: parseInt(offset, 10) };
  next();
}
