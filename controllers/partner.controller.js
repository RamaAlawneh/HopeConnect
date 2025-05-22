const {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner
} = require('../models/partner.model');

// ✅ عرض كل الشركاء
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await getAllPartners();
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

// ✅ عرض شريك حسب ID
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await getPartnerById(req.params.id);
    res.json(partner);
  } catch (err) {
    res.status(404).json({ error: err.message || "Partner not found" });
  }
};

// ✅ إنشاء شريك جديد
exports.createPartner = async (req, res) => {
  try {
    const partner = await createPartner(req.body);
    res.status(201).json({ message: "Partner created successfully", partner });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create partner" });
  }
};

// ✅ تعديل شريك
exports.updatePartner = async (req, res) => {
  try {
    const partner = await updatePartner(req.params.id, req.body);
    res.json({ message: "Partner updated successfully", partner });
  } catch (err) {
    res.status(404).json({ error: err.message || "Partner not found" });
  }
};

// ✅ حذف شريك
exports.deletePartner = async (req, res) => {
  try {
    const result = await deletePartner(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message || "Partner not found" });
  }
};
