const mysql = require('mysql');

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: "localhost",
    user: "zaina",
    password: 'admin123',
    database: "hopeconnect"
});


db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database!');
    }
});

const getOrphanById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM orphan WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject({ message: "Orphan not found" });
            resolve(results[0]);
        });
    });
};

const getAllOrphans = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM orphan', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const createOrphan = (newOrphan) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO orphan (name, age, education_status, health_condition, orphanage_id) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [newOrphan.name, newOrphan.age, newOrphan.education_status, newOrphan.health_condition, newOrphan.orphanage_id], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...newOrphan });
        });
    });
};

const updateOrphan = (id, updatedData) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE orphan SET name = ?, age = ?, education_status = ?, health_condition = ?, orphanage_id = ? WHERE id = ?';
        db.query(query, [updatedData.name, updatedData.age, updatedData.education_status, updatedData.health_condition, updatedData.orphanage_id, id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject({ message: "Orphan not found." });
            resolve({ id, ...updatedData });
        });
    });
};

const deleteOrphan = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM orphan WHERE id = ?', [id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject({ message: "Orphan not found." });
            resolve({ message: "Orphan deleted successfully." });
        });
    });
};

module.exports = {
    getAllOrphans,
    createOrphan,
    getOrphanById,
    updateOrphan,
    deleteOrphan
};
