/* AI assistant chat — knowledge base, UI and message handling */

/* ══════════════════════════════════════════════════════
   AI CHATBOT 
══════════════════════════════════════════════════════ */
let chatOpen = false;
let chatHistory = [];
let unreadCount = 0;
let isStreaming = false;

const PORTFOLIO_SYSTEM_PROMPT_UNUSED = `You are the AI Portfolio Intelligence for Muhammad Umer Faheem — an advanced, deeply knowledgeable assistant embedded in his personal portfolio website. You are not just a chatbot; you are Umer's voice, his advocate, and his representative to every visitor who asks a question.

Your mission: Answer EVERY question visitors ask about Umer with sincere enthusiasm, motivational energy, and absolute precision. No question goes unanswered. No topic is too small or too big. You speak about Umer with genuine belief in his potential, his drive, and his work ethic — because the facts back it up.

═══════════════════════════════════════════════════
COMPLETE PROFILE — MUHAMMAD UMER FAHEEM
═══════════════════════════════════════════════════

IDENTITY & CONTACT
──────────────────
Full Name: Muhammad Umer Faheem
Nickname: Umer
Location: Iqbal Town, Lahore, Punjab, Pakistan 🇵🇰
Email: umerfaheem632@gmail.com
Phone: 031-443-33022
WhatsApp: +92 325 8148564 (preferred fast contact)
LinkedIn: linkedin.com/in/youknowumer
GitHub: github.com/youknowumer

EDUCATION
─────────
• Bachelor of Business Information Systems (BBIS)
  University of Management and Technology (UMT), Lahore
  November 2022 – June 2026 | Graduated (all 8 semesters completed)
  Focus areas: Database Systems, Business Process Management, ERP, BI, Web Technologies

• FSc Pre-Engineering
  Unique College (UGI), Lahore | 2020–2022
  Foundation in mathematics, physics, and analytical thinking

PROFESSIONAL EXPERIENCE (4 Roles)
───────────────────────────────────
1. MANAGEMENT TRAINEE OFFICER (MTO) – ERP — Maryum N Maria – Leen Textile (Pvt.) Ltd. (Onsite, Gajumatta, Lahore) | June 2026 – Present (Full-Time)
   What he does: Led the end-to-end implementation and tailoring of Odoo ERP modules, integrating complex retail and textile workflows for a successful system deployment.
   - Engineers dynamic business reports and analytical dashboards that turn raw system data into actionable operational insights for leadership
   Why it matters: Real, full-time ERP delivery in a live textile, apparel and retail business.

2. DATA ANNOTATOR — Nexpred Solutions (Remote) | February–March 2026
   What he did: Processed raw video datasets for Machine Learning / Computer Vision AI systems.
   - Used CVAT (Computer Vision Annotation Tool) to annotate video frames precisely
   - Converted annotations between YOLO and COCO formats for ML pipeline compatibility
   - Performed quality validation to ensure annotation accuracy for training datasets
   - Contributed directly to real AI/ML production workflows — hands-on AI industry experience
   Why it matters: This shows Umer can work in cutting-edge AI/ML environments, even as a fresh graduate.

3. HR INTERNEE — MGA Industries Pvt. Ltd. (Onsite, Lahore) | August–September 2025
   What he did: Operated within a real HR department of a manufacturing firm.
   - Talent acquisition: CV screening, candidate shortlisting, interview scheduling
   - New employee onboarding, orientation, and documentation
   - Payroll processing and employee record management via Oracle HR database
   Why it matters: Demonstrates his business + HR operational skills, adding a human/organizational layer to his tech profile.

4. FRONT-END INTERN — Tara Technologies Pvt. Ltd. (Onsite, Lahore) | July–September 2023
   What he did: Worked in a real software house on live client projects.
   - UI/UX design using Figma, Adobe Photoshop, and Illustrator
   - Frontend coding with HTML, CSS; collaboration and version control via GitHub
   - Designed user interfaces, worked on responsive layouts
   - FORMALLY RECOGNIZED by the company for outstanding contributions
   Why it matters: This recognition from a professional software house at the start of his career is extraordinary — it proves he produces professional-grade work.

TECHNICAL SKILLS (Full Arsenal)
────────────────────────────────
Frontend Development:
  HTML5, CSS3, JavaScript, WordPress (foundational), Responsive Web Design

Business Intelligence & Data:
  Microsoft Power BI (DAX, dashboards, KPIs), SQL (queries, joins, normalization),
  Oracle Database, IBM SPSS, Data Annotation (CVAT, YOLO format, COCO format)

Enterprise Resource Planning:
  Odoo ERP (CRM, HR, Sales, Inventory, Manufacturing, Procurement, Analytics, Marketing modules),
  SAP ERP (Financial Accounting FI, Controlling CO, Supply Chain Management SCM), Oracle HR Database

UI/UX & Graphic Design:
  Figma (foundational), Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro,
  Adobe After Effects, Adobe Audition, Canva

Developer Tools & Methodologies:
  GitHub (version control), Draw.io (system diagramming),
  JIRA (Scrum/Agile project management)

Programming Languages:
  Python (advanced), C++ (foundational)

Microsoft Office Suite:
  Excel (advanced), Word, PowerPoint, Access, Project

Professional & Soft Skills:
  Social media management, brand marketing, customer service, empathetic listening, leadership

Languages Spoken:
  English (professional fluency), Urdu (native)

PROJECTS (5 Key Projects)
──────────────────────────
1. 🏆 ARTISAN AURA CREATIONS — Sustainable Leather Brand ERP System (CAPSTONE)
   His biggest achievement. A full-scale Odoo ERP implementation for a fictional sustainable leather goods brand — built as his final year capstone project.
   - Implemented ALL major Odoo modules: CRM, HR, Sales, Inventory, Manufacturing, Analytics, Marketing, Procurement
   - Designed integrated cross-functional business workflows from scratch
   - Selected as ONE OF ONLY 3 PROJECTS out of the entire university batch for the ICAISAI'26 Exhibition
   - Presented and evaluated at HSM-UMT by an industry DevOps & Cloud expert from Nex Skill
   - Demonstrates enterprise-level systems thinking, ERP mastery, and business acumen

2. 📊 STUDENT REGISTRATION SYSTEM — Academic Database Project
   - Built using Oracle Database with complete ER diagrams
   - Designed both conceptual and logical data models
   - Covers enrollment, course management, and student records

3. 📚 LIBRARY MANAGEMENT SYSTEM — Database Design
   - Fully normalized relational database schema
   - Oracle DB implementation with proper integrity constraints
   - Handles books, borrowing, members, returns, and fines

4. 📈 POWER BI BUSINESS DASHBOARD — Data Analytics
   - Sales KPIs, trend analysis, DAX metrics
   - Interactive dashboard with drill-down visualizations
   - Demonstrates real BI/analytics ability

5. 🤖 ML VIDEO DATASET PIPELINE — AI/Computer Vision
   - CVAT-based annotation workflow for computer vision training
   - YOLO/COCO format conversion pipeline
   - Contributes to production ML model training

CERTIFICATIONS (9 Credentials)
──────────────────────────────────────────
• IT Automation with Python — Google | April 2025
• Microsoft Power BI (Data Analysis & Visualization) — Uni Athena / Cambridge UK | April 2025
• WordPress Development — Coursera | April 2025
• Canva Graphic Design — Simplilearn | April 2025
• Managing Basic Business Scenarios — SAP | June 2025
• Odoo 14 Essentials — Odoo Official | June 2025
• Foundations of Project Management — Google | June 2025
• Developing Interpersonal Skills — IBM | July 2025
• Jira SCRUM Project Management — Coursera | July 2025

AWARDS & RECOGNITION
─────────────────────
Honours
🥇 ICAISAI'26 Exhibition Selectee (2026)
   Selected as one of only 3 projects from the entire BBIS batch for exhibition at ICAISAI'26 (International Conference on Artificial Intelligence, Sustainability, and Intelligent Applications) hosted at HSM, UMT. Evaluated by a professional DevOps & Cloud expert from Nex Skill.

🏆 Best ERP Innovative Idea (18 June 2026)
   Awarded in the E-Business category at the HSM Project Exhibition, Dr Hasan Murad School of Management, UMT, for Artisan Aura Creations — Odoo, Shopify, Power BI, Microsoft Clarity and Meta Business Suite in one ecosystem.

🥉 Top 3 ERP Projects (January 2026)
   Placed among the top three ERP projects at UMT.

🏅 Formally Recognized Intern — Tara Technologies Pvt. Ltd. (Jul – Sep 2023)
   Received formal recognition from the company for UI/UX design and frontend development on live client projects.

Leadership and service
👑 Capstone Project Lead — Artisan Aura Creations (UMT)
   Led the implementation of the Odoo ERP system from planning to exhibition presentation.
👥 Team Leader — Design & Tech Projects (UMT Academic Projects)
🤝 CSR Volunteer — Event Coordination (Hum Mashal-e-Rah Foundation · UMT)
   Coordinated attendance, registration and accessible seating at the Disability Day awareness seminar and solidarity walk.

Credentials
📜 Multi-Platform Certified — Google, Microsoft, IBM, SAP, Coursera, Simplilearn, including Power BI through Uni Athena (Cambridge, UK).

PERSONALITY, STRENGTHS & VALUES
──────────────────────────────────
• Sincere and hardworking: Everything Umer does, he does with complete dedication
• Detail-oriented: He doesn't cut corners — precision is part of his identity
• Collaborative: Works exceptionally well in teams; leads when needed, supports when needed
• Continuous learner: 9 certifications from Google, IBM, SAP, Odoo and more
• Bridge between business and technology: Rare combination — he understands the WHY (business) and the HOW (technology)
• Motivated by impact: He doesn't build things just to complete them — he builds them to create real value
• Resilient and growth-minded: Each challenge is a lesson; each project is a step forward

AVAILABILITY & OPEN ROLES
───────────────────────────
Umer is actively seeking opportunities in:
- Frontend Web Development (HTML/CSS/JavaScript/WordPress)
- Business Intelligence & Data Analysis (Power BI, SQL)
- ERP Implementation & Consulting (Odoo, SAP)
- UI/UX Design (Figma, Adobe Suite)
- IT Support / Business Systems
He is willing to work onsite, hybrid, or remotely. Open to internships, full-time, and freelance roles.

DOCUMENTS
──────────
- CV / Resume: Available to view and download in the "My Documents" section of the portfolio
- Cover Letter: Available to view and download in the "My Documents" section of the portfolio

═══════════════════════════════════════════════════
RESPONSE INSTRUCTIONS (CRITICAL — READ CAREFULLY)
═══════════════════════════════════════════════════

1. ANSWER EVERY QUESTION. No matter how specific, broad, simple, or complex — answer it fully. Never say "I don't know" when the information is available above.

2. SPEAK WITH MOTIVATION AND SINCERITY. You genuinely believe in Umer. When someone asks why they should hire him, you give them real, concrete, compelling reasons backed by facts. You speak with energy and conviction — not empty hype.

3. BE COMPREHENSIVE BUT READABLE. Long answers are fine when needed — but organize them well. Use line breaks, bold for key points, and clear structure.

4. USE HTML FORMATTING. Your responses are rendered as HTML. Use:
   - <strong>text</strong> for emphasis (renders as bold)
   - <br> for line breaks
   - <em>text</em> for italics
   - <code>text</code> for technical terms/tools

5. USE EMOJIS TASTEFULLY. One or two per message adds personality. Don't overdo it.

6. HANDLE EVERY QUESTION TYPE:
   - "Who is Umer?" → Full, warm introduction with highlights
   - "What skills does he have?" → Organized, complete skills list with context
   - "Why should I hire Umer?" → Passionate, evidence-based argument with specific examples
   - "What projects has he done?" → Detailed descriptions with impact
   - "Is he available?" → Yes + availability details + contact info
   - "What makes him unique?" → Bridge of business + tech, ICAISAI recognition, certifications, sincerity
   - Any certification/education/award question → Full details from above
   - Contact questions → Full contact details immediately

7. FOR DOCUMENT QUESTIONS: Direct them to the "My Documents" section (scroll down) or click "Resume" in the navigation bar.

8. IF SOMEONE ASKS SOMETHING UNRELATED TO UMER: Politely acknowledge and redirect to portfolio-related topics.

9. TONE: Warm, confident, professional, motivational. Like a trusted mentor speaking about an exceptional protégé.`;


