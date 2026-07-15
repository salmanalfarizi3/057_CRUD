const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',          
    host: 'localhost',          
    database: 'mahasiswa',    
    password: '2025',  
    port: 5432,                 
});

app.use(express.json());

app.get('/biodata', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM biodata ORDER BY id ASC');
        res.status(200).json({
            message: "Berhasil mengambil data biodata",
            data: result.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});

app.post('/biodata', async (req, res) => {
    try {
        const { id, nama, nim, kelas } = req.body;

        if (!id || !nama || !nim || !kelas) {
            return res.status(400).json({ error: "Kolom id, nama, nim, dan kelas harus diisi!" });
        }

        const queryText = 'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [id, nama, nim, kelas];

        const result = await pool.query(queryText, values);
        
        res.status(201).json({
            message: "Berhasil menambahkan biodata baru",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan saat menambahkan data" });
    }
});

