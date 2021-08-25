const db = require('./../db/mysql')
db.select().then(res=>{
	var details = []
	for(var a in res){
		details.push(res[a])
	}
	console.log(res)
	//console.log(details)
}).catch(reason=>{
	console.log(reason)
})