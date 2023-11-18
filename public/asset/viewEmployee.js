const url = new URL(window.location.href);
const id = url.searchParams.get("id");
console.log(id);

// -------------------------------------VIEW EMPLOYEE-------------------------------

viewDetails(id);
function viewDetails(id) {
  console.log(id);
  fetch(`http://localhost:5001/employee/api/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      document.getElementById(
        "viewEmployeeProfilePic"
      ).innerHTML = ` <img src=${data.employees.image}>`;
      const fullName =
        data.employees.salutation +
        " " +
        data.employees.firstName +
        " " +
        data.employees.lastName;
      document.getElementById("EmployeeName").innerHTML = fullName;
      document.getElementById("EmployeeEmail").innerHTML = data.employees.email;
      document.getElementById("GenderDetails").innerHTML =
        data.employees.gender;
      document.getElementById("DOBDetails").innerHTML = data.employees.dob;
      const DOB = changeformatYMD(data.employees.dob);
      const age = calculateAge(DOB);
      document.getElementById("AgeDetails").innerHTML = age;
      document.getElementById("PhoneNumberDetails").innerHTML =
        data.employees.phone;
      document.getElementById("QualificationsDetails").innerHTML =
        data.employees.qualifications;
      document.getElementById("AddressDetails").innerHTML =
        data.employees.address;
      document.getElementById("UsernameDetails").innerHTML =
        data.employees.username;
    });
}

const DeleteButton = document.getElementById("DeleteButton");

DeleteButton.addEventListener("click", () => {
  console.log(id);
  DeleteWarningModal(id);
});

// -----------------------------End--------VIEW EMPLOYEE-------------------------------------------------
// -------------------------------------Age -- Calculate-------------------------------------------------
function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);

  const currentDate = new Date();

  const timeDiff = currentDate - dob;

  const age = Math.floor(timeDiff / (365.25 * 24 * 60 * 60 * 1000));

  return age;
}

// ----------------------------------End---Age -- Calculate-------------------------------------------------

// ------------------------------------- -- Change format of the DOB-------------------------------------------------

function changeformatYMD(DOB) {
  const [date, month, year] = DOB.split("-");
  let formatteddate = year + "-" + month + "-" + date;
  return formatteddate;
}

// -------------------------------------End -- Change format of the DOB-------------------------------------------------

function DeleteWarningModal(emploID) {
  console.log(emploID);
  const DeleteWarningModal = document.getElementById("DeleteWarningModal");
  DeleteWarningModal.style.visibility = "visible";
  const overLay = document.getElementById("overLay");
  overLay.style.visibility = "visible";
  const deletebtn = document.getElementById("DeleteModal");
  deletebtn.addEventListener("click", () => {
    deleteEmployee(emploID);
  });
}
function CloseDeleteWarningModal() {
  const DeleteWarningModal = document.getElementById("DeleteWarningModal");
  DeleteWarningModal.style.visibility = "hidden";
  // const overLay = document.getElementById('overLay');
  // overLay.style.visibility = 'hidden';
}
// -------------------------------------Delete Employee -------------------------------------------------

function deleteEmployee(emploID) {
  console.log(emploID);
  fetch(`http://localhost:5001/employee/api/${emploID}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      getEmployee();
      // location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  CloseDeleteWarningModal();
}
// ----------------------------------End---Delete Employee -------------------------------------------------

function successDeleteModal() {
  const successDeleteModal = document.getElementById("successDeleteModal");
  successDeleteModal.style.display = "block";
  successDeleteModal.style.zIndex = 1;
  const overLay = document.getElementById("overLay");
  overLay.style.visibility = "visible";
}
function closeSuccessDeleteModal() {
  const successDeleteModal = document.getElementById("successDeleteModal");
  successDeleteModal.style.display = "none";
  const overLay = document.getElementById("overLay");
  overLay.style.visibility = "hidden";
  window.location.href = "/home";
}

const EditButton = document.getElementById("EditButton");
EditButton.addEventListener("click", () => {
  EditEmployee(id);
});

function EditEmployee(emploID) {
  const EditEmployeeForm = document.getElementById("EditEmployeeForm");
  EditEmployeeForm.style.visibility = "visible";
  const overLay = document.getElementById("overLay");
  overLay.style.visibility = "visible";

  fetch(`http://localhost:5001/employee/api/${emploID}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const editedViewEmployeeProfilePic = document.getElementById(
        "editedViewEmployeeProfilePic"
      );
      editedViewEmployeeProfilePic.src = `${data.employees.image}`;
      document.getElementById("editSalutation").value =
        data.employees.salutation;
      document.getElementById("editFirstName").value = data.employees.firstName;
      document.getElementById("editLastName").value = data.employees.lastName;
      document.getElementById("editEmail").value = data.employees.email;
      document.getElementById("editPhone").value = data.employees.phone;
      const dobvalue = data.employees.dob;
      const [day, month, year] = dobvalue.split("-");
      const formattedob = `${year}-${month}-${day}`;
      document.getElementById("Editdob").value = formattedob;
      document.querySelector(
        `input[name="editGender"][value="${data.employees.gender}"]`
      ).checked = true;
      document.getElementById("editQualifications").value =
        data.employees.qualifications;
      document.getElementById("editAddress").value = data.employees.address;
      document.getElementById("editCountry").value = data.employees.country;
      document.getElementById("editState").value = data.employees.state;
      document.getElementById("editCity").value = data.employees.city;
      document.getElementById("editPin").value = data.employees.pin;
    });
  const editEmlo = document.getElementById("SaveEditEmployee");
  editEmlo.addEventListener("click", (e) => {
    e.preventDefault();
    editViewEmployeeData(emploID);
    viewDetails(emploID);
    CloseEditEmployee();
    employyeeEdittedModal();
  });
}

const viewEmployeeProfilePic = document.getElementById(
  "viewEmployeeProfilePic"
);
const imgTagDP = viewEmployeeProfilePic.getElementsByTagName("img")[0];
viewEmployeeProfilePic.addEventListener("click", () => {
  viewEmployeeProfilePic.style.transition = "0.5s";
  viewEmployeeProfilePic.style.width = "300px";
  viewEmployeeProfilePic.style.height = "300px";
  viewEmployeeProfilePic.style.borderRadius = "5%";
  imgTagDP.style.borderRadius = "5%";
});
// Function to close the menu
function DPcloseMenu() {
  viewEmployeeProfilePic.style.width = "100px";
  viewEmployeeProfilePic.style.height = "100px";
  viewEmployeeProfilePic.style.borderRadius = "50%";
  imgTagDP.style.borderRadius = "50%";
}
//------------- Function to handle click outside the menu-------------------
function handleOutClick(event) {
  if (!viewEmployeeProfilePic.contains(event.target)) {
    DPcloseMenu();
  }
}
document.addEventListener("mousedown", handleOutClick);

let editedViewEmployeeProfilePic = document.getElementById(
  "editedViewEmployeeProfilePic"
);
let viewEmployeeEditImageInput = document.getElementById(
  "viewEmployeeEditImageInput"
);
viewEmployeeEditImageInput.onchange = function () {
  editedViewEmployeeProfilePic.src = URL.createObjectURL(
    viewEmployeeEditImageInput.files[0]
  );
};

// -------------------------------------PUT method-------------------------------
async function editViewEmployeeData(emploID) {
  const salutation = document.getElementById("editSalutation").value;
  const firstName = document.getElementById("editFirstName").value;
  const lastName = document.getElementById("editLastName").value;
  const email = document.getElementById("editEmail").value;
  const dob = document.getElementById("Editdob").value;
  const gender = document.querySelector(
    'input[name="editGender"]:checked'
  ).value;
  // Function for converting the format of date from yyyy-mm-dd to dd-mm-yyyy
  var dateofbirth = changeformat(dob);
  function changeformat(val) {
    const Array = val.split("-");
    let year = Array[0];
    let month = Array[1];
    let day = Array[2];
    let formatteddate = day + "-" + month + "-" + year;
    return formatteddate;
  }

  const qualifications = document.getElementById("editQualifications").value;
  const address = document.getElementById("editAddress").value;
  const city = document.getElementById("editCity").value;
  const state = document.getElementById("editState").value;
  const phone = document.getElementById("editPhone").value;
  const country = document.getElementById("editCountry").value;
  const pin = document.getElementById("editPin").value;
  const editImageInput = document.getElementById("viewEmployeeEditImageInput").files[0];

  const EmployeesData = new FormData();
  EmployeesData.append("salutation", salutation);
  EmployeesData.append("firstName", firstName);
  EmployeesData.append("lastName", lastName);
  EmployeesData.append("email", email);
  EmployeesData.append("dob", dateofbirth);
  EmployeesData.append("pin", pin);
  EmployeesData.append("gender", gender);
  EmployeesData.append("qualifications", qualifications);
  EmployeesData.append("address", address);
  EmployeesData.append("city", city);
  EmployeesData.append("state", state);
  EmployeesData.append("phone", phone);
  EmployeesData.append("country", country);
  EmployeesData.append("image", editImageInput);
  EmployeesData.append("username", firstName);
  EmployeesData.append("password", phone);

  
  await fetch(`http://localhost:5001/employee/api/${emploID}`, {
    method: "PUT",
    body: EmployeesData,

  }).then((response) => {
    
    return response.json();
  })
    .then((data) => {
      console.log(data);
      getEmployee();
      CloseAddEmployee();
      employyeeEdittedModal();
    })
    .catch((error) => {
      console.log(error - "error");
    });
}

// -----------------------------End--------PUT method-------------------------------
