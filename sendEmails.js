const nodemailer = require('nodemailer');
const fs = require('fs');

// 👇 1. Apna email aur App password yaha daalo
const SENDER_EMAIL = 'harshitj183@gmail.com';
const APP_PASSWORD = 'tumhara_app_password_yaha_daalo'; // Google Account -> Security -> App Passwords se 16 character ka password milega

// 👇 2. Jin startups ko bhejna hai, unke emails yaha daalo
const startupEmails = [
  'hr@startup1.com',
  'careers@startup2.com',
  // 'founder@coolstartup.com'
];

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: APP_PASSWORD
  }
});

const subject = "Application for Remote Software Engineering Internship - Harshit Jaiswal";
const htmlBody = `
<p>Dear Hiring Team,</p>

<p>I hope this email finds you well.</p>

<p>My name is <strong>Harshit Jaiswal</strong>, a Full Stack Web Developer (MERN Stack) and CS student. I am reaching out to express my strong interest in a remote Software Engineering or Web Development internship with your team.</p>

<p>I have a solid foundation in Data Structures and Algorithms, along with hands-on experience building scalable web applications. I have successfully delivered <strong>24+ freelance projects</strong> and completed remote internships as a Project Manager and Developer. A few highlights of my work include building the "Unified College Interaction System" utilizing React, Node.js, and MongoDB, and developing an open-source CLI module for AI context optimization.</p>

<p>I am highly adaptable, comfortable in remote environments, and eager to bring my development experience to a fast-growing startup like yours. I have attached my resume for your consideration.</p>

<p>Best regards,<br>
<strong>Harshit Jaiswal</strong><br>
harshitj183@gmail.com<br>
+91 97930 09391<br>
Portfolio: <a href="https://harshitj183.in">harshitj183.in</a><br>
GitHub: <a href="https://github.com/harshitj183">github.com/harshitj183</a></p>
`;

// Tumhare resume ka exact path
const resumePath = '/home/harshitj183/Downloads/Harshit Jaiswal Resume (27).pdf';

async function sendMails() {
  if (!fs.existsSync(resumePath)) {
    console.error("❌ Error: Resume file not found at " + resumePath);
    return;
  }

  console.log("🚀 Starting email automation...\n");

  for (let i = 0; i < startupEmails.length; i++) {
    const targetEmail = startupEmails[i];
    
    const mailOptions = {
      from: \`"Harshit Jaiswal" <\${SENDER_EMAIL}>\`,
      to: targetEmail,
      subject: subject,
      html: htmlBody,
      attachments: [
        {
          filename: 'Harshit Jaiswal_Resume.pdf',
          path: resumePath
        }
      ]
    };

    try {
      console.log(\`⏳ Sending email to \${targetEmail}...\`);
      await transporter.sendMail(mailOptions);
      console.log(\`✅ Successfully sent to \${targetEmail}\\n\`);
    } catch (error) {
      console.error(\`❌ Failed to send to \${targetEmail}: \`, error.message, "\\n");
    }
  }
  
  console.log("🎉 All emails processed!");
}

sendMails();
