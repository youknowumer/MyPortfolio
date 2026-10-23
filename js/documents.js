/* Documents — CV / cover letter preview modal */

/* ══════════════════════════════════════════════════════
   DOCUMENT VIEWER
══════════════════════════════════════════════════════ */
function openDocViewer(type){
  const overlay = document.getElementById('pdfViewerOverlay');
  const body = document.getElementById('pdfViewerBody');
  const title = document.getElementById('pdfModalTitle');
  const sub = document.getElementById('pdfModalSub');
  const icon = document.getElementById('pdfModalIcon');
  const dlBtn = document.getElementById('pdfModalDlBtn');
  if(!overlay||!body) return;

  if(type === 'cv'){
    title.textContent = 'CV — Muhammad Umer Faheem';
    sub.textContent = 'Full Resume · PDF · 2026';
    icon.innerHTML = '<i class="fas fa-file-alt"></i>';
    icon.style.background = 'linear-gradient(145deg,#D4813A,#A85E22)';
    dlBtn.href = 'assets/docs/Muhammad_Umer_Faheem_CV.pdf';
    dlBtn.download = 'Muhammad_Umer_Faheem_CV.pdf';
    body.innerHTML = `<embed src="assets/docs/Muhammad_Umer_Faheem_CV.pdf#toolbar=0&navpanes=0" type="application/pdf" width="100%" height="100%">
    <div class="pdf-viewer-fallback" id="pdfFallback" style="display:none">
      <i class="fas fa-file-pdf"></i>
      <p>Your browser doesn't support inline PDF preview.<br>Use the <strong>Download CV</strong> button to get the file.</p>
      <a href="assets/docs/Muhammad_Umer_Faheem_CV.pdf" download class="pdf-modal-dl-btn"><i class="fas fa-download"></i> Download CV</a>
    </div>`;
  } else {
    title.textContent = 'Cover Letter — Muhammad Umer Faheem';
    sub.textContent = 'Application Letter · PDF · 2026';
    icon.innerHTML = '<i class="fas fa-envelope-open-text"></i>';
    icon.style.background = 'linear-gradient(135deg,#f59e0b,#D4813A)';
    dlBtn.href = 'assets/docs/Muhammad_Umer_Faheem_Cover_Letter.pdf';
    dlBtn.download = 'Muhammad_Umer_Faheem_Cover_Letter.pdf';
    body.innerHTML = `<div class="cl-preview-content">
      <h3>Muhammad Umer Faheem</h3>
      <div class="cl-contact">Iqbal Town, Lahore &nbsp;|&nbsp; umerfaheem632@gmail.com &nbsp;|&nbsp; WhatsApp +92 325 8148564</div>
      <div class="cl-date">2026</div>
      <div class="cl-subject">Subject: Application for Internship / Entry-Level Role in Business Information Systems / IT / Front-End Development</div>
      <p>Dear Hiring Manager,</p>
      <p>I am writing to express my interest in an internship or entry-level position within your organization, aligned with my academic background in Business Information Systems and practical experience in IT support, front-end development, and ERP systems.</p>
      <p>Currently, I am pursuing a Bachelor's degree in Business Information System at the University of Management and Technology, Lahore. My academic program has provided me with a solid foundation in database systems, business process management, and digital tools such as SQL, Power BI, and MS Office Suite.</p>
      <p>In my recent internship at Tara Technologies, I contributed to front-end web development and UI/UX design using HTML, CSS, Java, GitHub, and Adobe Creative Suite. I also gained experience in digital marketing and administrative coordination during my internship at Forever Living Products.</p>
      <p>I have completed several certification courses from reputable platforms such as Google, Microsoft, and Coursera, including Power BI, WordPress Development, and IT Automation with Python. Furthermore, I led a capstone ERP project using Odoo for a sustainable leather brand, where I designed integrated business workflows across CRM, HR, sales, and inventory modules.</p>
      <p>I am particularly interested in applying my combined technical and business knowledge to contribute to technology-driven projects in a structured and innovative environment. I am willing to relocate and adapt to new cultural and professional settings to grow and add value to your team.</p>
      <p>Please find attached my CV for further details. I am available at your convenience for an interview and can provide references upon request.</p>
      <p>Thank you for considering my application.</p>
      <div class="cl-sig">Kind regards,<br>Muhammad Umer Faheem</div>
    </div>`;
  }

  overlay.style.display = 'flex';
  requestAnimationFrame(()=>overlay.classList.add('open'));
  document.body.style.overflow = 'hidden';
}

function closeDocViewer(){
  const overlay = document.getElementById('pdfViewerOverlay');
  if(!overlay) return;
  overlay.classList.remove('open');
  setTimeout(()=>{ overlay.style.display='none'; document.body.style.overflow=''; },300);
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeDocViewer(); });

/* ══════════ DOCUMENT PREVIEW MODAL ══════════ */
const docFiles = {
  cv: { file: 'assets/docs/Muhammad_Umer_Faheem_CV.pdf', title: 'Muhammad Umer Faheem — CV' },
  cl: { file: 'assets/docs/Muhammad_Umer_Faheem_Cover_Letter.pdf', title: 'Cover Letter — BIS Position' }
};

function switchDoc(type, ev){
  document.querySelectorAll('.doc-panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });
  document.querySelectorAll('.docs-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('docPanel-' + type);
  if(panel){ panel.style.display = 'block'; panel.classList.add('active'); }
  (ev || window.event || {currentTarget:null}).currentTarget?.classList.add('active');
}

function openDocPreview(type){
  const doc = docFiles[type];
  if(!doc) return;
  const modal = document.getElementById('docPreviewModal');
  const iframe = document.getElementById('previewIframe');
  const title = document.getElementById('previewModalTitle');
  const dlBtn = document.getElementById('previewDownloadBtn');
  if(!modal || !iframe) return;

  iframe.src = doc.file;

  if(title) title.textContent = doc.title;
  if(dlBtn){ dlBtn.href = doc.file; dlBtn.download = doc.file.split('/').pop(); }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDocPreview(){
  const modal = document.getElementById('docPreviewModal');
  if(modal){
    modal.style.display = 'none';
  }
  const iframe = document.getElementById('previewIframe');
  if(iframe) iframe.src = '';
  document.body.style.overflow = '';
}

/* ══════════ DOCUMENTS: INIT ══════════ */
document.addEventListener('DOMContentLoaded', function(){

  /* Doc modal close on backdrop */
  const docModal = document.getElementById('docPreviewModal');
  if(docModal){
    docModal.addEventListener('click', function(e){ if(e.target === this) closeDocPreview(); });
    docModal.style.display = 'none';
  }

  /* Escape closes the preview */
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape') closeDocPreview();
  });

  /* Doc panels init */
  document.querySelectorAll('.doc-panel').forEach((p, i) => {
    if(i > 0) p.style.display = 'none';
  });
});
