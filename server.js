const express = require('express');
const cors = require('cors');
const app = express();

// ✅ إعدادات عامة
app.use(cors());
app.use(express.json());

// ✅ استيراد المسارات
const orphanRoutes = require('./routes/orphan.routes');
const donationRoutes = require('./routes/donation.routes');
const sponsorshipRoutes = require('./routes/sponsorship.routes');
const volunteerRoutes = require('./routes/volunteer.routes');
const logisticsRoutes = require('./routes/logistics.routes');
const adminRoutes = require('./routes/admin.routes');
const emergencyRoutes = require('./routes/emergency.routes');
const feedbackRoutes = require('./routes/feedback.routes');
// إضافة مسارات اليوزر وauth
const userRoutes = require('./routes/user.routes');      // ملف مسارات المستخدمين
const authRoutes = require('./routes/auth.routes');      // ملف مسارات تسجيل الدخول
const transactionRoutes = require('./routes/transaction.routes');
const partnerRoutes = require('./routes/partner.routes');





// ✅ استخدام المسارات
app.use('/api/orphans', orphanRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/partners', partnerRoutes); 

//const orphanageRoutes = require('./routes/orphanages');
//app.use('/api/orphanages', orphanageRoutes);

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));



// مثال: ملف routes أو أي API عندك
const orphanageRoutes = require('./routes/orphanages');
app.use(orphanageRoutes);
app.use(express.static(path.join(__dirname, 'public')));




// مسارات المستخدمين والتوثيق
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

