import app from './src/app.js';
import config from './src/config.js';

const { port } = config;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
