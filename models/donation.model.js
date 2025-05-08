const db = require('../db');  // استيراد الاتصال بقاعدة البيانات

// استرجاع جميع التبرعات
const getAllDonations = (callback) => {
    db.query('SELECT * FROM donation', (err, result) => {
        callback(err, result);
    });
};

// إضافة تبرع جديد
const createDonation = (newDonation, callback) => {
    // التحقق من وجود اليتيم في قاعدة البيانات
    db.query('SELECT * FROM orphan WHERE id = ?', [newDonation.orphan_id], (err, result) => {
        if (err) {
            return callback({ message: "Error checking orphan." }, null);
        }
        if (result.length === 0) {
            return callback({ message: "Orphan not found." }, null);  // إذا لم يتم العثور على اليتيم
        }

        const query = 'INSERT INTO donation (amount, donor_name, date, orphan_id) VALUES (?, ?, ?, ?)';
        db.query(query, [newDonation.amount, newDonation.donor_name, newDonation.date, newDonation.orphan_id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, { id: result.insertId, ...newDonation });
        });
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
    // التحقق من وجود اليتيم في قاعدة البيانات
    db.query('SELECT * FROM orphan WHERE id = ?', [updatedData.orphan_id], (err, result) => {
        if (err) {
            return callback({ message: "Error checking orphan." }, null);
        }
        if (result.length === 0) {
            return callback({ message: "Orphan not found." }, null);  // إذا لم يتم العثور على اليتيم
        }

        const query = 'UPDATE donation SET amount = ?, donor_name = ?, date = ?, orphan_id = ? WHERE id = ?';
        db.query(query, [updatedData.amount, updatedData.donor_name, updatedData.date, updatedData.orphan_id, id], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            if (result.affectedRows === 0) {
                return callback({ message: "Donation not found." }, null);  // إذا لم يتم العثور على التبرع
            }
            callback(null, { id, ...updatedData });
        });
    });
};

// حذف تبرع
const deleteDonation = (id, callback) => {
    db.query('DELETE FROM donation WHERE id = ?', [id], (err, result) => {
        if (err) {
            return callback({ message: "Error deleting donation." }, null);
        }
        if (result.affectedRows === 0) {
            return callback({ message: "Donation not found." }, null);  // إذا لم يتم العثور على التبرع
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
