const axios = require('axios');

axios.post('http://localhost:3000/api/donations', {
  donor_name: "تجربة أحمد",
  amount: 500
})
.then(res => {
  console.log("تم الإضافة بنجاح:", res.data);
})
.catch(err => {
  console.error("حدث خطأ:", err.response.data);
});


