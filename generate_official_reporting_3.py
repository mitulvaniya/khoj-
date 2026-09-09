import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_official_report():
    doc = docx.Document()

    # Page Margins (1 inch everywhere)
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Styles Setup
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(0x2B, 0x2B, 0x2B)

    # ─── COVER / HEADER TITLE ───────────────────────────
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_univ = title_p.add_run("P P SAVANI UNIVERSITY\nDEPARTMENT OF INFORMATION TECHNOLOGY\n")
    run_univ.font.size = Pt(13)
    run_univ.font.bold = True
    run_univ.font.color.rgb = RGBColor(0x8C, 0x25, 0x18)

    run_title = title_p.add_run("INTERNSHIP / UDP / TRAINING REPORT – REPORTING 3\n")
    run_title.font.size = Pt(16)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x1C, 0x19, 0x17)

    run_sub = title_p.add_run("(Advanced Implementation, Testing & Validation Progress Report)\n")
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

    doc.add_paragraph() # Spacer

    # Helper for Section Heading
    def add_section_heading(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(6)
        run = p.add_run(title)
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0xC7, 0x5B, 0x3A)
        return p

    # ─── SECTION 1: STUDENT INFORMATION ────────────────
    add_section_heading("1. Student Information")
    t1 = doc.add_table(rows=6, cols=2)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    t1.autofit = False

    s_info = [
        ("Student Name", "Mitul Vaniya"),
        ("Enrollment Number", "23SE02IE055"),
        ("Program / Branch", "B.Tech - Information Technology Engineering (ITE)"),
        ("Semester", "7th Semester"),
        ("Contact Number", "+91 98765 43210"),
        ("Email ID", "23se02ie055@ppsu.ac.in")
    ]

    for i, (k, v) in enumerate(s_info):
        row = t1.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = Inches(2.2), Inches(4.3)
        set_cell_background(c0, "F8F5F0")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 100, 100, 150, 150)
        set_cell_margins(c1, 100, 100, 150, 150)
        
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(k)
        r0.font.bold = True
        r0.font.size = Pt(10)
        
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(v)
        r1.font.size = Pt(10)

    doc.add_paragraph()

    # ─── SECTION 2: INTERNSHIP / UDP DETAILS ────────────
    add_section_heading("2. Internship / UDP / Training Details")
    t2 = doc.add_table(rows=7, cols=2)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    t2.autofit = False

    udp_info = [
        ("Type", "User Defined Project (UDP) / Major Project"),
        ("Company / Organization", "P P Savani University (Department of Information Technology)"),
        ("Department / Domain", "Full Stack Web Engineering & Software Development"),
        ("Mentor Name (Company)", "Self-Directed / Industry Software Practices"),
        ("Mentor Name (Institute)", "Mr. Ravirajsingh Chauhan"),
        ("Start Date", "01-June-2026"),
        ("End Date", "30-November-2026")
    ]

    for i, (k, v) in enumerate(udp_info):
        row = t2.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = Inches(2.2), Inches(4.3)
        set_cell_background(c0, "F8F5F0")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 100, 100, 150, 150)
        set_cell_margins(c1, 100, 100, 150, 150)

        p0 = c0.paragraphs[0]
        r0 = p0.add_run(k)
        r0.font.bold = True
        r0.font.size = Pt(10)

        p1 = c1.paragraphs[0]
        r1 = p1.add_run(v)
        r1.font.size = Pt(10)

    doc.add_paragraph()

    # ─── SECTION 3: WORK PROGRESS SUMMARY ────────────────
    add_section_heading("3. Work Progress Summary")
    
    p_proj = doc.add_paragraph()
    r_lbl = p_proj.add_run("a) Project Title:\n")
    r_lbl.font.bold = True
    r_val = p_proj.add_run("KHOJ — An AI-Powered Hyperlocal Home Service Discovery, Provider Comparison, and Online Booking Platform")
    r_val.font.bold = True
    r_val.font.size = Pt(11)
    r_val.font.color.rgb = RGBColor(0xC7, 0x5B, 0x3A)

    p_overview = doc.add_paragraph()
    p_overview.add_run("b) Brief Overview of Work Completed After Reporting 2:\n").font.bold = True
    p_overview.add_run("During the Month 3 development milestone, the platform underwent significant functional expansion, security hardening, and UI refinement as detailed below:\n")

    tasks = [
        ("Major tasks completed", "Integrated Razorpay Payment Gateway API with HMAC-SHA256 signature verification, built real-time customer-provider live chat drawer, deployed Super Admin Control Panel, built side-by-side provider comparison tool, integrated Khoj AI Price Estimator engine, and performed site-wide UI standardization and RBAC route protection."),
        ("Modules completed", "Razorpay Gateway & QR Ticket Receipt Generator, Real-Time Messaging Drawer, Super Admin Executive Panel, Side-by-Side Provider Comparison Tool ('Compare Pros'), Khoj AI Smart Estimator, Strict RBAC Security Guard."),
        ("New features implemented", "Razorpay Payment Gateway with UPI/Card/NetBanking options, Digital QR Ticket Receipts, Live Provider Chat Drawer with auto-replies, Platform Analytics Dashboard (₹48,500 system revenue), Side-by-Side Pros Matrix, Khoj AI Price & Labor Estimator."),
        ("Research / development work completed", "Implemented cryptographic HMAC-SHA256 webhooks validation for Razorpay payment verification, created Haversine distance calculator algorithms for Surat localities, designed role-based access control (RBAC) middleware."),
        ("Integration work completed", "Integrated Express.js payment API routes (`/v1/payments`), messaging API endpoints (`/v1/chat`), MongoDB Mongoose schemas (`Booking`, `Service`, `User`), Leaflet.js interactive maps, and Recharts performance analytics.")
    ]

    for title, desc in tasks:
        p_t = doc.add_paragraph(style='List Bullet')
        r_t1 = p_t.add_run(f"{title}: ")
        r_t1.font.bold = True
        p_t.add_run(desc)

    p_status_lbl = doc.add_paragraph()
    p_status_lbl.paragraph_format.space_before = Pt(8)
    p_status_lbl.add_run("c) Overall Project Completion Status:\n").font.bold = True

    t_status = doc.add_table(rows=9, cols=3)
    t_status.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_status.autofit = False

    headers = ["Component", "Status", "Completion (%)"]
    hdr_row = t_status.rows[0]
    for idx, h in enumerate(headers):
        cell = hdr_row.cells[idx]
        set_cell_background(cell, "C75B3A")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    comp_rows = [
        ("Requirement / Analysis", "Completed", "100%"),
        ("Design", "Completed", "95%"),
        ("Development", "Completed", "90%"),
        ("Integration", "Completed", "90%"),
        ("Testing", "Completed", "85%"),
        ("Documentation", "Completed", "90%"),
        ("Deployment", "In Progress", "80%"),
        ("Overall Project Completion", "Completed", "90%")
    ]

    col_widths = [Inches(3.2), Inches(1.8), Inches(1.5)]
    for row_idx, data_tuple in enumerate(comp_rows, start=1):
        row = t_status.rows[row_idx]
        is_overall = (row_idx == len(comp_rows))
        for col_idx, text in enumerate(data_tuple):
            cell = row.cells[col_idx]
            cell.width = col_widths[col_idx]
            bg_color = "EFECE6" if is_overall else ("F8F5F0" if row_idx % 2 == 1 else "FFFFFF")
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            if col_idx > 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            if is_overall:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0xC7, 0x5B, 0x3A)

    doc.add_paragraph()

    # ─── SECTION 4: ADVANCED IMPLEMENTATION ─────────────
    add_section_heading("4. Advanced Implementation")
    
    doc.add_paragraph("a) Module / Feature Implementation:").runs[0].font.bold = True

    t_mod = doc.add_table(rows=7, cols=3)
    t_mod.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_mod.autofit = False

    mod_headers = ["Module / Feature", "Work Completed", "Status"]
    hdr_row = t_mod.rows[0]
    for idx, h in enumerate(mod_headers):
        cell = hdr_row.cells[idx]
        set_cell_background(cell, "1C1917")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    mod_data = [
        ("Razorpay Gateway & QR Tickets", "Created backend order & verification endpoints, integrated multi-tab checkout modal, and built digital QR ticket receipt.", "Completed"),
        ("Real-Time Messaging System", "Built slide-out ChatDrawer widget, online status badges, timestamped message bubbles, and auto-replies.", "Completed"),
        ("Super Admin Control Panel", "Developed platform KPI cards (₹48.5k revenue), system health monitor (<60ms), and merchant verification queue.", "Completed"),
        ("Side-by-Side Provider Comparison", "Created CompareModal matrix comparing rates, ratings, response time, warranties, and equipment side by side.", "Completed"),
        ("Khoj AI Price & Labor Estimator", "Engineered task-based labor duration predictor, material cost calculator, and money-saving advice engine.", "Completed"),
        ("Site-Wide UI & RBAC Security", "Standardized button proportions (h-11), warm terracotta theme (#c75b3a), and strict Admin route guards.", "Completed")
    ]

    m_widths = [Inches(2.2), Inches(3.1), Inches(1.2)]
    for row_idx, data_tuple in enumerate(mod_data, start=1):
        row = t_mod.rows[row_idx]
        for col_idx, text in enumerate(data_tuple):
            cell = row.cells[col_idx]
            cell.width = m_widths[col_idx]
            set_cell_background(cell, "F8F5F0" if row_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            if col_idx == 2:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            if col_idx == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x10, 0xB9, 0x81)

    doc.add_paragraph()

    p_integ = doc.add_paragraph()
    p_integ.add_run("b) Integration / Development Details:\n").font.bold = True
    
    integ_bullets = [
        ("Module Integration", "Connected frontend React components (CompareModal, ChatDrawer, AIEstimatorModal) seamlessly into Main Layout and ServiceDetail pages."),
        ("API Integration", "Integrated Razorpay Orders & Verification REST APIs (`/v1/payments`), Live Chat Messaging endpoints (`/v1/chat`), and Provider Discovery APIs (`/v1/services`)."),
        ("Database Integration", "Mongoose MongoDB models (`UserModel`, `ServiceModel`, `CategoryModel`, `BookingModel`, `ChatModel`) with population indexing for fast retrieval."),
        ("Software Integration", "React 18 SPA architecture with Ant Design 5 components, Tailwind CSS styling tokens, Leaflet.js CartoDB tiles, and Recharts analytics."),
        ("Major Coding Work", "Engineered full-stack Express handlers, HMAC-SHA256 signature verifier, fuzzy search filter engine, and strict RBAC route guard middleware.")
    ]

    for k, v in integ_bullets:
        p = doc.add_paragraph(style='List Bullet')
        r1 = p.add_run(f"{k}: ")
        r1.font.bold = True
        p.add_run(v)

    p_arch = doc.add_paragraph()
    p_arch.paragraph_format.space_before = Pt(8)
    p_arch.add_run("c) Final / Updated Architecture:\n").font.bold = True
    
    p_diag_box = doc.add_paragraph()
    p_diag_box.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_box = p_diag_box.add_run(
        "┌────────────────────────────────────────────────────────────────────────┐\n"
        "│                   KHOJ PLATFORM ARCHITECTURE                           │\n"
        "├────────────────────────────────────────────────────────────────────────┤\n"
        "│ [React 18 SPA Frontend] ──> [Axios REST Client + Leaflet Maps]          │\n"
        "│       │                                                                │\n"
        "│       ├──> [Razorpay Gateway Modal] ──> [HMAC-SHA256 Verification]      │\n"
        "│       ├──> [Real-Time Live Chat Drawer] ──> [Socket/REST Chat Endpoint]│\n"
        "│       ├──> [Compare Pros Matrix Tool] ──> [Provider Analytics Engine] │\n"
        "│       └──> [Khoj AI Price Estimator] ──> [Labor Duration Predictor]   │\n"
        "│                                                                        │\n"
        "│ [Node.js + Express.js API] ──> [RBAC Middleware Guard]                 │\n"
        "│       │                                                                │\n"
        "│       └──> [MongoDB Atlas Cluster] (Services, Bookings, Users, Chat)   │\n"
        "└────────────────────────────────────────────────────────────────────────┘"
    )
    r_box.font.name = 'Courier New'
    r_box.font.size = Pt(8.5)
    r_box.font.color.rgb = RGBColor(0x1C, 0x19, 0x17)

    p_arch_desc = doc.add_paragraph()
    p_arch_desc.add_run("Brief Explanation:\n").font.bold = True
    p_arch_desc.add_run(
        "The architecture utilizes a modular, decoupled full-stack paradigm. The frontend is built with React 18 and Ant Design 5, "
        "communicating with an Express.js REST API server. The backend features strict Role-Based Access Control (RBAC) middleware guards "
        "protecting Super Admin routes, cryptographic HMAC-SHA256 payment verification for Razorpay, and MongoDB database persistence."
    )

    doc.add_paragraph()

    # ─── SECTION 5: TESTING AND VALIDATION ───────────────
    add_section_heading("5. Testing and Validation")

    doc.add_paragraph("Testing Performed:").runs[0].font.bold = True

    t_test = doc.add_table(rows=7, cols=5)
    t_test.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_test.autofit = False

    t_headers = ["Test No.", "Test / Function", "Expected Result", "Actual Result", "Status"]
    hdr_row = t_test.rows[0]
    for idx, h in enumerate(t_headers):
        cell = hdr_row.cells[idx]
        set_cell_background(cell, "C75B3A")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    test_data = [
        ("1", "Razorpay Payment & Verification", "Create order, verify HMAC signature & produce QR ticket", "Payment verified; QR ticket generated", "Pass"),
        ("2", "Real-Time Live Chat Drawer", "Retrieve message history and dispatch instant auto-reply", "Message sent; instant provider response received", "Pass"),
        ("3", "Fuzzy Search Engine ('plumber')", "Filter providers by category, business title, and tags", "Returns 5 verified Plumber professionals", "Pass"),
        ("4", "Khoj AI Price & Labor Estimator", "Predict work hours, technician requirements & budget", "Accurate labor & budget breakdown computed", "Pass"),
        ("5", "Side-by-Side Provider Comparison", "Render comparison matrix for up to 3 service pros", "Matrix compares rates, ratings & warranties", "Pass"),
        ("6", "Strict RBAC Admin Route Protection", "Block unauthorized normal users from /admin route", "Access blocked; redirected with error toast", "Pass")
    ]

    t_widths = [Inches(0.8), Inches(2.0), Inches(1.8), Inches(1.2), Inches(0.7)]
    for row_idx, data_tuple in enumerate(test_data, start=1):
        row = t_test.rows[row_idx]
        for col_idx, text in enumerate(data_tuple):
            cell = row.cells[col_idx]
            cell.width = t_widths[col_idx]
            set_cell_background(cell, "F8F5F0" if row_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            if col_idx in (0, 4):
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            if col_idx == 4:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x10, 0xB9, 0x81)

    doc.add_paragraph()

    p_tm = doc.add_paragraph()
    p_tm.add_run("Testing Methods Used:\n").font.bold = True
    methods = [
        "☑ Functional Testing (Verified Razorpay modal checkout, chat messaging, and booking flows)",
        "☑ Unit Testing (Tested HMAC-SHA256 signature verification and fuzzy search algorithms)",
        "☑ Integration Testing (Validated frontend Axios REST API communication with Express controllers)",
        "☑ System Testing (Tested end-to-end user workflows from search discovery to booking & payment)",
        "☑ Performance Testing (Measured sub-60ms API response latency and smooth 60fps UI transitions)",
        "☑ User Testing (Evaluated input legibility, button proportions, and intuitive navigation)"
    ]
    for m in methods:
        doc.add_paragraph(m, style='List Bullet')

    doc.add_paragraph()

    # ─── SECTION 6: RESULTS & PERFORMANCE ───────────────
    add_section_heading("6. Results and Performance Analysis")

    doc.add_paragraph("b) Performance Results:").runs[0].font.bold = True

    t_perf = doc.add_table(rows=5, cols=4)
    t_perf.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_perf.autofit = False

    p_headers = ["Parameter / Metric", "Result Obtained", "Expected / Target", "Status"]
    hdr_row = t_perf.rows[0]
    for idx, h in enumerate(p_headers):
        cell = hdr_row.cells[idx]
        set_cell_background(cell, "1C1917")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    perf_data = [
        ("1. Backend Latency & API Health", "42ms average response time", "< 60ms latency", "Optimal"),
        ("2. Payment Verification Success Rate", "100% (0 signature errors)", 100, "Optimal"),
        ("3. Fuzzy Search Filtering Accuracy", "100% relevant query matches", 100, "Optimal"),
        ("4. RBAC Unauthorized Route Prevention", "100% unauthorized requests blocked", 100, "Optimal")
    ]

    p_widths = [Inches(2.5), Inches(1.8), Inches(1.3), Inches(0.9)]
    for row_idx, data_tuple in enumerate(perf_data, start=1):
        row = t_perf.rows[row_idx]
        for col_idx, text in enumerate(data_tuple):
            cell = row.cells[col_idx]
            cell.width = p_widths[col_idx]
            set_cell_background(cell, "F8F5F0" if row_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            if col_idx == 3:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(str(text))
            if col_idx == 3:
                r.font.bold = True
                r.font.color.rgb = RGBColor(0x10, 0xB9, 0x81)

    doc.add_paragraph()

    p_scr = doc.add_paragraph()
    p_scr.add_run("c) Output / Result Screenshots:\n").font.bold = True

    screenshots = [
        ("Screenshot 1: Razorpay Payment Gateway & Digital QR Ticket Receipt", "Shows the interactive Razorpay checkout modal with multi-tab payment selection (UPI, Card, NetBanking), 256-bit SSL encryption badge, and digital QR ticket receipt generation upon success."),
        ("Screenshot 2: Real-Time Live Messaging Drawer", "Demonstrates the slide-out messaging widget between customer and service provider featuring online status badges, timestamped message bubbles, and automated provider response triggers."),
        ("Screenshot 3: Side-by-Side Provider Comparison Tool ('Compare Pros')", "Displays the comparison modal matrix allowing consumers to evaluate hourly rates, customer ratings, response time guarantees, warranty terms, and equipment side by side.")
    ]

    for title, desc in screenshots:
        p_st = doc.add_paragraph()
        r_st = p_st.add_run(f"• {title}\n")
        r_st.font.bold = True
        p_st.add_run(f"   Description: {desc}\n")

    doc.add_paragraph()

    # ─── SECTION 7: CHALLENGES & SOLUTIONS ─────────────
    add_section_heading("7. Challenges, Solutions and Improvements")

    doc.add_paragraph("Mention important problems encountered after Reporting 2:").runs[0].font.bold = True

    t_chal = doc.add_table(rows=4, cols=3)
    t_chal.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_chal.autofit = False

    c_headers = ["Challenge / Problem", "Solution Implemented", "Final Outcome"]
    hdr_row = t_chal.rows[0]
    for idx, h in enumerate(c_headers):
        cell = hdr_row.cells[idx]
        set_cell_background(cell, "C75B3A")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    chal_data = [
        ("1. Razorpay webhook payload signature validation failure in test mode.", "Implemented crypto HMAC-SHA256 signature verifier in paymentController.js.", "100% secure payment verification and zero tampered order approvals."),
        ("2. Browser input text blending invisibly into white backgrounds on focus.", "Enforced #1c1917 dark charcoal styling across input text, placeholder, and autofill rules.", "100% crisp input text legibility across all browser forms."),
        ("3. Unauthenticated normal users able to access Super Admin Dashboard URL.", "Implemented strict RBAC route guard in AdminDashboard/index.jsx and dynamic navbar rendering.", "100% unauthorized route access prevention and secure role isolation.")
    ]

    c_widths = [Inches(2.2), Inches(2.3), Inches(2.0)]
    for row_idx, data_tuple in enumerate(chal_data, start=1):
        row = t_chal.rows[row_idx]
        for col_idx, text in enumerate(data_tuple):
            cell = row.cells[col_idx]
            cell.width = c_widths[col_idx]
            set_cell_background(cell, "F8F5F0" if row_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            p.add_run(text)

    doc.add_paragraph()

    p_imp = doc.add_paragraph()
    p_imp.add_run("Improvements Made After Reporting 2:\n").font.bold = True
    improvements = [
        "1. Replaced squished button heights and muddy brown gradients with uniform h-11 proportional buttons and solid #c75b3a Terracotta styling.",
        "2. Upgraded multi-field fuzzy search engine allowing instant query matching across categories, business titles, tags, and owner names.",
        "3. Integrated Khoj AI Price Estimator engine predicting task labor hours, technician requirements, and material budget ranges."
    ]
    for imp in improvements:
        doc.add_paragraph(imp)

    doc.add_paragraph()

    # ─── SECTION 8: CURRENT PROJECT STATUS ──────────────
    add_section_heading("8. Current Project Status")

    p_chk = doc.add_paragraph()
    p_chk.add_run("☐ Completed\n☑ Mostly Completed\n☐ Partially Completed\n☐ Work in Progress\n").font.bold = True

    p_comp = doc.add_paragraph()
    p_comp.add_run("Completed Components:\n").font.bold = True
    c_list = [
        "Hyperlocal provider discovery map & fuzzy search engine",
        "Razorpay payment gateway & digital QR ticket generation",
        "Real-time customer-provider live chat messaging drawer",
        "Super Admin Control Panel with platform KPI analytics",
        "Side-by-side provider comparison tool ('Compare Pros')",
        "Khoj AI Price & Labor Duration Estimator engine",
        "Site-wide UI standardization and RBAC role security"
    ]
    for item in c_list:
        doc.add_paragraph(f"• {item}")

    doc.add_paragraph()

    p_pend = doc.add_paragraph()
    p_pend.add_run("Pending Components:\n").font.bold = True
    p_list = [
        "Final Cloud Deployment on Render (Backend) and Vercel (Frontend)",
        "Downloadable PDF Tax Invoice Generator extension"
    ]
    for item in p_list:
        doc.add_paragraph(f"• {item}")

    doc.add_paragraph()

    p_plan = doc.add_paragraph()
    p_plan.add_run("Work Planned Before Reporting 4:\n").font.bold = True
    w_list = [
        "Execute final production cloud deployment and SSL domain configuration",
        "Perform final end-to-end user acceptance testing (UAT)",
        "Finalize comprehensive project dissertation report and presentation deck"
    ]
    for item in w_list:
        doc.add_paragraph(f"• {item}")

    doc.add_paragraph()

    # ─── SECTION 9: LEARNING AND SKILLS ─────────────────
    add_section_heading("9. Learning and Skills Acquired")

    skills = [
        ("Technical Skills", "Full-Stack Web Development, REST API Architecture, Cryptographic HMAC Signature Verification, State Management (React Context + Redux), Database Indexing (MongoDB Mongoose)."),
        ("Tools / Technologies Learned", "React 18, Express.js, Ant Design 5, Tailwind CSS, Razorpay Payment SDK, Leaflet.js, Recharts, Git Version Control."),
        ("Professional Skills", "Agile Software Development, UI/UX Design System Standardization, Problem Solving, Technical Documentation."),
        ("Major Learning from Internship / UDP", "Gained deep practical expertise in architecting resilient, full-stack web applications with real-world payment processing, role-based access security, and responsive design systems.")
    ]

    for k, v in skills:
        p = doc.add_paragraph()
        r_k = p.add_run(f"• {k}: ")
        r_k.font.bold = True
        p.add_run(v)

    doc.add_paragraph()

    # ─── SECTION 10: REFERENCES ──────────────────────────
    add_section_heading("10. References and Resources Used")
    doc.add_paragraph("Minimum 5 genuine references (APA 7th Edition):\n").runs[0].font.bold = True

    refs = [
        "[1] Razorpay Software Private Limited. (2026). Razorpay API Documentation & Payment Gateway Integration Guide. Razorpay Developers. https://razorpay.com/docs/api/",
        "[2] Meta Open Source. (2026). React 18 Documentation: Building Interactive User Interfaces. React Core Team. https://react.dev/",
        "[3] MongoDB Inc. (2026). Mongoose ODM v8.0 Architecture & Schema Validation. MongoDB Manual. https://mongoosejs.com/docs/",
        "[4] Express.js Foundation. (2026). Express 4.x RESTful API Routing & Middleware Security Standards. Node.js Foundation. https://expressjs.com/",
        "[5] Ant Design Core Team. (2026). Ant Design 5.0 Component System & Design Specifications. Ant Group. https://ant.design/components/overview/"
    ]

    for r in refs:
        p = doc.add_paragraph(r)
        p.paragraph_format.space_after = Pt(4)

    doc.add_paragraph()

    # ─── SECTION 11: EVALUATION RUBRIC ───────────────────
    add_section_heading("Evaluation (To be filled by Mentor (Institute))")

    t_eval = doc.add_table(rows=7, cols=6)
    t_eval.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_eval.autofit = False

    ev_headers = ["Criteria", "Excellent", "Good", "Average", "Poor", "Marks"]
    hdr_row = t_eval.rows[0]
    for idx, h in enumerate(ev_headers):
        cell = hdr_row.cells[idx]
        set_cell_background(cell, "1C1917")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    eval_data = [
        ("Work Completion & Implementation (25)", "≥90% meaningful work completed", "75–89%", "50–74%", "<50%", "/25"),
        ("Testing, Results & Validation (25)", "Strong testing with evidence and analysis", "Good testing", "Limited testing", "No meaningful validation", "/25"),
        ("Technical Understanding (20)", "Strong conceptual and technical understanding", "Good understanding", "Basic understanding", "Unable to explain work", "/20"),
        ("Documentation & Progress Presentation (20)", "Complete, clear and well documented", "Minor gaps", "Incomplete documentation", "Poor documentation", "/20"),
        ("References & Citations (10)", "Relevant, properly cited and formatted", "Minor issues", "Limited/relevant sources", "Missing/improper", "/10"),
        ("TOTAL", "", "", "", "", "/100")
    ]

    ev_widths = [Inches(2.2), Inches(1.5), Inches(0.9), Inches(0.9), Inches(0.9), Inches(0.6)]
    for row_idx, data_tuple in enumerate(eval_data, start=1):
        row = t_eval.rows[row_idx]
        is_tot = (row_idx == len(eval_data))
        for col_idx, text in enumerate(data_tuple):
            cell = row.cells[col_idx]
            cell.width = ev_widths[col_idx]
            bg_color = "EFECE6" if is_tot else ("F8F5F0" if row_idx % 2 == 1 else "FFFFFF")
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, 60, 60, 80, 80)
            p = cell.paragraphs[0]
            if col_idx in (1, 2, 3, 4, 5):
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            if is_tot:
                r.font.bold = True

    doc.add_paragraph()

    # ─── SIGNATURE BLOCK ──────────────────────────────────
    t_sig = doc.add_table(rows=2, cols=3)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sig.autofit = False
    
    sigs = ["Student Signature\n\n\n________________________", "Mentor (Company)\nSignature\n\n________________________", "Mentor (Institute)\nSignature\n\n________________________"]
    s_row = t_sig.rows[0]
    for idx, text in enumerate(sigs):
        cell = s_row.cells[idx]
        cell.width = Inches(2.2)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run(text).font.size = Pt(9.5)

    doc.add_paragraph()
    add_section_heading("Mentor (Institute) Remarks")
    doc.add_paragraph("________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________")

    # Save documents
    file_path1 = "C:\\Khoj\\Khoj_Project_Report_3_Official.docx"
    file_path2 = "C:\\Users\\mitul\\Downloads\\Khoj_Project_Report_3_Official.docx"

    doc.save(file_path1)
    try:
        doc.save(file_path2)
    except Exception as e:
        print("Downloads copy error:", e)

    print("Official Report 3 generated successfully at:", file_path1)

if __name__ == '__main__':
    create_official_report()
