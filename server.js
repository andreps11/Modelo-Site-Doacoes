const express = require("express")
const server = express()

server.use(express.static('public'))

server.use(express.urlencoded({ extended: true }))

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'baixo123',
    host: 'localhost',
    port: 5432,
    database: 'siteDoacao'
})

const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result) {
        if(err) return res.send("erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const movel = req.body.movel

    if(name == "" || email == "" || movel == "") {
        return res.send("Todos os campos são obrigatórios.")
    }
    
    const query = `
        INSERT INTO donors ("name", "email", "movel")
        VALUES ($1, $2, $3)`
    
    const values = [name, email, movel]

    db.query(query, values, function(err) {
        if(err) return res.send("erro no banco de dados.")

        return res.redirect("/")
    })
})

server.listen(3000)