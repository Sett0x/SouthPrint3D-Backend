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
    query.categories = { $regex: new RegExp(category, 'i') };
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
    // Obtener el producto actual
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      throw new Error('Producto no encontrado');
    }

    // Actualizar el producto con los datos proporcionados
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });

    // Verificar si se proporcionó un descuento en los datos actualizados
    if (productData.discount && productData.discount > 0) {
      // Calcular los precios y el IVA con el nuevo descuento aplicado
      const discountAmount = updatedProduct.price * (productData.discount / 100);
      updatedProduct.priceWithDiscount = updatedProduct.price - discountAmount;
      updatedProduct.totalPriceWithDiscount = updatedProduct.priceWithDiscount + (updatedProduct.priceWithDiscount * updatedProduct.iva);
      updatedProduct.ivaPrice = parseFloat((updatedProduct.totalPriceWithDiscount - updatedProduct.priceWithDiscount).toFixed(2));
      updatedProduct.ivaForTotalPrice = parseFloat((updatedProduct.price * updatedProduct.iva).toFixed(2));
    } else {
      // Si no se proporcionó un nuevo descuento, eliminar los campos relacionados con el descuento
      updatedProduct.discount = 0;
      updatedProduct.priceWithDiscount = null;
      updatedProduct.totalPriceWithDiscount = null;
      updatedProduct.ivaPrice = null;
      updatedProduct.ivaForTotalPrice = parseFloat((updatedProduct.price * updatedProduct.iva).toFixed(2));
    }

    // Guardar los cambios realizados
    await updatedProduct.save();

    return updatedProduct;
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
