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

// ✅ استخدام المسارات
app.use('/api/orphans', orphanRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


