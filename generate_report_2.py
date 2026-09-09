import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import os

# ─── 1. GENERATE GANTT CHART IMAGE ───────────────────────────
def generate_gantt_chart():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    
    tasks = [
        ("Requirement Analysis & Architecture Design", 1, 2, "Completed"),
        ("Project Setup & Base Routing (Khoj API)", 2, 3, "Completed"),
        ("Frontend Parchment Theme & Layout System", 3, 5, "Completed"),
        ("Category Catalog & Dynamic Unsplash Resolver", 5, 7, "Completed"),
        ("Constellation Physics Hero Canvas Animation", 7, 8, "Completed"),
        ("Leaflet.js Map Explorer & Surat Coords", 8, 10, "Completed"),
        ("Full-Stack Booking Engine & Dual Dashboard", 10, 12, "Completed"),
        ("Ratings/Reviews Engine & ReadyState Failover", 11, 13, "Completed"),
        ("Razorpay Gateway & Socket.io Realtime Chat", 13, 14, "Planned"),
    ]
    
    y_positions = range(len(tasks))
    colors = {
        "Completed": "#c75b3a", # Terracotta
        "Planned": "#b08d57"    # Antique Gold
    }
    
    for i, (task, start, end, status) in enumerate(tasks):
        ax.barh(i, end - start, left=start, height=0.55, align='center', color=colors[status], edgecolor='#1c1917', linewidth=1)
        ax.text(end + 0.1, i, f"W{start}-W{end}", va='center', ha='left', fontsize=8, fontweight='bold', color='#1c1917')
        
    ax.set_yticks(y_positions)
    ax.set_yticklabels([t[0] for t in tasks], fontsize=9, fontweight='bold')
    ax.invert_yaxis()  # top-down
    
    ax.set_xlabel("Project Schedule (Weeks 1 to 14)", fontsize=10, fontweight='bold', color='#1c1917')
    ax.set_xlim(0, 15)
    ax.set_xticks(range(1, 15))
    ax.set_xticklabels([f"W{w}" for w in range(1, 15)], fontsize=8)
    
    ax.grid(axis='x', linestyle='--', alpha=0.5)
    ax.set_title("Khoj Platform — Gantt Schedule (Milestone 2 Progress)", fontsize=12, fontweight='bold', pad=15, color='#c75b3a')
    
    completed_patch = mpatches.Patch(color='#c75b3a', label='Completed (Milestones 1 & 2)')
    planned_patch = mpatches.Patch(color='#b08d57', label='Future Scope (Milestone 3)')
    ax.legend(handles=[completed_patch, planned_patch], loc='lower right', fontsize=8)
    
    plt.tight_layout()
    gantt_path = "gantt_chart_m2.png"
    plt.savefig(gantt_path, dpi=300)
    plt.close()
    return gantt_path

