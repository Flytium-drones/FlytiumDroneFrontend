import React from 'react';

const CertificateTemplate = React.forwardRef(({ data }, ref) => {
  const {
    studentName,
    rollNo,
    year: studentYear,
    courseName,
    college,
    duration,
    startDate,
    endDate,
    issueDate,
    certificateId,
  } = data;

  const formatDateWithSuffix = (dateStr) => {
    if (!dateStr) return "___";
    const date = new Date(dateStr);
    const day = date.getDate();
    
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';
    
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    
    return (
      <span>
        {day}<sup>{suffix}</sup> of {month} {year}
      </span>
    );
  };

  const formatDateSimple = (dateStr) => {
    if (!dateStr) return "___";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const FDLogo = ({ width, height }) => (
    <img 
      src="/fd-logo-transparent.png" 
      alt="FD Logo" 
      style={{ width: `${width}px`, height: `${height}px`, objectFit: 'contain' }} 
    />
  );

  return (
    <div 
      ref={ref}
      style={{
        width: '800px',
        height: '1131px', // A4 aspect ratio
        backgroundColor: 'white',
        position: 'relative',
        padding: '30px',
        fontFamily: '"Times New Roman", Times, serif',
        color: '#333',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        border: '3px solid #000',
        height: '100%',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'linear-gradient(to right, #e8f7f4, #e6f0fa)', 
          padding: '20px 30px',
          borderBottom: '3px solid #000'
        }}>
          <div style={{ flexShrink: 0 }}>
            <FDLogo width="80" height="80" color="#0ea5e9" />
          </div>
          
          <div style={{ marginLeft: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '52px', 
              letterSpacing: '14px', 
              color: '#222',
              fontFamily: '"Arial Black", Impact, Arial, sans-serif',
              fontWeight: '900',
              lineHeight: '1'
            }}>
              FLYTIUM DRONES
            </h1>
            <span style={{ 
              alignSelf: 'flex-end',
              fontSize: '18px', 
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              color: '#222',
              marginRight: '5px',
              marginTop: '5px'
            }}>
              Pvt. Ltd.
            </span>
          </div>
        </div>

        {/* Top Info */}
        <div style={{ padding: '15px 40px', fontSize: '15px' }}>
          <strong>DPIIT No: DIPP188344</strong>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '35px' }}>
          <h2 style={{ 
            fontSize: '34px', 
            textDecoration: 'underline',
            fontWeight: 'bold',
            margin: 0,
            color: '#333'
          }}>
            Internship Completion Certificate
          </h2>
        </div>

        {/* Main Content */}
        <div style={{ 
          padding: '0 45px', 
          fontSize: '16px', 
          lineHeight: '1.7', 
          textAlign: 'justify', 
          position: 'relative', 
          zIndex: 10,
          flex: 1
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '25px', color: '#333' }}>
            To Whom It May Concern,
          </p>
          
          <p style={{ marginBottom: '20px' }}>
            This is to certify that <strong>{studentName || "Sunny Choudhary"}</strong>, a graduate of {college || "Shri Ramswaroop Memorial College of Engineering and Management"} from the {courseName || "Computer Science and Engineering"} branch{studentYear ? `, ${studentYear}` : ''}{rollNo ? `, bearing Roll Number ${rollNo}` : ''}, worked as an intern at Flytium Drones Private Limited from {formatDateWithSuffix(startDate)} to {formatDateWithSuffix(endDate)}.
          </p>

          <p style={{ marginBottom: '20px' }}>
            During this period, he was an active member of our <strong>{duration || "Artificial Intelligence & Machine Learning"}</strong> team, where he contributed to ongoing projects, participated in technical workshops, and collaborated closely with the team on assigned tasks and deliverables.
          </p>

          <p style={{ marginBottom: '20px' }}>
            Throughout his tenure, he demonstrated strong technical aptitude, a proactive attitude, and consistent dedication to his work. He collaborated effectively with team members, met project deadlines, and made valuable contributions to the team's objectives.
          </p>

          <p style={{ marginBottom: '40px' }}>
            We were pleased to have him as part of our team and wish him continued success in his future endeavors.
          </p>

          <div style={{ marginTop: '30px' }}>
            <p style={{ margin: '5px 0' }}>Issued On:- {formatDateSimple(issueDate)}</p>
            <p style={{ margin: '5px 0' }}>Certificate ID: {certificateId || "FD26011"}</p>
          </div>

          {/* Signature Area */}
          <div style={{ marginTop: '50px', position: 'relative' }}>
            {/* Stamp */}
            <div style={{
              width: '120px',
              height: '120px',
              border: '2px solid #1e3a8a',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: '0',
              top: '-30px',
              opacity: 0.85
            }}>
              <svg width="116" height="116" viewBox="0 0 120 120" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path id="curve" d="M 15 60 A 45 45 0 1 1 105 60 A 45 45 0 1 1 15 60" fill="transparent" />
                <text fill="#1e3a8a" fontSize="11" fontWeight="bold" letterSpacing="1">
                  <textPath href="#curve" startOffset="10%">FLYTIUM DRONES PVT. LTD.</textPath>
                </text>
              </svg>
              <div style={{ marginTop: '-15px' }}>
                <FDLogo width="30" height="30" color="#1e3a8a" />
              </div>
              <span style={{ fontSize: '11px', color: '#1e3a8a', fontWeight: 'bold', marginTop: '10px' }}>Director</span>
            </div>

            {/* Signature overlay */}
            <div style={{ 
              position: 'absolute',
              left: '20px',
              top: '15px',
              fontFamily: "'Brush Script MT', 'Caveat', cursive",
              fontSize: '44px',
              color: '#1e3a8a',
              transform: 'rotate(-5deg)',
              zIndex: 10
            }}>
              Ankit Kumar
            </div>

            <div style={{ marginTop: '80px', marginLeft: '10px' }}>
              <p style={{ margin: 0, fontSize: '17px', color: '#333' }}>Ankit Kumar</p>
              <p style={{ margin: 0, fontSize: '17px', color: '#333' }}>Founder and CEO</p>
              <p style={{ margin: 0, fontSize: '17px', color: '#333' }}>Flytium-Drones Pvt. Ltd.</p>
            </div>
          </div>
        </div>

        {/* Central Watermark */}
        <div style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.20
        }}>
          <FDLogo width="650" height="650" color="#0ea5e9" />
        </div>

        {/* Footer */}
        <div style={{
          background: 'linear-gradient(to right, #e8f7f4, #e6f0fa)',
          borderTop: '3px solid #000',
          padding: '15px 30px',
          textAlign: 'center',
          fontFamily: 'Times New Roman, serif'
        }}>
          <h3 style={{ margin: '0 0 5px 0', letterSpacing: '4px', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            FLYTIUM Drones Pvt. Ltd.
          </h3>
          <p style={{ margin: 0, fontSize: '15px', color: '#444' }}>CIN: U85499UP2024PTC207041</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '15px', color: '#333' }}>
            Email :- ankit@flytiumdrones.com <span style={{ fontWeight: 'bold', margin: '0 5px' }}>|</span> ContactNo : +91 6307193440
          </p>
        </div>

      </div>
    </div>
  );
});

export default CertificateTemplate;
