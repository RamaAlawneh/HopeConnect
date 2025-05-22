const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

// ✅ تسجيل مدير جديد
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    Admin.create({ name, email, password: hashedPassword, role }, (err, result) => {
      if (err) {
        console.error('Registration error:', err);
        return res.status(500).json({
          message: 'فشل في إنشاء حساب المدير',
          error: err.message
        });
      }
      res.status(201).json({ message: 'تم تسجيل المدير بنجاح' });
    });
  } catch (err) {
    console.error('Hashing error:', err);
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
};

// ✅ تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }

    // تحويل callback إلى Promise لاستخدام await
    const admin = await new Promise((resolve, reject) => {
      Admin.findByEmail(email, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!admin) {
      return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    // مقارنة كلمة المرور (دعم للقديم وغير المشفر إن وجد)
    let isMatch;
    if (admin.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, admin.password);
    } else {
      isMatch = password === admin.password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions || []
      },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions || []
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
};

// ✅ جلب جميع المدراء
exports.getAllAdmins = (req, res) => {
  Admin.getAll((err, results) => {
    if (err) {
      console.error('Fetch admins error:', err);
      return res.status(500).json({
        message: 'فشل في جلب المدراء',
        error: err.message
      });
    }
    res.json(results);
  });
};

// ✅ حذف مدير حسب الـ ID
exports.deleteAdmin = (req, res) => {
  const id = req.params.id;

  Admin.deleteById(id, (err) => {
    if (err) {
      console.error('Delete admin error:', err);
      return res.status(500).json({
        message: 'فشل في حذف المدير',
        error: err.message
      });
    }
    res.json({ message: 'تم حذف المدير بنجاح' });
  });
};
