const db = require('../db');

// استرجاع جميع الكفالات
const getAllSponsorships = (callback) => {
    db.query('SELECT * FROM sponsorship', (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// إنشاء كفالة جديدة
const createSponsorship = (sponsorship, callback) => {
    const query = `
        INSERT INTO sponsorship 
        (sponsor_name, sponsor_contact, amount, start_date, end_date, status, orphan_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        sponsorship.sponsor_name,
        sponsorship.sponsor_contact,
        sponsorship.amount,
        sponsorship.start_date,
        sponsorship.end_date,
        sponsorship.status,
        sponsorship.orphan_id
    ];

    db.query(query, values, (err, result) => {
        if (err) return callback(err);
        callback(null, { id: result.insertId, ...sponsorship });
    });
};

// استرجاع كفالة حسب ID
const getSponsorshipById = (id, callback) => {
    db.query('SELECT * FROM sponsorship WHERE id = ?', [id], (err, result) => {
        if (err) return callback(err);
        callback(null, result[0]);
    });
};

// تحديث كفالة
const updateSponsorship = (id, data, callback) => {
    const query = `
        UPDATE sponsorship SET 
        sponsor_name = ?, sponsor_contact = ?, amount = ?, 
        start_date = ?, end_date = ?, status = ?, orphan_id = ?
        WHERE id = ?`;

    const values = [
        data.sponsor_name,
        data.sponsor_contact,
        data.amount,
        data.start_date,
        data.end_date,
        data.status,
        data.orphan_id,
        id
    ];

    db.query(query, values, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

// حذف كفالة
const deleteSponsorship = (id, callback) => {
    db.query('DELETE FROM sponsorship WHERE id = ?', [id], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

module.exports = {
    getAllSponsorships,
    createSponsorship,
    getSponsorshipById,
    updateSponsorship,
    deleteSponsorship
};