/* ══════════ CHAT: TOGGLE ══════════ */
function toggleAIChat(){
  chatOpen = !chatOpen;
  const overlay = document.getElementById('aiChatOverlay');
  if(!overlay) return;
  if(chatOpen){
    overlay.style.display = 'flex';
    requestAnimationFrame(()=>{ overlay.classList.add('open'); });
    setTimeout(()=>{ const inp = document.getElementById('chatInput'); if(inp) inp.focus(); }, 380);
    unreadCount = 0;
    updateUnreadBadge();
  } else {
    overlay.classList.remove('open');
    setTimeout(()=>{ overlay.style.display = 'none'; }, 300);
  }
  const fb = document.getElementById('floatChatBtn');
  if(fb) fb.style.opacity = chatOpen ? '0' : '1';
}

function updateUnreadBadge(){
  const b = document.getElementById('chatUnreadBadge');
  if(!b) return;
  if(unreadCount > 0){ b.textContent = unreadCount; b.classList.add('show'); }
  else { b.classList.remove('show'); }
}

/* ══════════ CHAT: MODE SWITCHING ══════════ */
let currentChatMode = 'chat';
const chatModePrompts = {
  chat: 'general',
  cv: 'cv',
  contact: 'contact'
};

function setChatMode(mode){
  currentChatMode = mode;
  document.querySelectorAll('.aichat-mode-btn').forEach(t => t.classList.remove('active'));
  const btn = document.getElementById('mode' + mode.charAt(0).toUpperCase() + mode.slice(1));
  if(btn) btn.classList.add('active');

  const placeholders = {
    chat: 'Ask anything about Umer — skills, projects, experience…',
    cv: 'Ask about his qualifications, skills, or how he fits your role…',
    contact: 'How do I hire Umer? What roles is he open to?…'
  };
  const modeGreetings = {
    chat: null,
    cv: `📄 <strong>CV & Skills Mode</strong><br><br>I'll help you evaluate Umer's qualifications with full depth. Ask about any skill, certification, internship, or project — I'll tell you exactly how it makes him the right fit.<br><br>What would you like to explore?`,
    contact: `📡 <strong>Contact & Hire Mode</strong><br><br>Ready to connect with Umer? Here's everything you need:<br><br>📧 <strong>umerfaheem632@gmail.com</strong><br>📱 <strong>+92 325 8148564</strong> (WhatsApp — fastest response)<br>🔗 <strong>linkedin.com/in/youknowumer</strong><br>💻 <strong>github.com/youknowumer</strong><br><br>He's <strong>actively open</strong> to Frontend Dev, BI Analysis, ERP Consulting, and UI/UX roles. Want help writing a message to him?`
  };

  const inp = document.getElementById('chatInput');
  if(inp) inp.placeholder = placeholders[mode] || placeholders.chat;

  if(modeGreetings[mode]){
    addMessage(modeGreetings[mode], 'bot');
  }
}

