import 'dotenv/config';

const config = {
  port: process.env.PORT || 8080,
  icon: {
    url: process.env.ICON_URL,
    apiKey: process.env.ICON_API_KEY,
  },
  app: {
    secretKey: process.env.APP_SECRET_KEY
  },
  mongodb: {
    url: process.env.MONGODB_URL,
  },
  deployUrl: process.env.DEPLOY_URL
};

export default config;
