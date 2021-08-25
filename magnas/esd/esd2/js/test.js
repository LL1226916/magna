const db = require('./../db/mysql')
db.select().then(res=>{
	console.log(res)
}).catch(reason=>{
	console.log(reason)
})