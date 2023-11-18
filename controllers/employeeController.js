const asyncHandler = require("express-async-handler");
const employee = require("../models/employeeModels");
const multer = require("multer");
const upload = require("../config/multer");
const path = require("path");

//get employee
const getEmployee = asyncHandler(async (req, res) => {
  let { page, size } = req.query;
  const limit = parseInt(size);
  const skip = (page - 1) * size;
  const Totalemployees = await employee.find();

  const employees = await employee.find().limit(limit).skip(skip);
  res.status(200).json({ Totalemployees, employees });
});

//post employee
const createEmployee = asyncHandler(async (req, res) => {
  console.log("the request body is:", req.body);
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: "img upload error" });
    } else if (err) {
      res.status(500).json({ message: "server error" });
    } else {
      const {
        salutation,
        firstName,
        lastName,
        email,
        phone,
        dob,
        address,
        gender,
        qualifications,
        state,
        city,
        country,
        pin,
        password,
        username,
      } = req.body;
      console.log(req.file);
      const imagepath = req.file ? req.file.path : null;

      if (
        !salutation ||
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !gender ||
        !dob ||
        !address ||
        !qualifications ||
        !state ||
        !city ||
        !country ||
        !pin ||
        !password ||
        !username
      ) {
        res.status(400);
        throw new Error("All fields are mandatory");
      }

      try {
        const newEmployee = await employee.create({
          salutation,
          firstName,
          lastName,
          email,
          dob,
          pin,
          qualifications,
          address,
          city,
          gender,
          state,
          phone,
          country,
          password,
          username,
          image: imagepath,
        });

        res.status(201).json({ employee: newEmployee });
      } catch (error) {
        // Handle any potential errors that may occur during the creation process
        res.status(500).json({ error: error.message });
      }
    }
  });
});

// module.exports = createEmployee;

//get employee by id
const getEmployeeByID = asyncHandler(async (req, res) => {
  const employees = await employee.findById(req.params.id);
  if (!employees) {
    res.status(404);
    throw new Error("employee not found");
  }
  res.status(200).json({ employees });
});

//put employee
const editEmployee = asyncHandler(async (req, res) => {
  console.log(req.body);
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: "img upload error" });
    } else if (err) {
      res.status(500).json({ message: "server error" });
  
    }
    let imagePath; 
    if (req.file) {
      imagePath = path.join("uploads", req.file.filename);
    }
    else {
      const employees = await employee.findById(req.params.id);
      if (!employees) {
        res.status(404);
        throw new Error("employee not found");
      }
      imagePath = employees.image;
    }   
      const updateData = {
        //spread-operator
        ...req.body,
        ...(imagePath ? { image: imagePath } : {}), //condition to include image
      };
      const editedEmployee = await employee.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      res.status(200).json({ editedEmployee });
    
  });
});
//delete employee
const deleteEmployee = asyncHandler(async (req, res) => {
  const employees = await employee.findByIdAndDelete(req.params.id);
  if (!employees) {
    res.status(404);
    throw new Error("employee not found");
  }

  res.status(200).json({ employees });
});

//search method
const searchEmployee = asyncHandler(async (req, res) => {
  const search = await employee.find({
    $or: [
      { firstName: { $regex: req.params.key, $options: "i" } },
      { lastName: { $regex: req.params.key, $options: "i" } },
      { dob: { $regex: req.params.key, $options: "i" } },
      { email: { $regex: req.params.key, $options: "i" } },
      { phone: { $regex: req.params.key, $options: "i" } },
      { gender: { $regex: req.params.key, $options: "i" } },
    ],
  });
  if (!search) {  
    res.status(404);
    throw new Error("employee not found");
  }

  res.status(200).json({ search });
});

module.exports = {
  getEmployee,
  searchEmployee,
  createEmployee,
  getEmployeeByID,
  editEmployee,
  deleteEmployee,
};
