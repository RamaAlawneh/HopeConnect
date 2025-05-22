const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const SECRET = '1a2s3q5t7c'; // من الأفضل تخزينها في ملف .env

// تسجيل الدخول
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, user) => {
    if (err) return res.status(500).json({ message: 'خطأ في السيرفر' });
    if (!user) return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });

    // إنشاء التوكن مع تضمين الصلاحيات
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        permissions: user.permissions || [] // يجب أن تكون مصفوفة الصلاحيات
      },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'تم تسجيل الدخول بنجاح', token });
  });
};

// ميدلوير لفك التوكن وحماية المسارات
exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'لم يتم توفير التوكن' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'توكن غير صالح' });
    req.user = decoded;
    next();
  });
};

// ميدلوير لفحص الدور فقط (اختياري)
exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح لك، هذا المسار للأدمن فقط' });
  }
  next();
};

// ميدلوير لفحص صلاحية معينة (permissions)
exports.checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || [];
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ message: `Access denied. Permission required: ${requiredPermission}` });
    }
    next();
  };
};
