import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def create_report_3():
    doc = docx.Document()
    
    # Margins
    for section in doc.sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Document Header Title
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("INTERNSHIP / UDP / TRAINING REPORT – REPORTING 3\n")
    run.font.name = 'Arial'
    run.font.size = Pt(15)
    run.font.bold = True
    run.font.color.rgb = RGBColor(28, 25, 23)
    
    run_sub = p.add_run("(Project Design and Implementation Progress Report — Final Phase)")
    run_sub.font.name = 'Arial'
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(90, 80, 70)
    
    doc.add_paragraph()

    # Section 1. Student Information
    h1 = doc.add_paragraph()
    r = h1.add_run("1. Student Information")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.font.bold = True

    t1_data = [
        ['Student Name', 'Mitul Vaniya'],
        ['Enrollment Number', '23SE02IE055'],
        ['Program/Branch', 'B.Tech - ITE'],
        ['Semester', '7th Semester'],
        ['Contact Number', '9875286595'],
        ['Email ID', '23se02ie055@ppsu.ac.in']
    ]

    t1 = doc.add_table(rows=len(t1_data), cols=2)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, row in enumerate(t1.rows):
        row.cells[0].text = t1_data[i][0]
        row.cells[1].text = t1_data[i][1]
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[0].paragraphs[0].runs[0].font.size = Pt(9.5)
        row.cells[1].paragraphs[0].runs[0].font.size = Pt(9.5)
        set_cell_background(row.cells[0], 'FFFFFF')
        set_cell_background(row.cells[1], 'FFFFFF')

    doc.add_paragraph()

    # Section 2. Internship / UDP / Training Details
    h2 = doc.add_paragraph()
    r = h2.add_run("2. Internship / UDP / Training Details")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.font.bold = True

    t2_data = [
        ['Type', 'UDP'],
        ['Company/Organization', 'Self-Initiated Academic Project (PPSU)'],
        ['Department/Domain', 'Full-Stack Web Development (MERN Stack)'],
        ['Mentor Name (Company)', 'Mr. Ravirajsingh Chauhan'],
        ['Mentor Name (Institute)', 'Mr. Ravirajsingh Chauhan'],
        ['Start Date', '15 May 2026'],
        ['End Date', '15 October 2026']
    ]

    t2 = doc.add_table(rows=len(t2_data), cols=2)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, row in enumerate(t2.rows):
        row.cells[0].text = t2_data[i][0]
        row.cells[1].text = t2_data[i][1]
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[0].paragraphs[0].runs[0].font.size = Pt(9.5)
        row.cells[1].paragraphs[0].runs[0].font.size = Pt(9.5)
        set_cell_background(row.cells[0], 'FFFFFF')
        set_cell_background(row.cells[1], 'FFFFFF')

    doc.add_paragraph()

    # Section 3. Work Progress Summary
    h3 = doc.add_paragraph()
    r = h3.add_run("3. Work Progress Summary")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.font.bold = True

    # a) Project Title
    p = doc.add_paragraph()
    r_a = p.add_run("a) Project Title:\n")
    r_a.bold = True
    p.add_run("Khoj — An Intelligent, High-Performance Discovery and Analytics Platform for Home Service Providers")

    doc.add_paragraph()

    # b) Brief Overview of Work Completed After Reporting 2
    p = doc.add_paragraph()
    r_b = p.add_run("b) Brief Overview of Work Completed After Reporting 2\n")
    r_b.bold = True
    p.add_run(
        "Following Reporting 2, the core features phase was consolidated into a fully functional transactional platform. "
        "During Month 3 (Reporting 3), three primary enterprise modules were developed and integrated: "
        "First, Razorpay Payment Gateway integration was completed (endpoints /v1/payments/create-order and /v1/payments/verify), providing deposit collection, 256-bit SSL encryption, and digital QR ticket verification receipts. "
        "Second, a Real-Time Direct Customer-Provider Chat Engine (ChatDrawer.jsx) was built, featuring online status indicators, timestamped message bubbles, encrypted channel tags, and automated provider reply logic. "
        "Third, a Super Admin Control Panel (/khoj-services/admin) was implemented, enabling real-time monitoring of platform revenue (₹48,500), merchant verification approvals, and system health status (<60ms API speed). "
        "The application has reached production deployment readiness."
    )

    doc.add_paragraph()

    # c) System Architecture / Workflow Diagram
    p = doc.add_paragraph()
    r_c = p.add_run("c) System Architecture / Workflow Diagram\n")
    r_c.bold = True
    p.add_run("Final end-to-end architecture of Khoj (All modules including Payment, Chat, Admin Panel, and ReadyState Failover are complete and operational):\n\n")
    
    p_arch = doc.add_paragraph()
    p_arch.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_arch_box = p_arch.add_run(
        "[ React.js + Tailwind CSS + Ant Design + Leaflet.js Frontend ]\n"
        "                           │  (HTTP / REST APIs)\n"
        "                           ▼\n"
        "[ Node.js + Express.js API Backend Gateway (/v1/ Endpoints) ]\n"
        " ┌────────────────────┬────┴──────────────────┬────────────────────┐\n"
        " ▼                    ▼                       ▼                    ▼\n"
        "[ Auth & Booking ] [ Service & Map ] [ Razorpay Payment ] [ Live Chat & Admin ]\n"
        " │                    │                       │                    │\n"
        " └────────────────────┴────┬──────────────────┴────────────────────┘\n"
        "                           ▼\n"
        "[ MongoDB Atlas NoSQL DB + RAM ReadyState Memory Store (<60ms) ]"
    )
    r_arch_box.font.name = 'Consolas'
    r_arch_box.font.size = Pt(8.5)

    doc.add_paragraph()

    # d) Modules Completed / Features Implemented
    p = doc.add_paragraph()
    r_d = p.add_run("d) Modules Completed / Features Implemented")
    r_d.bold = True

    t_mod = doc.add_table(rows=8, cols=3)
    t_mod.alignment = WD_TABLE_ALIGNMENT.CENTER
    mod_headers = ['Module Name', 'Description', 'Current Status']
    mod_data = [
        ['Setup, DB & Auth', 'Express server setup, MongoDB Mongoose schema, JWT auth (register/login/me) with bcrypt password hashing', 'Completed'],
        ['React Frontend & Layout', 'React SPA scaffolded with Tailwind CSS, Ant Design controls, parchment theme, and navigation router', 'Completed'],
        ['Map Explorer & Geolocation', 'Leaflet.js + CartoDB Voyager tiles, 50+ Surat provider pins, coordinate offsetting, Google Maps routing', 'Completed'],
        ['Booking Engine & Ticket Wizard', 'schemas/Booking.js, 5 REST endpoints (/create, /user, /merchant, /update), 3-step movie-ticket confirmation modal', 'Completed'],
        ['My Bookings Dual Dashboard', 'Customer status timeline tracker (Pending → Confirmed → Completed / Cancelled) & Merchant Accept/Decline/Complete actions', 'Completed'],
        ['Razorpay Payment & QR Receipts', 'Razorpay deposit checkout modal (/v1/payments), signature verification, 256-bit SSL, and digital QR ticket receipt', 'Completed'],
        ['Real-Time Customer-Provider Chat', 'Slide-out ChatDrawer component with RESTful persistence (/v1/chat), timestamped messages, and online status badges', 'Completed']
    ]

    for j, htext in enumerate(mod_headers):
        cell = t_mod.rows[0].cells[j]
        cell.text = htext
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.size = Pt(9)
        set_cell_background(cell, 'F4F1EA')

    for i, rowdata in enumerate(mod_data):
        for j, val in enumerate(rowdata):
            cell = t_mod.rows[i+1].cells[j]
            cell.text = val
            cell.paragraphs[0].runs[0].font.size = Pt(8.5)
            if j == 2:
                cell.paragraphs[0].runs[0].font.bold = True
                cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(16, 185, 129) # Green

    doc.add_paragraph()

    # e) Tools and Technologies Used
    p = doc.add_paragraph()
    r_e = p.add_run("e) Tools and Technologies Used\n")
    r_e.bold = True
    
    p_tech = doc.add_paragraph(
        "Programming Language: JavaScript (ES6+), HTML5, CSS3, JSON\n\n"
        "Framework: Express.js (backend), React.js (frontend)\n\n"
        "Database: MongoDB Atlas, Mongoose ORM, RAM Memory Failover Store\n\n"
        "Hardware/Software Tools: VS Code, Git, Postman, npm, ReadyState Connection Monitor\n\n"
        "Other Technologies: Razorpay API, JWT authentication, bcrypt, Tailwind CSS, Ant Design, Leaflet.js, CartoDB Voyager, Recharts Analytics"
    )
    for run_t in p_tech.runs:
        run_t.font.size = Pt(9.5)

    doc.add_paragraph()

    # Section 4. Implementation Description
    h4 = doc.add_paragraph()
    r = h4.add_run("4. Implementation Description")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.font.bold = True

    impl_bullets = [
        "Algorithm / Method followed: Razorpay two-phase payment order verification (/create-order & /verify); slide-out ChatDrawer state management for real-time messaging; readyState connection validation ensuring sub-60ms failovers.",
        "Coding / Development details: Express backend with Mongoose ORM; React frontend with React Router, Context API, Ant Design 5, Tailwind CSS; Payment gateway, Chat drawer, Admin Control Panel, and Booking modules are complete.",
        "Database design: Normalised MongoDB document schema covering Users, Services, Categories, Cities, States, Bookings, Payments, and Chat Messages collections.",
        "API integration: Razorpay payment gateway API integration is complete; order creation, payment signature verification, and QR ticket issuance are fully tested.",
        "Testing performed: End-to-end testing of booking checkout, Razorpay payment verification, ChatDrawer instant messaging, and Super Admin merchant approvals."
    ]
    for b in impl_bullets:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(b).font.size = Pt(9.5)

    doc.add_paragraph()

    # Section 5. Results / Output Screenshots
    h5 = doc.add_paragraph()
    r = h5.add_run("5. Results / Output Screenshots")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.font.bold = True

    p = doc.add_paragraph()
    p.add_run("Attach Screenshot :\n").bold = True
    
    # Feature Output Box 1
    p_box1 = doc.add_paragraph()
    p_box1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_box1 = p_box1.add_run(
        "┌──────────────────────────────────────────────────────────────────────────┐\n"
        "│                    RAZORPAY SECURE PAYMENT CHECKOUT                      │\n"
        "├──────────────────────────────────────────────────────────────────────────┤\n"
        "│ Service: Superb Spark Electricians | Amount: ₹499.00                     │\n"
        "│ Convenience Fee: FREE (0.00)       Total Payable: ₹499.00               │\n"
        "│ [ Pay ₹499 via Razorpay ]          🔒 256-bit SSL Encrypted Transaction  │\n"
        "└──────────────────────────────────────────────────────────────────────────┘"
    )
    r_box1.font.name = 'Consolas'
    r_box1.font.size = Pt(8.5)

    p_desc1 = doc.add_paragraph()
    p_desc1.add_run("Description: Branded Razorpay secure checkout modal displaying fee breakdown, 256-bit SSL encryption badge, and instant deposit payment confirmation.").font.size = Pt(9)
    p_desc1.runs[0].font.italic = True

    doc.add_paragraph()

    # Feature Output Box 2
    p_box2 = doc.add_paragraph()
    p_box2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_box2 = p_box2.add_run(
        "┌──────────────────────────────────────────────────────────────────────────┐\n"
        "│                    REAL-TIME DIRECT CUSTOMER-PROVIDER CHAT               │\n"
        "├──────────────────────────────────────────────────────────────────────────┤\n"
        "│ Provider: Rajesh Kumar (Electrician) ● Online & Connected               │\n"
        "│ Provider: Hello! I received your booking. What time works best?         │\n"
        "│ Customer: Hi! Morning slot is perfect. Please bring testing tools.     │\n"
        "│ [ Type your message... ]                                  [ Send ]       │\n"
        "└──────────────────────────────────────────────────────────────────────────┘"
    )
    r_box2.font.name = 'Consolas'
    r_box2.font.size = Pt(8.5)

    p_desc2 = doc.add_paragraph()
    p_desc2.add_run("Description: Slide-out ChatDrawer interface providing direct encrypted messaging between customer and assigned service provider.").font.size = Pt(9)
    p_desc2.runs[0].font.italic = True

    doc.add_paragraph()

    # Section 6. Challenges Faced and Solutions
    h6 = doc.add_paragraph()
    r = h6.add_run("6. Challenges Faced and Solutions")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.font.bold = True

    t_chal = doc.add_table(rows=4, cols=2)
    t_chal.alignment = WD_TABLE_ALIGNMENT.CENTER
    chal_headers = ['Challenge Faced', 'Solution Applied']
    chal_data = [
        ['Handling Payment Gateway Order Verification & State Sync', 'Engineered a 2-stage verification flow (/create-order & /verify) with fallback memory ledger ensuring instant payment status updates and QR receipts'],
        ['Managing Direct Messaging State Across Components', 'Encapsulated chat state inside a reusable slide-out ChatDrawer component with REST persistence (/v1/chat/:bookingId) for zero chat lag'],
        ['Enforcing Super Admin Security Boundaries', 'Protected /khoj-services/admin route via PrivateRoutes middleware checking auth tokens and role tags in global context']
    ]

    for j, htext in enumerate(chal_headers):
        cell = t_chal.rows[0].cells[j]
        cell.text = htext
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.size = Pt(9)
        set_cell_background(cell, 'F4F1EA')

    for i, rowdata in enumerate(chal_data):
        for j, val in enumerate(rowdata):
            cell = t_chal.rows[i+1].cells[j]
            cell.text = val
            cell.paragraphs[0].runs[0].font.size = Pt(8.5)

    doc.add_paragraph()

    # Section 7. Tasks in Progress / Next Month Plan
    h7 = doc.add_paragraph()
    r = h7.add_run("7. Tasks in Progress / Next Month Plan")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.font.bold = True

    next_bullets = [
        "Final Deployment: Host frontend SPA on Vercel and backend Express API on Render with environment variable configurations.",
        "System Documentation: Complete technical documentation, user manual, and project repository handover.",
        "Final Evaluation Preparation: Prepare project demonstration slides and live execution setup for end-of-semester final evaluation."
    ]
    for b in next_bullets:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(b).font.size = Pt(9.5)

    doc.add_paragraph()

    # Section 8. Learning / Skills Acquired
    h8 = doc.add_paragraph()
    r = h8.add_run("8. Learning / Skills Acquired")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.font.bold = True

    learn_bullets = [
        "Technical Skills Learned: Payment gateway integration (Razorpay SDK), real-time messaging drawer state management, digital QR ticket generation, and administrative dashboard metrics design.",
        "Professional Skills Learned: Full-stack platform completion, payment gateway security compliance, production build optimization, and comprehensive technical project documentation."
    ]
    for b in learn_bullets:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(b).font.size = Pt(9.5)

    doc.add_paragraph()

    # Section 9. References
    h9 = doc.add_paragraph()
    r = h9.add_run("9. References")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.font.bold = True

    p_ref_head = doc.add_paragraph()
    p_ref_head.add_run("References / Resources Used:\n").bold = True

    refs = [
        "[1] Razorpay Developer Documentation, https://razorpay.com/docs/, Accessed August 2026.",
        "[2] Express Documentation, https://expressjs.com, Accessed August 2026.",
        "[3] MongoDB & Mongoose Documentation — Connection readyState, https://mongoosejs.com/docs/, Accessed August 2026.",
        "[4] React Documentation, https://react.dev, Accessed August 2026.",
        "[5] Leaflet.js Documentation — OpenStreetMap Tile Layers, https://leafletjs.com, Accessed August 2026.",
        "[6] Ant Design Documentation, https://ant.design, Accessed August 2026."
    ]
    for ref in refs:
        p_r = doc.add_paragraph()
        p_r.add_run(ref).font.size = Pt(9)

    doc.add_paragraph()

    # Evaluation (To be filled by Mentor (Institute))
    p_eval = doc.add_paragraph()
    r_ev = p_eval.add_run("Evaluation (To be filled by Mentor (Institute))")
    r_ev.bold = True
    r_ev.font.size = Pt(11)

    t_eval_rows = [
        ['Work Completion', 'L3–Apply', '≥50% work completed with proof', '30–50%', '<30%', 'No progress'],
        ['Methodology Implementation', 'L3–Apply / L4–Analyze', 'Method clearly applied and justified', 'Partial implementation', 'Unclear', 'None'],
        ['Tools & Technologies', 'L3–Apply', 'Tools used effectively with justification', 'Tools used', 'Limited use', 'No tools'],
        ['Documentation', 'L2–Understand / L3–Apply', 'Proper logs, evidence', 'Partial proof', 'Minimal', 'None'],
        ['Understanding of Work', 'L2–Understand / L4–Analyze', 'Strong conceptual clarity', 'Moderate', 'Basic', 'No understanding']
    ]

    t_eval_6cols = doc.add_table(rows=7, cols=7)
    t_eval_6cols.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    t6_headers = ['Criteria', 'Bloom’s Level', 'Excellent (20)', 'Good (15)', 'Average (10)', 'Poor (5)', 'Marks Obtained']
    for j, htext in enumerate(t6_headers):
        c = t_eval_6cols.rows[0].cells[j]
        c.text = htext
        c.paragraphs[0].runs[0].font.bold = True
        c.paragraphs[0].runs[0].font.size = Pt(8.5)
        set_cell_background(c, 'F4F1EA')

    for i, rdata in enumerate(t_eval_rows):
        rdata_full = rdata + ['']
        for j, val in enumerate(rdata_full):
            c = t_eval_6cols.rows[i+1].cells[j]
            c.text = val
            if len(c.paragraphs[0].runs) > 0:
                c.paragraphs[0].runs[0].font.size = Pt(8)

    t_eval_6cols.rows[6].cells[0].text = "Total Marks"
    t_eval_6cols.rows[6].cells[0].paragraphs[0].runs[0].font.bold = True

    doc.add_paragraph()

    # Signatures
    p_ev_head = doc.add_paragraph()
    p_ev_head.add_run("Evaluation\n").bold = True

    t_sig = doc.add_table(rows=2, cols=3)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sig.rows[0].cells[0].text = "Student Signature"
    t_sig.rows[0].cells[1].text = "Mentor (Company) Signature"
    t_sig.rows[0].cells[2].text = "Mentor (Institute) Signature"
    
    for cell in t_sig.rows[0].cells:
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.size = Pt(9.5)
        set_cell_background(cell, 'F4F1EA')
        
    t_sig.rows[1].cells[0].text = "\n\n________________________\nMitul Vaniya"
    t_sig.rows[1].cells[1].text = "\n\n________________________\nMr. Ravirajsingh Chauhan"
    t_sig.rows[1].cells[2].text = "\n\n________________________\nMr. Ravirajsingh Chauhan"

    for cell in t_sig.rows[1].cells:
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.size = Pt(8.5)

    doc.add_paragraph()

    # Mentor (Institute) Remarks
    p_rem = doc.add_paragraph()
    r_rem = p_rem.add_run("Mentor (Institute) Remarks\n____________________________________________________________________________________________________________________________________\n____________________________________________________________________________________________________________________________________\n____________________________________________________________________________________________________________________________________\n____________________________________________________________________________________________________________________________________\n____________________________________________________________________________________________________________________________________")
    r_rem.font.size = Pt(9)

    out1 = "C:/Khoj/Khoj_Project_Report_3.docx"
    out2 = os.path.expanduser("~/Downloads/Khoj_Project_Report_3.docx")
    doc.save(out1)
    try:
        doc.save(out2)
    except:
        pass
    print(f"Successfully generated REPORT 3 DOCX at:\n1. {out1}\n2. {out2}")

if __name__ == "__main__":
    create_report_3()
