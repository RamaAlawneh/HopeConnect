const mysql = require('mysql');

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Rama',
    password: '1234',
    database: 'hopeconnect'
});

// الاتصال بقاعدة البيانات
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database!');
    }
});

// استرجاع يتيم حسب ID
const getOrphanById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM orphan WHERE id = ?', [id], (err, result) => {
            if (err) return reject(err);
            if (result.length === 0) return reject({ message: "Orphan not found" });
            resolve(result[0]);
        });
    });
};

// استرجاع جميع الأيتام
const getAllOrphans = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM orphan', (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// إضافة يتيم جديد
const createOrphan = (newOrphan) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO orphan (name, age, education_status, health_condition) VALUES (?, ?, ?, ?)';
        db.query(query, [newOrphan.name, newOrphan.age, newOrphan.education_status, newOrphan.health_condition], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...newOrphan });
        });
    });
};

// تعديل بيانات يتيم
const updateOrphan = (id, updatedData) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE orphan SET name = ?, age = ?, education_status = ?, health_condition = ? WHERE id = ?';
        db.query(query, [updatedData.name, updatedData.age, updatedData.education_status, updatedData.health_condition, id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject({ message: "Orphan not found." });
            resolve({ id, ...updatedData });
        });
    });
};

// حذف يتيم
const deleteOrphan = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM orphan WHERE id = ?', [id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject({ message: "Orphan not found." });
            resolve({ message: "Orphan deleted successfully" });
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
