import React, { memo, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BsGithub } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import membersData from "../Data/sortedMembers.json";
import Particle from "../Particle";
import "./Members.css";

// The core issue is that images are in src/Assets/Projects, not in public/Assets/Projects
// This utility function normalizes various image path formats to point to the correct location
const getImageUrl = (path) => {
  // Extract the filename from path, regardless of directory structure
  const filename = path.split('/').pop();
  
  // First, try to find the image directly in src/Assets/Projects
  try {
    // Use a relative path that webpack can resolve during build
    return require(`../../Assets/Projects/${filename}`);
  } catch (e) {
    console.warn(`Could not find image: ${filename} in src/Assets/Projects, using fallback path`);
    
    // Fallback to original path if import fails
    if (path.startsWith('/')) {
      // For absolute paths, they're relative to public folder
      return path;
    } else if (path.startsWith('src/')) {
      // For paths starting with src/
      return path.replace('src/', '/');
    } else {
      // For other relative paths
      return `/${path}`;
    }
  }
};

// Memoized MemberCard component to prevent unnecessary re-renders
const MemberCard = memo(({ member }) => {
  const [imageError, setImageError] = useState(false);
  
  // Initial attempt - try to get URL from our utility function
  const [imageSrc, setImageSrc] = useState(() => {
    try {
      return getImageUrl(member.image);
    } catch (e) {
      console.error(`Failed to get initial image for ${member.name}:`, e);
      return member.image;
    }
  });
  
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Log when component mounts
  useEffect(() => {
    console.log(`Rendering card for ${member.name} with image: ${member.image}`);
  }, [member.name, member.image]);
  
  const handleImageError = () => {
    console.error(`Failed to load image for ${member.name} (Attempt ${attemptCount + 1})`);
    
    // Try different approaches
    if (attemptCount === 0) {
      // First attempt: Try to get the filename with a different extension
      const filename = member.image.split('/').pop();
      const baseFilename = filename.replace(/\.\w+$/, '');
      
      try {
        // Look for the same filename but with .png extension
        const newPath = `../../Assets/Projects/${baseFilename}.png`;
        console.log(`Attempt 1: Trying to load ${newPath}`);
        import(`../../Assets/Projects/${baseFilename}.png`)
          .then(image => {
            setImageSrc(image.default);
            setAttemptCount(1);
          })
          .catch(() => {
            // Continue with next attempt if this fails
            setAttemptCount(1);
          });
        return;
      } catch (e) {
        console.warn(`Attempt 1 failed for ${member.name}:`, e);
        setAttemptCount(1);
      }
    } 
    else if (attemptCount === 1) {
      // Second attempt: Try jpeg extension
      const filename = member.image.split('/').pop();
      const baseFilename = filename.replace(/\.\w+$/, '');
      
      try {
        // Look for the same filename but with .jpeg extension
        const newPath = `../../Assets/Projects/${baseFilename}.jpeg`;
        console.log(`Attempt 2: Trying to load ${newPath}`);
        import(`../../Assets/Projects/${baseFilename}.jpeg`)
          .then(image => {
            setImageSrc(image.default);
            setAttemptCount(2);
          })
          .catch(() => {
            // Continue with next attempt if this fails
            setAttemptCount(2);
          });
        return;
      } catch (e) {
        console.warn(`Attempt 2 failed for ${member.name}:`, e);
        setAttemptCount(2);
      }
    }
    else if (attemptCount === 2) {
      // Third attempt: Try jpg extension
      const filename = member.image.split('/').pop();
      const baseFilename = filename.replace(/\.\w+$/, '');
      
      try {
        // Look for the same filename but with .jpg extension
        const newPath = `../../Assets/Projects/${baseFilename}.jpg`;
        console.log(`Attempt 3: Trying to load ${newPath}`);
        import(`../../Assets/Projects/${baseFilename}.jpg`)
          .then(image => {
            setImageSrc(image.default);
            setAttemptCount(3);
          })
          .catch(() => {
            // Continue with next attempt if this fails
            setAttemptCount(3);
          });
        return;
      } catch (e) {
        console.warn(`Attempt 3 failed for ${member.name}:`, e);
        setAttemptCount(3);
      }
    }
    else if (attemptCount === 3) {
      // Fourth attempt: Try looking for exact file match by name
      // This is useful if case sensitivity is an issue
      const filename = member.image.split('/').pop();
      
      // Try to find a close match to the filename in our known file list
      // This is a simplified approach since we can't read the directory contents at runtime
      console.log(`Attempt 4: Trying to find close match for ${filename}`);
      setAttemptCount(4);
      
      // Default to fallback after all attempts
      setImageError(true);
    }
    else {
      // If all attempts fail, show the fallback
      console.error(`All attempts to load image for ${member.name} failed. Showing fallback.`);
      setImageError(true);
    }
  };

  // Determine banner color based on text
  const getBannerClass = (text) => {
    if (!text) return '';
    
    // Convert to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('lead')) return 'banner-lead';
    if (lowerText.includes('android')) return 'banner-android';
    if (lowerText.includes('ios')) return 'banner-ios';
    if (lowerText.includes('flutter')) return 'banner-flutter';
    if (lowerText.includes('cyber')) return 'banner-cyber';
    if (lowerText.includes('web')) return 'banner-web';
    if (lowerText.includes('ml') || lowerText.includes('ai')) return 'banner-ai';
    
    // Default
    return '';
  };

  return (
    <div className="team-member-card">
      <div className="position-relative team-member-image-container">
        {imageError ? (
          <div className="image-fallback">
            {member.name.split(' ').map(word => word[0]).join('')}
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={member.name}
            className="team-member-image"
            loading="lazy"
            onError={handleImageError}
          />
        )}
        
        {/* Add banner if showBanner is true */}
        {member.showBanner && (
          <div className={`member-banner ${getBannerClass(member.bannerText)}`}>
            {member.bannerText || "Featured"}
          </div>
        )}
      </div>
      <div className="team-member-info">
        <h3 className="team-member-name">{member.name}</h3>
        <p className="team-member-position">{member.specialization}</p>
        <p className="team-member-branch">{member.branch}</p>
        <div className="team-member-skills">
          {member.skills && member.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
        <div className="social-links">
        {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label={`${member.name}'s Instagram`}
              title="Instagram"
            >
              <BsInstagram />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label={`${member.name}'s GitHub`}
              title="GitHub"
            >
              <BsGithub />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label={`${member.name}'s LinkedIn`}
              title="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="social-link"
              aria-label={`Email ${member.name}`}
              title="Email"
            >
              <MdEmail />
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

// Year section component
const YearSection = memo(({ section }) => (
  <div className="year-section">
    <div className="section-title">
      <h2>{section.data.title}</h2>
    </div>
    <Row className="justify-content-center">
      {section.data.members.map((member, index) => (
        <Col lg={3} md={4} sm={6} xs={12} key={`${section.key}-${index}`} className="mb-4">
          <MemberCard member={member} />
        </Col>
      ))}
    </Row>
  </div>
));

function Members() {
  const yearSections = [
    {key: "commitment", data: membersData.commitment},
    { key: "fourthYear", data: membersData.fourthYear },
    { key: "thirdYear", data: membersData.thirdYear },
    { key: "secondYear", data: membersData.secondYear }
  ];

  return (
    <Container fluid className="members-section">
      <div className="particle-container">
        {/* <Particle variant="members" /> */}
      </div>
      <Container>
        <div className="section-title">
          <h2>Our Team</h2>
          <p>Meet the talented individuals behind Programming Club</p>
        </div>

        {yearSections.map((yearSection) => (
          <YearSection key={yearSection.key} section={yearSection} />
        ))}
      </Container>
    </Container>
  );
}

export default Members; 