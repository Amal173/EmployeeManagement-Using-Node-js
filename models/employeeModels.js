const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  salutation: {
    type: String,
    required: [true, "please enter a value"],
  },
  firstName: {
    type: String,
    required: [true, "please enter a value"],
  },
  lastName: {
    type: String,
    required: [true, "please enter a value"],
  },

  email: {
    type: String,
    required: [true, "please enter a value"],
  },
  phone: {
    type: String,
    required: [true, "please enter a value"],
  },
  address: {
    type: String,
    required: [true, "please enter a value"],
  },
  dob: {
    type: String,
    required: [true, "please enter a value"],
  },
  gender: {
    type: String,
    required: [true, "please enter a value"],
  },
  qualifications: {
    type: String,
    required: [true, "please enter a value"],
  },
  state: {
    type: String,
    required: [true, "please enter a value"],
  },
  country: {
    type: String,
    required: [true, "please enter a value"],
  },
  city: {
    type: String,
    required: [true, "please enter a value"],
  },
  pin: {
    type: String,
    required: [true, "please enter a value"],
  },
  username: {
    type: String,
    required: [true, "please enter a value"],
  },
  password: {
    type: String,
    required: [true, "please enter a value"],
  },
  image: {
    type: String,
    required: [true, "please add the image"],
  },
});

module.exports = mongoose.model("employee", employeeSchema);
