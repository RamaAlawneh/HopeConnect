const { google } = require('googleapis');
const fs = require('fs');
const donationModel = require('../models/donation.model');

const auth = new google.auth.GoogleAuth({
    keyFile: './config/service-account.json',  // تأكد من وجود هذا الملف!
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const spreadsheetId = '17ae7lbY7IlSHSHg4i57y0fpmQLY02h71Wu5KakAXWL4';  // 👈 لازم تغيره بالـ ID الحقيقي

exports.exportDonationsToSheet = async () => {
    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        // جلب البيانات من قاعدة البيانات
        const data = await new Promise((resolve, reject) => {
            donationModel.getAllDonations((err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // تحويل البيانات إلى مصفوفة
        const rows = data.map(donation => [
            donation.id,
            donation.amount,
            donation.donor_name,
            donation.date,
            donation.orphan_id
        ]);

        // إضافة عنوان الأعمدة
        rows.unshift(['ID', 'Amount', 'Donor Name', 'Date', 'Orphan ID']);

        // كتابة البيانات إلى Google Sheet
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'Sheet1!A1',
            valueInputOption: 'USER_ENTERED',
            resource: { values: rows }
        });

        return { success: true, count: rows.length - 1 };

    } catch (error) {
        return { success: false, error: error.message };
    }
};
