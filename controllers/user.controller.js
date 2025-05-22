const User = require('../models/user.model'); // أو المسار الصحيح
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = '1a2s3q5t7c';

// مخطط التحقق
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'volunteer', 'sponsor').required(),
  password: Joi.string().min(6).required()
});

// تسجيل مستخدم
exports.register = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  User.findByEmail(req.body.email, async (err, existingUser) => {
    if (err) return res.status(500).json({ message: 'خطأ في السيرفر' });
    if (existingUser) return res.status(400).json({ message: 'البريد الإلكتروني مستخدم مسبقًا' });

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = {
        ...req.body,
        password: hashedPassword,
        permissions: req.body.permissions || [] // تأكد أنه موجود إذا احتجته
      };

      User.create(newUser, (err, result) => {
        if (err) return res.status(500).json({ message: 'فشل في إنشاء المستخدم', error: err });

        // توليد التوكن بعد النجاح
        const token = jwt.sign(
          { id: result.insertId, role: newUser.role, permissions: newUser.permissions },
          SECRET,
          { expiresIn: '1d' }
        );

        res.status(201).json({ message: 'تم إنشاء المستخدم', token });
      });
    } catch (e) {
      res.status(500).json({ message: 'خطأ عند التشفير', error: e });
    }
  });
};

// بقية الدوال:
exports.getUserById = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).json({ message: 'خطأ في جلب المستخدم' });
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
    res.json(user);
  });
};

exports.updateUser = (req, res) => {
  const id = req.params.id;
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'volunteer', 'sponsor').required(),
    permissions: Joi.array().items(Joi.string()).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  User.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ message: 'فشل في التحديث', error: err });
    res.json({ message: 'تم التحديث بنجاح' });
  });
};

exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'فشل في الحذف', error: err });
    res.json({ message: 'تم الحذف بنجاح' });
  });
};



// ✅ استرجاع المستخدم الحالي بناءً على التوكن
exports.getCurrentUser = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'الرجاء تسجيل الدخول مجددًا' });
  }

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).json({ message: 'خطأ في السيرفر' });
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
    res.json(user);
  });
};
