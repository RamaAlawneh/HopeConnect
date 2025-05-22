const jwt = require('jsonwebtoken');
const SECRET = '1a2s3q5t7c'; // من الأفضل تخزين هذا في ملف .env

// ✅ ميدلوير للتحقق من التوكن
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'لم يتم توفير التوكن' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'توكن غير صالح أو منتهي الصلاحية' });
    }

    req.user = decoded; // ✅ حفظ بيانات المستخدم من التوكن
    next();
  });
};

// ✅ يسمح فقط لـ Super Admin
exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super') {
    return res.status(403).json({ message: 'الدخول مرفوض، هذا المسار مخصص لـ Super Admin فقط' });
  }
  next();
};

// ✅ التحقق من صلاحية معينة (permission)
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    let userPermissions = req.user?.permissions || [];

    // إذا كانت permissions مخزنة كنص في قاعدة البيانات، نحولها لمصفوفة
    if (typeof userPermissions === 'string') {
      try {
        userPermissions = JSON.parse(userPermissions);
      } catch (error) {
        userPermissions = [];
      }
    }

    // تأكد أن userPermissions مصفوفة
    if (!Array.isArray(userPermissions)) {
      userPermissions = [];
    }

    // تحقق من وجود الصلاحية المطلوبة
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ message: `Access denied. Permission required: ${permission}` });
    }

    next();
  };
};
