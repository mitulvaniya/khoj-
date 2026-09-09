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

def create_exact_report():
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
    run = p.add_run("INTERNSHIP / UDP / TRAINING REPORT – REPORTING 2\n")
    run.font.name = 'Arial'
    run.font.size = Pt(15)
    run.font.bold = True
    run.font.color.rgb = RGBColor(28, 25, 23)
    
    run_sub = p.add_run("(Project Design and Implementation Progress Report)")
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
    set_cell_background(doc.add_table(rows=1, cols=1).rows[0].cells[0], 'E8EEF5') # Banner style if needed, or simple text

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

    # b) Brief Overview of Work Completed After Reporting 1
    p = doc.add_paragraph()
    r_b = p.add_run("b) Brief Overview of Work Completed After Reporting 1\n")
    r_b.bold = True
    p.add_run(
        "Following Reporting 1, the Foundation phase was completed: the local development environment and server infrastructure were established, "
        "Express REST endpoints and MongoDB schemas (Users, Services, Categories, Cities, States) were initialized, JWT authentication with bcrypt password hashing was implemented, "
        "and the React single page application was scaffolded with Tailwind CSS, Ant Design, and custom glassmorphism styling. "
        "The Core Features phase has progressed rapidly since then: the full-stack Booking Engine and 3-step movie-ticket confirmation modal are complete, "
        "the My Bookings dual dashboard (Customer status tracking and Merchant Accept/Decline/Complete actions) is operational, "
        "and an interactive OpenStreetMap / Leaflet.js explorer displaying 50+ service provider pins localized around Surat, Gujarat with Google Maps directions routing is integrated. "
        "Additionally, a verified 5-star Customer Reviews engine with real-time average hero rating calculations and a zero-latency backend readyState connection failover boundary (serving requests in <60ms during cloud DB latency) were implemented. "
        "Work is now on Payment integration with Razorpay; a few integration errors are currently occurring during checkout, and time is being spent debugging and resolving them before moving on. "
        "The WebSockets real-time chat, AWS S3 storage, and final production cloud deployment will be reported in the next submission."
    )

    doc.add_paragraph()

    # c) System Architecture / Workflow Diagram
    p = doc.add_paragraph()
    r_c = p.add_run("c) System Architecture / Workflow Diagram\n")
    r_c.bold = True
    p.add_run("Target end-to-end architecture of Khoj (Setup/Auth through Booking Engine & Leaflet Explorer are complete; Payment is in progress, remaining modules are planned):\n\n")
    
    p_arch = doc.add_paragraph()
    p_arch.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_arch_box = p_arch.add_run(
        "[ React.js + Tailwind CSS + Ant Design + Leaflet.js Frontend ]\n"
        "                           │  (HTTP / REST APIs)\n"
        "                           ▼\n"
        "[ Node.js + Express.js API Backend Gateway (/v1/ Endpoints) ]\n"
        "         ┌─────────────────┼─────────────────┐\n"
        "         ▼                 ▼                 ▼\n"
        "[ Auth & Booking Router ]  [ Service & Map Router ]  [ ReadyState Memory Failover Store ]\n"
        "         │                 │                 │\n"
        "         └─────────────────┼─────────────────┘\n"
        "                           ▼\n"
        "[ MongoDB Atlas NoSQL Database (Users, Bookings, Services, Categories) ]\n"
        "                           │\n"
        "            [ Razorpay Payment Gateway (In Progress) ]"
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
        ['Ratings & Reviews Engine', 'ServiceDetail/Reviews.jsx 5-star rate selector, distribution bar charts, write review modal, live hero score calculation', 'Completed'],
        ['Payment & Deposit Checkout', 'Razorpay checkout integration for booking deposit collection', 'In Progress — debugging integration errors']
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
                if 'Completed' in val:
                    cell.paragraphs[0].runs[0].font.bold = True
                    cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(16, 185, 129) # Green
                else:
                    cell.paragraphs[0].runs[0].font.bold = True
                    cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(234, 88, 12) # Orange

    doc.add_paragraph()

    # e) Tools and Technologies Used
    p = doc.add_paragraph()
    r_e = p.add_run("e) Tools and Technologies Used\n")
    r_e.bold = True
    
    p_tech = doc.add_paragraph(
        "Programming Language: JavaScript (ES6+), HTML5, CSS3\n\n"
        "Framework: Express.js (backend), React.js (frontend)\n\n"
        "Database: MongoDB Atlas, Mongoose ORM, RAM Memory Failover Store\n\n"
        "Hardware/Software Tools: VS Code, Git, Postman, npm, ReadyState Connection Monitor\n\n"
        "Other Technologies: JWT authentication, bcrypt, Tailwind CSS, Ant Design, Leaflet.js, CartoDB Voyager, Recharts Analytics, Razorpay (integration in progress)"
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
        "Algorithm / Method followed: State machine pattern governing booking status transitions (Pending → Confirmed → Completed / Cancelled); Mongoose readyState connection checking to bypass 10s buffer timeouts for sub-60ms failovers; spatial coordinate offsetting for Leaflet map markers around Surat, Gujarat (21.1702, 72.8311).",
        "Coding / Development details: Express backend with Mongoose ORM; React frontend with React Router, Context API, Ant Design 5, Tailwind CSS; Booking CRUD, Reviews engine, OpenStreetMap Leaflet explorer, and My Bookings dashboard modules are complete and integrated.",
        "Database design: Normalised MongoDB document schema covering Users, Services, Categories, Cities, States, Bookings (userId, serviceId, date, timeSlot, status), and Reviews collections.",
        "API integration: Razorpay payment gateway integration is in progress; a few errors are occurring during the checkout/order-creation flow and are currently being debugged (reviewing API responses, order/payment signature verification, and webhook handling).",
        "Testing performed: Manual verification of authentication, Booking CRUD, readyState failovers, and Leaflet map rendering flows, including duplicate booking prevention checks to confirm no double-booking occurs; Payment module testing is in progress alongside the ongoing debugging."
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
        "│                      KHOJ — SERVICE BOOKING ENGINE                       │\n"
        "├──────────────────────────────────────────────────────────────────────────┤\n"
        "│ Service Provider: Superb Spark Electricians                              │\n"
        "│ Date & Slot: Thu, 23 Jul 2026 | Morning (9 AM - 12 PM)                    │\n"
        "│ Visit Address: 12, Link Road, Surat, Gujarat                             │\n"
        "│ Rate: ₹499/hr                      Status: PENDING CONFIRMATION          │\n"
        "│ [ Edit Details ]                   [ Confirm Booking ]                   │\n"
        "└──────────────────────────────────────────────────────────────────────────┘"
    )
    r_box1.font.name = 'Consolas'
    r_box1.font.size = Pt(8.5)

    p_desc1 = doc.add_paragraph()
    p_desc1.add_run("Description: Movie-Ticket style 3-step booking confirmation modal displaying summary ticket details, slot validation, and instant request transmission.").font.size = Pt(9)
    p_desc1.runs[0].font.italic = True

    doc.add_paragraph()

    # Feature Output Box 2
    p_box2 = doc.add_paragraph()
    p_box2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_box2 = p_box2.add_run(
        "┌──────────────────────────────────────────────────────────────────────────┐\n"
        "│                      LEAFLET.JS OPENSTREETMAP EXPLORER                    │\n"
        "├──────────────────────────────────────────────────────────────────────────┤\n"
        "│ Map Location: Surat, Gujarat (21.1702 N, 72.8311 E)                      │\n"
        "│ Layer: CartoDB Voyager Custom Tiles                                      │\n"
        "│ Active Service Pins: 50+ Local Providers Plotted                          │\n"
        "│ [ Open Google Maps Routing Link ]                                        │\n"
        "└──────────────────────────────────────────────────────────────────────────┘"
    )
    r_box2.font.name = 'Consolas'
    r_box2.font.size = Pt(8.5)

    p_desc2 = doc.add_paragraph()
    p_desc2.add_run("Description: OpenStreetMap split explorer rendering localized service provider markers with CartoDB Voyager tiles and Google Maps navigation routing.").font.size = Pt(9)
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
        ['Preventing double-booking under concurrent service requests', 'Implemented backend duplicate query validation checking userId, serviceId, date, and slot returning HTTP 409 Conflict paired with 3-step date-picker wizard'],
        ['Mongoose 10-second buffer timeout during cloud database connection latency', 'Implemented readyState connection checks (if readyState === 1) with instant RAM memory store fallbacks — verified serving requests in <60ms'],
        ['Errors occurring during Razorpay checkout/order-creation while integrating payments', 'Currently debugging by checking API request/response payloads, order and payment signature verification, and webhook handling — fix in progress, to be completed and reported next']
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
        "Remaining modules: Resolve the current Razorpay integration errors and complete Payment deposit collection, then move on to Socket.io WebSockets real-time chat between customer and provider.",
        "Testing plan: Add integration test coverage for booking concurrency state transitions and, once fixed, for the payment flow end-to-end.",
        "Documentation work: Document the readyState failover mechanism, REST API endpoints, and payment flow once stabilised.",
        "Deployment plan: Admin Panel/Dashboard, AWS S3 storage, and cloud deployment on Vercel (frontend) and Render (backend) are scheduled for upcoming weeks per the project roadmap."
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
        "Technical Skills Learned: React state machine workflows, Leaflet.js OpenStreetMap integration, readyState connection failovers, RESTful API design, and Mongoose schema modeling.",
        "Professional Skills Learned: Debugging third-party payment gateway integrations methodically, following a phased project roadmap, and Git feature-branch workflow."
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
        "[1] Express Documentation, https://expressjs.com, Accessed July 2026.",
        "[2] MongoDB & Mongoose Documentation — Connection readyState, https://mongoosejs.com/docs/, Accessed July 2026.",
        "[3] React Documentation, https://react.dev, Accessed July 2026.",
        "[4] Leaflet.js Documentation — OpenStreetMap Tile Layers, https://leafletjs.com, Accessed July 2026.",
        "[5] Ant Design Documentation, https://ant.design, Accessed July 2026.",
        "[6] Razorpay Developer Documentation, https://razorpay.com/docs/, Accessed July 2026."
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

    t_eval = doc.add_table(rows=6, cols=6)
    t_eval.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    eval_headers = ['Criteria', 'Bloom’s Level', 'Excellent (20)', 'Good (15)', 'Average (10)', 'Poor (5)', 'Marks Obtained (Out of 20)']
    # 6 columns in table layout: Criteria, Bloom's Level, Excellent (20), Good (15), Average (10), Poor (5) + Marks column
    
    t_eval_headers = ['Criteria', 'Bloom’s Level', 'Excellent (20)', 'Good (15)', 'Average (10)', 'Poor (5)']
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

    # Total Marks row
    t_eval_6cols.rows[6].cells[0].text = "Total Marks"
    t_eval_6cols.rows[6].cells[0].paragraphs[0].runs[0].font.bold = True

    doc.add_paragraph()

    # Evaluation Signature Table
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

    out1 = "C:/Khoj/Khoj_Project_Report_2.docx"
    out2 = os.path.expanduser("~/Downloads/Khoj_Project_Report_2.docx")
    doc.save(out1)
    try:
        doc.save(out2)
    except:
        pass
    print(f"Successfully generated EXACT FRIEND FORMAT DOCX report at:\n1. {out1}\n2. {out2}")

if __name__ == "__main__":
    create_exact_report()
