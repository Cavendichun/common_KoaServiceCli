import mysql from 'mysql';

//初始化连接池
let pool = null;

export const createConnectionPool = async (config) => {
    let mysql_config = {
        host: config.HOST,
        user: config.USER,
        password: config.PASSWORD,
        database: config.DATABASE,
        port: config.PORT
    }
    //尝试第一次连接
    let cnt = await mysql.createConnection(mysql_config);
    await new Promise((resolve, reject) => {
        cnt.connect((err) => {
            if (err) {
                console.log('数据库连接异常');
                throw err;
            } else {
                console.log('数据库连接成功，建立连接池');
                //建立连接池
                pool = mysql.createPool(mysql_config);
                resolve();
            }
        })
    })
}

export const query = async (sql, value) => {
    return await new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                reject(4002)
            } else {
                connection.query(sql , value, (err, fields) => {
                    if (err) {
                        console.error(err);
                        reject(4003);
                    } else {
                        resolve(fields);
                    }
                    connection.release();
                })
            }
        })
    })
}