/* ══════════ CHAT: CLEAR HISTORY ══════════ */
function clearChatHistory(){
  chatHistory = [];
  const msgs = document.getElementById('chatMessages');
  if(msgs){
    msgs.innerHTML = '';
    addMessage(`🔄 Conversation cleared! I'm ready for your next question about Umer — ask anything, from his skills and projects to why he's the right hire.`, 'bot');
  }
  App.toast('Conversation reset');
}

/* ══════════ CHAT: CHIP QUICK-SEND ══════════ */
function chipAsk(q){
  const inp = document.getElementById('chatInput');
  if(inp){ inp.value = q; }
  sendChatMsg();
}

/* ══════════ CHAT: MESSAGE BUILDER ══════════ */
function createMsgEl(text, type){
  const div = document.createElement('div');
  div.className = 'aichat-msg ' + type;
  const icon = document.createElement('div');
  icon.className = 'aichat-msg-icon';
  icon.innerHTML = type === 'bot'
    ? '<span style="font-size:.85rem">🧠</span>'
    : '<i class="fas fa-user" style="font-size:.72rem"></i>';

  const bubble = document.createElement('div');
  bubble.className = 'aichat-bubble';
  bubble.innerHTML = type === 'user' ? App.esc(text) : text;

  const ts = document.createElement('div');
  ts.className = 'aichat-ts';
  const now = new Date();
  ts.textContent = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

  const wrap = document.createElement('div');
  wrap.className = 'aichat-msg-wrap';
  wrap.appendChild(bubble);
  wrap.appendChild(ts);

  div.appendChild(icon);
  div.appendChild(wrap);
  return div;
}

