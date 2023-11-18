const express = require("express");
const router = express.Router();
const {
  getEmployee,
  createEmployee,
  getEmployeeByID,
  editEmployee,
  deleteEmployee,
  searchEmployee
} = require("../controllers/employeeController");
const upload=require("../config/multer")
// const authenticateUser=require("../middleware/authenticathon");
router.route("/").get(getEmployee);

router.route("/").post(createEmployee);

router.route("/search/:key").get(searchEmployee);
router.route("/:id").get(getEmployeeByID);
router.route("/:id").put(editEmployee);
router.route("/:id").delete(deleteEmployee);

module.exports = router;
