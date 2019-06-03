import fs from 'fs';
import path from 'path';

let middleWares = {}, paths = [];
//获取所有中间件文件名
fs.readdirSync(__dirname).filter(i => i != 'index.js').map(n => paths.push(n))
//便利引用所有中间件
paths.map(i => {
    middleWares[i.split('.')[0]] = require(path.resolve(__dirname, i)).default
})
//暴露的每个中间件的名称就是中间件的文件名
export default middleWares;
