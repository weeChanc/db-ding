var mysql = require('mysql')

var pool = mysql.createPool(
    {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'ding'
    }
)

module.exports = {
    exec : function( sql, values ) {
        // 返回一个 Promise
        return new Promise(( resolve, reject ) => {
            pool.getConnection(function(err, connection) {
                if (err) {
                    reject( err )
                } else {
                    connection.query(sql, values, ( err, rows) => {

                        if ( err ) {
                            reject( err )
                        } else {
                            resolve( rows )
                        }
                        // 结束会话
                        connection.release()
                    })
                }
            })
        })
    },

    execBy : function ( sql ,values ,conn){
        return new Promise((reslove , reject) => {
            conn.query(sql,values,(err,rows) => {
                if(err ){
                    reject(err)
                }else{
                    reslove(rows)
                }
            })
        })
    },

    execTransition:  function (sqls, values) {
        pool.getConnection(async function (err, conn) {
            if(err) reject(err)
            else{
                conn.beginTransaction()
                var list = []
                try{
                    for(let i = 0 ; i < sql.size() ; i++ ){
                        await this.execBy(sqls[i],values[i],conn)
                    }
                }catch (e) {
                    conn.rollback()
                }
                conn.commit();
            }
        })
    }
}
