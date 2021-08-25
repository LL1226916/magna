let mysql = require('mysql')
let conn = mysql.createConnection({
	host: '',
	user: '',
	password: '',
	prot: ''
})
var srmUrl = "jdbc:mysql://localhost:3306/srm";
var srmUser ="srm";
var srmPassword = "srm_dev@2018";
var srmDriver = "com.mysql.jdbc.Driver";
conn.connect()