# ─── 2. GENERATE PERT CHART IMAGE ────────────────────────────
def generate_pert_chart():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    
    nodes = {
        'A': (1, 3, "Req. Analysis\n(2w)"),
        'B': (3, 3, "Arch. Setup\n(1w)"),
        'C': (5, 4, "Explorer & Map\n(2w)"),
        'D': (5, 2, "Hero Physics\n(1w)"),
        'E': (7, 4, "Booking Engine\n(2w)"),
        'F': (7, 2, "Reviews & Failover\n(1w)"),
        'G': (9, 3, "Dashboard Integration\n(1w)"),
        'H': (11, 3, "Final Deployment\n(1w)")
    }
    
    edges = [
        ('A', 'B', True, "Critical"),
        ('B', 'C', True, "Critical"),
        ('B', 'D', False, "Parallel"),
        ('C', 'E', True, "Critical"),
        ('D', 'F', False, "Parallel"),
        ('E', 'G', True, "Critical"),
        ('F', 'G', False, "Parallel"),
        ('G', 'H', True, "Critical")
    ]
    
    for start, end, is_critical, label in edges:
        x1, y1, _ = nodes[start]
        x2, y2, _ = nodes[end]
        color = '#c75b3a' if is_critical else '#b08d57'
        linestyle = '-' if is_critical else '--'
        linewidth = 2.5 if is_critical else 1.5
        
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color=color, lw=linewidth, ls=linestyle, shrinkA=18, shrinkB=18))
        
    for node_id, (x, y, label_text) in nodes.items():
        is_crit_node = node_id in ['A', 'B', 'C', 'E', 'G', 'H']
        bg_color = '#c75b3a' if is_crit_node else '#b08d57'
        
        circle = plt.Circle((x, y), 0.55, color=bg_color, ec='#1c1917', lw=1.5, zorder=3)
        ax.add_patch(circle)
        ax.text(x, y, node_id, color='white', weight='bold', fontsize=12, ha='center', va='center', zorder=4)
        ax.text(x, y - 0.9, label_text, color='#1c1917', weight='bold', fontsize=8, ha='center', va='top')
        
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 5.5)
    ax.axis('off')
    ax.set_title("PERT Chart — Critical Path: A → B → C → E → G → H (11 Weeks)", fontsize=12, fontweight='bold', pad=15, color='#c75b3a')
    
    crit_patch = mpatches.Patch(color='#c75b3a', label='Critical Path (Completed Tasks)')
    par_patch = mpatches.Patch(color='#b08d57', label='Parallel Sub-Tasks')
    ax.legend(handles=[crit_patch, par_patch], loc='lower right', fontsize=8)
    
    plt.tight_layout()
    pert_path = "pert_chart_m2.png"
    plt.savefig(pert_path, dpi=300)
    plt.close()
    return pert_path

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def create_report():
    gantt_img = generate_gantt_chart()
    pert_img = generate_pert_chart()
    
    doc = docx.Document()
    
    # Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Document Header Title
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("INTERNSHIP / UDP / TRAINING REPORT\n")
    run.font.name = 'Arial'
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = RGBColor(199, 91, 58) # Terracotta
    
    run_sub = p.add_run("(Monthly Progress Report 2 — Milestone 2)")
    run_sub.font.name = 'Arial'
    run_sub.font.size = Pt(13)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(176, 141, 87) # Antique Gold
    
    doc.add_paragraph()

    # Section 1: Student Information
    h1 = doc.add_paragraph()
    r = h1.add_run("1. Student Information")
    r.font.name = 'Arial'
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(28, 25, 23)

    t1_data = [
        ['Student Name', 'MITUL VANIYA'],
        ['Enrollment Number', '23SE02IE055'],
        ['Program/Branch', 'B.Tech – Information Technology & Engineering'],
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
        row.cells[0].paragraphs[0].runs[0].font.size = Pt(10)
        row.cells[1].paragraphs[0].runs[0].font.size = Pt(10)
        set_cell_background(row.cells[0], 'F4F1EA')
        set_cell_background(row.cells[1], 'FFFFFF')

    doc.add_paragraph()

    # Section 2: Internship / UDP Details
    h2 = doc.add_paragraph()
    r = h2.add_run("2. Internship / UDP / Training Details")
    r.font.name = 'Arial'
    r.font.size = Pt(12)
    r.font.bold = True

    t2_data = [
        ['Type', 'UDP'],
        ['Company/Organization', 'Self-Initiated Academic Project (PPSU)'],
        ['Department/Domain', 'Full-Stack Web Development (MERN Stack)'],
        ['Mentor Name (Company)', 'Mr.Ravirajsingh Chauhan'],
        ['Mentor Name (Institute)', 'Mr.Ravirajsingh Chauhan'],
        ['Start Date', '15/05/2026'],
        ['End Date', '15/10/2026']
    ]

    t2 = doc.add_table(rows=len(t2_data), cols=2)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, row in enumerate(t2.rows):
        row.cells[0].text = t2_data[i][0]
        row.cells[1].text = t2_data[i][1]
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[0].paragraphs[0].runs[0].font.size = Pt(10)
        row.cells[1].paragraphs[0].runs[0].font.size = Pt(10)
        set_cell_background(row.cells[0], 'F4F1EA')
        set_cell_background(row.cells[1], 'FFFFFF')

    doc.add_paragraph()

    # Section 3: Work Progress Summary
    h3 = doc.add_paragraph()
    r = h3.add_run("3. Work Progress Summary")
    r.font.name = 'Arial'
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    r1 = p.add_run("Project Title: ")
    r1.bold = True
    p.add_run("Khoj – An Intelligent, High-Performance Discovery and Analytics Platform for Home Service Providers")

    p = doc.add_paragraph()
    r1 = p.add_run("Problem Statement: ")
    r1.bold = True
    p.add_run(
        "In developing nations and local urban communities, finding verified, skilled, and reliable service providers (such as electricians, plumbers, painters, cleaners, and tutors) remains fragmented and unreliable. "
        "During Milestone 2 development, we addressed key platform challenges: customers lacked a real-time reservation tracking system, service feedback was unverified, and standard database queries caused 10-second buffer timeouts whenever cloud database instances experienced connection latency. "
        "To solve this, we engineered a full-stack booking lifecycle engine, an interactive rating submission module, zero-latency readyState connection failover boundaries, and an OpenStreetMap geolocation explorer localized to Surat, Gujarat."
    )

    p = doc.add_paragraph()
    r1 = p.add_run("Objectives (Milestone 2 Focus):\n")
    r1.bold = True
    objectives = [
        "Full-Stack Booking Engine: Implement a movie-ticket style 3-step booking flow and a My Bookings dashboard supporting Customer status tracking (Pending → Confirmed → Completed / Cancelled) and Merchant request management (Accept / Decline / Complete).",
        "Zero-Latency ReadyState Boundary: Implement instant mongoose connection state checks and RAM memory failover stores to eliminate 10-second buffer delays and serve API requests in under 60ms.",
        "Interactive Customer Reviews System: Develop a verified 5-star review submission system with rating distribution progress bars and real-time average score updates on profile hero banners.",
        "Interactive OpenStreetMap Geolocation: Embed Leaflet.js with CartoDB Voyager tiles, plotting 50+ service provider markers around Surat, Gujarat (21.1702, 72.8311) default coordinates with Google Maps directions navigation links.",
        "Aesthetic Overhaul & Multi-Step Wizards: Redesign Add Service (2-step merchant wizard), Add Category (drag-and-drop banner uploader), Profile, and Setting user dashboards into a unified terracotta/parchment theme."
    ]
    for obj in objectives:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(obj)

    p = doc.add_paragraph()
    r1 = p.add_run("Proposed Methodology:\n")
    r1.bold = True
    p.add_run(
        "The project implements a modern MERN (MongoDB, Express, React, Node.js) single-page application (SPA) architecture:\n"
        "1. Presentation Layer (Frontend): Built with React.js 18, styled using Tailwind CSS, Ant Design 5 controls, Recharts analytics, and Leaflet.js 1.9 maps.\n"
        "2. Application Layer (Backend API): Node.js & Express.js REST API with modular routers mounted under /v1/ (services, categories, bookings, city, state).\n"
        "3. Data Layer & Connection Boundary: MongoDB Atlas with Mongoose ORM, featuring connection readyState checks and in-memory RAM fallback stores for instant responses.\n"
        "4. Booking Lifecycle Engine: Standardized state machine governing booking transitions (Pending → Confirmed → Completed / Cancelled)."
    )

    p = doc.add_paragraph()
    r1 = p.add_run("Expected Outcomes:\n")
    r1.bold = True
    outcomes = [
        "A fully functional, high-performance transactional service marketplace.",
        "Customers can browse providers, view local Leaflet map pins, place movie-ticket style booking requests, and write verified reviews.",
        "Merchants can accept/decline booking requests, track client appointments, and register new service profiles via multi-step wizards.",
        "Zero-crash fallback performance guaranteeing instant < 60ms API response speed."
    ]
    for out in outcomes:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(out)

    doc.add_paragraph()

    # Section 4: Tasks Accomplished
    h4 = doc.add_paragraph()
    r = h4.add_run("4. Tasks Accomplished (Detailed Practical Implementation Work)")
    r.font.name = 'Arial'
    r.font.size = Pt(12)
    r.font.bold = True

    # 4.1 Completed Modules
    p = doc.add_paragraph()
    r = p.add_run("4.1 Completed Modules\n")
    r.bold = True
    r.font.size = Pt(11)
    
    modules = [
        "Booking Lifecycle Module (schemas/Booking.js, controller/bookingController.js, router/booking.js): Built MongoDB schema storing customer details, provider details, date/time slots, special instructions, and status flags.",
        "Movie-Ticket Booking Flow (ServiceDetail/index.jsx): Created a 3-step modal wizard featuring slot selection, dashed ticket summary card, duplicate booking detection, and unique booking ID generation.",
        "My Bookings Dashboard (pages/MyBookings/index.jsx): Created dual-mode dashboard for Customers (track booking status) and Merchants (Accept, Decline, and Mark Complete actions).",
        "Connection Failover Boundary (controller/service.js, category.js, state.js, bookingController.js): Implemented readyState checks to bypass 10-second Mongoose buffering timeouts, ensuring sub-60ms responses.",
        "Customer Ratings & Reviews Engine (ServiceDetail/Reviews.jsx): Built 5-star rating selector, distribution bar charts, write review modal, live feed, and real-time average score updates on profile hero banners.",
        "OpenStreetMap Geolocation Explorer (pages/AllService/index.jsx): Integrated Leaflet.js with CartoDB Voyager tiles, plotting 50+ provider pins localized around Surat, Gujarat (21.1702, 72.8311) with Google Maps routing.",
        "Canvas Constellation Hero Physics (pages/Home/index.jsx): Built HTML5 canvas particle physics with magnetic cursor attraction and auto-fill search redirects.",
        "Form Portal & Dashboard Overhauls (AddService, AddCategory, Profile, Setting): Redesigned 2-step merchant wizard, drag-and-drop uploader, user profile credentials, and notification switches.",
        "Analytics Visualizer (CategoryChart, ServiceChart): Upgraded Recharts pie/donut charts with KPI summary cards and click-to-filter category/city redirects."
    ]
    for m in modules:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(m)

    # 4.2 Tools & Technologies Used
    p = doc.add_paragraph()
    r = p.add_run("4.2 Tools and Technologies Used\n")
    r.bold = True
    r.font.size = Pt(11)

    t_tech = doc.add_table(rows=6, cols=3)
    t_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    tech_headers = ['Layer / Component', 'Technologies / Libraries', 'Purpose']
    tech_data = [
        ['Frontend Framework', 'React.js 18, React Router v6, Context API', 'Single Page Application structure and global state management'],
        ['UI & Styling', 'Tailwind CSS, Ant Design 5, CSS Modules', 'Glassmorphism aesthetics, responsive layouts, and modal forms'],
        ['Mapping & Charts', 'Leaflet.js 1.9, CartoDB Voyager, Recharts', 'Interactive OpenStreetMap geolocation rendering and density analytics'],
        ['Backend Engine', 'Node.js v20, Express.js 4, Nodemon', 'REST API server routing, middleware logging, and controllers'],
        ['Database & Security', 'MongoDB Atlas, Mongoose 8, Bcrypt.js, JWT', 'NoSQL data persistence, connection readyState failover, and auth']
    ]
    for j, htext in enumerate(tech_headers):
        c = t_tech.rows[0].cells[j]
        c.text = htext
        c.paragraphs[0].runs[0].font.bold = True
        c.paragraphs[0].runs[0].font.size = Pt(9)
        set_cell_background(c, 'C75B3A')
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)

    for i, rowdata in enumerate(tech_data):
        for j, val in enumerate(rowdata):
            c = t_tech.rows[i+1].cells[j]
            c.text = val
            c.paragraphs[0].runs[0].font.size = Pt(8.5)
            if i % 2 == 1:
                set_cell_background(c, 'FAF8F5')

    doc.add_paragraph()

    # 4.3 Technical Challenges Faced & Engineering Solutions
    p = doc.add_paragraph()
    r = p.add_run("4.3 Technical Challenges Faced and Engineering Solutions\n")
    r.bold = True
    r.font.size = Pt(11)

    challenges = [
        ("1. Mongoose 10-Second Buffer Timeout during Cloud DB Latency:",
         " Challenge: When MongoDB Atlas was offline or experiencing connection latency, Mongoose buffered incoming model queries (.find(), .save()) for 10 seconds before timing out, causing frozen UI screens.\n"
         " Solution: Implemented connection readyState checking across backend controllers (if (mongoose.connection.readyState === 1)). If the database is disconnected, requests immediately utilize in-memory RAM fallback stores, maintaining sub-60ms response speeds."),
        
        ("2. Leaflet.js Double-Mounting & 0px Container Height Bug:",
         " Challenge: In React 18, StrictMode remounted DOM nodes. Initializing Leaflet on an existing map container caused 'Map container is already initialized' exceptions or rendered a 0px blank grey canvas when wrapped inside conditional loading spinners.\n"
         " Solution: Modified AllService/index.jsx so the map container ref remains permanently mounted in the DOM. Implemented mapRef.current.remove() cleanup logic and invoked mapRef.current.invalidateSize() inside a 300ms post-mount timer."),
        
        ("3. Preventing Duplicate Bookings & Managing State Machine Lifecycles:",
         " Challenge: Users could accidentally trigger multiple booking requests for the same provider at the identical date and time slot.\n"
         " Solution: Implemented duplicate query validation on the backend (checking userId, serviceId, bookingDate, timeSlot for non-cancelled bookings) returning HTTP 409 Conflict, paired with a 3-step modal wizard enforcing date-picker validation.")
    ]
    for title, desc in challenges:
        p_c = doc.add_paragraph()
        r_c = p_c.add_run(title + "\n")
        r_c.bold = True
        r_c.font.size = Pt(9.5)
        p_c.add_run(desc)

    doc.add_paragraph()

    # 4.4 Results and Output Screenshots Summary
    p = doc.add_paragraph()
    r = p.add_run("4.4 Results and Output Implementation Summary\n")
    r.bold = True
    r.font.size = Pt(11)
    p.add_run(
        "All developed modules have been verified and compiled successfully with zero error exit codes (react-scripts build succeeded). "
        "Key output highlights include:\n"
        "• Movie-Ticket Booking Modal: Displays service provider info, date/time slot, visit address, estimated rate, dashed ticket separator, and booking ID generation upon confirmation.\n"
        "• My Bookings Dashboard: Renders status-filtered tabs (All, Pending, Confirmed, Completed, Cancelled) with color-coded status pills and Merchant action controls.\n"
        "• Leaflet OpenStreetMap Explorer: Displays localized pins around Surat, Gujarat (21.1702, 72.8311) with Google Maps directions navigation links.\n"
        "• Verified Reviews Component: Renders average star score, distribution bar charts, write review modal, and live feed updates."
    )

    doc.add_paragraph()

    # Section 5: Tasks in Progress / Next Plan
    h5 = doc.add_paragraph()
    r = h5.add_run("5. Tasks in Progress / Next Plan (Milestone 3)")
    r.font.name = 'Arial'
    r.font.size = Pt(12)
    r.font.bold = True
    next_tasks = [
        "Razorpay Sandbox Payment Gateway: Integrate payment deposit collection upon booking confirmation.",
        "Real-Time WebSockets Chat: Implement Socket.io instant messaging between customers and assigned service providers.",
        "Cloud Storage Integration: Connect AWS S3 / Cloudinary for persistent media document uploads."
    ]
    for n in next_tasks:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(n)

    doc.add_paragraph()

    # Section 6: Learnings / Skills Acquired
    h6 = doc.add_paragraph()
    r = h6.add_run("6. Learnings / Skills Acquired")
    r.font.name = 'Arial'
    r.font.size = Pt(12)
    r.font.bold = True
    learnings = [
        "Designing transactional state engines and multi-step modal workflows in React.",
        "Implementing Mongoose readyState connection monitoring and memory store fallbacks for zero-downtime web applications.",
        "Open-source mapping integration using Leaflet.js and geographic coordinate offsetting algorithms.",
        "Building dual-role (Customer vs Merchant) dashboard interfaces with real-time status updates."
    ]
    for l in learnings:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(l)

    doc.add_paragraph()

    # Section 7: Gantt Chart
    h7 = doc.add_paragraph()
    r = h7.add_run("7. Gantt Chart — Project Schedule (Milestone 2 Progress)")
    r.font.name = 'Arial'
    r.font.size = Pt(12)
    r.font.bold = True
    p = doc.add_paragraph("The following Gantt chart illustrates the updated project schedule across 14 weeks. Terracotta bars represent completed Milestone 1 and Milestone 2 tasks, while gold bars represent planned Milestone 3 work.")
    
    doc.add_paragraph().add_run().add_picture(gantt_img, width=Inches(6.2))
    doc.add_paragraph()

    # Section 8: PERT Chart
    h8 = doc.add_paragraph()
    r = h8.add_run("8. PERT Chart — Critical Path Analysis")
    r.font.name = 'Arial'
    r.font.size = Pt(12)
    r.font.bold = True
    p = doc.add_paragraph("The PERT chart below maps all project activities. Terracotta nodes and solid arrows indicate the Critical Path: A → B → C → E → G → H, with a total minimum duration of 11 weeks.")
    
    doc.add_paragraph().add_run().add_picture(pert_img, width=Inches(6.2))
    doc.add_paragraph()

    # Section 9: References (MANDATORY SECTION)
    h9 = doc.add_paragraph()
    r = h9.add_run("9. References (Mandatory Technical Resources)")
    r.font.name = 'Arial'
    r.font.size = Pt(12)
    r.font.bold = True
    
    references = [
        "[1] React Documentation, 'React v18 Single Page Application Concepts & Hooks Reference', Meta Open Source, 2024. [Online]. Available: https://react.dev",
        "[2] Node.js Foundation, 'Node.js v20.x Runtime Environment & Express Middleware Architecture Specification', 2024. [Online]. Available: https://nodejs.org",
        "[3] Leaflet.js Documentation, 'Interactive Open-Source JavaScript Maps Library & Tile Layer Integration Specs', 2024. [Online]. Available: https://leafletjs.com",
        "[4] MongoDB Inc., 'Mongoose v8 ODM Documentation: Schemas, Models, and Connection readyState Handling', 2024. [Online]. Available: https://mongoosejs.com/docs/",
        "[5] Ant Design, 'Enterprise-Class React UI Components & Form Validation Patterns v5', Ant Financial, 2024. [Online]. Available: https://ant.design",
        "[6] Recharts Specification, 'Redefined Chart Library Built with React and D3 SVG Engine', 2024. [Online]. Available: https://recharts.org",
        "[7] W3C Web Application Working Group, 'HTML5 Geolocation API & Coordinate Positioning Specification', W3C Recommendation, 2023. [Online]. Available: https://www.w3.org/TR/geolocation-API/"
    ]
    for ref in references:
        bp = doc.add_paragraph(style='List Bullet')
        bp.add_run(ref)

    doc.add_paragraph()

    # Evaluation Rubric Table (Table 3)
    p = doc.add_paragraph()
    r = p.add_run("Evaluation (To be filled by Mentor (Institute))")
    r.bold = True
    r.font.size = Pt(11)

    t3_headers = ['Criteria', 'Bloom’s Level', 'Excellent (20)', 'Good (15)', 'Average (10)', 'Poor (5)', 'Marks Obtained']
    t3_rows = [
        ['Problem Definition', 'L4–Analyze', 'Clearly defined, justified real-world problem', 'Defined but lacks depth', 'Vague problem', 'No clear problem', ''],
        ['Project Title Relevance', 'L2–Understand', 'Highly precise and aligned', 'Mostly relevant', 'Partially relevant', 'Misleading', ''],
        ['Scope of Work', 'L5–Evaluate', 'Well-defined scope, deliverables, constraints', 'Defined with minor gaps', 'Broad/unclear', 'No scope', ''],
        ['Literature Study', 'L4–Analyze', '3–5 sources analyzed critically', 'Sources listed', 'Minimal references', 'No study', ''],
        ['Clarity & Presentation', 'L3–Apply', 'Structured, professional', 'Minor issues', 'Some confusion', 'Poor', ''],
        ['Total Marks', 'Total Marks', 'Total Marks', 'Total Marks', 'Total Marks', 'Total Marks', '']
    ]

    t3 = doc.add_table(rows=len(t3_rows)+1, cols=7)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    for j, h_text in enumerate(t3_headers):
        cell = t3.rows[0].cells[j]
        cell.text = h_text
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.size = Pt(9)
        set_cell_background(cell, 'C75B3A')
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)

    for i, row_data in enumerate(t3_rows):
        for j, val in enumerate(row_data):
            cell = t3.rows[i+1].cells[j]
            cell.text = val
            if len(cell.paragraphs[0].runs) > 0:
                cell.paragraphs[0].runs[0].font.size = Pt(8.5)
            if i % 2 == 1:
                set_cell_background(cell, 'FAF8F5')

    doc.add_paragraph()

    # Signatures Table (Table 4)
    t4 = doc.add_table(rows=2, cols=3)
    t4.alignment = WD_TABLE_ALIGNMENT.CENTER
    t4.rows[0].cells[0].text = "Student Signature"
    t4.rows[0].cells[1].text = "Mentor (Company) Signature"
    t4.rows[0].cells[2].text = "Mentor (Institute) Signature"
    
    for cell in t4.rows[0].cells:
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.size = Pt(10)
        set_cell_background(cell, 'F4F1EA')
        
    t4.rows[1].cells[0].text = "\n\n________________________\nMITUL VANIYA"
    t4.rows[1].cells[1].text = "\n\n________________________\nMr. Ravirajsingh Chauhan"
    t4.rows[1].cells[2].text = "\n\n________________________\nMr. Ravirajsingh Chauhan"

    for cell in t4.rows[1].cells:
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.size = Pt(9)

    doc.add_paragraph()
    p_rem = doc.add_paragraph()
    r_rem = p_rem.add_run("Mentor (Institute) Remarks:\n________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________")
    r_rem.font.size = Pt(9)

    out1 = "C:/Khoj/Khoj_Project_Report_2.docx"
    out2 = os.path.expanduser("~/Downloads/Khoj_Project_Report_2.docx")
    doc.save(out1)
    try:
        doc.save(out2)
    except:
        pass
    print(f"Successfully updated DOCX report conforming to all PPSU Guidelines at:\n1. {out1}\n2. {out2}")

if __name__ == "__main__":
    create_report()
