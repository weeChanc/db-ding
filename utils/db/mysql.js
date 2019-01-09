var mysql = require('mysql')

var pool = mysql.createPool(
    {
        host: 'localhost',
        user: 'ding-admin',
        password: '123456',
        port: '3306',
        database: 'ding'
    }
)



module.exports = {
    getConnection: function(){
        return new Promise((resolve,reject)=>{
            pool.getConnection(function (err, connection) {
                if(err ) reject(err)
                else{
                    resolve(connection)
                }
            });
        })
    },

    begin: function(){
        return new Promise((resolve,reject)=>{
            pool.getConnection(function (err, connection) {
                if(err ) reject(err)
                else{
                    connection.beginTransaction(function (err) {
                        if(err) {
                            reject(err)
                            connection.release()
                        }
                        else{
                            resolve(connection)
                        }
                    })
                }
            });
        })
    },


    exec: function (sql, values) {
        // 返回一个 Promise
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        // 结束会话
                        connection.release()
                    })
                }
            })
        })
    },

    execBy: function (sql, values, conn) {
        return new Promise((reslove, reject) => {
            conn.query(sql, values, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    reslove(rows)
                }
            })
        })
    },

    execTrans: function (funcs) {
        return new Promise((resolve, reject) => {
            pool.getConnection(async function (err, conn) {
                var result = []
                if (err) reject(err)
                else {
                    try {
                        for (let i = 0; i < funcs.length; i++) {
                            const r = await funcs[i](conn)
                            result.push(r)
                        }
                    }catch (e) {
                        conn.rollback()
                        reject(e)
                    }
                }
                conn.commit()
                resolve(result)
            })
        })
    },

    execTransition: function (sqls, values) {
        pool.getConnection(async function (err, conn) {
            if (err) reject(err)
            else {
                conn.beginTransaction()
                var list = []
                try {
                    for (let i = 0; i < sql.size(); i++) {
                        await this.execBy(sqls[i], values[i], conn)
                    }
                } catch (e) {
                    conn.rollback()
                }
                conn.commit();
            }
        })
    }
}
