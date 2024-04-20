export const paginationItems = (req, items) => {
  const { query: { limit = 10, offset = 0 } } = req;
  const first = parseInt(offset, 10);
  const step = parseInt(limit, 10);
  const last = first + step;

  // Opciones predefinidas para la cantidad de productos por página
  const defaultOptions = [];
  const maxPerPage = 100; // Máximo de productos por página
  for (let i = 10; i <= maxPerPage; i += 5) {
    defaultOptions.push(i);
  }

  const lastPage = Math.floor((items.total - 1) / step) * step;
  const nextPage = Math.floor(last / step) * step;
  const prevPage = Math.floor((first - step) / step) * step;

  // Generar las opciones de cantidad de productos por página
  const limitOptions = defaultOptions.map(option => ({
    value: option,
    label: option.toString(),
    selected: option === step
  }));

  return {
    links: {
      base: `${req.headers.host}${req.baseUrl}`,
      first: first !== 0 ? `?offset=0&limit=${step}` : undefined,
      previous: first >= step ? `?offset=${prevPage}&limit=${step}` : undefined,
      next: first < lastPage ? `?offset=${nextPage}&limit=${step}` : undefined,
      last: first < lastPage ? `?offset=${lastPage}&limit=${step}` : undefined,
    },
    offset,
    limit,
    limitOptions,
    total: items.total,
    pages: Math.ceil(items.total / step),
    results: items.values,
  };
};
