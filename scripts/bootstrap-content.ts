import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

// ── DIRECTORIES TO CREATE ────────────────────────────────────
const baseDir = process.cwd();
const editDir = path.join(baseDir, 'edit');
const reportsDir = path.join(baseDir, 'REPORTS');

const directories = [
  editDir,
  reportsDir,
  path.join(editDir, 'backups'),
  path.join(editDir, 'ai-content'),
  path.join(editDir, 'templates'),
  path.join(editDir, 'documents'),
  path.join(editDir, 'documents', 'customizations'),
  path.join(editDir, 'documents', 'services'),
  path.join(editDir, 'documents', 'products'),
  path.join(editDir, 'images'),
  path.join(editDir, 'images', 'customizations'),
  path.join(editDir, 'images', 'services'),
  path.join(editDir, 'images', 'products'),
  path.join(editDir, 'images', 'industries'),
  path.join(editDir, 'images', 'case-studies'),
  path.join(editDir, 'images', 'industry-banners')
];

console.log('Creating CMS directory structure...');
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${path.relative(baseDir, dir)}`);
  }
});

// ── CREATE TEMPLATE PLACEHOLDERS ─────────────────────────────
const templates = [
  'customization-template.docx',
  'service-template.docx',
  'product-template.docx',
  'case-study-template.docx',
  'proposal-template.docx',
  'brochure-template.docx'
];

console.log('\nCreating document templates...');
templates.forEach(file => {
  const filePath = path.join(editDir, 'templates', file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, Buffer.alloc(0)); // empty placeholder
    console.log(`Created empty template: edit/templates/${file}`);
  }
});

// ── LOAD EXISTING HARDCODED DATA ─────────────────────────────
// We can define the existing data directly in this bootstrapping script to avoid import complications.

const existingCustomizations = [
  {
    id: "hotel-lodging",
    title: "Hotel & Lodging Management System",
    slug: "hotel-lodging",
    category: "Hotel",
    description: "Complete room reservation, check-in/check-out, guest ledger billing, and occupancy reporting integrated seamlessly with Tally Prime.",
    features: [
      "Dynamic room reservation matrix and availability board",
      "Instant check-in and automated guest registration cards",
      "Room service billing and restaurant KOT integration",
      "Multi-tariff support based on seasons and occupancy",
      "One-click check-out with detailed tax invoice generation"
    ],
    benefits: [
      "Eliminates duplicate entries between front-desk software and accounting",
      "Real-time occupancy tracking for improved room allocation",
      "Accurate GST calculation on lodging services and food/beverages",
      "Enhanced guest experience with fast check-out times"
    ],
    price: "₹12,500",
    compatibility: ["Tally Prime", "Tally ERP 9", "Cloud Compatible", "GST Enabled"],
    image: "/assets/customizations/hotel.jpg",
    popular: true,
    featured: true,
    industry: "Hospitality",
    tags: ["Hotel", "Restaurant", "GST", "Billing", "Reports"],
    problemsSolved: [
      "Lack of real-time guest balance checking causing billing disputes",
      "Time-consuming manual transfer of front-desk transactions into Tally",
      "Complex tax allocation across different lodging tariffs and restaurant bills"
    ],
    workflow: [
      "Guest reserves a room via phone or online portal",
      "Front-desk checks availability on room matrix and marks check-in",
      "Restaurant/room service orders are recorded directly under the guest room folder",
      "System auto-calculates room charges, taxes, and service fees on checkout",
      "Receipt is generated and accounting entries sync instantly to Tally Prime"
    ],
    faq: [
      {
        q: "Does this module support multiple room categories?",
        a: "Yes, you can create unlimited room categories (e.g., Deluxe, Suite, Standard) and set custom rates and seasonal tariffs for each."
      },
      {
        q: "Can it run on Tally on Cloud?",
        a: "Absolutely, this customization is fully optimized to run on cloud servers without any lag."
      },
      {
        q: "Is guest ID scanning supported?",
        a: "Yes, you can attach scanned guest ID documents (Aadhar, Passport) directly to the guest ledger."
      }
    ]
  },
  {
    id: "garment-retail",
    title: "Garment & Apparel Grid Billing Module",
    slug: "garment-retail",
    category: "Garment",
    description: "Multi-dimensional billing grid (Size, Color, Brand, Style) with barcode integration for swift retail checkouts and clean stock tracking.",
    features: [
      "Grid matrix item selection (Size x Color x Brand) on a single billing line",
      "1D and 2D barcode scanner integration for automated product search",
      "Dynamic discount and promotional scheme application based on brands/styles",
      "E-Way bill and E-Invoicing triggers directly from the POS interface",
      "Multi-store stock visibility and transfer tracking"
    ],
    benefits: [
      "Increases cashier throughput during peak retail hours",
      "Allows tracking stock levels at the micro-attribute level (e.g., XL - Blue - Levi's)",
      "Reduces manual search errors during invoice creation",
      "Enables automated stock re-order alerts based on size/color availability"
    ],
    price: "₹9,500",
    compatibility: ["Tally Prime", "Barcode Support", "Cloud Compatible", "GST Enabled"],
    image: "/assets/customizations/garment.jpg",
    popular: false,
    featured: true,
    industry: "Retail",
    tags: ["Garment", "Barcode", "POS", "Inventory", "Retail"],
    problemsSolved: [
      "Slow billing lines due to cashiers manually typing product codes",
      "Inability to track exact stock quantities for separate sizes of the same model",
      "Disputes in brand-wise sales commissions and royalty reporting"
    ],
    workflow: [
      "Barcode labels are printed and attached to garments during inwarding",
      "During sales, the cashier scans the barcode or selects size/color from the grid",
      "Tally auto-populates product specs, rates, and active discounts",
      "System deducts stock from the specific size/color bin",
      "POS thermal receipt or tax invoice is generated instantly"
    ],
    faq: [
      {
        q: "Can I print customized price tags with barcodes?",
        a: "Yes, this module includes a customizable barcode label designer that supports printing size, color, price, and barcode directly onto labels."
      },
      {
        q: "How does it handle product returns or exchanges?",
        a: "A quick exchange/return button allows cashiers to pull up the original bill, scan returned items, and adjust inventory and credits on the spot."
      }
    ]
  },
  {
    id: "manufacturing-bom",
    title: "Auto-BOM & Manufacturing Consumption Module",
    slug: "manufacturing-bom",
    category: "Manufacturing",
    description: "Automatic generation of production entries and raw material consumption vouchers based on sales invoices and Bills of Materials.",
    features: [
      "Multi-level Bill of Materials (BOM) setup with wastage percentages",
      "Auto-triggering of physical stock consumption on sales voucher validation",
      "Production cost tracking including wages, power, and overhead allocation",
      "Real-time raw material shortage alerts before commencing production",
      "Batch-wise tracking of finished goods and expiry control"
    ],
    benefits: [
      "Ensures stock books are kept accurate without manual physical stock journals",
      "Provides exact cost-of-goods-sold (COGS) analytics to monitor margins",
      "Automates raw material requisition planning based on active order books",
      "Tracks production efficiency and alerts on excessive material wastage"
    ],
    price: "₹15,000",
    compatibility: ["Tally Prime", "Tally ERP 9", "Inventory Control", "Cloud Compatible"],
    image: "/assets/customizations/manufacturing.jpg",
    popular: true,
    featured: false,
    industry: "Manufacturing",
    tags: ["Manufacturing", "BOM", "Inventory", "Automation", "Finance"],
    problemsSolved: [
      "Inaccurate inventory levels caused by delayed or missing consumption journals",
      "Difficulty in tracking actual profit margins per production batch due to manual calculation",
      "Unmanaged wastage leading to discrepancies in physical stock takes"
    ],
    workflow: [
      "Define standard Bill of Materials (BOM) for finished items",
      "Enter a Sales Invoice for finished products",
      "Module runs background consumption checks for raw ingredients",
      "System automatically generates manufacturing journal and consumption voucher",
      "Inventory lists and cost ledgers update instantly"
    ],
    faq: [
      {
        q: "What happens if raw materials are out of stock?",
        a: "The module will flag a warnings report displaying the missing quantities, allowing you to choose whether to block billing or allow negative inventory."
      },
      {
        q: "Does it support co-products or by-products?",
        a: "Yes, you can configure by-products and scrap generation percentages inside the BOM settings."
      }
    ]
  },
  {
    id: "multi-branch-sync",
    title: "Multi-Branch Real-Time Data Sync",
    slug: "multi-branch-sync",
    category: "Integration",
    description: "Sync all retail transactions, receipts, and inventory stock transfers across multiple physical locations and main head office seamlessly.",
    features: [
      "Automated background sync intervals (real-time or scheduled queue)",
      "Conflict resolution protocol for concurrent ledger edits",
      "Offline sync buffer that auto-uploads transactions when internet resumes",
      "Consolidated multi-branch financial reports and trial balances",
      "Centralized master inventory control and SKU cataloging"
    ],
    benefits: [
      "Head office has immediate visibility of overall cash-flow and revenue",
      "Prevents branches from overselling inventory available in other godowns",
      "Ensures unified pricing and item database across all stores",
      "Zero manual data export-import overheads"
    ],
    price: "₹18,000",
    compatibility: ["Tally Prime", "Cloud Compatible", "Multi-Branch Support"],
    image: "/assets/customizations/sync.jpg",
    popular: true,
    featured: true,
    industry: "Logistics & Warehouse",
    tags: ["Integration", "Automation", "Multi Branch", "Cloud Compatible", "Reports"],
    problemsSolved: [
      "Out-of-sync inventory leading to branches committing sales for out-of-stock items",
      "Hours of manual reconciliation at the end of every week to check consolidated sales",
      "Loss of transaction data during branch internet disruptions"
    ],
    workflow: [
      "Branch A records sales invoice locally or on cloud",
      "Sync agent verifies data integrity and uploads payload to HO server",
      "Central database processes transaction and updates global stock book",
      "Consolidated dashboards at HO update with latest branch KPIs"
    ],
    faq: [
      {
        q: "Does it require static IP at all branch locations?",
        a: "No, a standard internet connection is sufficient. The sync communicates securely over web services."
      },
      {
        q: "Can I disable certain branches from editing masters?",
        a: "Yes, you can enforce read-only permissions for product masters at branch levels, allowing modifications only at the Head Office."
      }
    ]
  },
  {
    id: "payroll-biometric",
    title: "Payroll & Biometric Attendance Integration",
    slug: "payroll-biometric",
    category: "Payroll",
    description: "Link attendance logs from hardware scanners or mobile check-ins directly into Tally's payroll voucher system for single-click salaries.",
    features: [
      "Direct API sync with biometric devices (ZKTeco, Matrix, Essl, etc.)",
      "Auto-calculation of overtime, late marks, half-days, and paid leaves",
      "Custom salary structures containing allowances, PF, ESIC, and TDS",
      "One-click monthly salary generation and automated email payslips",
      "Employee self-service portal compatibility for attendance sheets"
    ],
    benefits: [
      "Saves hours of HR time spent compiling Excel sheets manually",
      "Eliminates payroll calculation errors and manual data entry mistakes",
      "Ensures compliance with statutory regulations (PF, ESIC, Professional Tax)",
      "Provides transparent attendance logs to employees, boosting trust"
    ],
    price: "₹11,000",
    compatibility: ["Tally Prime", "Tally ERP 9", "Hardware API", "GST Enabled"],
    image: "/assets/customizations/payroll.jpg",
    popular: false,
    featured: false,
    industry: "Professional Services",
    tags: ["Payroll", "Automation", "Integration", "Reports", "Education"],
    problemsSolved: [
      "Incorrect salary payments caused by manual translation of card punches",
      "Delays in salary distribution due to complex manual calculations",
      "Compliance penalties due to miscalculated PF and ESIC liabilities"
    ],
    workflow: [
      "Employees punch attendance on biometric device",
      "Sync tool downloads punch logs daily and parses into attendance records",
      "At month-end, HR triggers automated calculation inside Tally Prime",
      "Payroll voucher is generated, and payslips are emailed automatically",
      "Bank transfer spreadsheet is generated for bulk bank payments"
    ],
    faq: [
      {
        q: "What types of biometric devices are supported?",
        a: "Any biometric scanner that supports database exports (SQL/Access) or has a web API is fully compatible."
      },
      {
        q: "Does it handle multiple shifts and night shifts?",
        a: "Yes, you can configure unlimited shifts and specify custom rules for night shift allowances and overtime."
      }
    ]
  },
  {
    id: "mis-dashboard",
    title: "MIS Dashboard & Visual Analytics Panel",
    slug: "mis-dashboard",
    category: "MIS Reports",
    description: "Beautiful graphical visual dashboard showing key business health vitals like accounts receivable, cash flows, top customers, and sales trends.",
    features: [
      "Real-time charts showing sales growth, top-selling products, and revenue lines",
      "Ageing analysis visual tool for tracking outstanding payments",
      "Automated PDF reports emailed directly to management every evening",
      "Cash flow forecasting tool based on outstanding payables and receivables",
      "Comparative charts for current year vs previous year metrics"
    ],
    benefits: [
      "Enables fast, data-backed decisions for promoters and executives",
      "Identifies lagging collections before they turn into bad debts",
      "Reduces reliance on complex Tally menus for simple financial reviews",
      "Accessible by managers without giving them direct edit access to accounting vouchers"
    ],
    price: "₹8,000",
    compatibility: ["Tally Prime", "Cloud Compatible", "GST Enabled", "Mobile Access"],
    image: "/assets/customizations/dashboard.jpg",
    popular: true,
    featured: true,
    industry: "Professional Services",
    tags: ["MIS Reports", "Finance", "Mobile Access", "Reports", "Automation"],
    problemsSolved: [
      "Executives struggling to understand raw numbers and ledger lists",
      "Missing cash-flow issues until bank balances reach critical lows",
      "Management requesting custom reports from busy accounting staff daily"
    ],
    workflow: [
      "Sales, receipts, and invoices are entered into Tally normally",
      "MIS Module reads financial variables dynamically",
      "Visual cards render charts (pie charts, bar graphs, indicators)",
      "CEO accesses the dashboard via local system, cloud, or email PDF attachment"
    ],
    faq: [
      {
        q: "Can I customize the charts displayed on the dashboard?",
        a: "Yes, you can pin specific charts, configure targets/KPI limits, and select which categories or ledgers to track."
      },
      {
        q: "Does it work on mobile phones?",
        a: "Yes, this customized visual dashboard is optimized for responsive mobile browsers."
      }
    ]
  },
  {
    id: "warehouse-batch",
    title: "Warehouse & Batch Expiry Tracker",
    slug: "warehouse-batch",
    category: "Warehouse",
    description: "Advanced batch tracking with manufacturing and expiry date alerts, multi-godown stock transfers, and rack allocation tags.",
    features: [
      "Batch-wise inventory classification with manufacturing/expiry details",
      "FIFO (First-In, First-Out) stock suggestions during invoice creation",
      "Automated warnings when billing items nearing their expiry date",
      "Multi-godown stock allocation matrix inside sales/purchase vouchers",
      "Godown-wise rack location coordinates search tool"
    ],
    benefits: [
      "Prevents loss of capital due to expired stocks sitting in warehouses",
      "Speeds up packaging cycles by providing warehouse rack coordinates",
      "Simplifies inventory audits by separating stocks godown-wise",
      "Accurate tracking of batch profitability and costing"
    ],
    price: "₹10,500",
    compatibility: ["Tally Prime", "Tally ERP 9", "Inventory Control", "Cloud Compatible"],
    image: "/assets/customizations/warehouse.jpg",
    popular: false,
    featured: false,
    industry: "Logistics & Warehouse",
    tags: ["Warehouse", "Inventory", "Barcode", "Healthcare", "Retail"],
    problemsSolved: [
      "Shipping expired goods to retail clients resulting in compliance problems",
      "Staff spending hours searching for items in disorganized warehouses",
      "Writing off inventory due to stock going unnoticed in remote godowns"
    ],
    workflow: [
      "Items are inwarded with batch number, manufacturing date, and rack code",
      "Vouchers allocate items to designated Godowns",
      "Billing pulls items using automated FIFO expiry suggestions",
      "Reports trigger warning on items expiring within 30, 60, or 90 days"
    ],
    faq: [
      {
        q: "Is this suitable for pharmaceutical distribution?",
        a: "Absolutely, this customization is built specifically to address drug license guidelines and drug expiry tracking."
      },
      {
        q: "Can I allocate stock to multiple godowns on a single bill?",
        a: "Yes, you can split a single invoice line item into multiple godowns and batches in a small sub-screen."
      }
    ]
  },
  {
    id: "tally-crm",
    title: "Tally CRM & Lead Tracker Module",
    slug: "tally-crm",
    category: "CRM",
    description: "Manage client interaction history, outstanding reminders, lead status, and sales representative targets right inside Tally Prime.",
    features: [
      "Lead stage tracking (New, Contacted, Proposal, Negotiation, Closed)",
      "Daily follow-up reminders and scheduled tasks calendar",
      "Auto-generation of quotations directly from leads list",
      "Sales executive performance dashboard and targets tracker",
      "WhatsApp outstanding collection alerts sent in bulk"
    ],
    benefits: [
      "Bridges the gap between sales activity and invoicing records",
      "Reduces payment outstanding delays with automated client alerts",
      "Retains client relationship history even when sales executives leave",
      "Increases quotation conversion ratios with timely notifications"
    ],
    price: "₹14,000",
    compatibility: ["Tally Prime", "GST Enabled", "Mobile Access", "Cloud Compatible"],
    image: "/assets/customizations/crm.jpg",
    popular: true,
    featured: false,
    industry: "Retail",
    tags: ["CRM", "Automation", "Mobile Access", "Finance", "Retail"],
    problemsSolved: [
      "Leads falling through the cracks due to tracking on separate spreadsheets",
      "Difficulty in assigning credit for sales to specific representatives",
      "Delays in sending quotation updates to prospective clients"
    ],
    workflow: [
      "Inward a lead and assign it to a sales executive",
      "Executive updates stages and follow-up logs",
      "Quotations are generated, and converted into Sales Orders",
      "Invoicing triggers and closes the CRM ticket automatically",
      "Outstanding sync tools notify client on WhatsApp when collection is due"
    ],
    faq: [
      {
        q: "Can sales executives access this outside office?",
        a: "Yes, if Tally is hosted on cloud, executives can access lead sheets via mobile or web client."
      },
      {
        q: "Is there a limit to the number of leads I can track?",
        a: "No, the module is optimized to store and track tens of thousands of leads without slowing down Tally."
      }
    ]
  }
];

const existingServices = [
  // 3 main Tally services from MainServicesApp.tsx
  {
    id: "tally-license",
    name: "Tally Prime License",
    slug: "tally-license",
    category: "Main",
    description: "Get genuine Tally Prime licenses (Single & Multi User) with complete setup and guidance.",
    price: "₹7,500/yr",
    features: ["GST Ready Billing", "Inventory Management", "Bank Reconciliation", "Multi-Company Support", "Setup Assistance"],
    benefits: ["Certified Tally Solutions partner", "Lifetime module upgrades", "Expert installation support"],
    image: "",
    document: "",
    seoTitle: "Genuine Tally Prime License (Silver & Gold) - Harsh Infotech",
    seoDescription: "Purchase official Tally Prime Single User (Silver) and Multi User (Gold) licenses with free setup and support from Harsh Infotech."
  },
  {
    id: "tally-cloud",
    name: "Tally on Cloud",
    slug: "tally-cloud",
    category: "Main",
    description: "Access your business data anytime, anywhere with secure and reliable cloud solutions.",
    price: "₹7,200/yr",
    features: ["Secure Remote Login", "Daily Automated Backups", "99.9% Uptime Guarantee", "Multi-device compatibility", "Dedicated Support"],
    benefits: ["Work from anywhere without complex server setups", "Protects financial databases from local hardware failures", "Scales users instantly"],
    image: "",
    document: "",
    seoTitle: "Secure Tally on Cloud Hosting & Remote Access - Harsh Infotech",
    seoDescription: "Host your Tally Prime database on our secure, fully-managed cloud server. Access data anywhere with 99.9% uptime and daily backups."
  },
  {
    id: "tally-customization",
    name: "Tally Customization",
    slug: "tally-customization",
    category: "Main",
    description: "Customize Tally according to your business workflow using advanced TDL solutions.",
    price: "Custom",
    features: ["Invoice Customization", "MIS Dashboard Integrations", "Approval Workflows", "Statutory Compliance automation"],
    benefits: ["Bridges accounting with day-to-day operations", "Eliminates redundant manual spreadsheet data entry", "Custom-built for your business scale"],
    image: "",
    document: "",
    seoTitle: "Custom TDL Customization & Module Development - Harsh Infotech",
    seoDescription: "Design custom templates, automate voucher approvals, and integrate third-party APIs with Tally Prime TDL development services."
  },
  // 5 supplementary services from ServicesApp.tsx
  {
    id: "vps",
    name: "VPS (Virtual Private Server)",
    slug: "vps",
    category: "More",
    description: "High-performance cloud servers for running business applications securely and efficiently.",
    price: "₹1,999/mo",
    features: ["99.9% Uptime Guarantee", "SSD Backed Storage", "24/7 Monitoring", "Full Root Access"],
    benefits: ["High availability for hosting corporate applications", "Enterprise-grade safety configurations"],
    image: "",
    document: "",
    seoTitle: "High Performance Business VPS Server Hosting - Harsh Infotech",
    seoDescription: "Host your legacy or web business software on high-speed SSD backed VPS servers with root access and 24/7 support."
  },
  {
    id: "amc",
    name: "Tally AMC & Support",
    slug: "amc",
    category: "More",
    description: "Reliable annual maintenance and support for smooth business operations.",
    price: "₹4,500/yr",
    features: ["Priority Remote Support", "Data Corruption Fixes", "Version Upgrades", "On-site Visits"],
    benefits: ["Zero operational halts with rapid response technicians", "Keeps your accounting logs healthy"],
    image: "",
    document: "",
    seoTitle: "Annual Maintenance Contract (AMC) for Tally Prime - Harsh Infotech",
    seoDescription: "Sign up for comprehensive Tally AMC support including data recovery, priority telephonic guidance, and remote updates."
  },
  {
    id: "excel",
    name: "Excel to Tally Integration",
    slug: "excel",
    category: "More",
    description: "Seamlessly import and manage your vast Excel data directly into Tally.",
    price: "Custom",
    features: ["Bulk Ledger Creation", "Voucher Imports", "Custom Mapping", "Error Validation"],
    benefits: ["Imports thousands of entries within seconds", "Prevents duplicate typing errors"],
    image: "",
    document: "",
    seoTitle: "Excel to Tally XML/TDL Data Import Utilities - Harsh Infotech",
    seoDescription: "Automate ledger imports and bulk voucher entries from Excel sheets directly into Tally Prime with mapping tools."
  },
  {
    id: "data-migration",
    name: "Data Migration & Setup",
    slug: "data-migration",
    category: "More",
    description: "Secure transfer and setup of your existing business data to new systems or cloud.",
    price: "Custom",
    features: ["Zero Data Loss guarantee", "Downtime Minimization", "Secure Encryption", "Post-Migration Audit"],
    benefits: ["Clean upgrade from Tally ERP9 to Tally Prime", "Reorganizes accounting years securely"],
    image: "",
    document: "",
    seoTitle: "Safe Tally Data Migration & Accounting Setup - Harsh Infotech",
    seoDescription: "Reorganize financial periods and migrate accounting data between servers with zero loss and full data audits."
  },
  {
    id: "hardware-support",
    name: "Hardware & System Support",
    slug: "hardware-support",
    category: "More",
    description: "Complete assistance for business systems and physical IT infrastructure.",
    price: "Hourly",
    features: ["Network Troubleshooting", "Hardware Repair", "System Upgrades", "Peripheral Setup"],
    benefits: ["Maintains office computers and printers at peak performance", "Proactive hardware checkups"],
    image: "",
    document: "",
    seoTitle: "Corporate IT Support & Hardware Maintenance - Harsh Infotech",
    seoDescription: "Get network diagnostics, computer repairs, server installs, and office hardware maintenance services in Mumbai."
  }
];

const existingProducts = [
  {
    id: "servers",
    name: "Enterprise Servers",
    slug: "servers",
    brand: "HP / Dell / Lenovo",
    category: "Hardware",
    description: "Reliable and high-performance servers designed for non-stop business operations and data redundancy.",
    price: "Starting at ₹85,000",
    specifications: [
      "CPU: Dual Intel Xeon or AMD EPYC Processors",
      "RAM: ECC DDR4/DDR5 Registered Modules",
      "Storage: Enterprise SAS/SATA RAID arrays",
      "Network: 10GbE SFP+ high-speed interfaces"
    ],
    image: "",
    datasheet: "",
    seoTitle: "Enterprise Database & Application Servers - Harsh Infotech",
    seoDescription: "Procure certified enterprise servers from Dell, HP, and Lenovo optimized for local data hosting and virtual machines."
  },
  {
    id: "workstations",
    name: "Professional Workstations",
    slug: "workstations",
    brand: "HP / Dell / Custom Builds",
    category: "Hardware",
    description: "Powerful desktop systems designed for heavy professional workloads, industrial use, and secure workflows.",
    price: "Starting at ₹45,000",
    specifications: [
      "CPU: Intel Core i7/i9 or AMD Ryzen Threadripper",
      "RAM: 32GB to 128GB High-speed channels",
      "Storage: Ultra-fast NVMe PCIe M.2 SSDs",
      "Graphics: Dedicated NVIDIA RTX professional GPUs"
    ],
    image: "",
    datasheet: "",
    seoTitle: "HP & Dell Professional Workstation Desktops - Harsh Infotech",
    seoDescription: "High-end workstations built for heavy accounting calculations, software compilation, and professional processing."
  },
  {
    id: "printers",
    name: "Commercial Printers",
    slug: "printers",
    brand: "Epson / HP / Canon",
    category: "Hardware",
    description: "Efficient high-volume printing solutions tailored for daily business accounting and invoicing needs.",
    price: "Starting at ₹12,000",
    specifications: [
      "Print Speed: 30 to 50+ pages per minute",
      "Duty Cycle: Up to 50,000 printouts monthly",
      "Connectivity: Gigabit LAN and WiFi network printing",
      "Options: Monochrome / Color LaserJet and InkTank"
    ],
    image: "",
    datasheet: "",
    seoTitle: "Heavy-Duty Office Printers & Laser Copiers - Harsh Infotech",
    seoDescription: "Equip your billing desk with reliable high-volume network laser printers from Epson, HP, and Canon."
  },
  {
    id: "scanners",
    name: "High-Speed Scanners",
    slug: "scanners",
    brand: "Fujitsu / Canon",
    category: "Hardware",
    description: "Fast document scanning solutions for achieving an organized, paperless workflow safely.",
    price: "Starting at ₹8,500",
    specifications: [
      "Feeder: Auto Document Feeder (ADF) up to 80 sheets",
      "Resolution: Double-sided (Duplex) 600 DPI scans",
      "Speed: 40 to 80 sheets scanned per minute",
      "Software: Auto-OCR text identification included"
    ],
    image: "",
    datasheet: "",
    seoTitle: "High-Speed Document Scanners & Digitizers - Harsh Infotech",
    seoDescription: "Digitize invoices and corporate filings easily with fast sheet-fed scanners supporting optical character recognition."
  }
];

const existingTestimonials = [
  { id: "test-1", status: "Active", featured: true, name: "Rajesh Sharma", role: "Business Owner", initials: "RS", text: "Harsh Infotech helped us streamline our Tally operations and saved hours of manual work." },
  { id: "test-2", status: "Active", featured: true, name: "Priya Mehta", role: "Accountant", initials: "PM", text: "Excellent support and fast implementation. Their Tally customization is top-notch." },
  { id: "test-3", status: "Active", featured: true, name: "Amit Verma", role: "Operations Manager", initials: "AV", text: "Smooth migration and zero data loss. Highly recommended for growing companies." },
  { id: "test-4", status: "Active", featured: true, name: "Sneha Patil", role: "Finance Head", initials: "SP", text: "Reliable AMC support and quick issue resolution every time." },
  { id: "test-5", status: "Active", featured: true, name: "Kunal Shah", role: "Startup Founder", initials: "KS", text: "Their cloud Tally setup allowed us to work from anywhere seamlessly." },
  { id: "test-6", status: "Active", featured: true, name: "Neha Gupta", role: "Admin Manager", initials: "NG", text: "Professional team with deep knowledge of business workflows." }
];

// Compile FAQs from customizationsData
const extractedFAQs: any[] = [];
let faqCounter = 1;
existingCustomizations.forEach(item => {
  if (item.faq) {
    item.faq.forEach(f => {
      extractedFAQs.push({
        id: `faq-${faqCounter++}`,
        status: "Active",
        featured: true,
        category: item.category,
        question: f.q,
        answer: f.a
      });
    });
  }
});

// Compile Pricing Plans (e.g. Tally Licenses, Cloud, AMC Plans)
const extractedPricing = [
  // Tally Prime Licenses
  { id: "price-lic-1", status: "Active", planName: "Silver (Single User) - Monthly", serviceSlug: "tally-license", pricingPeriod: "Monthly", price: "₹750 / mo", features: "GST Ready Billing|Inventory Management|Bank Reconciliation|1 Concurrent User|Free Setup Assistance", popular: "FALSE" },
  { id: "price-lic-2", status: "Active", planName: "Silver (Single User) - Yearly", serviceSlug: "tally-license", pricingPeriod: "Yearly", price: "₹7,500 / yr", features: "GST Ready Billing|Inventory Management|Bank Reconciliation|1 Concurrent User|Save 2 Months|Free Setup Assistance", popular: "FALSE" },
  { id: "price-lic-3", status: "Active", planName: "Silver (Single User) - Perpetual", serviceSlug: "tally-license", pricingPeriod: "Perpetual", price: "₹22,500", features: "GST Ready Billing|Inventory Management|Bank Reconciliation|1 Concurrent User|One Time Purchase|Free Setup Assistance", popular: "FALSE" },
  { id: "price-lic-4", status: "Active", planName: "Gold (Multi User) - Monthly", serviceSlug: "tally-license", pricingPeriod: "Monthly", price: "₹1,500 / mo", features: "Everything in Silver|Unlimited Concurrent Users|Multi-Company Support|Remote Access Ready|Priority Support", popular: "FALSE" },
  { id: "price-lic-5", status: "Active", planName: "Gold (Multi User) - Yearly", serviceSlug: "tally-license", pricingPeriod: "Yearly", price: "₹15,000 / yr", features: "Everything in Silver|Unlimited Concurrent Users|Multi-Company Support|Remote Access Ready|Priority Support|Save 2 Months", popular: "FALSE" },
  { id: "price-lic-6", status: "Active", planName: "Gold (Multi User) - Perpetual", serviceSlug: "tally-license", pricingPeriod: "Perpetual", price: "₹67,500", features: "Everything in Silver|Unlimited Concurrent Users|Multi-Company Support|Remote Access Ready|Priority Support|One Time Purchase", popular: "TRUE" },
  
  // Tally on Cloud Plans
  { id: "price-cloud-1", status: "Active", planName: "Starter Cloud (SU)", serviceSlug: "tally-cloud", pricingPeriod: "Yearly", price: "₹7,200 / yr", features: "1 User Access|Secure Cloud Environment|Daily Automated Backups|Remote Login Capability|Standard Support", popular: "FALSE" },
  { id: "price-cloud-2", status: "Active", planName: "Business Cloud (MU)", serviceSlug: "tally-cloud", pricingPeriod: "Yearly", price: "₹7,200 per user / yr", features: "Multiple Users Access|Shared Cloud Environment|Daily Automated Backups|Remote Login Capability|Priority Technical Support", popular: "TRUE" },
  
  // Tally AMC Plans
  { id: "price-amc-1", status: "Active", planName: "Remote Support AMC", serviceSlug: "amc", pricingPeriod: "Yearly", price: "₹9,000 / yr (Single) | ₹13,500 / yr (Multi)", features: "Unlimited telephonic support (business hours)|Quick issue resolution|Guidance & troubleshooting", popular: "FALSE" },
  { id: "price-amc-2", status: "Active", planName: "Basic AMC", serviceSlug: "amc", pricingPeriod: "Yearly", price: "₹11,000 / yr (Single) | ₹18,000 / yr (Multi)", features: "All Remote AMC features|6 scheduled on-site visits|Regular system checks", popular: "TRUE" },
  { id: "price-amc-3", status: "Active", planName: "Plus AMC", serviceSlug: "amc", pricingPeriod: "Yearly", price: "₹25,000 – ₹35,000 / yr", features: "All Basic features|12 scheduled visits|Priority response support", popular: "FALSE" },
  { id: "price-amc-4", status: "Active", planName: "Premium AMC", serviceSlug: "amc", pricingPeriod: "Yearly", price: "₹35,000 – ₹45,000+ / yr", features: "All Plus features|16 scheduled visits|Highest priority response|Complete system health checks", popular: "FALSE" }
];

const existingOffers = [
  { id: "offer-1", status: "Active", offerName: "New Financial Year Discount", slug: "new-fy-discount", discount: "10%", description: "Get 10% off on all Tally customizations during the new financial year opening.", couponCode: "WELCOME10", expiryDate: "2026-07-31" }
];

const existingIndustries = [
  { id: "ind-1", status: "Active", industryName: "Hospitality", slug: "hospitality", description: "Hotels, lodging setups, guest houses, and restaurants." },
  { id: "ind-2", status: "Active", industryName: "Retail", slug: "retail", description: "Supermarkets, apparel boutiques, POS outlets, and distributors." },
  { id: "ind-3", status: "Active", industryName: "Manufacturing", slug: "manufacturing", description: "Factory operations, bill of materials tracking, and raw ingredients management." },
  { id: "ind-4", status: "Active", industryName: "Logistics & Warehouse", slug: "logistics-warehouse", description: "Multi-godown management, batch tracking, and logistics." },
  { id: "ind-5", status: "Active", industryName: "Professional Services", slug: "professional-services", description: "Consultancies, schools, payroll systems, and MIS dashboards." }
];

// Placeholder for case studies to provide template records
const defaultCaseStudies = [
  {
    id: "case-1",
    status: "Active",
    featured: true,
    title: "Streamlining Front-Desk & Billing for Sea Breeze Luxury Hotel",
    slug: "sea-breeze-hotel",
    industry: "Hospitality",
    clientType: "3-Star Boutique Hotel (50 Rooms)",
    problem: "Manual recording of room reservation sheets and guest ledger entries causing massive delays during checkout|Frequent billing errors on room services and dining bills between front desk and Tally Prime",
    solution: "Deployed the Custom Hotel & Lodging Management System integrating reservation matrix, room services, and checkout invoicing directly in Tally Prime",
    results: "Checkout processing time cut down from 15 minutes to under 2 minutes|Eliminated manual bookkeeping discrepancies between front-office and audit staff|GST tax allocation reports compile instantly on demand",
    image: "",
    document: "",
    seoTitle: "Sea Breeze Hotel Checkout Automation Case Study - Harsh Infotech",
    seoDescription: "Read how Sea Breeze Hotel automated room reservations, service ledger billing, and checkout invoices with Tally Prime customizations."
  }
];

// Helper to compile sheets
function writeXlsx(filename: string, headers: string[], rows: any[]) {
  const filePath = path.join(editDir, filename);
  const wb = XLSX.utils.book_new();
  
  // Format rows to match headers exactly
  const formattedRows = rows.map(r => {
    const obj: any = {};
    headers.forEach(h => {
      obj[h] = r[h] !== undefined ? r[h] : '';
    });
    return obj;
  });
  
  const ws = XLSX.utils.json_to_sheet(formattedRows);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filePath);
  console.log(`Saved Excel sheet: edit/${filename} (Rows: ${rows.length})`);
}

// ── BOOTSTRAP EXCEL FILES ────────────────────────────────────
console.log('\nBootstrapping Excel content databases...');

// 1. customizations.xlsx
const customizationHeaders = [
  "ID", "Status", "Featured", "Module Name", "Slug", "Category", "Industry", 
  "Short Description", "Full Description", "Problem Solved", "Benefits", 
  "Features", "Workflow", "Compatibility", "Starting Price", "Related Items", 
  "Thumbnail Image", "Banner Image", "Document File", "WhatsApp CTA", 
  "SEO Title", "SEO Description", "Priority", "Tags", 
  "Created Date", "Updated Date", "Created By", "Updated By", "Owner"
];
const customizationRows = existingCustomizations.map((item, idx) => ({
  "ID": item.id,
  "Status": "Active",
  "Featured": item.featured ? "TRUE" : "FALSE",
  "Module Name": item.title,
  "Slug": item.slug,
  "Category": item.category,
  "Industry": item.industry,
  "Short Description": item.description,
  "Full Description": `Complete automation module tailored for the ${item.industry} industry. Integrates with standard Tally structures to compile operational parameters seamlessly.`,
  "Problem Solved": item.problemsSolved.join('|'),
  "Benefits": item.benefits.join('|'),
  "Features": item.features.join('|'),
  "Workflow": item.workflow.join('|'),
  "Compatibility": item.compatibility.join('|'),
  "Starting Price": item.price,
  "Related Items": "",
  "Thumbnail Image": item.image,
  "Banner Image": "",
  "Document File": "",
  "WhatsApp CTA": `Hi, I am interested in details and pricing for the Tally module: ${item.title}`,
  "SEO Title": `${item.title} - Tally Customizations | Harsh Infotech`,
  "SEO Description": `${item.title}: ${item.description}`,
  "Priority": String(10 - idx),
  "Tags": item.tags.join('|'),
  "Created Date": "2026-06-03",
  "Updated Date": "2026-06-03",
  "Created By": "System Bootstrap",
  "Updated By": "System Bootstrap",
  "Owner": "Harsh Infotech"
}));
writeXlsx("customizations.xlsx", customizationHeaders, customizationRows);

// 2. services.xlsx
const serviceHeaders = [
  "ID", "Status", "Featured", "Service Name", "Slug", "Category", "Description", 
  "Price", "Benefits", "Features", "Image", "Document", "Related Items", 
  "SEO Title", "SEO Description", "Priority", "Tags", 
  "Created Date", "Updated Date", "Created By", "Updated By", "Owner"
];
const serviceRows = existingServices.map((item, idx) => ({
  "ID": item.id,
  "Status": "Active",
  "Featured": idx < 3 ? "TRUE" : "FALSE",
  "Service Name": item.name,
  "Slug": item.slug,
  "Category": item.category,
  "Description": item.description,
  "Price": item.price,
  "Benefits": item.benefits.join('|'),
  "Features": item.features.join('|'),
  "Image": item.image,
  "Document": item.document,
  "Related Items": "",
  "SEO Title": item.seoTitle,
  "SEO Description": item.seoDescription,
  "Priority": String(10 - idx),
  "Tags": item.category === "Main" ? "Core Tally|Support" : "Infrastructure|IT Services",
  "Created Date": "2026-06-03",
  "Updated Date": "2026-06-03",
  "Created By": "System Bootstrap",
  "Updated By": "System Bootstrap",
  "Owner": "Harsh Infotech"
}));
writeXlsx("services.xlsx", serviceHeaders, serviceRows);

// 3. products.xlsx
const productHeaders = [
  "ID", "Status", "Featured", "Product Name", "Slug", "Brand", "Category", 
  "Description", "Price", "Specifications", "Image", "Datasheet", "Related Items", 
  "SEO Title", "SEO Description", "Priority", "Tags", 
  "Created Date", "Updated Date", "Created By", "Updated By", "Owner"
];
const productRows = existingProducts.map((item, idx) => ({
  "ID": item.id,
  "Status": "Active",
  "Featured": "TRUE",
  "Product Name": item.name,
  "Slug": item.slug,
  "Brand": item.brand,
  "Category": item.category,
  "Description": item.description,
  "Price": item.price,
  "Specifications": item.specifications.join('|'),
  "Image": item.image,
  "Datasheet": item.datasheet,
  "Related Items": "",
  "SEO Title": item.seoTitle,
  "SEO Description": item.seoDescription,
  "Priority": String(10 - idx),
  "Tags": "Hardware|Office Infrastructure",
  "Created Date": "2026-06-03",
  "Updated Date": "2026-06-03",
  "Created By": "System Bootstrap",
  "Updated By": "System Bootstrap",
  "Owner": "Harsh Infotech"
}));
writeXlsx("products.xlsx", productHeaders, productRows);

// 4. case-studies.xlsx
const caseStudyHeaders = [
  "ID", "Status", "Featured", "Title", "Slug", "Industry", "Client Type", 
  "Problem", "Solution", "Results", "Image", "Document", "Related Items", 
  "SEO Title", "SEO Description", "Priority", "Tags", 
  "Created Date", "Updated Date", "Created By", "Updated By", "Owner"
];
const caseStudyRows = defaultCaseStudies.map((item, idx) => ({
  "ID": item.id,
  "Status": "Active",
  "Featured": item.featured ? "TRUE" : "FALSE",
  "Title": item.title,
  "Slug": item.slug,
  "Industry": item.industry,
  "Client Type": item.clientType,
  "Problem": item.problem,
  "Solution": item.solution,
  "Results": item.results,
  "Image": item.image,
  "Document": item.document,
  "Related Items": "",
  "SEO Title": item.seoTitle,
  "SEO Description": item.seoDescription,
  "Priority": String(10 - idx),
  "Tags": "Success Story|Bespoke Customization",
  "Created Date": "2026-06-03",
  "Updated Date": "2026-06-03",
  "Created By": "System Bootstrap",
  "Updated By": "System Bootstrap",
  "Owner": "Harsh Infotech"
}));
writeXlsx("case-studies.xlsx", caseStudyHeaders, caseStudyRows);

// 5. testimonials.xlsx
const testimonialHeaders = ["ID", "Status", "Featured", "Name", "Role", "Initials", "Text"];
const testimonialRows = existingTestimonials.map(t => ({
  "ID": t.id,
  "Status": t.status,
  "Featured": t.featured ? "TRUE" : "FALSE",
  "Name": t.name,
  "Role": t.role,
  "Initials": t.initials,
  "Text": t.text
}));
writeXlsx("testimonials.xlsx", testimonialHeaders, testimonialRows);

// 6. faq.xlsx
const faqHeaders = ["ID", "Status", "Featured", "Category", "Question", "Answer"];
const faqRows = extractedFAQs.map(f => ({
  "ID": f.id,
  "Status": f.status,
  "Featured": f.featured ? "TRUE" : "FALSE",
  "Category": f.category,
  "Question": f.question,
  "Answer": f.answer
}));
writeXlsx("faq.xlsx", faqHeaders, faqRows);

// 7. pricing.xlsx
const pricingHeaders = ["ID", "Status", "Plan Name", "Service Slug", "Pricing Period", "Price", "Features", "Popular"];
const pricingRows = extractedPricing.map(p => ({
  "ID": p.id,
  "Status": p.status,
  "Plan Name": p.planName,
  "Service Slug": p.serviceSlug,
  "Pricing Period": p.pricingPeriod,
  "Price": p.price,
  "Features": p.features,
  "Popular": p.popular
}));
writeXlsx("pricing.xlsx", pricingHeaders, pricingRows);

// 8. offers.xlsx
const offerHeaders = ["ID", "Status", "Offer Name", "Slug", "Discount", "Description", "Coupon Code", "Expiry Date"];
const offerRows = existingOffers.map(o => ({
  "ID": o.id,
  "Status": o.status,
  "Offer Name": o.offerName,
  "Slug": o.slug,
  "Discount": o.discount,
  "Description": o.description,
  "Coupon Code": o.couponCode,
  "Expiry Date": o.expiryDate
}));
writeXlsx("offers.xlsx", offerHeaders, offerRows);

// 9. industries.xlsx
const industryHeaders = ["ID", "Status", "Industry Name", "Slug", "Description"];
const industryRows = existingIndustries.map(i => ({
  "ID": i.id,
  "Status": i.status,
  "Industry Name": i.industryName,
  "Slug": i.slug,
  "Description": i.description
}));
writeXlsx("industries.xlsx", industryHeaders, industryRows);

// 10. analytics-tags.xlsx
const analyticsHeaders = ["ID", "Category", "Industry", "Campaign", "Lead Source", "Tracking Tag"];
const analyticsRows = [
  { "ID": "tag-1", "Category": "Customizations", "Industry": "Hospitality", "Campaign": "Google Search Ads", "Lead Source": "WhatsApp Chat", "Tracking Tag": "G-XXXXX-HOSP" },
  { "ID": "tag-2", "Category": "Services", "Industry": "Retail", "Campaign": "Meta Lead Form", "Lead Source": "Contact Form", "Tracking Tag": "FB-PIXEL-RET" }
];
writeXlsx("analytics-tags.xlsx", analyticsHeaders, analyticsRows);

console.log('\n✅ CMS data bootstrapping successfully completed!');
