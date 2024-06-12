// Helper function for pagination with population
export const paginate = async (
  model,
  query = {},
  page = 1,
  perPage = 10,
  sort = { createdAt: -1 },
  populateOptions = null
) => {
  const skip = (page - 1) * perPage;

  let queryBuilder = model.find(query).skip(skip).limit(perPage).sort(sort);

  if (populateOptions) {
    queryBuilder = queryBuilder.populate(populateOptions);
  }

  const documents = await queryBuilder;

  const totalCount = await model.countDocuments(query);
  const totalPages = Math.ceil(totalCount / perPage);

  return {
    documents,
    pagination: {
      totalCount,
      totalPages,
      currentPage: page,
      perPage,
    },
  };
};
