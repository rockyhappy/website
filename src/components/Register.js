import React, { useState, useRef } from "react";
import axios from "axios";
import "./Register.css"; 
import ReCAPTCHA from "react-google-recaptcha";

const branchCodes = {
  ME: "40",
  ECE: "31",
  EE: "21",
  "CSE(Hindi)": "169",
  "CSE (Hindi)": "169",
  AIML: "164",
  "CSE(DS)": "154",
  "CSE (DS)": "154",
  "CSE(AIML)": "153",
  "CSE (AIML)": "153",
  IT: "13",
  CS: "12",
  CSIT: "11",
  "CS IT": "11",
  CSE: "10",
  CE: "0",
};

function Register() {
  const [formData, setFormData] = useState({
    teamName: "",
    fullName1: "",
    emailId1: "",
    phoneNumber1: "",
    hackerrankProfile1: "",
    branch1: "",
    year1: "",
    gender1: "",
    hosteller1: "",
    studentNumber1: "",
    rollNumber1: "",
    fullName2: "",
    emailId2: "",
    phoneNumber2: "",
    hackerrankProfile2: "",
    branch2: "",
    year2: "",
    gender2: "",
    hosteller2: "",
    studentNumber2: "",
    rollNumber2: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef();

  const validateForm = () => {
    let tempErrors = {};
    const {
      fullName1,
      emailId1,
      phoneNumber1,
      rollNumber1,
      branch1,
      year1,
      hosteller1,
      studentNumber1,
      fullName2,
      emailId2,
      phoneNumber2,
      rollNumber2,
      branch2,
      year2,
      hosteller2,
      studentNumber2,
    } = formData;

    if (!fullName1.trim() || !/^[a-zA-Z\s]+$/.test(fullName1)) {
      tempErrors.fullName1 =
        "Please enter Member 1's valid name (alphabets only).";
    }
    if (!emailId1.endsWith("@akgec.ac.in")) {
      tempErrors.emailId1 = "Member 1's Email must end with @akgec.ac.in";
    }
    if (!/^[6-9]\d{9}$/.test(phoneNumber1)) {
      tempErrors.phoneNumber1 =
        "Member 1's Phone must be a valid 10-digit number.";
    }
    if (
      !studentNumber1.trim() ||
      !/^\d+$/.test(studentNumber1) ||
      studentNumber1.length < 7 ||
      studentNumber1.length > 8
    ) {
      tempErrors.studentNumber1 =
        "Member 1's Student No must be 7 or 8 digits.";
    }
    if (!rollNumber1.trim() || !/^\d{13}$/.test(rollNumber1)) {
      tempErrors.rollNumber1 = "Member 1's Roll No must be exactly 13 digits.";
    } else if (rollNumber1.substring(3, 6) !== "027") {
      tempErrors.rollNumber1 =
        "Member 1's Roll No seems invalid (college code mismatch).";
    } else if (
      branch1 &&
      branchCodes[branch1] &&
      !rollNumber1.substring(5, 9).includes(branchCodes[branch1])
    ) {
      tempErrors.rollNumber1 = `Member 1's Roll No does not match selected branch (${branch1}).`;
    }
    if (!branch1) {
      tempErrors.branch1 = "Please select Member 1's Branch.";
    }
    if (!year1) {
      tempErrors.year1 = "Please select Member 1's year.";
    }
    if (hosteller1 === "") {
      tempErrors.hosteller1 = "Please specify if Member 1 is a hosteller.";
    }

    if (!fullName2.trim() || !/^[a-zA-Z\s]+$/.test(fullName2)) {
      tempErrors.fullName2 =
        "Please enter Member 2's valid name (alphabets only).";
    }
    if (!emailId2.endsWith("@akgec.ac.in")) {
      tempErrors.emailId2 = "Member 2's Email must end with @akgec.ac.in";
    }
    if (!/^[6-9]\d{9}$/.test(phoneNumber2)) {
      tempErrors.phoneNumber2 =
        "Member 2's Phone must be a valid 10-digit number.";
    }
    if (
      !studentNumber2.trim() ||
      !/^\d+$/.test(studentNumber2) ||
      studentNumber2.length < 7 ||
      studentNumber2.length > 8
    ) {
      tempErrors.studentNumber2 =
        "Member 2's Student No must be 7 or 8 digits.";
    }
    if (!rollNumber2.trim() || !/^\d{13}$/.test(rollNumber2)) {
      tempErrors.rollNumber2 = "Member 2's Roll No must be exactly 13 digits.";
    } else if (rollNumber2.substring(3, 6) !== "027") {
      tempErrors.rollNumber2 =
        "Member 2's Roll No seems invalid (college code mismatch).";
    } else if (
      branch2 &&
      branchCodes[branch2] &&
      !rollNumber2.substring(5, 9).includes(branchCodes[branch2])
    ) {
      tempErrors.rollNumber2 = `Member 2's Roll No does not match selected branch (${branch2}).`;
    }
    if (!branch2) {
      tempErrors.branch2 = "Please select Member 2's Branch.";
    }
    if (!year2) {
      tempErrors.year2 = "Please select Member 2's year.";
    }
    if (hosteller2 === "") {
      tempErrors.hosteller2 = "Please specify if Member 2 is a hosteller.";
    }

    if (emailId1 && emailId1 === emailId2) {
      tempErrors.emailId1 = "Emails must be different.";
      tempErrors.emailId2 = "Emails must be different.";
    }
    if (phoneNumber1 && phoneNumber1 === phoneNumber2) {
      tempErrors.phoneNumber1 = "Phone numbers must be different.";
      tempErrors.phoneNumber2 = "Phone numbers must be different.";
    }
    if (rollNumber1 && rollNumber1 === rollNumber2) {
      tempErrors.rollNumber1 = "Roll numbers must be different.";
      tempErrors.rollNumber2 = "Roll numbers must be different.";
    }
    if (year1 && year2 && year1 !== year2) {
      tempErrors.year1 = "Both members must be from the same year.";
      tempErrors.year2 = "Both members must be from the same year.";
    }

    if (!captchaValue) {
      tempErrors.captcha = "Please verify you are not a robot.";
    }

    return tempErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    let isCurrentlyValid = true;
    let inlineErrorMsg = null;

    if (name === "fullName1" || name === "fullName2") {
      if (value && !/^[a-zA-Z\s]*$/.test(value)) {
        inlineErrorMsg = "Only letters and spaces allowed.";
        isCurrentlyValid = false;
      }
    } else if (
      name === "phoneNumber1" ||
      name === "phoneNumber2" ||
      name === "rollNumber1" ||
      name === "rollNumber2" ||
      name === "studentNumber1" ||
      name === "studentNumber2"
    ) {
      if (value && !/^[0-9]*$/.test(value)) {
        inlineErrorMsg = "Only numbers allowed.";
        isCurrentlyValid = false;
      }
    } else if (name === "emailId1" || name === "emailId2") {
      if (value && !/^[a-zA-Z0-9._%+-@]*$/.test(value)) {
        inlineErrorMsg = "Invalid character for email.";
        isCurrentlyValid = false;
      }
      if (
        value.includes("@") &&
        !value.endsWith("@akgec.ac.in") &&
        value.split("@")[1].length > 0
      ) {
        if (!errors[name]?.includes("must end with")) {
          inlineErrorMsg = "Email must end with @akgec.ac.in";
        }
      }
    }

    if (name === "hosteller1" || name === "hosteller2") {
      processedValue = value === "yes" ? true : value === "no" ? false : "";
    }

    if (!isCurrentlyValid) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: inlineErrorMsg }));
      return;
    } else {
      if (errors[name]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
      if (inlineErrorMsg) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: inlineErrorMsg }));
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setErrors({});

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsError(true);

      if (
        Object.keys(validationErrors).length === 1 &&
        validationErrors.captcha
      ) {
        setMessage("Please verify you are not a robot. ❌");
      } else {
        setMessage(
          "Registration failed. Please check the errors on your form. ❌"
        );
      }
      return;
    }

    setLoading(true);
    const payload = { ...formData, recaptchaToken: captchaValue };

    try {
      const response = await axios.post(
        "https://api.programmingclub.live/api/registration/team",
        payload
      );
      console.log("Server response:", response.data);
      setLoading(false);
      setMessage("Registration successful! ✅");
      setIsError(false);
      setFormData({
        teamName: "",
        fullName1: "",
        emailId1: "",
        phoneNumber1: "",
        hackerrankProfile1: "",
        branch1: "",
        year1: "",
        gender1: "",
        hosteller1: "",
        studentNumber1: "",
        rollNumber1: "",
        fullName2: "",
        emailId2: "",
        phoneNumber2: "",
        hackerrankProfile2: "",
        branch2: "",
        year2: "",
        gender2: "",
        hosteller2: "",
        studentNumber2: "",
        rollNumber2: "",
      });
      recaptchaRef.current.reset();
      setCaptchaValue(null);
    } catch (error) {
      setLoading(false);
      setIsError(true);
      console.error("API Error:", error.response?.data || error.message);
      recaptchaRef.current.reset();
      setCaptchaValue(null);

      if (error.code === "ERR_NETWORK" || !error.response) {
        setMessage(
          "Registration failed. Cannot connect to server. Please check your internet. ❌"
        );
        return;
      }

      const apiErrorsObject = error.response?.data?.errors;
      const apiErrorMessage = error.response?.data?.message;

      if (apiErrorsObject && typeof apiErrorsObject === "object") {
        if (
          apiErrorsObject.year1 &&
          apiErrorsObject.year1.includes("same year")
        ) {
          apiErrorsObject.year2 = apiErrorsObject.year1;
        }
        if (
          apiErrorsObject.year2 &&
          apiErrorsObject.year2.includes("same year")
        ) {
          apiErrorsObject.year1 = apiErrorsObject.year2;
        }
        setErrors(apiErrorsObject);
        setMessage(
          "Registration failed. Please check the errors below your fields. ❌"
        );
      } else if (apiErrorMessage && typeof apiErrorMessage === "string") {
        const newErrors = {};
        if (
          apiErrorMessage.includes("duplicate key") ||
          apiErrorMessage.includes("already exists")
        ) {
          setMessage(
            "Registration failed: A user with this email, phone, or roll number already exists. ❌"
          );
          if (apiErrorMessage.includes("email")) {
            newErrors.emailId1 = "This email might already be registered.";
            newErrors.emailId2 = "This email might already be registered.";
          }
          if (apiErrorMessage.includes("student_number")) {
            newErrors.studentNumber1 =
              "This student number might already be registered.";
            newErrors.studentNumber2 =
              "This student number might already be registered.";
          }
          if (apiErrorMessage.includes("roll_number")) {
            newErrors.rollNumber1 =
              "This roll number might already be registered.";
            newErrors.rollNumber2 =
              "This roll number might already be registered.";
          }
          setErrors(newErrors);
          return;
        }

        const errorString = apiErrorMessage.replace(
          "Registration failed. ",
          ""
        );
        const errorParts = errorString.split(", ");
        let foundSpecificErrors = false;
        errorParts.forEach((part) => {
          const splitPoint = part.indexOf(":");
          if (splitPoint > -1) {
            foundSpecificErrors = true;
            const key = part.substring(0, splitPoint).trim();
            const value = part.substring(splitPoint + 1).trim();
            if (key.includes("year") && value.includes("same year")) {
              newErrors.year1 = value;
              newErrors.year2 = value;
            } else {
              newErrors[key] = value;
            }
          }
        });

        if (foundSpecificErrors) {
          setErrors(newErrors);
          setMessage(
            "Registration failed. Please check the errors below your fields. ❌"
          );
        } else {
          if (apiErrorMessage.includes("reCAPTCHA")) {
            setMessage(
              "Registration failed: reCAPTCHA verification failed. Please try again. ❌"
            );
          } else {
            setMessage(`Registration failed: ${apiErrorMessage} ❌`);
          }
        }
      } else if (error.response?.status === 500) {
        setMessage(
          "Registration failed: An internal server error occurred. Please contact support. ❌"
        );
      } else {
        setMessage("Registration failed. An unknown error occurred. ❌");
      }
    }
  };

 return (
  <div className="formContainer">
    <form onSubmit={handleSubmit} className="form">
      <h2>
        <span className="highlight">CODE++</span> Registration
      </h2>
      <p className="description">
        Organized by Programming Club, AKGEC
      </p>
      <div className="formGrid">
        <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="teamName" className="label">
            Team Name:<span>*</span>
          </label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
            className="input"
            placeholder="Enter your team name"
          />
        </div>

        <h3 className="gridHeading">Member 1 Details</h3>
        <div className="formGroup">
          <label htmlFor="fullName1" className="label">
            Full Name (Member 1):<span>*</span>
          </label>
          <input
            type="text"
            id="fullName1"
            name="fullName1"
            value={formData.fullName1}
            onChange={handleChange}
            required
            className="input"
            placeholder="Enter member 1's full name"
          />
          <p className="hintText">Only letters and spaces allowed.</p>
          {errors.fullName1 && (
            <p className="errorText">{errors.fullName1}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="emailId1" className="label">
            Email (Member 1):<span>*</span>
          </label>
          <input
            type="email"
            id="emailId1"
            name="emailId1"
            value={formData.emailId1}
            onChange={handleChange}
            required
            className="input"
            placeholder="name.studentno@akgec.ac.in"
          />
          <p className="hintText">Must end with @akgec.ac.in</p>
          {errors.emailId1 && (
            <p className="errorText">{errors.emailId1}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="phoneNumber1" className="label">
            Phone Number (Member 1):<span>*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber1"
            name="phoneNumber1"
            value={formData.phoneNumber1}
            onChange={handleChange}
            required
            className="input"
            placeholder="10-digit mobile number"
            maxLength={10}
          />
          <p className="hintText">
            Must be a 10-digit number (e.g., 9876543210)
          </p>
          {errors.phoneNumber1 && (
            <p className="errorText">{errors.phoneNumber1}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="rollNumber1" className="label">
            Roll Number (Member 1):<span>*</span>
          </label>
          <input
            type="text"
            id="rollNumber1"
            name="rollNumber1"
            value={formData.rollNumber1}
            onChange={handleChange}
            required
            className="input"
            placeholder="Enter 13-digit university roll number"
            maxLength={13}
          />
          <p className="hintText">
            Must be 13 digits (e.g., 230027... or 240027...)
          </p>
          {errors.rollNumber1 && (
            <p className="errorText">{errors.rollNumber1}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="branch1" className="label">
            Branch (Member 1):<span>*</span>
          </label>
          <select
            id="branch1"
            name="branch1"
            value={formData.branch1}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="CS IT">CS & IT</option>
            <option value="CS">CS</option>
            <option value="IT">IT</option>
            <option value="CSE(AIML)">CSE (AIML)</option>
            <option value="AIML">AIML</option>
            <option value="CSE(DS)">CSE (DS)</option>
            <option value="CSE(Hindi)">CSE (Hindi)</option>
            <option value="ECE">ECE</option>
            <option value="EE">EE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
          </select>
          {errors.branch1 && (
            <p className="errorText">{errors.branch1}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="studentNumber1" className="label">
            Student Number (Member 1):<span>*</span>
          </label>
          <input
            type="text"
            id="studentNumber1"
            name="studentNumber1"
            value={formData.studentNumber1}
            onChange={handleChange}
            required
            className="input"
            placeholder="Enter 7 or 8 digit student number"
          />
          <p className="hintText">
            Must be 7 or 8 digits and numbers only.
          </p>
          {errors.studentNumber1 && (
            <p className="errorText">{errors.studentNumber1}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="year1" className="label">
            Year (Member 1):<span>*</span>
          </label>
          <select
            id="year1"
            name="year1"
            value={formData.year1}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Select Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
          </select>
          {errors.year1 && <p className="errorText">{errors.year1}</p>}
        </div>
        <div className="formGroup">
          <label htmlFor="gender1" className="label">
            Gender (Member 1):<span>*</span>
          </label>
          <select
            id="gender1"
            name="gender1"
            value={formData.gender1}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="formGroup">
          <label htmlFor="hosteller1" className="label">
            Hosteller (Member 1):<span>*</span>
          </label>
          <select
            id="hosteller1"
            name="hosteller1"
            value={
              formData.hosteller1 === true
                ? "yes"
                : formData.hosteller1 === false
                ? "no"
                : ""
            }
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Are you a hosteller?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.hosteller1 && (
            <p className="errorText">{errors.hosteller1}</p>
          )}
        </div>
        <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="hackerrankProfile1" className="label">
            HackerRank ID (Member 1):
          </label>
          <input
            type="text"
            id="hackerrankProfile1"
            name="hackerrankProfile1"
            value={formData.hackerrankProfile1}
            onChange={handleChange}
            className="input"
            placeholder="Enter HackerRank username (Optional)"
          />
          {errors.hackerrankProfile1 && (
            <p className="errorText">{errors.hackerrankProfile1}</p>
          )}
        </div>

        <h3 className="gridHeading">Member 2 Details</h3>
        <div className="formGroup">
          <label htmlFor="fullName2" className="label">
            Full Name (Member 2):<span>*</span>
          </label>
          <input
            type="text"
            id="fullName2"
            name="fullName2"
            value={formData.fullName2}
            onChange={handleChange}
            required
            className="input"
            placeholder="Enter member 2's full name"
          />
          <p className="hintText">Only letters and spaces allowed.</p>
          {errors.fullName2 && (
            <p className="errorText">{errors.fullName2}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="emailId2" className="label">
            Email (Member 2):<span>*</span>
          </label>
          <input
            type="email"
            id="emailId2"
            name="emailId2"
            value={formData.emailId2}
            onChange={handleChange}
            required
            className="input"
            placeholder="name.studentno@akgec.ac.in"
          />
          <p className="hintText">Must end with @akgec.ac.in</p>
          {errors.emailId2 && (
            <p className="errorText">{errors.emailId2}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="phoneNumber2" className="label">
            Phone Number (Member 2):<span>*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber2"
            name="phoneNumber2"
            value={formData.phoneNumber2}
            onChange={handleChange}
            required
            className="input"
            placeholder="10-digit mobile number"
            maxLength={10}
          />
          <p className="hintText">
            Must be a 10-digit number (e.g., 9876543210)
          </p>
          {errors.phoneNumber2 && (
            <p className="errorText">{errors.phoneNumber2}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="rollNumber2" className="label">
            Roll Number (Member 2):<span>*</span>
          </label>
          <input
            type="text"
            id="rollNumber2"
            name="rollNumber2"
            value={formData.rollNumber2}
            onChange={handleChange}
            required
            className="input"
            placeholder="Enter 13-digit university roll number"
            maxLength={13}
          />
          <p className="hintText">
            Must be 13 digits (e.g., 230027... or 240027...)
          </p>
          {errors.rollNumber2 && (
            <p className="errorText">{errors.rollNumber2}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="branch2" className="label">
            Branch (Member 2):<span>*</span>
          </label>
          <select
            id="branch2"
            name="branch2"
            value={formData.branch2}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="CS IT">CS & IT</option>
            <option value="CS">CS</option>
            <option value="IT">IT</option>
            <option value="CSE(AIML)">CSE (AIML)</option>
            <option value="AIML">AIML</option>
            <option value="CSE(DS)">CSE (DS)</option>
            <option value="CSE(Hindi)">CSE (Hindi)</option>
            <option value="ECE">ECE</option>
            <option value="EE">EE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
          </select>
          {errors.branch2 && (
            <p className="errorText">{errors.branch2}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="studentNumber2" className="label">
            Student Number (Member 2):<span>*</span>
          </label>
          <input
            type="text"
            id="studentNumber2"
            name="studentNumber2"
            value={formData.studentNumber2}
            onChange={handleChange}
            required
            className="input"
            placeholder="Enter 7 or 8 digit student number"
          />
          <p className="hintText">
            Must be 7 or 8 digits and numbers only.
          </p>
          {errors.studentNumber2 && (
            <p className="errorText">{errors.studentNumber2}</p>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="year2" className="label">
            Year (Member 2):<span>*</span>
          </label>
          <select
            id="year2"
            name="year2"
            value={formData.year2}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Select Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
          </select>
          {errors.year2 && <p className="errorText">{errors.year2}</p>}
        </div>
        <div className="formGroup">
          <label htmlFor="gender2" className="label">
            Gender (Member 2):<span>*</span>
          </label>
          <select
            id="gender2"
            name="gender2"
            value={formData.gender2}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="formGroup">
          <label htmlFor="hosteller2" className="label">
            Hosteller (Member 2):<span>*</span>
          </label>
          <select
            id="hosteller2"
            name="hosteller2"
            value={
              formData.hosteller2 === true
                ? "yes"
                : formData.hosteller2 === false
                ? "no"
                : ""
            }
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Are you a hosteller?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.hosteller2 && (
            <p className="errorText">{errors.hosteller2}</p>
          )}
        </div>
        <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="hackerrankProfile2" className="label">
            HackerRank ID (Member 2):
          </label>
          <input
            type="text"
            id="hackerrankProfile2"
            name="hackerrankProfile2"
            value={formData.hackerrankProfile2}
            onChange={handleChange}
            className="input"
            placeholder="Enter HackerRank username (Optional)"
          />
          {errors.hackerrankProfile2 && (
            <p className="errorText">{errors.hackerrankProfile2}</p>
          )}
        </div>
      </div>

      <div
        className="formGroup"
        style={{
          gridColumn: "1 / -1",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
        <ReCAPTCHA
  ref={recaptchaRef}
  sitekey="6LdiBPkrAAAAAE2m6IRWNs3Gu37Ps6y-MpfwOLRA"
  onChange={(value) => setCaptchaValue(value)}
  theme="dark"
/>
          {errors.captcha && (
            <p className="errorText" style={{ textAlign: "center" }}>
              {errors.captcha}
            </p>
          )}
        </div>
      </div>

      <button type="submit" disabled={loading} className="button">
        {loading ? "Submitting..." : "Register"}
      </button>

      {message && (
        <p
          className={`message ${isError ? "error" : "success"}`}
        >
          {message}
        </p>
      )}
    </form>
  </div>
);
}

export default Register;
