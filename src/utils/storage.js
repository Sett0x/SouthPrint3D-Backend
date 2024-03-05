import multer from 'multer';

// Configurar el almacenamiento de archivos con Multer
const storage = multer.diskStorage({
  // Especificar la carpeta de destino para guardar los archivos
  destination: (req, file, cb) => {
    cb(null, './images/product_images'); // Ruta relativa a la carpeta raíz del proyecto
  },
  // Especificar el nombre del archivo
  filename: (req, file, cb) => {
    // Obtener el ID del producto desde la solicitud
    const productId = req.body.productId; // Asegúrate de que este sea el nombre correcto del campo que contiene el ID del producto en tu solicitud

    // Generar el nombre del archivo utilizando el ID del producto
    const fileName = `product_${productId}_${Date.now()}-${file.originalname}`;

    cb(null, fileName);
  }
});

// Crear el middleware de Multer con la configuración de almacenamiento
const upload = multer({ storage: storage });

export default upload;
