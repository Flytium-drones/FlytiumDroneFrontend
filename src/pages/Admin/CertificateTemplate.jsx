import React from 'react';

const CertificateTemplate = React.forwardRef(({ data }, ref) => {
  const {
    studentName,
    rollNo,
    courseName,
    college,
    duration,
    startDate,
    endDate,
    issueDate,
    certificateId,
  } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  const formatWithSuffix = (dateStr) => {
     if (!dateStr) return "";
     const date = new Date(dateStr);
     const day = date.getDate();
     const suffix = getDaySuffix(day);
     const month = date.toLocaleDateString("en-GB", { month: "long" });
     const year = date.getFullYear();
     return `${day}${suffix} of ${month} ${year}`;
  };

  const formattedStart = formatWithSuffix(startDate);
  const formattedEnd = formatWithSuffix(endDate);
  const formattedIssue = formatDate(issueDate);

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
        color: '#000',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        border: '3px solid #000',
        height: '100%',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#e3effa', 
          padding: '20px 30px',
          borderBottom: '3px solid #000'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '2px solid #3b82f6',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#3b82f6',
            fontSize: '50px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            F
          </div>
          
          <div style={{ marginLeft: '20px', flex: 1 }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '44px', 
              letterSpacing: '10px', 
              color: '#333',
              fontFamily: 'Arial, sans-serif'
            }}>
              FLYTIUM DRONES
            </h1>
            <p style={{ 
              margin: 0, 
              textAlign: 'right', 
              fontSize: '18px', 
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              marginRight: '20px'
            }}>
              Pvt. Ltd.
            </p>
          </div>
        </div>

        <div style={{ padding: '10px 30px', fontSize: '16px', fontWeight: 'bold' }}>
          DPIIT No: DIPP188344
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            textDecoration: 'underline',
            fontWeight: 'bold',
            margin: 0
          }}>
            Internship Completion Certificate
          </h2>
        </div>

        <div style={{ padding: '0 40px', fontSize: '18px', lineHeight: '1.6', textAlign: 'justify', position: 'relative', zIndex: 10 }}>
          <p style={{ fontWeight: 'bold', marginBottom: '20px' }}>
            To Whom It May Concern,
          </p>
          
          <p>
            This is to certify that <strong>{studentName}</strong> a student of {college}, enrolled in the {courseName}, bearing Roll Number {rollNo}, has successfully completed a {duration} internship program organized by Flytium Drones Private Limited from {formattedStart} to {formattedEnd}.
          </p>

          <p>
            His/Her internship was focused on Drone technology and involved hands-on sessions, project development, and technical workshops.
          </p>

          <p>
            During the internship, the student demonstrated commendable enthusiasm, learning ability, and participation in all activities and successfully completed the project assigned to him/her.
          </p>

          <p>
            We congratulate the student on the successful completion of this program and wish them the very best in their future endeavors.
          </p>
          
          <p>
            We appreciate their efforts and wish them success in their future endeavors.
          </p>

          <div style={{ marginTop: '30px' }}>
            <p style={{ margin: 0 }}>Issued On:- {formattedIssue}</p>
            <p style={{ margin: 0 }}>Certificate ID: {certificateId}</p>
          </div>

          <div style={{ marginTop: '40px', position: 'relative' }}>
            <div style={{
              width: '100px',
              height: '100px',
              border: '2px solid navy',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: '0',
              top: '-10px',
              opacity: 0.8
            }}>
              <span style={{ fontSize: '10px', color: 'navy', fontWeight: 'bold', textAlign: 'center', lineHeight: '1' }}>FLYTIUM DRONES<br/>PVT. LTD.</span>
              <span style={{ fontSize: '24px', color: 'navy', fontStyle: 'italic', fontWeight: 'bold', margin: '2px 0' }}>F</span>
              <span style={{ fontSize: '10px', color: 'navy' }}>Director</span>
            </div>

            <div style={{ 
              position: 'absolute',
              left: '20px',
              top: '40px',
              fontFamily: "'Brush Script MT', cursive",
              fontSize: '36px',
              color: 'navy',
              transform: 'rotate(-10deg)',
              zIndex: 10
            }}>
              Ankit Kumar
            </div>

            <div style={{ marginTop: '80px' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Ankit Kumar</p>
              <p style={{ margin: 0 }}>Founder and CEO</p>
              <p style={{ margin: 0 }}>Flytium-Drones Pvt. Ltd.</p>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '700px',
          color: '#e3effa',
          fontWeight: 'bold',
          pointerEvents: 'none',
          zIndex: 1,
          fontFamily: 'Arial, sans-serif'
        }}>
          F
        </div>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#e3effa',
          borderTop: '3px solid #000',
          padding: '15px 30px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h3 style={{ margin: '0 0 5px 0', letterSpacing: '5px', fontSize: '22px' }}>
            FLYTIUM Drones Pvt. Ltd.
          </h3>
          <p style={{ margin: 0, fontSize: '14px' }}>CIN: U85499UP2024PTC207041</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
            Email :- ankit@flytiumdrones.com | Contact No : +91 6307193440
          </p>
        </div>

      </div>
    </div>
  );
});

export default CertificateTemplate;
