const multer = require("multer");
const { query } = require("../database/client");
const { v4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, "upload");
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
    if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|JFIF)$/i) || Object.keys(req.file).length === 0) {
       // return res.status(400).send("No file were uploaded.");
       return res.status(400).json({success:false,message:"Please check file type!"})
    }

    const id = req.params.emp_id;

    try {
        results = await query(
            `UPDATE employees SET image = '${req.file.filename}' where emp_id='${id}'`
        );
        res.send(results);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};
