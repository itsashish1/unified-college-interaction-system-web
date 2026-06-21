/**
 * Paginate a Mongoose query.
 * @param {import('mongoose').Query} query - Mongoose query (before exec)
 * @param {object} opts - { page, limit } from req.query
 * @returns {Promise<{data: Array, pagination: object}>}
 */
export const paginate = async (query, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  // Clone the query for counting (before applying skip/limit)
  const countQuery = query.model.find(query.getFilter());
  const [data, total] = await Promise.all([
    query.skip(skip).limit(limit),
    countQuery.countDocuments(),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};
