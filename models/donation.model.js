const db = require('../db');

// استرجاع جميع التبرعات
const getAllDonations = (callback) => {
    db.query('SELECT * FROM donation', (err, result) => {
        callback(err, result);
    });
};

// إضافة تبرع جديد
const createDonation = (newDonation, callback) => {
    const query = `
        INSERT INTO donation (amount, donor_name, date, category, orphan_id, orphanage_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [
        newDonation.amount,
        newDonation.donor_name,
        newDonation.date,
        newDonation.category,
        newDonation.orphan_id !== undefined ? newDonation.orphan_id : null,
    newDonation.orphanage_id !== undefined ? newDonation.orphanage_id : null
    ], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, { id: result.insertId, ...newDonation });
    });
};

// استرجاع تبرع حسب id
const getDonationById = (id, callback) => {
    db.query('SELECT * FROM donation WHERE id = ?', [id], (err, result) => {
        if (err) {
            return callback({ message: "Error fetching donation." }, null);
        }
        if (result.length === 0) {
            return callback({ message: "Donation not found." }, null);
        }
        callback(null, result[0]);
    });
};

// تعديل بيانات تبرع
const updateDonation = (id, updatedData, callback) => {
    const query = `
        UPDATE donation
        SET amount = ?, donor_name = ?, date = ?, category = ?, orphan_id = ?, orphanage_id = ?
        WHERE id = ?
    `;
    db.query(query, [
        updatedData.amount,
        updatedData.donor_name,
        updatedData.date,
        updatedData.category,
        updatedData.orphan_id || null,
        updatedData.orphanage_id || null,
        id
    ], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        if (result.affectedRows === 0) {
            return callback({ message: "Donation not found." }, null);
        }
        callback(null, { id, ...updatedData });
    });
};

// حذف تبرع
const deleteDonation = (id, callback) => {
    db.query('DELETE FROM donation WHERE id = ?', [id], (err, result) => {
        if (err) {
            return callback({ message: "Error deleting donation." }, null);
        }
        if (result.affectedRows === 0) {
            return callback({ message: "Donation not found." }, null);
        }
        callback(null, { message: "Donation deleted successfully." });
    });
};

module.exports = {
    getAllDonations,
    createDonation,
    getDonationById,
    updateDonation,
    deleteDonation
};
