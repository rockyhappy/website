import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about.png";
import Toolstack from "./Toolstack";
import Card from "react-bootstrap/Card";  
import { ImPointRight } from "react-icons/im";
import icpc1 from "../../Assets/Projects/icpc1.jpg";
import icpc2 from "../../Assets/Projects/icpc2.jpg";
import icpc3 from "../../Assets/Projects/icpc3.jpg";
function About() {
  return (
    <Container fluid className="home-section">
      {/* <Particle /> */}
      <Container>
      <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px",color: "white" }}>
              ICPC <strong className="purple">Regionalist'24</strong>
            </h1>
            <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "left" }}>
            The regional phase of the <span className="purple"> ICPC</span>, the <span className="purple">International Collegiate Programming Contest</span> stands as a beacon of excellence, uniting the brightest minds in competitive programming. With unwavering determination and technical brilliance, our team has showcased exceptional problem-solving skills, embodying talent and dedication.
          </p>
          <p style={{ textAlign: "left" }}>As one of the most prestigious algorithmic programming competitions in the world, ICPC challenges participants to devise innovative solutions to complex, real-world computational problems. This rigorous contest not only cultivates technical expertise but also fosters ingenuity, teamwork, and strategic thinking—hallmarks of great problem solvers. It is a platform where brilliance converges with determination</p>
          <p style={{ textAlign: "left" }}>
            Members of the Team Include:
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Aakarsh Singh
            </li>
            <li className="about-activity">
              <ImPointRight /> Ayush Agrawal
            </li>
            <li className="about-activity">
              <ImPointRight /> Paras Upadhayay
            </li>
          </ul>
        </blockquote>
      </Card.Body>
    </Card>
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <img src={icpc3} alt="about" className="img-fluid" />
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" ,color: "white"}}>
              ICPC <strong className="purple">Regionalist'23</strong>
            </h1>
            <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "left" }}>
            The regional phase of the <span className="purple"> ICPC</span>, the <span className="purple">International Collegiate Programming Contest</span> —an algorithmic programming contest for college students across the world—has been concluded, and we extend resounding congratulations to the exceptional members of our accomplished team—a powerhouse of talent and dedication!
          </p>
          <p style={{ textAlign: "left" }}>The ICPC has a rich legacy of nurturing the brightest minds in the field of computer science and engineering, and the regional phase is a testament to the exceptional problem-solving skills and technical acumen of the participants. The contest challenges students to solve complex, real-world problems through the application of algorithmic principles and programming skills, fostering creativity, teamwork, and innovation.</p>
          <p style={{ textAlign: "left" }}>
            Members of the Team Include:
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Kapish Upadhyay
            </li>
            <li className="about-activity">
              <ImPointRight /> Shreyansh Mittal
            </li>
            <li className="about-activity">
              <ImPointRight /> Utkarsh Shukla
            </li>
          </ul>

          {/* <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"{" "}
          </p> */}
          {/* <footer className="blockquote-footer">Soumyajit</footer> */}
        </blockquote>
      </Card.Body>
    </Card>
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <img src={icpc1} alt="about" className="img-fluid" />
            {/* <img src={icpc1} alt="about" className="img-fluid" /> */}
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" ,color: "white"}}>
              ICPC <strong className="purple">Regionalist'23</strong>
            </h1>
            <Aboutcard />
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <img src={icpc2} alt="about" className="img-fluid" />
            {/* <img src={icpc1} alt="about" className="img-fluid" /> */}
          </Col>
        </Row>
        
        {/* <h1 className="project-heading">
          Professional <strong className="purple">Skillset </strong>
        </h1> */}

        {/* <Techstack /> */}

        {/* <h1 className="project-heading">
          <strong className="purple">Tools</strong> I use
        </h1> */}
        {/* <Toolstack /> */}

        {/* <Github /> */}
      </Container>
    </Container>
  );
}

export default About;
