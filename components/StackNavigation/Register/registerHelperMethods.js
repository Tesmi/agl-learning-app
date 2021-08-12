import axios from "axios";
const config = require("../../../config");

exports.verifyInputs = ({
  fullname,
  email,
  contact,
  gender,
  grade,
  accountType,
  board,
  password,
  confirmPassword,
  teacherKey,
}) => {
  try {
    if (fullname == undefined || fullname == null || fullname.trim() == "") {
      return "Full name can't be empty";
    }
    if (email == undefined || email == null || email.trim() == "") {
      return "Email can't be empty";
    }
    if (!(email.includes("@") && email.includes("."))) {
      return "Please enter a valid email";
    }
    if (contact == undefined || contact == null || contact.trim() == "") {
      return "Contact can't be empty";
    }

    if (contact.length != 10) {
      return "Please enter a valid contact info";
    }

    if (!(gender == "male" || gender == "female")) {
      console.log(gender);
      return "Please select a valid gender";
    }

    if (accountType == "teacher") {
      if (
        teacherKey == undefined ||
        teacherKey == null ||
        teacherKey.trim() == ""
      ) {
        return "Please select a valid key for teacher's account";
      }
    } else if (accountType == "student") {
      if (grade == undefined || grade == null) {
        return "Please select a valid class";
      }
      if (board == undefined || board == null || board.trim() == "") {
        return "Please select a valid board";
      }
    } else return "Please select a valid account type";

    if (password == undefined || password == null || password.trim() == "") {
      return "Password can't be empty";
    }

    if (
      confirmPassword == undefined ||
      confirmPassword == null ||
      confirmPassword.trim() == ""
    ) {
      return "Confirm-password can't be empty";
    }

    if (password.length < 8) {
      return "Password is too short";
    }

    if (password != confirmPassword) {
      return "Password and Confirm-password does not match";
    }
    return true;
  } catch (error) {
    return "Something went wrong, try again later";
  }
};

exports.verifyTeacherKey = async (key) => {
  try {
    const result = await axios.get(`${config.uri}/public/isKeyAvailable`, {
      params: { key },
    });
    if (result.data.status == "success") {
      return true;
    } else {
      return result.data.msg;
    }
  } catch (error) {
    return "Network error, try again later";
  }
};

exports.sendOTP = (email, fullname, otp) => {
  let msg = `<!DOCTYPE html><html lang="en"><body><h2> Welcome ${fullname} to AGL-Learning-App your otp is</h2><h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2></body></html>`;
  let sub = "OTP from AGL-Learning-App";
  try {
    axios.get(`${config.uri}/public/sendOTP`, { params: { msg, sub, email } });
  } catch (error) {}
};
