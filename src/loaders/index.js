import expressLoader from './express-loader.js';
import mongodbLoader from './mongodb-loader.js';

export async function init(server, config){
    await expressLoader(server);
    await mongodbLoader(config);
}
