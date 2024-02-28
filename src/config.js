import 'dotenv/config';

const config = {
    port: process.env.PORT || 8080,
    icon: {
        url: process.env.ICON_URL,
        apiKey: process.env.ICON_API_KEY,
    },
    // Configuración de la base de datos MongoDB
    mongodb: {
        url: process.env.MONGODB_URL, // URL de conexión a MongoDB
    },
};

export default config;
