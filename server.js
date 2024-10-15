const express = require("express")
const { json } = require("express/lib/response")
const mysql = require("mysql")
const bodyParser = require("body-parser")


const app = express()
app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: true }))



const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "buku_db"
})
db.connect((err) => {
    if (err) throw err
    console.log("Mysql Connected...")

    app.get("/", (req, res) => {
        const sql_query = "SELECT * FROM books"
        db.query(sql_query, (err, result) => {
            if (err) throw err
            console.log(result)
            const books = JSON.parse(JSON.stringify(result))
            res.render("index", { books: books, title: "Daftar Buku" })
        })

    })
    app.get("/delete/:id", (req, res) => {

        const id = req.params.id

        const sql_query = `DELETE FROM books WHERE id = ${id}`

        db.query(sql_query, (err, result) => {
            if (err) throw err
            res.redirect("/")

        })
    })
    app.post("/tambah", (req, res) => {
        const judul = req.body.judul
        const halaman = req.body.halaman
        const sinopsis = req.body.sinopsis
        const sql_query = `INSERT INTO books (judul, sinopsis, halaman) VALUES ('${judul}','${sinopsis}','${halaman}')`
        db.query(sql_query, (err, result) => {
            if (err) throw err
            res.send(`
                <script>
                  alert('Data berhasil ditambahkan');
                  window.location.href = "/"
                </script>
              `);
        })
    })
    app.get("/edit/:id", (req, res) => {

        const id = req.params.id

        const sql_query = `SELECT * FROM books WHERE id = ${id}`
        db.query(sql_query, (err, result) => {
            if (err) throw err
            const book = JSON.parse(JSON.stringify(result))

            console.log(book)

            res.render("edit", { book: book[0], title: "Edit File" })
        })
    })

    app.post('/update', (req, res) => {
        const id = req.body.id
        const judul = req.body.judul
        const sinopsis = req.body.sinopsis
        const halaman = req.body.halaman
        const sql_query = `UPDATE books SET judul = '${judul}', sinopsis = '${sinopsis}', halaman = '${halaman}' WHERE id = ${id}`
        db.query(sql_query, (err, result) => {
            if (err) throw err
            res.send(`
                <script>
                  alert('Data berhasil diupdate');
                  window.location.href = "/"
                </script>
              `);
        })
    })
    app.listen(8000, () => {
        console.log("Server is running on port 8000")


    })


})