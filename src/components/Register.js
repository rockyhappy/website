import React, { useState, useEffect, lazy, Suspense } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { FaCheckCircle } from "react-icons/fa";
import "./Register.css";

// Lazy load particle component
const Particle = lazy(() => import("./Particle"));
const RECAPTCHA_SITE_KEY = "6LePUwUrAAAAAPZdevNjCuMlDlPgEKZQ2aHUZSLE";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch_name: "",
    student_no: "",
    phone: "",
    hackerrank: "",
    gender: "",
    hosteller: "",
    year: "",
    registration_type: ""
  });

  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [shouldRenderParticles, setShouldRenderParticles] = useState(false);
  const [yearError, setYearError] = useState(false);
  const [registrationTypeError, setRegistrationTypeError] = useState(false);

  // Only enable particles on desktop devices and if user's device is powerful enough
  useEffect(() => {
    // Check for desktop and not low-end device
    const isDesktop = window.innerWidth >= 992;
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;
    setShouldRenderParticles(isDesktop && !isLowEndDevice);

    // Add a listener for window resize events
    const handleResize = () => {
      setShouldRenderParticles(window.innerWidth >= 992 && !isLowEndDevice);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validateForm = () => {
    // Email validation for AKGEC domain
    if (!formData.email.endsWith('@akgec.ac.in')) {
      setFormError('Please use your AKGEC email address (@akgec.ac.in)');
      return false;
    }

    // Phone number validation (exactly 10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      setFormError('Please enter a valid 10-digit phone number');
      return false;
    }

    // Student number validation (7 or 8 digits)
    if (!/^\d{7,8}$/.test(formData.student_no)) {
      setFormError('Please enter a valid 7 or 8-digit student number');
      return false;
    }

    // Year validation (only 1st and 2nd year allowed)
    if (formData.year !== "1" && formData.year !== "2") {
      setFormError('Only 1st and 2nd year students are eligible for this event');
      return false;
    }

    // Registration type validation based on year
    if (formData.year === "2" && formData.registration_type === "workshop_contest") {
      setFormError('2nd year students can only register for Contest Only option');
      return false;
    }

    // Required fields validation (all except hackerrank)
    if (!formData.name || !formData.email || !formData.branch_name || 
        !formData.student_no || !formData.phone || !formData.gender || 
        !formData.hosteller || !formData.year || !formData.registration_type) {
      setFormError('All fields are required except HackerRank profile');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number to remove any non-digit characters and limit to 10 digits
    if (name === 'phone') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prevState => ({
        ...prevState,
        [name]: formattedValue
      }));
      return;
    }

    // Format student number to remove any non-digit characters and limit to 8 digits
    if (name === 'student_no') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 8);
      setFormData(prevState => ({
        ...prevState,
        [name]: formattedValue
      }));
      return;
    }

    // Reset registration type if 2nd year is selected
    if (name === 'year' && value === '2') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        registration_type: 'contest' // Default to contest only for 2nd year
      }));
      return;
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear year-specific errors when changing year or registration type
    if (name === 'year' || name === 'registration_type') {
      setYearError(false);
      setRegistrationTypeError(false);
    }
  };

  // Handle year selection and update available registration types
  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    
    // Reset any previous errors
    setYearError(false);
    setRegistrationTypeError(false);
    
    // Check if the year is valid (1st or 2nd)
    if (selectedYear !== "1" && selectedYear !== "2") {
      setYearError(true);
      return;
    }
    
    // If 2nd year is selected, force registration type to "contest"
    if (selectedYear === "2") {
      setFormData(prevState => ({
        ...prevState,
        year: selectedYear,
        registration_type: "contest"
      }));
    } else {
      // For 1st year, just update the year
      setFormData(prevState => ({
        ...prevState,
        year: selectedYear
      }));
    }
  };

  // Handle registration type selection based on year
  const handleRegistrationTypeChange = (e) => {
    const selectedType = e.target.value;
    const currentYear = formData.year;
    
    // Reset any previous errors
    setRegistrationTypeError(false);
    
    // If 2nd year is trying to select workshop+contest, show error
    if (currentYear === "2" && selectedType === "workshop_contest") {
      setRegistrationTypeError(true);
      return;
    }
    
    setFormData(prevState => ({
      ...prevState,
      registration_type: selectedType
    }));
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    if (!recaptchaToken) {
      setFormError('Please complete the reCAPTCHA verification');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Transform the data to match the API schema
    const apiData = {
      name: formData.name,
      branch_name: formData.branch_name,
      recaptcha_token: recaptchaToken,
      student_no: formData.student_no,
      hackerrank: formData.hackerrank || "", // Optional field
      phone: formData.phone,
      email: formData.email,
      gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).toLowerCase(),
      hosteller: formData.hosteller === 'yes' ? 'True' : 'False',
      year: formData.year,
      registration_type: formData.registration_type === 'workshop_contest' ? 'contest_workshop' : 'contest'
    };

    try {
      setIsLoading(true);
      const response = await fetch('https://api.programming-club.tech/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiData),
      });

      // Parse the response data regardless of status code
      const responseData = await response.json().catch(() => ({ message: 'Failed to parse response' }));
      
      if (response.status !== 201) {
        // Display the actual response in the error message
        setFormError(JSON.stringify(responseData, null, 2));
        throw new Error('Registration failed');
      }

      // Success handling
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        branch_name: "",
        student_no: "",
        phone: "",
        hackerrank: "",
        gender: "",
        hosteller: "",
        year: "",
        registration_type: ""
      });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Registration error:', error);
      // Don't override the error message if it was already set above for non-201 status
      if (!formError) {
        setFormError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-section">
      {shouldRenderParticles && (
        <Suspense fallback={<div />}>
          <div className="particle-container">
            <Particle />
          </div>
        </Suspense>
      )}
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="register-form-container">
            <h1 className="heading-name text-center mb-4">
              <span className="purple">#INCLUDE 4.0</span> REGISTRATION
            </h1>
            <p className="text-center subtitle mb-4">Organized by Programming Club, AKGEC</p>
            
            {showSuccess ? (
              <div className="success-message">
                <div className="success-icon">
                  <FaCheckCircle />
                </div>
                <h2>Registration <span className="purple">Complete!</span></h2>
                <p>Thank you for registering! Please check your email for further instructions and confirmation details.</p>
                <Button 
                  variant="primary" 
                  className="submit-btn"
                  onClick={() => setShowSuccess(false)}
                >
                  Register Another
                </Button>
              </div>
            ) : (
              <>
                {formError && <Alert variant="danger"><pre style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{formError}</pre></Alert>}
                
                <Form onSubmit={handleSubmit} className="register-form">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@akgec.ac.in"
                          pattern="[0-9a-zA-Z._%+-]+@akgec[.]ac[.]in"
                          title="Please enter a valid AKGEC email address (ending with @akgec.ac.in)"
                        />
                        <Form.Text className="text-muted">
                          Must be an AKGEC domain email (@akgec.ac.in)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="10-digit phone number"
                          pattern="[0-9]{10}"
                          title="Please enter exactly 10 digits"
                        />
                        <Form.Text className="text-muted">
                          Must be exactly 10 digits
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Year <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="year"
                          value={formData.year}
                          onChange={handleYearChange}
                          required
                          isInvalid={yearError}
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Only 1st and 2nd year students are eligible
                        </Form.Text>
                        {yearError && (
                          <Form.Control.Feedback type="invalid">
                            Only 1st and 2nd year students are eligible
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Branch <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="branch_name"
                          value={formData.branch_name}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Branch</option>
                          <option value="CSE">CSE</option>
                          <option value="CSE (AIML)">CSE (AIML)</option>
                          <option value="CSE (Hindi)">CSE (Hindi)</option>
                          <option value="CSE (DS)">CSE (DS)</option>
                          <option value="CS">CS</option>
                          <option value="AIML">AIML</option>
                          <option value="IT">IT</option>
                          <option value="ECE">ECE</option>
                          <option value="EE">EE</option>
                          <option value="ME">ME</option>
                          <option value="CE">CE</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Registration Type <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="registration_type"
                          value={formData.registration_type}
                          onChange={handleRegistrationTypeChange}
                          required
                          disabled={formData.year === "2"}
                          isInvalid={registrationTypeError}
                        >
                          <option value="">Select Option</option>
                          {formData.year !== "2" && (
                            <option value="workshop_contest">Workshop + Contest</option>
                          )}
                          <option value="contest">Contest Only (Free)</option>
                        </Form.Select>
                        {formData.year === "2" && (
                          <Form.Text className="text-muted">
                            2nd year students can only register for Contest Only
                          </Form.Text>
                        )}
                        {registrationTypeError && (
                          <Form.Control.Feedback type="invalid">
                            2nd year students can only register for Contest Only
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Are you a Hosteller? <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="hosteller"
                          value={formData.hosteller}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>HackerRank Profile</Form.Label>
                        <Form.Control
                          type="text"
                          name="hackerrank"
                          value={formData.hackerrank}
                          onChange={handleChange}
                          placeholder="Your HackerRank username"
                        />
                        <Form.Text className="text-muted">
                          Optional field
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Student Number <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="student_no"
                          value={formData.student_no}
                          onChange={handleChange}
                          required
                          placeholder="Enter your student number"
                          pattern="[0-9]{7,8}"
                          title="Please enter 7 or 8 digits"
                        />
                        <Form.Text className="text-muted">
                          Must be 7 or 8 digits
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="recaptcha-container mb-4">
                    <ReCAPTCHA
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                    />
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="submit-btn" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                </Form>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Register;