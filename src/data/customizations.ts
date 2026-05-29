export interface CustomizationModule {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  features: string[];
  benefits: string[];
  price: string;
  compatibility: string[];
  image: string;
  popular: boolean;
  featured: boolean;
  industry: string;
  tags: string[];
  problemsSolved: string[];
  workflow: string[];
  faq: { q: string; a: string; }[];
}

export const customizationsData: CustomizationModule[] = [
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
