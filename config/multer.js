const multer=require("multer");
// const path=require("path");
const StoreFile=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.originalname)
    }
});

const upload=multer({storage:StoreFile}).single("image");

module.exports=upload;
