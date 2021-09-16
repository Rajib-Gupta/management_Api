const multer = require("multer");
const { v4 } = require("uuid");
const path = require("path");
const { Employee } = require("../models/employee.model");
const creatError = require("http-errors");

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, path.join(__dirname, "../", "..", "uploads"));
  },
  filename: (req, file, callBack) => {
    console.log("file", file);
    const ext = path.extname(file.originalname);
    const fileHash = v4();
    const fileName = `${fileHash}${ext}`;
    callBack(null, `${fileName}`);
  },
});

exports.uploads = multer({ storage: storage });

exports.imageUpload = async (req, res) => {
  if (!req.file || Object.keys(req.file).length === 0) {
    return res.status(400).send("No file were uploaded.");
  }

  const emp_id = req.params.emp_id;
  const image = req.file.filename
  try {
    const employee = await Employee.findOne({ where: { id: emp_id } })
    if (!employee) {
      return res.json(creatError.BadRequest())
    }
    const emp = await employee.update({ image })
    res.send(emp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
