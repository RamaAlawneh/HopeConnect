const { z } = require('zod');
const db = require('../db'); // تأكد من أن هذا هو اتصال mysql2

// ✅ التحقق من الحقول الموجودة فعليًا في قاعدة البيانات فقط
const emergencySchema = z.object({
  case_type: z.string({ required_error: "Case type is required" }),
  description: z.string({ required_error: "Description is required" }),
  priority: z.coerce.number().int().min(1).max(5),
  case_date: z.coerce.date({ required_error: "Case date is required" }),
  status: z.enum(["In Progress", "Completed"], { required_error: "Status is required" }),
  orphan_id: z.coerce.number().optional(),
  volunteer_id: z.coerce.number().optional()
});

// ✅ التحقق من البيانات
const validateEmergencyData = (data) => {
  try {
    const validated = emergencySchema.parse(data);
    return { isValid: true, data: validated };
  } catch (err) {
    return { isValid: false, errors: err.errors };
  }
};

// ✅ إضافة حالة طارئة
async function addEmergencyCase(data) {
  const { isValid, data: validData, errors } = validateEmergencyData(data);
  if (!isValid) {
    throw new Error('Validation failed: ' + errors.map(e => e.message).join(', '));
  }

  const { case_type, description, priority, case_date, status, orphan_id, volunteer_id } = validData;
  const query = `
    INSERT INTO emergency_cases 
    (case_type, description, priority, case_date, status, orphan_id, volunteer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [case_type, description, priority, case_date, status, orphan_id, volunteer_id];

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        reject(new Error('Database error: ' + err.message));
      } else {
        resolve({ id: result.insertId, ...validData });
      }
    });
  });
}

// ✅ جلب كل الحالات
async function getAllEmergencyCases() {
  const query = `SELECT * FROM emergency_cases`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(new Error("حدث خطأ أثناء الاستعلام: " + err.message));
      else resolve(result);
    });
  });
}

// ✅ جلب حالة طارئة بواسطة ID
async function getEmergencyCaseById(id) {
  const query = `SELECT * FROM emergency_cases WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) reject(new Error("حدث خطأ أثناء الاستعلام: " + err.message));
      else resolve(result[0]);
    });
  });
}

// ✅ تعديل حالة طارئة
async function updateEmergencyCase(id, data) {
  const { isValid, data: validData, errors } = validateEmergencyData(data);
  if (!isValid) {
    throw new Error('Validation failed: ' + errors.map(e => e.message).join(', '));
  }

  const { case_type, description, priority, case_date, status, orphan_id, volunteer_id } = validData;
  const query = `
    UPDATE emergency_cases 
    SET case_type = ?, description = ?, priority = ?, case_date = ?, status = ?, orphan_id = ?, volunteer_id = ?
    WHERE id = ?
  `;
  const values = [case_type, description, priority, case_date, status, orphan_id, volunteer_id, id];

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) reject(new Error("خطأ أثناء التحديث: " + err.message));
      else resolve({ id, ...validData });
    });
  });
}

// ✅ حذف حالة طارئة
async function deleteEmergencyCase(id) {
  const query = `DELETE FROM emergency_cases WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) reject(new Error("حدث خطأ أثناء الحذف: " + err.message));
      else resolve({ message: "تم الحذف بنجاح", id });
    });
  });
}

module.exports = {
  emergencySchema,
  validateEmergencyData,
  addEmergencyCase,
  getAllEmergencyCases,
  getEmergencyCaseById,
  updateEmergencyCase,
  deleteEmergencyCase
};

