import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function EventPopup() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup on every page load
    setShow(true);
  }, []);

  const handleClose = () => setShow(false);

  const handleRegister = () => {
    handleClose();
    navigate("/register");
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      className="event-popup"
    >
      <Modal.Header closeButton>
        <Modal.Title>🎉 New Event Alert! 🎉</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="event-content">
          <h3>Programming Club Presents</h3>
          <h2>Code++</h2>
          <p className="event-details">
            Join us for an exciting competitive programming workshop where you can elevate your programming skills!
          </p>
          <ul className="event-info">
            <li>📅 Date: Nov 4, 2025</li>
            <li>⏰ Time: 4:00 PM - 6:00 PM</li>
            <li>📍 Venue: CSIT Seminar Hall</li>
            <li>💻 Team Size : 2 Members</li>
          </ul>
          <p className="event-description">
         A Team Contest Comprising of 2 Rounds boosting your competitive programming skills.
         Prize Pool worth Rs. 6000
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleRegister}>
          Register Now
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EventPopup; 
