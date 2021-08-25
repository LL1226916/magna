const mysql = require('mysql')

const pool = mysql.createPool({
	connectionLimit: 10,
	// host: '139.224.114.140',
	// user: 'srm',
	// password: 'srm_dev@2018',
	// port: '3306',
	// database: 'srm'
	host: '10.228.4.174',
	user: 'ink',
	password: 'ink@2019',
	port: '3306',
	database: 'ink'
})

//conn.connect();
function select(){
	return new Promise((resolve,reject)=>{
		let sql = 'select * from OEE'
		pool.query(sql,(err,res)=>{
			err ? reject(err) : resolve(res)
		})
	})
}

module.exports = {select}

//  var sql = 'select * from HR_ACCOUNT'
// conn.query(sql,function(err,res){
// 	if(err){
// 		console.log('[SELECT ERROR]-'+err.message);
// 		return;
// 	}
// 	console.log("select srm" + res)
// })
// conn.end();


// let connection = null
// exports.connect = () => {
//     connection = mysql.createConnection({
//         host: '139.224.114.140',
//         port: '3306',
//         user: 'srm',
//         password: 'srm_dev@2018',
//         database: 'srm'
//     })
//     connection.connect()
//     console.log('数据库连接成功')
//     return connection;
// }

// exports.query = (sql, data, callback) => {
//     connection.query(sql, data, function (err, result, fields) {
//         if (err) throw err
//         callback(result)
//         console.log('查询数据成功')
//     })
//     connection.end()
// }