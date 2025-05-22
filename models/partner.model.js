const connection = require('../db');

// ✅ الحصول على كل الشركاء
const getAllPartners = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM partners', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// ✅ الحصول على شريك حسب ID
const getPartnerById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM partners WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject({ message: "Partner not found" });
            resolve(results[0]);
        });
    });
};

// ✅ إنشاء شريك جديد
const createPartner = (newPartner) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO partners (name, description, contact_email, partnership_type) VALUES (?, ?, ?, ?)';
        connection.query(query, [newPartner.name, newPartner.description, newPartner.contact_email, newPartner.partnership_type], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, ...newPartner });
        });
    });
};

// ✅ تحديث شريك
const updatePartner = (id, updatedData) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE partners SET name = ?, description = ?, contact_email = ?, partnership_type = ? WHERE id = ?';
        connection.query(query, [updatedData.name, updatedData.description, updatedData.contact_email, updatedData.partnership_type, id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject({ message: "Partner not found." });
            resolve({ id, ...updatedData });
        });
    });
};

// ✅ حذف شريك
const deletePartner = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM partners WHERE id = ?', [id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject({ message: "Partner not found." });
            resolve({ message: "Partner deleted successfully." });
        });
    });
};

module.exports = {
    getAllPartners,
    getPartnerById,
    createPartner,
    updatePartner,
    deletePartner
};
