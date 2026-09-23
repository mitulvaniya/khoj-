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

def style_heading(p, text, size=Pt(12), color=RGBColor(0x1A, 0x36, 0x5D)):
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.bold = True
    run.font.size = size
    run.font.color.rgb = color

def create_report_4():
    doc = docx.Document()

    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = RGBColor(0x2B, 0x2B, 0x2B)

    # HEADER / TITLE
    header_p = doc.add_paragraph()
    header_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r1 = header_p.add_run("P P SAVANI UNIVERSITY\nSCHOOL OF ENGINEERING | DEPARTMENT OF INFORMATION TECHNOLOGY\n")
    r1.font.bold = True
    r1.font.size = Pt(12)
    r1.font.color.rgb = RGBColor(0x8C, 0x25, 0x18)

    r2 = header_p.add_run("INTERNSHIP / UDP / TRAINING REPORT – REPORTING 4\n")
    r2.font.bold = True
    r2.font.size = Pt(15)
    r2.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)

    r3 = header_p.add_run("(Final Project Completion, Demonstration & Evaluation Report)\n")
    r3.font.italic = True
    r3.font.size = Pt(11)
    r3.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

    # 1. STUDENT INFORMATION
    style_heading(doc.add_paragraph(), "1. Student Information")
    t1 = doc.add_table(rows=6, cols=2)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    s_info = [
        ("Student Name", "Mitul Vaniya"),
        ("Enrollment Number", "23SE02IE055"),
        ("Program/Branch", "B.Tech - Information Technology Engineering (ITE)"),
        ("Semester", "7th Semester"),
        ("Contact Number", "+91 98765 43210"),
        ("Email ID", "23se02ie055@ppsu.ac.in")
    ]
    for i, (k, v) in enumerate(s_info):
        c0 = t1.cell(i, 0)
        c1 = t1.cell(i, 1)
        c0.width = Inches(2.2)
        c1.width = Inches(4.5)
        set_cell_background(c0, "F0F4F8")
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)
        r_k = c0.paragraphs[0].add_run(k)
        r_k.font.bold = True
        c1.paragraphs[0].add_run(v)

    # 2. INTERNSHIP / UDP / TRAINING DETAILS
    style_heading(doc.add_paragraph(), "2. Internship / UDP / Training Details")
    t2 = doc.add_table(rows=7, cols=2)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    tr_info = [
        ("Type", "User Defined Project (UDP) / Major Project"),
        ("Company/Organization", "P P Savani University (Department of Information Technology)"),
        ("Department/Domain", "Full Stack Web Engineering & Cloud Distributed Systems"),
        ("Mentor Name (Company)", "Self-Directed / Industry Software Practices"),
        ("Mentor Name (Institute)", "Mr. Ravirajsingh Chauhan"),
        ("Start Date", "01-June-2026"),
        ("End Date", "30-November-2026 (Final Milestone Completed: September 2026)")
    ]
    for i, (k, v) in enumerate(tr_info):
        c0 = t2.cell(i, 0)
        c1 = t2.cell(i, 1)
        c0.width = Inches(2.2)
        c1.width = Inches(4.5)
        set_cell_background(c0, "F0F4F8")
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)
        r_k = c0.paragraphs[0].add_run(k)
        r_k.font.bold = True
        c1.paragraphs[0].add_run(v)

    # 3. WORK PROGRESS SUMMARY
    style_heading(doc.add_paragraph(), "3. Work Progress Summary")
    
    p_title = doc.add_paragraph()
    r = p_title.add_run("a) Project Title:\n")
    r.font.bold = True
    p_title.add_run("KHOJ — Hyperlocal Home Service Discovery, Provider Comparison, and Online Booking Platform (With Integrated Wallet, AI Diagnostics, and Cloud Distributed Architecture)")

    p_bo = doc.add_paragraph()
    r = p_bo.add_run("b) Brief Overview of Work Completed After Reporting 2:\n")
    r.font.bold = True
    p_bo.add_run(
        "• Major tasks completed: Production cloud deployment of the full-stack system: Decoupled client hosted on Netlify Edge CDN (https://khoj-build.netlify.app/) and Node.js/Express API deployed on Render (https://khoj-api-ukh8.onrender.com/). Configured MongoDB Atlas cloud production cluster with global network access rules (0.0.0.0/0 IP CIDR whitelisting). Implemented end-to-end Booking Engine with dynamic calendar slot reservation, real-time booking status tracker, doorstep completion PIN verification, and digital receipt generator. Built Khoj In-App Digital Wallet system with instant credit/debit ledger and promotional balance.\n\n"
        "• Modules completed: Cloud Production Deployment & Edge Delivery Module; End-to-End Service Booking Lifecycle & Status Engine; Security Doorstep Verification Module (4-digit secret OTP handshake); In-App Digital Wallet & Transaction Ledger Module; AI Home Issue Diagnostics & Cost Estimator; Super Admin Control Panel; Client-Side Geolocation & Haversine Proximity Filtering.\n\n"
        "• New features implemented: Live Production Cloud URLs (Netlify & Render); Netlify Reverse Proxying (/v1/* -> Render API) eliminating CORS errors; Micro-Status Tracker; Doorstep Safety PIN; Automated PDF/Digital Invoices; Cleaned & Unified Responsive Navbar with brand identity.\n\n"
        "• Research / development work completed: Researched Jamstack decoupled client vs. monolith server architecture; analyzed SPA edge routing failure modes (resolved via _redirects rewrite rules); engineered dual-storage fallback engine preventing crashes during MongoDB cloud latency.\n\n"
        "• Integration work completed: Integrated Netlify Edge CDN with Render Express backend via edge proxying; connected Render Node.js backend with MongoDB Atlas cluster via Mongoose ORM; integrated Leaflet.js maps with HTML5 Geolocation API."
    )

    style_heading(doc.add_paragraph(), "c) Overall Project Completion Status")
    t3 = doc.add_table(rows=8, cols=3)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_status = [
        ("Component", "Status", "Completion (%)"),
        ("Requirement / Analysis", "Completed", "100%"),
        ("Design", "Completed", "100%"),
        ("Development", "Completed", "100%"),
        ("Integration", "Completed", "100%"),
        ("Testing", "Completed", "100%"),
        ("Documentation", "Completed", "100%"),
        ("Deployment", "Completed", "100%")
    ]
    for i, row in enumerate(c_status):
        for j, val in enumerate(row):
            cell = t3.cell(i, j)
            if i == 0:
                set_cell_background(cell, "1A365D")
                r = cell.paragraphs[0].add_run(val)
                r.font.bold = True
                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            else:
                set_cell_background(cell, "F9FBFD" if i % 2 == 1 else "FFFFFF")
                cell.paragraphs[0].add_run(val)
            set_cell_margins(cell, 60, 60, 80, 80)

    p_tot = doc.add_paragraph()
    p_tot.paragraph_format.space_before = Pt(6)
    r = p_tot.add_run("Overall Project Completion: 100%")
    r.font.bold = True
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(0x1A, 0x7F, 0x37)

    # 4. ADVANCED IMPLEMENTATION
    style_heading(doc.add_paragraph(), "4. Advanced Implementation")
    p_adv = doc.add_paragraph()
    p_adv.add_run("Describe the major implementation work completed after Reporting 3:")

    style_heading(doc.add_paragraph(), "a) Module / Feature Implementation", size=Pt(11))
    t4 = doc.add_table(rows=8, cols=3)
    t4.alignment = WD_TABLE_ALIGNMENT.CENTER
    feats = [
        ("Module / Feature", "Work Completed", "Status"),
        ("Production Cloud Deployment", "De-coupled React frontend deployed to Netlify global CDN; Node.js API to Render Cloud", "Completed"),
        ("MongoDB Atlas Cloud Database", "Provisioned Cluster0 on MongoDB Atlas, configured SCRAM user khojuser, open CIDR access", "Completed"),
        ("SPA Edge Routing & Reverse Proxy", "Configured _redirects and netlify.toml proxying /v1/* to Render API with zero CORS error", "Completed"),
        ("Navbar Ergonomic Redesign", "Eliminated text overlap; engineered sleek 3-part layout (Logo, Center Search, Profile)", "Completed"),
        ("Doorstep Completion PIN Handshake", "Built 4-digit secret OTP modal requiring mutual verification before job marking done", "Completed"),
        ("In-App Wallet Payment System", "Integrated ₹250 promotional sign-up balance, auto-deduction on booking, instant recharge", "Completed"),
        ("Automated Health Check Engine", "Added graceful JSON status API endpoint on root (/) with Mongoose connection validation", "Completed")
    ]
    for i, row in enumerate(feats):
        for j, val in enumerate(row):
            cell = t4.cell(i, j)
            if i == 0:
                set_cell_background(cell, "1A365D")
                r = cell.paragraphs[0].add_run(val)
                r.font.bold = True
                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            else:
                set_cell_background(cell, "F9FBFD" if i % 2 == 1 else "FFFFFF")
                cell.paragraphs[0].add_run(val)
            set_cell_margins(cell, 60, 60, 80, 80)

    style_heading(doc.add_paragraph(), "b) Integration / Development Details", size=Pt(11))
    p_int = doc.add_paragraph()
    p_int.add_run(
        "• Module integration: React 18 Context API and React Router DOM v6 seamlessly connect all user interfaces (Discovery, Cart Drawer, Wallet, Booking Engine, and Live Chat) with zero full-page reloads.\n"
        "• API integration: Modular Express route controllers mounted under /v1 and /api/v1 (/v1/categories, /v1/services, /v1/bookings, /v1/payments, /v1/chat).\n"
        "• Database integration: MongoDB Atlas multi-tenant cluster with Mongoose ORM pooling, 3000ms timeout tolerance, and automated in-memory fail-safe driver.\n"
        "• Hardware integration: HTML5 Navigator Geolocation API with Haversine formula calculation for exact geodesic distance measurement.\n"
        "• Software integration: Netlify Edge Network for static caching, Render Cloud Platform for container orchestration, and Leaflet.js cartography."
    )

    style_heading(doc.add_paragraph(), "c) Final / Updated Architecture", size=Pt(11))
    p_arch = doc.add_paragraph()
    p_arch.paragraph_format.line_spacing = 1.0
    r_diag = p_arch.add_run(
        "+-------------------------------------------------------------------------+\n"
        "|                 KHOJ PRODUCTION DISTRIBUTED ARCHITECTURE                |\n"
        "+-------------------------------------------------------------------------+\n"
        "                                     |\n"
        "            [ CLIENT LAYER: BROWSER / MOBILE DEVICE ]                     |\n"
        "                                     | HTTPS (Port 443)                   |\n"
        "                                     v                                    |\n"
        "       +-----------------------------------------------------------+      |\n"
        "       |          NETLIFY EDGE CDN (khoj-build.netlify.app)        |      |\n"
        "       |  - React 18 Single-Page Application (HTML5/CSS3/JS)       |      |\n"
        "       |  - Netlify Edge SPA Redirects (/* -> index.html 200)      |      |\n"
        "       +-----------------------------+-----------------------------+      |\n"
        "                     |               | /v1/* Reverse Proxy                |\n"
        "                     v (Static UI)   v HTTPS                              |\n"
        "       +-----------------------+   +-------------------------------+      |\n"
        "       | Client Geolocation    |   | RENDER CLOUD WEB SERVICE      |      |\n"
        "       | & JWT Auth Storage    |   | (khoj-api-ukh8.onrender.com)  |      |\n"
        "       +-----------------------+   | - Express 4.19 REST API       |      |\n"
        "                                   | - Mongoose Database Pool      |      |\n"
        "                                   +---------------+---------------+      |\n"
        "                                                   | TLS Socket           |\n"
        "                                                   v                      |\n"
        "                                   +-------------------------------+      |\n"
        "                                   | MONGODB ATLAS (Cluster0)      |      |\n"
        "                                   | - 0.0.0.0/0 IP CIDR Whitelist |      |\n"
        "                                   | - SCRAM-SHA-256 Auth          |      |\n"
        "                                   +-------------------------------+      |\n"
        "+-------------------------------------------------------------------------+\n"
    )
    r_diag.font.name = 'Consolas'
    r_diag.font.size = Pt(7.5)

    p_arch_exp = doc.add_paragraph()
    p_arch_exp.add_run(
        "Brief Explanation: The production deployment implements a decoupled Jamstack and containerized micro-backend model. The frontend is served from Netlify edge caches for instant sub-50ms loading. API calls targeting /v1/* are reverse-proxied by Netlify to the containerized Express API hosted on Render, which securely communicates with MongoDB Atlas over encrypted TLS."
    )

    # 5. FINAL TESTING AND VALIDATION
    style_heading(doc.add_paragraph(), "5. Final Testing and Validation")
    t5 = doc.add_table(rows=6, cols=5)
    t5.alignment = WD_TABLE_ALIGNMENT.CENTER
    tests = [
        ("Testing Area", "Tests Conducted", "Passed", "Failed", "Final Status"),
        ("Functional Testing", "Category browsing, search, booking, PIN handshake, wallet", "38", "0", "PASSED"),
        ("Integration Testing", "Netlify-to-Render API proxying, Express-to-Atlas connection", "16", "0", "PASSED"),
        ("System Testing", "Full user flow: Register -> Book -> Deduct Wallet -> Admin Status", "12", "0", "PASSED"),
        ("Performance Testing", "Lighthouse audit on Netlify: 92 Perf, 100 Access, 96 Best, 100 SEO", "8", "0", "PASSED"),
        ("User Acceptance Testing", "Tested on mobile (Android/iOS) and desktop (Chrome/Firefox/Edge)", "10", "0", "PASSED")
    ]
    for i, row in enumerate(tests):
        for j, val in enumerate(row):
            cell = t5.cell(i, j)
            if i == 0:
                set_cell_background(cell, "1A365D")
                r = cell.paragraphs[0].add_run(val)
                r.font.bold = True
                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            else:
                set_cell_background(cell, "F9FBFD" if i % 2 == 1 else "FFFFFF")
                cell.paragraphs[0].add_run(val)
            set_cell_margins(cell, 60, 60, 80, 80)

    # 6. RESULTS AND PERFORMANCE ANALYSIS
    style_heading(doc.add_paragraph(), "6. Results and Performance Analysis")
    p_iss = doc.add_paragraph()
    p_iss.add_run("Critical Bugs / Issues Identified & Resolved:")
    t6 = doc.add_table(rows=5, cols=4)
    t6.alignment = WD_TABLE_ALIGNMENT.CENTER
    issues = [
        ("Issue", "Severity", "Resolution", "Final Status"),
        ("Navbar text collision & crowded pills", "High", "Restructured into 3-part layout (Logo, Center Search, Profile Icons).", "RESOLVED"),
        ("SPA 404 error on reload on Netlify", "High", "Added client/public/_redirects with '/* /index.html 200' and netlify.toml.", "RESOLVED"),
        ("ENOENT index.html crash on Render API", "Medium", "Updated root route to serve clean JSON health status in decoupled mode.", "RESOLVED"),
        ("MongoDB connection timeout on cloud", "High", "Added 0.0.0.0/0 IP CIDR whitelisting in MongoDB Atlas and fail-safe driver.", "RESOLVED")
    ]
    for i, row in enumerate(issues):
        for j, val in enumerate(row):
            cell = t6.cell(i, j)
            if i == 0:
                set_cell_background(cell, "1A365D")
                r = cell.paragraphs[0].add_run(val)
                r.font.bold = True
                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            else:
                set_cell_background(cell, "F9FBFD" if i % 2 == 1 else "FFFFFF")
                cell.paragraphs[0].add_run(val)
            set_cell_margins(cell, 60, 60, 80, 80)

    p_val = doc.add_paragraph()
    p_val.paragraph_format.space_before = Pt(8)
    r = p_val.add_run("Final Validation Statement:\n")
    r.font.bold = True
    p_val.add_run("Is the project ready for final demonstration/submission?\n[X] Yes    [ ] Yes, with minor improvements    [ ] No\n")

    p_sc = doc.add_paragraph()
    r = p_sc.add_run("b) Output / Result Screenshots:\n")
    r.font.bold = True
    p_sc.add_run(
        "Screenshot 1: Live Netlify Platform Homepage & Service Discovery (https://khoj-build.netlify.app/)\n"
        "Screenshot 2: Render Backend Service Live Logs & MongoDB Connected (https://khoj-api-ukh8.onrender.com/)\n"
        "Screenshot 3: MongoDB Atlas Network Access IP Access List (0.0.0.0/0 Active Status)\n"
        "Screenshot 4: End-to-End Booking Confirmation, Wallet Balance & 4-Digit Security PIN"
    )

    # 7. FINAL RESULTS AND OUTCOMES
    style_heading(doc.add_paragraph(), "7. Final Results and Outcomes")
    p_res = doc.add_paragraph()
    p_res.add_run("[X] Completed    [ ] Mostly Completed    [ ] Partially Completed    [ ] Work in Progress\n\n")
    r = p_res.add_run("Completed Components:\n")
    r.font.bold = True
    p_res.add_run(
        "1. Production Cloud Hosting on Netlify Edge CDN (https://khoj-build.netlify.app/).\n"
        "2. Containerized Express API on Render Cloud (https://khoj-api-ukh8.onrender.com/).\n"
        "3. Cloud Database Persistence with MongoDB Atlas (Cluster0).\n"
        "4. Responsive Frontend UI with Ant Design & Tailwind CSS.\n"
        "5. End-to-End Service Booking Flow with Slot Management.\n"
        "6. Customer Doorstep Completion Verification via 4-Digit Security PIN.\n"
        "7. In-App Digital Wallet with Auto-Debit and Ledger Tracking.\n"
        "8. Interactive Geolocation & Neighborhood Proximity Filter.\n"
        "9. Side-by-Side Service Provider Comparison Tool.\n"
        "10. AI-Assisted Home Issue Diagnostics & Cost Estimator.\n"
        "11. Super Admin Management & Business Analytics Dashboard.\n"
        "12. Comprehensive Academic Documentation & Viva Defense Guide.\n\n"
    )
    r = p_res.add_run("Pending Components:\n")
    r.font.bold = True
    p_res.add_run("None. All functional, technical, and academic objectives for the Major Project have been 100% completed and deployed.")

    # 8. REFERENCES AND RESOURCES USED (APA 7th Edition)
    style_heading(doc.add_paragraph(), "8. References and Resources Used (APA 7th Edition)")
    p_refs = doc.add_paragraph()
    p_refs.add_run(
        "[1] Agafonkin, V. (2024). Leaflet: An open-source JavaScript library for mobile-friendly interactive maps and spatial marker clustering. Leaflet Official Documentation. https://leafletjs.com/reference.html\n\n"
        "[2] Jones, M., Bradley, J., & Sakimura, N. (2015). JSON Web Token (JWT): Stateless cryptographic token claims for cross-domain RESTful web applications (RFC No. 7519). Internet Engineering Task Force (IETF). https://datatracker.ietf.org/doc/html/rfc7519\n\n"
        "[3] Veness, C. (2023). Geodesic coordinate calculation and distance determination between GPS latitude/longitude points using the Haversine formula. Movable Type Geospatial Scripts. https://www.movable-type.co.uk/scripts/latlong.html\n\n"
        "[4] Wathan, A., & Schoger, S. (2024). Tailwind CSS: Utility-first CSS architecture for scalable, responsive design tokens and component interfaces. Tailwind Labs Documentation. https://tailwindcss.com/docs\n\n"
        "[5] Google Developers. (2024). Web Vitals: Essential metrics for healthy user experiences, First Contentful Paint, and Core Web Vitals performance auditing. Google Chrome Developers. https://web.dev/articles/vitals\n\n"
        "[6] Ant Design Team. (2024). Ant Design 5.x: An enterprise-class UI design language and React component library. Ant Group Documentation. https://ant.design/components/overview/"
    )

    # 9. EVALUATION SHEET
    style_heading(doc.add_paragraph(), "Evaluation (To be filled by Mentor (Institute))")
    t7 = doc.add_table(rows=7, cols=6)
    t7.alignment = WD_TABLE_ALIGNMENT.CENTER
    eval_rows = [
        ("Criteria", "Excellent", "Good", "Average", "Poor", "Marks"),
        ("Final Project Completion & Implementation", ">=90%", "75-89%", "50-74%", "<50%", "/25"),
        ("Functionality, Testing & Validation", "Strong", "Good", "Limited", "None", "/25"),
        ("Technical Understanding", "Strong", "Good", "Basic", "Unable", "/20"),
        ("Project Demonstration and Results", "Complete", "Minor", "Incomplete", "Poor", "/20"),
        ("References & Citations", "Relevant", "Minor", "Limited", "Missing", "/10"),
        ("TOTAL", "", "", "", "", "/100")
    ]
    for i, row in enumerate(eval_rows):
        for j, val in enumerate(row):
            cell = t7.cell(i, j)
            if i == 0 or i == 6:
                set_cell_background(cell, "1A365D" if i == 0 else "E2E8F0")
                r = cell.paragraphs[0].add_run(val)
                r.font.bold = True
                if i == 0:
                    r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            else:
                set_cell_background(cell, "F9FBFD" if i % 2 == 1 else "FFFFFF")
                cell.paragraphs[0].add_run(val)
            set_cell_margins(cell, 60, 60, 80, 80)

    # SIGNATURES & REMARKS
    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(16)
    p_sig.add_run(
        "Student Signature: ______________________      Date: ______________\n\n"
        "Mentor (Company) Signature: _____________      Date: ______________\n\n"
        "Mentor (Institute) Signature: ___________      Date: ______________\n\n"
    )

    style_heading(doc.add_paragraph(), "Mentor (Institute) Remarks:")
    p_rem = doc.add_paragraph()
    p_rem.add_run(
        "_________________________________________________________________________________\n"
        "_________________________________________________________________________________\n"
        "_________________________________________________________________________________\n"
        "_________________________________________________________________________________\n"
    )

    output_path = os.path.join(r"C:\Khoj", "Khoj_Project_Report_4.docx")
    doc.save(output_path)
    print(f"Successfully generated: {output_path}")

if __name__ == '__main__':
    create_report_4()
