import Product from '../../models/product.js';

export async function getProducts(queryParams, page = 1, perPage = 10) {
  const { id, name, category, priceMin, priceMax, minStock, search, totalPrice, averageRating, sortField, sortOrder } = queryParams;
  let query = { show: true }; // Agregamos la condición para mostrar solo productos con show=true

  if (id) {
    query._id = id;
  }

  if (name) {
    query.name = { $regex: new RegExp(name, 'i') };
  }

  if (category) {
    const categoriesArray = Array.isArray(category) ? category : [category];
    query.categories = { $all: categoriesArray };
  }

  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = parseFloat(priceMin);
    if (priceMax) query.price.$lte = parseFloat(priceMax);
  }

  if (minStock) {
    query.stock = { $gte: parseInt(minStock) };
  }

  if (search) {
    query.$or = [
      { name: { $regex: new RegExp(search, 'i') } },
      { description: { $regex: new RegExp(search, 'i') } },
      { categories: { $regex: new RegExp(search, 'i') } }
    ];
  }

  if (totalPrice) {
    query.totalPrice = parseFloat(totalPrice);
  }

  if (averageRating) {
    query.averageRating = { $gte: parseFloat(averageRating) };
  }

  try {
    let productsQuery = Product.find(query).collation({ locale: 'en', strength: 2 });

    if (sortField && sortOrder) {
      const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
      productsQuery = productsQuery.sort(sortOptions);
    }

    const totalCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const currentPage = Math.max(Math.min(page, totalPages), 1); // Ajustar page para asegurar que esté dentro del rango válido

    const products = await productsQuery
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .exec();

    if (products.length === 0) {
      return {
        currentPage,
        totalPages,
        totalCount,
        perPage,
        products: [],
        message: "No se encontraron productos."
      };
    }

    return {
      currentPage,
      totalPages,
      totalCount,
      perPage,
      products
    };
  } catch (error) {
    throw new Error(`Error al obtener los productos: ${error.message}`);
  }
}

export async function getHiddenProducts(queryParams, page = 1, perPage = 10) {
  try {
    const { search } = queryParams;

    let query = { show: false }; // Filtrar por productos ocultos

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
        { categories: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const totalCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const currentPage = Math.max(Math.min(page, totalPages), 1);

    const hiddenProducts = await Product.find(query)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (hiddenProducts.length === 0) {
      return {
        currentPage,
        totalPages,
        totalCount,
        perPage,
        products: [],
        message: "No se encontraron productos ocultos."
      };
    }

    return {
      currentPage,
      totalPages,
      totalCount,
      perPage,
      products: hiddenProducts
    };
  } catch (error) {
    throw new Error('Error al obtener los productos ocultos: ' + error.message);
  }
}

export async function createProduct(productData) {
  try {
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw new Error('Error al crear el producto: ' + error.message);
  }
}

export async function updateProduct(id, productData) {
  try {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    return product;
  } catch (error) {
    throw new Error('Error al actualizar el producto: ' + error.message);
  }
}

export async function deleteProduct(id) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct; // Devuelve el producto eliminado
  } catch (error) {
    throw new Error('Error al eliminar el producto: ' + error.message);
  }
}

export async function getProductsByCategory(category) {
  try {
    const products = await Product.findByCategory(category);
    return products;
  } catch (error) {
    throw new Error('Error al obtener los productos por categoría: ' + error.message);
  }
}

export async function getProductById(id) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new ValidationError('Producto no encontrado');
    }
    return product;
  } catch (error) {
    throw new Error('Error al obtener el producto por ID: ' + error.message);
  }
}
