import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/home-main2.svg";
import Tilt from "react-parallax-tilt";
import Particle from "../Particle";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  return (
    <Container fluid className="home-about-section position-relative" id="about">
      <div className="home-about-particle-container">
        {/* <Particle variant="about" /> */}
      </div>
      <Container className="home-about-content">
        <Row>
          <Col md={8} className="home-about-description">
            <h1 className="about-heading">
              What We <span className="purple">Do</span> 
            </h1>
            <p className="home-about-body">

              The <span className="purple">Programming Club</span> at Ajay Kumar Garg Engineering College is dedicated to <span className="purple">Competitive Programming and Data Structures & Algorithms (DSA)</span>.<br/><br/>
               We aim to develop students' <span className="purple">problem-solving</span> skills through coding workshops and seminars that prepare them for national and global competitions.

              Our events are designed for all skill levels, offering insights and techniques to master <span className="purple">Competitive Programming</span>. <br/><br/>
              Whether you're a beginner or an experienced coder, the Programming Club is the perfect place to enhance your skills and succeed in coding challenges.
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid rounded-circle" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND US ON</h1>
            <p>
              Feel free to <span className="purple">connect</span> with us
            </p>
            <ul className="home-about-social-links">
              {/* <li className="social-icons">
                <a
                  href="https://github.com/soumyajit4419"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li> */}
              {/* <li className="social-icons">
                <a
                  href="https://twitter.com/Soumyajit4419"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiOutlineTwitter />
                </a>
              </li> */}
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/company/programming-club-akgec/mycompany/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.instagram.com/programmingclub.akgec/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                  aria-label="Instagram"
                >
                  <AiFillInstagram />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
