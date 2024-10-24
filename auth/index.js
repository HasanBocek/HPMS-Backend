var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Employee = require('../models/Employee');

const validator = {
  email: async (email) => {
    if (!email || !await Employee.findOne({ "contact.email": email })) {
      return "Lütfen kayıtlı bir E-posta adresi girin.";
    }
    return false;
  },
  password: async (password) => {
    if (!password) {
      return "Lütfen bir şifre girin.";
    }
    return false;
  }
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const requestDetails = { method: req.method, url: req.originalUrl, headers: req.headers, body: req.body };
  let responseBody;

  try {
    const errors = await Promise.all([validator.email(email), validator.password(password)]);
    const errorsArray = errors.filter(Boolean);

    if (errorsArray.length > 0) {
      responseBody = { error: true, message: "errors", data: errorsArray };

      return res.status(200).json(responseBody);
    }
    let employee = await Employee.findOne({ "contact.email": email });
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      responseBody = { error: true, message: "errors", data: ["Lütfen şifreyi doğru girin."] };

      return res.status(200).json(responseBody);
    }
    const token = jwt.sign({ _id: employee._id }, process.env.JWT_SECRET);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    })

    responseBody = { error: false, message: "Oturum başarılı bir şekilde açıldı." };

    res.status(200).json(responseBody);
  } catch (error) {
    responseBody = { error: true, message: "error", data: error };

    return res.status(200).json(responseBody);
  }
});

router.get('/logout', async (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 })
  res.json({ error: false, message: "Oturum kapatıldı." });
});

router.get("/test", async (req, res) => {
  try {
    const cookie = req.cookies['jwt']
    const claims = jwt.verify(cookie, process.env.JWT_SECRET)

    if (!claims) {
      return res.status(401).json({ error: true, message: "Aktif oturum bulunamadı." })

    }
    const employee = await Employee.findOne({ _id: claims._id })
    if (!employee) {
      return res.status(401).json({ error: true, message: "Aktif oturum bulunamadı." })
    }
    res.json({ error: false, message: employee });
  } catch (error) {
    return res.status(401).json({ error: true, message: "Aktif oturum bulunamadı." })
  }
});
module.exports = router;