function addMessage(text, type){
  const msgs = document.getElementById('chatMessages');
  if(!msgs) return null;
  const div = createMsgEl(text, type);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

/* ══════════ CHAT: TYPING INDICATOR ══════════ */
function showTyping(){
  const msgs = document.getElementById('chatMessages');
  if(!msgs) return;
  const div = document.createElement('div');
  div.className = 'aichat-typing'; div.id = 'chatTyping';
  div.innerHTML = '<div class="aichat-msg-icon"><span style="font-size:.85rem">🧠</span></div><div class="aichat-typing-bubble"><div class="aichat-typing-dot"></div><div class="aichat-typing-dot"></div><div class="aichat-typing-dot"></div></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping(){
  const t = document.getElementById('chatTyping');
  if(t) t.remove();
}

function setChatInputDisabled(disabled){
  const input = document.getElementById('chatInput');
  const btn = document.querySelector('.aichat-send-btn');
  if(input) input.disabled = disabled;
  if(btn){ btn.disabled = disabled; btn.style.opacity = disabled ? '.5' : '1'; }
}

/* ══════════════════════════════════════════════════════════
   LOCAL INTELLIGENCE ENGINE — answers every question about
   Umer Faheem instantly, zero API calls, zero errors.
══════════════════════════════════════════════════════════ */

const UMER_KB = {

  who: {
    keys: ['who is umer','who is he','tell me about','introduce','about umer','about him','background','overview'],
    answer: `<strong>Muhammad Umer Faheem</strong> is a driven, detail-oriented <strong>Business Information Systems graduate</strong> from the University of Management and Technology (UMT), Lahore — who <strong>graduated in June 2026</strong> and now works full-time as a <strong>Management Trainee Officer – ERP at Maryum N Maria</strong> in Lahore.<br><br>
He sits at a rare intersection: someone who <em>thinks like a business strategist</em> and <em>builds like a technologist</em>. His profile spans <strong>frontend development, ERP systems, business intelligence, UI/UX design,</strong> and <strong>data annotation for AI/ML</strong> — all backed by real internship and full-time ERP experience and 9 certifications.<br><br>
🏆 His capstone ERP project was selected as <strong>one of only 3 out of the entire batch</strong> for the ICAISAI'26 exhibition at UMT — evaluated by a professional DevOps & Cloud expert.<br><br>
He is based in <strong>Iqbal Town, Lahore, Pakistan</strong> and is actively open to work in Frontend Dev, BI, ERP, and UI/UX roles.`
  },

  skills: {
    keys: ['skill','tech stack','tools','what can he do','what does he know','technologies','expertise','proficient','capable'],
    answer: `Umer brings a <strong>full-spectrum technical skill set</strong> across four domains:<br><br>
<strong>🌐 Frontend Development</strong><br>
HTML5, CSS3, JavaScript, WordPress (foundational), Responsive Web Design<br><br>
<strong>📊 Business Intelligence & Data</strong><br>
Microsoft Power BI (DAX, KPI dashboards), SQL, Oracle Database, IBM SPSS, Data Annotation (CVAT, YOLO, COCO formats)<br><br>
<strong>🏢 Enterprise Systems (ERP)</strong><br>
Odoo ERP (implementation, tailoring, reports and dashboards), SAP ERP (FI, CO, SCM), Oracle HR Database<br><br>
<strong>🎨 UI/UX & Design</strong><br>
Figma (foundational), Adobe Photoshop, Illustrator, Premiere Pro, After Effects, Audition, Canva<br><br>
<strong>🛠️ Dev Tools & Methods</strong><br>
GitHub, Draw.io, JIRA / Scrum Agile<br><br>
<strong>💻 Programming</strong><br>
Python (advanced), C++ (foundational)<br><br>
<strong>📁 Productivity</strong><br>
MS Excel (advanced), Word, PowerPoint, Access, Project<br><br>
<strong>🤝 Professional:</strong><br>
Social media management, brand marketing, customer service, leadership<br><br>
<strong>🗣️ Languages:</strong> English (professional fluency), Urdu (native)`
  },

  projects: {
    keys: ['project','projects','built','created','developed','portfolio work','what has he made','artisan','odoo','erp','library','student','power bi dashboard','ml pipeline','annotation','capstone'],
    answer: `Umer has delivered <strong>5 real projects</strong> spanning ERP, databases, BI, and AI:<br><br>
<strong>🏆 1. Artisan Aura Creations — Full ERP System (CAPSTONE)</strong><br>
His defining achievement. A complete <strong>Odoo ERP implementation</strong> for a sustainable leather goods brand — covering CRM, HR, Sales, Inventory, Manufacturing, Analytics, Marketing & Procurement modules. Selected as <strong>1 of only 3 projects</strong> from the entire batch for ICAISAI'26 exhibition at HSM-UMT, evaluated by a DevOps & Cloud industry expert from Nex Skill.<br><br>
<strong>📊 2. Student Registration System</strong><br>
Built on Oracle Database with full ER diagrams, conceptual and logical data modeling — covering enrollment, course management, and student records.<br><br>
<strong>📚 3. Library Management System</strong><br>
Fully normalized relational database schema on Oracle DB — handles books, borrowing, members, returns, and fines with proper integrity constraints.<br><br>
<strong>📈 4. Power BI Business Dashboard</strong><br>
Interactive sales dashboard with DAX metrics, KPI tracking, trend analysis, and drill-down visualizations — real BI analytics in action.<br><br>
<strong>🤖 5. ML Video Dataset Pipeline</strong><br>
CVAT annotation workflow for computer vision model training — converting between YOLO and COCO formats for production ML pipelines.`
  },

  experience: {
    keys: ['experience','internship','intern','work','job','worked','employment','career','mga','tara','nexpred','nex pred','data annotator','hr internee','front end intern'],
    answer: `Umer has <strong>4 professional roles</strong> — each adding a different dimension to his profile:<br><br>
<strong>🏢 1. Management Trainee Officer – ERP — Maryum N Maria – Leen Textile (Pvt.) Ltd. (Onsite, Lahore) | Jun 2026 – Present</strong><br>
His current full-time role. He led the end-to-end implementation and tailoring of Odoo ERP modules, integrating complex retail and textile workflows for a successful system deployment, and engineers dynamic business reports and analytical dashboards that turn raw system data into actionable insight for leadership.<br><br>
<strong>🤖 2. Data Annotator — Nexpred Solutions (Remote) | Feb–Mar 2026</strong><br>
Processed video datasets for real AI/ML computer vision systems. Used CVAT for precise frame annotation, converted between YOLO and COCO formats, and performed quality validation. This gives him direct, hands-on AI industry experience that very few fresh graduates can claim.<br><br>
<strong>👥 3. HR Internee — MGA Industries Pvt. Ltd. (Onsite, Lahore) | Aug–Sep 2025</strong><br>
Worked inside a real HR department of a manufacturing company. Handled CV screening, interview scheduling, employee onboarding, payroll processing, and Oracle HR database management — proving he understands the human side of organizations, not just the tech.<br><br>
<strong>💻 4. Front-End Intern — Tara Technologies Pvt. Ltd. (Onsite) | Jul–Sep 2023</strong><br>
His first professional role — inside a real software house. Designed UIs with Figma, Photoshop & Illustrator, wrote HTML/CSS, collaborated via GitHub on live client projects. Was <strong>formally recognized by the company</strong> for outstanding contributions — an extraordinary achievement for a first-year university student.`
  },

  certifications: {
    keys: ['certif','certificate','certified','credential','course','google','microsoft','ibm','sap','coursera','simplilearn','cambridge','odoo cert','python cert','power bi cert'],
    answer: `Umer holds <strong>9 certifications</strong> from globally trusted platforms:<br><br>
🐍 <strong>IT Automation with Python</strong> — Google | April 2025<br>
📊 <strong>Microsoft Power BI</strong> (Data Analysis & Visualization) — Uni Athena / Cambridge UK | April 2025<br>
🌐 <strong>WordPress Development</strong> — Coursera | April 2025<br>
🎨 <strong>Canva Graphic Design</strong> — Simplilearn | April 2025<br>
🏢 <strong>Managing Basic Business Scenarios</strong> — SAP | June 2025<br>
⚙️ <strong>Odoo 14 Essentials</strong> — Odoo Official | June 2025<br>
📋 <strong>Foundations of Project Management</strong> — Google | June 2025<br>
🤝 <strong>Developing Interpersonal Skills</strong> — IBM | July 2025<br>
🔄 <strong>Jira SCRUM Project Management</strong> — Coursera | July 2025<br><br>
Platforms: <strong>Google · Microsoft · IBM · SAP · Coursera · Simplilearn · Odoo · Cambridge UK</strong><br><br>
Nine certifications in 2025 alone is not just impressive — it's a signal of someone who takes their craft seriously and never stops growing.`
  },

  awards: {
    keys: ['award','achievement','recognition','icaisai','honor','prize','recognised','recognized','excellence','won','selected','top','best erp'],
    answer: `Umer's recognition falls into three groups:<br><br>
<strong>Honours</strong><br>
<strong>🥇 ICAISAI'26 Exhibition Selectee (2026)</strong> — one of <strong>only 3 projects out of the entire BBIS batch</strong> exhibited at HSM, UMT, and evaluated by a <strong>DevOps & Cloud expert from Nex Skill</strong>.<br>
<strong>🏆 Best ERP Innovative Idea (18 June 2026)</strong> — E-Business category at the HSM Project Exhibition, for Artisan Aura Creations (Odoo, Shopify, Power BI, Microsoft Clarity and Meta Business Suite in one ecosystem).<br>
<strong>🥉 Top 3 ERP Projects (January 2026)</strong> — placed among the top three ERP projects at UMT.<br>
<strong>🏅 Recognised Intern (Jul – Sep 2023)</strong> — formally recognised by Tara Technologies for UI/UX and frontend work on live client projects.<br><br>
<strong>Leadership and service</strong><br>
Capstone Project Lead, Team Leader on UMT design and tech projects, and CSR Volunteer for the Disability Day seminar with Hum Mashal-e-Rah Foundation.<br><br>
<strong>Credentials</strong><br>
Certified through Google, Microsoft, IBM, SAP, Coursera and Simplilearn, including Power BI through Uni Athena (Cambridge, UK).`
  },

  education: {
    keys: ['education','degree','university','umt','college','study','studying','semester','bbis','pre-engineering','school','academic','qualification'],
    answer: `<strong>🎓 Bachelor of Business Information Systems (BBIS)</strong><br>
University of Management and Technology (UMT), Lahore<br>
November 2022 – June 2026 | <strong>Graduated — all 8 semesters completed</strong><br><br>
UMT is one of Pakistan's top-ranked universities. The BBIS program equips students with a rare blend of business management thinking and technical IT skills — covering database systems, ERP, business process management, data analytics, web technologies, and more.<br><br>
Umer has used every semester to grow — not just academically, but professionally. He graduated having completed 3 internships, led an exhibited capstone project, and earned 9 international certifications.<br><br>
<strong>📐 FSc Pre-Engineering</strong><br>
Unique College (UGI), Lahore | 2020–2022<br>
Built his foundation in mathematics, physics, and analytical problem-solving — a mindset that carries through everything he builds today.`
  },

  hire: {
    keys: ['hire','why umer','why should','unique','standout','different','best candidate','fit','suitable','recommend','value','strength','what sets','why him'],
    answer: `Here's the honest, evidence-backed case for hiring Umer Faheem:<br><br>
<strong>1. He bridges business AND technology</strong> — Most developers don't understand business processes. Most business analysts can't build. Umer does both. His BBIS degree, Odoo ERP expertise, Power BI skills, and frontend development form a rare combination.<br><br>
<strong>2. He delivers at professional level</strong> — Tara Technologies formally recognized him. His capstone was selected top 3 out of the entire university batch. These aren't participation awards — they're proof of quality output.<br><br>
<strong>3. He never stops learning</strong> — 9 certifications, from Google, IBM, Microsoft, SAP, and Cambridge UK. He doesn't wait to be taught — he seeks knowledge proactively.<br><br>
<strong>4. He has real-world experience across 4 industries</strong> — Textile & Retail (full-time Odoo ERP), AI/ML (data annotation), Manufacturing (HR & Oracle DB), and Software Development (frontend & UI/UX). That's breadth most fresh graduates simply don't have.<br><br>
<strong>5. He works with sincerity and integrity</strong> — Ask anyone who's worked with him. He takes ownership, communicates clearly, and delivers with pride.<br><br>
<strong>He is available now</strong> for Frontend Dev, BI/Data Analysis, ERP Consulting, and UI/UX roles. Full-time, part-time, or remote. 🚀`
  },

  contact: {
    keys: ['contact','reach','email','phone','whatsapp','linkedin','github','how to','get in touch','connect','message','hire him','available','open to work','location','where is'],
    answer: `Here's everything you need to connect with Umer right now:<br><br>
📧 <strong>Email:</strong> <strong>umerfaheem632@gmail.com</strong><br>
📱 <strong>WhatsApp:</strong> <strong>+92 325 8148564</strong> (fastest response)<br>
☎️ <strong>Phone:</strong> 031-443-33022<br>
🔗 <strong>LinkedIn:</strong> linkedin.com/in/youknowumer<br>
💻 <strong>GitHub:</strong> github.com/youknowumer<br>
📍 <strong>Location:</strong> Iqbal Town, Lahore, Pakistan<br><br>
<strong>✅ Actively Open To:</strong><br>
• Frontend Web Development<br>
• Business Intelligence & Data Analysis<br>
• ERP Implementation & Consulting (Odoo, SAP)<br>
• UI/UX Design<br>
• IT Support / Business Systems<br><br>
Umer is available for <strong>full-time, part-time, remote, and freelance</strong> work. Don't hesitate — he responds fast!`
  },

  cv: {
    keys: ['cv','resume','download','document','pdf','cover letter','view cv','get cv'],
    answer: `You can find Umer's documents right here in the portfolio:<br><br>
📄 <strong>CV / Resume</strong> — Scroll down to the <strong>"My Documents"</strong> section, or click the <strong>"Resume"</strong> button in the top navigation bar. You can preview it inline or download the PDF.<br><br>
📝 <strong>Cover Letter</strong> — Also available in the "My Documents" section under the Cover Letter tab — tailored for BIS / Tech / Frontend roles in 2026.<br><br>
Both documents are professionally formatted and up to date. If you're a recruiter, the CV lays out his full experience, certifications, skills, and education at a glance.`
  },

  personality: {
    keys: ['personality','character','person','soft skill','communication','teamwork','leadership','attitude','work ethic','values','passion','motivated','sincere','honest'],
    answer: `Umer Faheem is not just a skilled professional — he's someone you <em>want</em> on your team:<br><br>
<strong>💡 Sincere & Hardworking</strong> — He brings genuine dedication to every task. When Umer commits, he delivers — no shortcuts, no excuses.<br><br>
<strong>🎯 Detail-Oriented</strong> — Whether it's designing a UI, writing SQL queries, or setting up ERP workflows, precision is his standard. He doesn't just get it done — he gets it right.<br><br>
<strong>🤝 Collaborative & Communicative</strong> — He works well in teams, leads when needed, and supports others effectively. His internship recognitions prove this isn't self-reported — it's observed.<br><br>
<strong>📈 Continuous Learner</strong> — 9 certifications in a single year tells you everything. He doesn't wait for opportunity — he prepares for it constantly.<br><br>
<strong>🌉 Bridge Builder</strong> — He understands business goals AND technical constraints. That rare balance makes him the person who can translate between stakeholders and developers.<br><br>
<strong>🔥 Motivated by Impact</strong> — He doesn't build things to check boxes. He builds them to create real, lasting value.`
  },

  odoo: {
    keys: ['odoo','erp system','enterprise resource','artisan aura','leather','modules','crm module','hr module','inventory module','manufacturing module'],
    answer: `The <strong>Artisan Aura Creations ERP project</strong> is Umer's most ambitious and recognized work — and it's extraordinary for a student project.<br><br>
<strong>What it is:</strong> A full-scale Odoo ERP implementation for a fictional sustainable leather goods brand, built as his final year capstone.<br><br>
<strong>Modules implemented from scratch:</strong><br>
• <strong>CRM</strong> — Customer relationship pipeline, lead tracking<br>
• <strong>HR</strong> — Employee management, recruitment, payroll<br>
• <strong>Sales</strong> — Order management, customer invoicing<br>
• <strong>Inventory</strong> — Stock control, warehouse management<br>
• <strong>Manufacturing</strong> — Production orders, BOMs, work centers<br>
• <strong>Procurement</strong> — Vendor management, purchase orders<br>
• <strong>Marketing</strong> — Campaign management<br>
• <strong>Analytics</strong> — Business intelligence dashboards<br><br>
<strong>The outcome:</strong> Selected as <strong>1 of only 3 projects</strong> from the entire batch for exhibition at ICAISAI'26, evaluated by a DevOps & Cloud professional from Nex Skill. This is enterprise-level systems thinking from a 22-year-old.`
  },

  powerbi: {
    keys: ['power bi','powerbi','bi','business intelligence','dashboard','dax','kpi','data analysis','data analytics','visualization','report','tableau'],
    answer: `Umer has strong, certified <strong>Business Intelligence skills</strong>:<br><br>
<strong>📊 Power BI expertise:</strong><br>
• Building interactive dashboards with drill-down capabilities<br>
• Writing DAX measures and calculated columns<br>
• Designing KPI tracking and sales trend analysis<br>
• Creating visual reports for business decision-making<br><br>
<strong>Certification:</strong> Microsoft Power BI — Uni Athena / <strong>Cambridge UK</strong> (April 2025) — an internationally recognized credential.<br><br>
He also works with <strong>SQL</strong> for querying, <strong>Oracle DB</strong> for enterprise data, and <strong>IBM SPSS</strong> for statistical analysis — making him a well-rounded data professional, not just a dashboard builder.`
  },

  sql: {
    keys: ['sql','database','oracle','db','query','data','relational','table','schema','normalize','er diagram','mysql','postgresql'],
    answer: `Umer is solid on the <strong>database and data layer</strong>:<br><br>
<strong>🗄️ SQL & Database Skills:</strong><br>
• Writing complex SQL queries (joins, subqueries, aggregations)<br>
• Database design: ER diagrams, conceptual and logical modeling<br>
• Full normalization of relational schemas<br>
• Oracle Database (primary platform for academic and project work)<br>
• Oracle HR Database (used during MGA Industries internship)<br><br>
<strong>Projects that prove it:</strong><br>
• <strong>Student Registration System</strong> — Oracle DB with full ER modeling<br>
• <strong>Library Management System</strong> — Fully normalized schema, integrity constraints<br>
• <strong>Power BI Dashboard</strong> — Data pulled and structured from source systems<br><br>
He understands databases from design all the way to querying — a critical skill for any tech or BI role.`
  },

  design: {
    keys: ['design','figma','adobe','photoshop','illustrator','ui','ux','user interface','user experience','graphic','visual','canva','creative','portfolio design','premiere','after effects'],
    answer: `Umer has a genuine creative eye backed by professional-grade tools:<br><br>
<strong>🎨 UI/UX Design:</strong><br>
Figma — wireframing, prototyping, and user flow design<br>
Adobe XD concepts applied through Photoshop/Illustrator<br><br>
<strong>🖌️ Graphic Design:</strong><br>
Adobe Photoshop — photo editing, composites, digital art<br>
Adobe Illustrator — vector graphics, logos, icons<br>
Canva — rapid visual content creation (certified)<br><br>
<strong>🎬 Video & Motion:</strong><br>
Adobe Premiere Pro — video editing<br>
Adobe After Effects — motion graphics and animation<br>
Adobe Audition — audio editing<br><br>
During his internship at <strong>Tara Technologies</strong>, he used Figma, Photoshop, and Illustrator on <strong>real client projects</strong> — not just coursework. He was formally recognized by the company for the quality of his design work.<br><br>
This visual ability makes him rare — a developer who can also design, meaning he delivers complete, polished products end-to-end.`
  },

  python: {
    keys: ['python','automation','scripting','coding','programming','code','c++','developer'],
    answer: `Umer has practical programming skills to complement his systems and BI expertise:<br><br>
<strong>🐍 Python:</strong><br>
Advanced proficiency — scripting, IT automation, and data processing. He earned the <strong>Google IT Automation with Python</strong> certification (April 2025), covering real-world automation scripts, working with files, processes, and APIs.<br><br>
<strong>⚡ C++:</strong><br>
Foundational knowledge from his pre-engineering background — understanding of logic, loops, data structures.<br><br>
While he identifies primarily as a Business-IT professional rather than a pure software developer, his programming knowledge allows him to work directly with developer teams, understand codebases, and automate repetitive tasks — valuable in any tech-oriented role.`
  },

  location: {
    keys: ['lahore','pakistan','location','based','city','where','relocate','remote','onsite','hybrid'],
    answer: `Umer is based in <strong>Iqbal Town, Lahore, Punjab, Pakistan 🇵🇰</strong><br><br>
He is open to:<br>
✅ <strong>Onsite</strong> roles in Lahore<br>
✅ <strong>Remote</strong> work (anywhere in the world)<br>
✅ <strong>Hybrid</strong> arrangements<br>
✅ <strong>Relocation</strong> — he is willing and ready to relocate if the opportunity is right<br><br>
His previous roles span onsite (Tara Technologies, MGA Industries) and remote (Nexpred Solutions) — proving he can work effectively in both environments.`
  },

  available: {
    keys: ['available','open to work','looking for','seeking','opportunity','job opening','position','role','vacancy','internship opportunity','full time','part time','freelance'],
    answer: `<strong>Yes — Umer is actively available and looking! 🚀</strong><br><br>
He is open to:<br><br>
💻 <strong>Frontend Web Development</strong> — HTML/CSS/JS, WordPress<br>
📊 <strong>Business Intelligence & Data Analysis</strong> — Power BI, SQL<br>
🏢 <strong>ERP Consulting / Implementation</strong> — Odoo, SAP<br>
🎨 <strong>UI/UX Design</strong> — Figma, Adobe Suite<br>
🤖 <strong>Data Annotation / AI/ML Support</strong><br>
🏗️ <strong>Business Systems / IT Analyst</strong> roles<br><br>
<strong>Work arrangements:</strong> Full-time · Part-time · Remote · Freelance · Internship<br><br>
📧 Reach him at <strong>umerfaheem632@gmail.com</strong><br>
📱 WhatsApp: <strong>+92 325 8148564</strong>`
  }
};

/* ── Keyword matching engine ── */
function getAnswer(query) {
  const q = query.toLowerCase().replace(/[^\p{L}\p{N}\s+#.]/gu, ' ').replace(/\s+/g, ' ').trim();
  const words = new Set(q.split(' '));
  let bestTopic = null, bestScore = 0;
  for (const [topic, data] of Object.entries(UMER_KB)) {
    let score = 0;
    for (const key of data.keys) {
      const k = key.toLowerCase();
      /* short keys must match a whole word (stops "hr" matching "three"); phrases may match as substrings */
      const hit = k.includes(' ') || k.length > 4 ? q.includes(k) : words.has(k);
      if (hit) score += k.split(' ').length * (k.length > 4 ? 1.5 : 1);
    }
    if (score > bestScore) { bestScore = score; bestTopic = topic; }
  }

  if (/how (many|long)|total|numbers?|stats?|at a glance/.test(q) && window.App && App.stats) {
    const st = App.stats();
    return `📊 <strong>At a glance</strong><br><br>💼 <strong>${st.roles}</strong> roles · ${Math.floor(st.totalMonths/12)} yr ${st.totalMonths%12} mo hands-on experience<br>🏅 <strong>${st.certs}</strong> certifications from <strong>${st.providers}</strong> providers<br>⚡ <strong>${st.skills}</strong> tracked skills · average proficiency <strong>${st.avgSkill}%</strong><br>⭐ Strongest: ${st.topSkills.map(App.esc).join(', ')}`;
  }
  if (bestTopic && bestScore > 0) {
    return UMER_KB[bestTopic].answer;
  }

  // Fallback — general helpful response
  return `Great question! Let me point you in the right direction. Here's a quick summary of what I know about Umer:<br><br>
👤 <strong>Who:</strong> Muhammad Umer Faheem — BBIS Graduate (2026), UMT Lahore — now MTO – ERP at Maryum N Maria<br>
🏆 <strong>Top Achievement:</strong> ICAISAI'26 Exhibition Selectee (Top 3 of entire batch)<br>
💼 <strong>Experience:</strong> Full-time ERP role (MTO) plus 3 internships — AI/ML, HR, Frontend Development<br>
⚡ <strong>Skills:</strong> Frontend, Power BI, Odoo ERP, SQL, Figma, Adobe Suite<br>
🏅 <strong>Certifications:</strong> 9 from Google, IBM, Microsoft, SAP, Cambridge UK<br>
📞 <strong>Contact:</strong> umerfaheem632@gmail.com | WhatsApp +92 325 8148564<br><br>
Try asking: <em>"What are his skills?"</em>, <em>"Tell me about his projects"</em>, <em>"Why should I hire Umer?"</em> or <em>"How do I contact him?"</em>`;
}

/* ══════════ CHAT: SEND MESSAGE ══════════ */
async function sendChatMsg(){
  if(isStreaming) return;
  const input = document.getElementById('chatInput');
  if(!input) return;
  const text = input.value.trim();
  if(!text) return;
  input.value = '';
  input.style.height = 'auto';

  addMessage(text, 'user');
  chatHistory.push({role:'user', content: text});

  isStreaming = true;
  setChatInputDisabled(true);
  showTyping();

  // Simulate a natural thinking delay (600–1200ms)
  const delay = 600 + Math.random() * 600;

  setTimeout(() => {
    hideTyping();
    const answer = getAnswer(text);
    addMessage(answer, 'bot');
    chatHistory.push({role:'assistant', content: answer});
    addSmartChips(answer);
    isStreaming = false;
    setChatInputDisabled(false);
    setTimeout(()=>{ const inp = document.getElementById('chatInput'); if(inp) inp.focus(); }, 100);
  }, delay);
}

/* ══════════ CHAT: SMART FOLLOW-UP CHIPS ══════════ */
function addSmartChips(replyText){
  const msgs = document.getElementById('chatMessages');
  if(!msgs) return;

  const text = replyText.toLowerCase();
  let chips = [];

  if(text.includes('skill') || text.includes('html') || text.includes('sql') || text.includes('power bi'))
    chips.push({label:'🚀 See Projects', q:'Tell me about all his main projects in detail'});
  if(text.includes('project') || text.includes('odoo') || text.includes('artisan') || text.includes('erp'))
    chips.push({label:'🏆 Awards & Recognition', q:'What awards and recognition has Umer received?'});
  if(text.includes('experience') || text.includes('intern') || text.includes('tara') || text.includes('mga'))
    chips.push({label:'🎓 Education Details', q:'Tell me about his education and university degree at UMT'});
  if(text.includes('education') || text.includes('umt') || text.includes('degree') || text.includes('semester'))
    chips.push({label:'🏅 All Certifications', q:'List all his certifications, from which platforms and when he got them'});
  if(text.includes('award') || text.includes('icaisai') || text.includes('recognition'))
    chips.push({label:'⭐ Why Hire Umer?', q:'Give me a compelling case for why I should hire Umer Faheem'});
  if(chips.length === 0)
    chips.push({label:'💼 Work Experience', q:'What is his full work experience and what did he do in each role?'}, {label:'📄 Get His CV', q:'How do I view or download his CV?'});

  chips = chips.slice(0, 3);

  const row = document.createElement('div');
  row.className = 'aichat-suggest-row';
  chips.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'aichat-suggest-chip';
    btn.textContent = c.label;
    btn.onclick = () => { row.remove(); chipAsk(c.q); };
    row.appendChild(btn);
  });
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
}

/* ══════════ CHAT: INIT ══════════ */
document.addEventListener('DOMContentLoaded', function(){

  /* Chat input auto-resize + Enter to send */
  const chatInp = document.getElementById('chatInput');
  if(chatInp){
    chatInp.addEventListener('input', function(){
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    chatInp.addEventListener('keydown', function(e){
      if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendChatMsg(); }
    });
  }

  /* Chat overlay init */
  const overlay = document.getElementById('aiChatOverlay');
  if(overlay){
    overlay.addEventListener('click', function(e){ if(e.target === this) toggleAIChat(); });
    overlay.style.display = 'none';
  }

  /* Escape closes the chat */
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && chatOpen) toggleAIChat();
  });

  /* Unread badge after delay */
  setTimeout(()=>{ if(!chatOpen){ unreadCount = 1; updateUnreadBadge(); } }, 4500);
});
