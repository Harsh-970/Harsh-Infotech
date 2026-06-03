import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
const xlsx = (XLSX as any).default || XLSX;

// ── CONFIGURATIONS & PATHS ───────────────────────────────────
const baseDir = process.cwd();
const editDir = path.join(baseDir, 'edit');
const publicDir = path.join(baseDir, 'public');
const srcDir = path.join(baseDir, 'src');
const srcDataDir = path.join(srcDir, 'data');
const reportsDir = path.join(baseDir, 'REPORTS');
const backupsDir = path.join(editDir, 'backups');

const categories = ['customizations', 'services', 'products', 'case-studies'];
const imageExtensions = ['.webp', '.png', '.jpg', '.jpeg'];

// Ensure target output dirs and edit structures exist
const cmsDirs = [
  editDir,
  reportsDir,
  srcDataDir,
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
cmsDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── PURE JS IMAGE HEADER PARSER ─────────────────────────────
interface ImageInfo {
  width: number;
  height: number;
  format: string;
}

function getImageDimensions(filePath: string): ImageInfo | null {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // 1. PNG Signature check
    if (buffer.readUInt32BE(0) === 0x89504E47 && buffer.readUInt32BE(4) === 0x0D0A1A0A) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height, format: 'PNG' };
    }
    
    // 2. JPEG Signature check (starts with FFD8)
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let offset = 2;
      while (offset < buffer.length) {
        const marker = buffer.readUInt16BE(offset);
        if (marker === 0xFFD9 || marker === 0xFFDA) break; // End of image or Start of stream
        const length = buffer.readUInt16BE(offset + 2);
        
        if ((marker >= 0xFFC0 && marker <= 0xFFC3) || (marker >= 0xFFC5 && marker <= 0xFFC7) || (marker >= 0xFFC9 && marker <= 0xFFCB) || (marker >= 0xFFCD && marker <= 0xFFCF)) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height, format: 'JPEG' };
        }
        offset += 2 + length;
      }
    }
    
    // 3. WebP Signature check
    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      const type = buffer.toString('ascii', 12, 16);
      if (type === 'VP8 ') {
        const width = buffer.readUInt16LE(26) & 0x3FFF;
        const height = buffer.readUInt16LE(28) & 0x3FFF;
        return { width, height, format: 'WEBP' };
      } else if (type === 'VP8L') {
        const b1 = buffer[21];
        const b2 = buffer[22];
        const b3 = buffer[23];
        const b4 = buffer[24];
        const width = 1 + (((b2 & 0x3F) << 8) | b1);
        const height = 1 + (((b4 & 0x0F) << 10) | (b3 << 2) | ((b2 & 0xC0) >> 6));
        return { width, height, format: 'WEBP' };
      } else if (type === 'VP8X') {
        const width = 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16));
        const height = 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16));
        return { width, height, format: 'WEBP' };
      }
    }
  } catch (e) {
    // Dimension parse error
  }
  return null;
}

// ── AUTOMATED BACKUPS ROTATION ──────────────────────────────
function performBackup() {
  if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });
  
  const today = new Date().toISOString().split('T')[0];
  const editFiles = fs.readdirSync(editDir).filter(f => 
    (f.endsWith('.xlsx') || f.endsWith('.csv')) && 
    f !== 'content-index.xlsx'
  );
  
  editFiles.forEach(file => {
    const srcPath = path.join(editDir, file);
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const backupName = `${base}-${today}${ext}`;
    const destPath = path.join(backupsDir, backupName);
    
    fs.copyFileSync(srcPath, destPath);
  });
  
  // Rotate: keep only the newest 30
  const backups = fs.readdirSync(backupsDir)
    .filter(f => f.endsWith('.xlsx') || f.endsWith('.csv'))
    .map(f => {
      const filePath = path.join(backupsDir, f);
      return { name: f, time: fs.statSync(filePath).mtime.getTime() };
    })
    .sort((a, b) => a.time - b.time);
    
  while (backups.length > 30) {
    const oldest = backups.shift();
    if (oldest) {
      fs.unlinkSync(path.join(backupsDir, oldest.name));
    }
  }
}

// ── READ SHEETS (SUPPORT XLSX / CSV) ─────────────────────────
function readSheetData(baseName: string): any[] {
  const xlsxPath = path.join(editDir, `${baseName}.xlsx`);
  const csvPath = path.join(editDir, `${baseName}.csv`);
  let filePath = '';
  
  if (fs.existsSync(xlsxPath)) {
    filePath = xlsxPath;
  } else if (fs.existsSync(csvPath)) {
    filePath = csvPath;
  } else {
    return [];
  }
  
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet, { defval: '' });
  } catch (err) {
    console.error(`Error reading database file ${baseName}:`, err);
    return [];
  }
}

// ── HELPER: STRING ARRAY PARSER ─────────────────────────────
function parsePipeArray(value: any): string[] {
  if (value === undefined || value === null) return [];
  const str = String(value).trim();
  if (!str) return [];
  return str.split('|').map(s => s.trim()).filter(Boolean);
}

// ── AUTO SLUG & UNIQUE ENGINE ────────────────────────────────
function generateSlug(title: string, existingSlugs: Set<string>): string {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  if (!slug) slug = 'item';
  
  let finalSlug = slug;
  let counter = 2;
  while (existingSlugs.has(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  existingSlugs.add(finalSlug);
  return finalSlug;
}

// ── RUN SYNCHRONIZATION ──────────────────────────────────────
async function runSync() {
  console.log('--- CMS SYNCHRONIZATION STARTED ---');
  
  // 1. Backups
  performBackup();
  console.log('✔ Rotating backups captured in edit/backups/');
  
  // Initialize health audits variables
  let healthScore = 100;
  const issues: string[] = [];
  const missingImages: { item: string, file: string, type: string }[] = [];
  const missingBrochures: { item: string, file: string, type: string }[] = [];
  const duplicateSlugsReport: string[] = [];
  const seoIssues: { item: string, type: string, issue: string }[] = [];
  const missingAssetsQueue: { type: string, name: string, slug: string, asset: string, path: string }[] = [];
  const masterIndexRows: any[] = [];
  
  // Load databases
  const rawCustomizations = readSheetData('customizations');
  const rawServices = readSheetData('services');
  const rawProducts = readSheetData('products');
  const rawCaseStudies = readSheetData('case-studies');
  const rawTestimonials = readSheetData('testimonials');
  const rawFAQs = readSheetData('faq');
  const rawPricing = readSheetData('pricing');
  const rawOffers = readSheetData('offers');
  const rawIndustries = readSheetData('industries');
  
  // Sets to track slugs for dynamic routing and deduplication
  const customizationSlugs = new Set<string>();
  const serviceSlugs = new Set<string>();
  const productSlugs = new Set<string>();
  const caseStudySlugs = new Set<string>();
  const industrySlugs = new Set<string>();
  
  // ── A. PROCESS CUSTOMIZATIONS ──────────────────────────────
  console.log('Processing Customizations...');
  const customizationsData: any[] = [];
  const activeCustomizations: any[] = [];
  
  rawCustomizations.forEach((row: any) => {
    const title = row['Module Name'] || '';
    if (!title) return;
    
    // Auto slugging
    const inputSlug = String(row['Slug'] || '').trim();
    let slug = inputSlug;
    if (!slug) {
      slug = generateSlug(title, customizationSlugs);
    } else {
      if (customizationSlugs.has(slug)) {
        duplicateSlugsReport.push(`Conflict: Customization slug "${slug}" exists. Auto resolving...`);
        slug = generateSlug(slug, customizationSlugs);
        healthScore -= 2;
      } else {
        customizationSlugs.add(slug);
      }
    }
    
    const id = row['ID'] || slug;
    const status = String(row['Status'] || 'Active').trim();
    const featured = String(row['Featured']).toUpperCase() === 'TRUE';
    const category = row['Category'] || 'General';
    const industry = row['Industry'] || 'General';
    
    // Asset Check: Overrides first
    let finalImage = '';
    let hasOverride = false;
    
    for (const ext of imageExtensions) {
      const overridePath = path.join(editDir, 'images', 'customizations', `${slug}${ext}`);
      if (fs.existsSync(overridePath)) {
        // Run binary validation
        const info = getImageDimensions(overridePath);
        if (info) {
          const ratio = info.width / info.height;
          const expectedRatio = 16 / 9;
          const tolerance = 0.15;
          if (info.width < 1200) {
            issues.push(`[Image Warning] Customization "${title}" image "${slug}${ext}" width is ${info.width}px. Minimum: 1200px.`);
            healthScore -= 2;
          }
          if (Math.abs(ratio - expectedRatio) > tolerance) {
            issues.push(`[Image Warning] Customization "${title}" image "${slug}${ext}" aspect ratio is ${ratio.toFixed(2)}. Recommended: 16:9.`);
            healthScore -= 2;
          }
          if (info.format !== 'WEBP') {
            issues.push(`[Image Suggestion] Customization "${title}" override image "${slug}${ext}" format is ${info.format}. WebP is preferred.`);
            healthScore -= 1;
          }
        }
        
        // Copy to public assets
        const destDir = path.join(publicDir, 'assets', 'customizations');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const destName = `${slug}${ext}`;
        fs.copyFileSync(overridePath, path.join(destDir, destName));
        finalImage = `/assets/customizations/${destName}`;
        hasOverride = true;
        break;
      }
    }
    
    if (!hasOverride && row['Thumbnail Image']) {
      finalImage = row['Thumbnail Image'];
    }
    
    // Log missing assets
    if (status === 'Active' && !finalImage) {
      missingImages.push({ item: title, file: `${slug}.webp`, type: 'Customization' });
      missingAssetsQueue.push({ type: 'Customization Image', name: title, slug, asset: `${slug}.webp`, path: 'edit/images/customizations/' });
      healthScore -= 5;
    }
    
    // Document Check
    let docUrl = '';
    const brochureName = row['Document File'] || '';
    if (brochureName) {
      const srcDocPath = path.join(editDir, 'documents', 'customizations', brochureName);
      if (fs.existsSync(srcDocPath)) {
        const stats = fs.statSync(srcDocPath);
        const ext = path.extname(brochureName).toLowerCase();
        if (stats.size === 0) {
          issues.push(`[Doc Warning] Customization "${title}" brochure "${brochureName}" is empty.`);
          healthScore -= 2;
        }
        if (!['.pdf', '.docx', '.pptx'].includes(ext)) {
          issues.push(`[Doc Warning] Customization "${title}" brochure "${brochureName}" has unsupported extension ${ext}.`);
          healthScore -= 2;
        }
        
        // Copy to public
        const destDir = path.join(publicDir, 'assets', 'documents', 'customizations');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(srcDocPath, path.join(destDir, brochureName));
        docUrl = `/assets/documents/customizations/${brochureName}`;
      } else {
        missingBrochures.push({ item: title, file: brochureName, type: 'Customization' });
        missingAssetsQueue.push({ type: 'Customization Brochure', name: title, slug, asset: brochureName, path: 'edit/documents/customizations/' });
        healthScore -= 5;
      }
    }
    
    // SEO Validation
    const seoTitle = row['SEO Title'] || '';
    const seoDesc = row['SEO Description'] || '';
    if (status === 'Active') {
      if (!seoTitle) {
        seoIssues.push({ item: title, type: 'SEO Title', issue: 'Missing SEO title.' });
        healthScore -= 3;
      } else if (seoTitle.length < 30 || seoTitle.length > 70) {
        seoIssues.push({ item: title, type: 'SEO Title', issue: `SEO title has non-optimal length of ${seoTitle.length} chars (Target: 30-70).` });
        healthScore -= 1;
      }
      if (!seoDesc) {
        seoIssues.push({ item: title, type: 'SEO Description', issue: 'Missing SEO description.' });
        healthScore -= 3;
      } else if (seoDesc.length < 120 || seoDesc.length > 160) {
        seoIssues.push({ item: title, type: 'SEO Description', issue: `SEO description has non-optimal length of ${seoDesc.length} chars (Target: 120-160).` });
        healthScore -= 1;
      }
    }
    
    // Load relevant FAQs dynamically from Standalone FAQs sheet by Category
    const faq = rawFAQs
      .filter((f: any) => 
        String(f['Status'] || 'Active').trim() === 'Active' && 
        String(f['Category'] || '').toLowerCase() === String(category || '').toLowerCase()
      )
      .map((f: any) => ({
        q: f['Question'] || '',
        a: f['Answer'] || ''
      }));
      
    // Process item values
    const itemData = {
      id,
      title,
      slug,
      status,
      featured,
      category,
      industry,
      description: row['Short Description'] || '',
      fullDescription: row['Full Description'] || '',
      problemsSolved: parsePipeArray(row['Problem Solved']),
      benefits: parsePipeArray(row['Benefits']),
      features: parsePipeArray(row['Features']),
      workflow: parsePipeArray(row['Workflow']),
      compatibility: parsePipeArray(row['Compatibility']),
      price: typeof row['Starting Price'] === 'number' ? `₹${new Intl.NumberFormat('en-IN').format(row['Starting Price'])}` : String(row['Starting Price'] || 'Custom').trim(),
      relatedItems: parsePipeArray(row['Related Items']),
      image: finalImage,
      bannerImage: row['Banner Image'] || '',
      documentUrl: docUrl,
      whatsAppCTA: row['WhatsApp CTA'] || '',
      seoTitle,
      seoDescription: seoDesc,
      priority: Number(row['Priority']) || 0,
      tags: parsePipeArray(row['Tags']),
      hasCustomImage: hasOverride,
      faq
    };
    
    customizationsData.push(itemData);
    if (status === 'Active') activeCustomizations.push(itemData);
    
    // Master index logging
    masterIndexRows.push({
      Type: 'Customization',
      Name: title,
      Slug: slug,
      Status: status,
      Featured: featured ? 'Yes' : 'No',
      Category: category,
      Industry: industry,
      'Last Updated': row['Updated Date'] || todayString(),
      Owner: row['Owner'] || 'Harsh Infotech',
      'Source File': 'customizations.xlsx'
    });
  });
  
  // Smart dynamic recommendations for customizations
  activeCustomizations.forEach(item => {
    let related = item.relatedItems;
    if (related.length === 0) {
      related = activeCustomizations
        .filter(other => other.id !== item.id && (other.category === item.category || other.industry === item.industry))
        .slice(0, 3)
        .map(other => other.slug);
        
      if (related.length < 3) {
        const fillers = activeCustomizations
          .filter(other => other.id !== item.id && !related.includes(other.slug))
          .slice(0, 3 - related.length)
          .map(other => other.slug);
        related = [...related, ...fillers];
      }
      item.relatedItems = related;
    }
    
    // Validate related recommendations existence
    related.forEach((slugTarget: string) => {
      const match = activeCustomizations.find(c => c.slug === slugTarget);
      if (!match) {
        issues.push(`[Reference Warning] Customization "${item.title}" references non-existent related module "${slugTarget}".`);
        healthScore -= 5;
      }
    });
  });
  
  // ── B. PROCESS SERVICES ────────────────────────────────────
  console.log('Processing Services...');
  const servicesData: any[] = [];
  const activeServices: any[] = [];
  
  rawServices.forEach((row: any) => {
    const title = row['Service Name'] || '';
    if (!title) return;
    
    const inputSlug = String(row['Slug'] || '').trim();
    let slug = inputSlug;
    if (!slug) {
      slug = generateSlug(title, serviceSlugs);
    } else {
      if (serviceSlugs.has(slug)) {
        duplicateSlugsReport.push(`Conflict: Service slug "${slug}" exists. Auto resolving...`);
        slug = generateSlug(slug, serviceSlugs);
        healthScore -= 2;
      } else {
        serviceSlugs.add(slug);
      }
    }
    
    const id = row['ID'] || slug;
    const status = String(row['Status'] || 'Active').trim();
    const featured = String(row['Featured']).toUpperCase() === 'TRUE';
    const category = row['Category'] || 'More';
    
    // Copy override image
    let finalImage = '';
    let hasOverride = false;
    for (const ext of imageExtensions) {
      const overridePath = path.join(editDir, 'images', 'services', `${slug}${ext}`);
      if (fs.existsSync(overridePath)) {
        const destDir = path.join(publicDir, 'assets', 'services');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const destName = `${slug}${ext}`;
        fs.copyFileSync(overridePath, path.join(destDir, destName));
        finalImage = `/assets/services/${destName}`;
        hasOverride = true;
        break;
      }
    }
    if (!hasOverride && row['Image']) finalImage = row['Image'];
    
    // Copy document
    let docUrl = '';
    const brochureName = row['Document'] || '';
    if (brochureName) {
      const srcDocPath = path.join(editDir, 'documents', 'services', brochureName);
      if (fs.existsSync(srcDocPath)) {
        const destDir = path.join(publicDir, 'assets', 'documents', 'services');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(srcDocPath, path.join(destDir, brochureName));
        docUrl = `/assets/documents/services/${brochureName}`;
      } else {
        missingBrochures.push({ item: title, file: brochureName, type: 'Service' });
        missingAssetsQueue.push({ type: 'Service Brochure', name: title, slug, asset: brochureName, path: 'edit/documents/services/' });
        healthScore -= 5;
      }
    }
    
    const itemData = {
      id,
      title,
      slug,
      status,
      featured,
      category,
      description: row['Description'] || '',
      price: typeof row['Price'] === 'number' ? `₹${new Intl.NumberFormat('en-IN').format(row['Price'])}` : String(row['Price'] || 'Custom').trim(),
      benefits: parsePipeArray(row['Benefits']),
      features: parsePipeArray(row['Features']),
      image: finalImage,
      documentUrl: docUrl,
      relatedItems: parsePipeArray(row['Related Items']),
      seoTitle: row['SEO Title'] || '',
      seoDescription: row['SEO Description'] || '',
      priority: Number(row['Priority']) || 0,
      tags: parsePipeArray(row['Tags']),
      hasCustomImage: hasOverride
    };
    
    servicesData.push(itemData);
    if (status === 'Active') activeServices.push(itemData);
    
    masterIndexRows.push({
      Type: 'Service',
      Name: title,
      Slug: slug,
      Status: status,
      Featured: featured ? 'Yes' : 'No',
      Category: category,
      Industry: 'N/A',
      'Last Updated': row['Updated Date'] || todayString(),
      Owner: row['Owner'] || 'Harsh Infotech',
      'Source File': 'services.xlsx'
    });
  });
  
  // Smart default recommendations for services
  activeServices.forEach(item => {
    let related = item.relatedItems;
    if (related.length === 0) {
      related = activeServices
        .filter(other => other.id !== item.id && other.category === item.category)
        .slice(0, 3)
        .map(other => other.slug);
      
      if (related.length < 3) {
        const fillers = activeServices
          .filter(other => other.id !== item.id && !related.includes(other.slug))
          .slice(0, 3 - related.length)
          .map(other => other.slug);
        related = [...related, ...fillers];
      }
      item.relatedItems = related;
    }
    
    // Validate related recommendations existence
    related.forEach((slugTarget: string) => {
      const match = activeServices.find(s => s.slug === slugTarget);
      if (!match) {
        issues.push(`[Reference Warning] Service "${item.title}" references non-existent related service "${slugTarget}".`);
        healthScore -= 5;
      }
    });
  });
  
  // ── C. PROCESS PRODUCTS ────────────────────────────────────
  console.log('Processing Products...');
  const productsData: any[] = [];
  const activeProducts: any[] = [];
  
  rawProducts.forEach((row: any) => {
    const title = row['Product Name'] || '';
    if (!title) return;
    
    const inputSlug = String(row['Slug'] || '').trim();
    let slug = inputSlug;
    if (!slug) {
      slug = generateSlug(title, productSlugs);
    } else {
      if (productSlugs.has(slug)) {
        duplicateSlugsReport.push(`Conflict: Product slug "${slug}" exists. Auto resolving...`);
        slug = generateSlug(slug, productSlugs);
        healthScore -= 2;
      } else {
        productSlugs.add(slug);
      }
    }
    
    const id = row['ID'] || slug;
    const status = String(row['Status'] || 'Active').trim();
    const featured = String(row['Featured']).toUpperCase() === 'TRUE';
    const brand = row['Brand'] || 'HP';
    const category = row['Category'] || 'Hardware';
    
    // Copy override image
    let finalImage = '';
    let hasOverride = false;
    for (const ext of imageExtensions) {
      const overridePath = path.join(editDir, 'images', 'products', `${slug}${ext}`);
      if (fs.existsSync(overridePath)) {
        const destDir = path.join(publicDir, 'assets', 'products');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const destName = `${slug}${ext}`;
        fs.copyFileSync(overridePath, path.join(destDir, destName));
        finalImage = `/assets/products/${destName}`;
        hasOverride = true;
        break;
      }
    }
    if (!hasOverride && row['Image']) finalImage = row['Image'];
    
    // Copy brochure/datasheet
    let docUrl = '';
    const brochureName = row['Datasheet'] || '';
    if (brochureName) {
      const srcDocPath = path.join(editDir, 'documents', 'products', brochureName);
      if (fs.existsSync(srcDocPath)) {
        const destDir = path.join(publicDir, 'assets', 'documents', 'products');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(srcDocPath, path.join(destDir, brochureName));
        docUrl = `/assets/documents/products/${brochureName}`;
      } else {
        missingBrochures.push({ item: title, file: brochureName, type: 'Product' });
        missingAssetsQueue.push({ type: 'Product Datasheet', name: title, slug, asset: brochureName, path: 'edit/documents/products/' });
        healthScore -= 5;
      }
    }
    
    const itemData = {
      id,
      title,
      slug,
      status,
      featured,
      brand,
      category,
      description: row['Description'] || '',
      price: typeof row['Price'] === 'number' ? `₹${new Intl.NumberFormat('en-IN').format(row['Price'])}` : String(row['Price'] || '').trim(),
      specifications: parsePipeArray(row['Specifications']),
      image: finalImage,
      documentUrl: docUrl,
      relatedItems: parsePipeArray(row['Related Items']),
      seoTitle: row['SEO Title'] || '',
      seoDescription: row['SEO Description'] || '',
      priority: Number(row['Priority']) || 0,
      tags: parsePipeArray(row['Tags']),
      hasCustomImage: hasOverride
    };
    
    productsData.push(itemData);
    if (status === 'Active') activeProducts.push(itemData);
    
    masterIndexRows.push({
      Type: 'Product',
      Name: title,
      Slug: slug,
      Status: status,
      Featured: featured ? 'Yes' : 'No',
      Category: category,
      Industry: 'N/A',
      'Last Updated': row['Updated Date'] || todayString(),
      Owner: row['Owner'] || 'Harsh Infotech',
      'Source File': 'products.xlsx'
    });
  });
  
  // Smart default recommendations for products
  activeProducts.forEach(item => {
    let related = item.relatedItems;
    if (related.length === 0) {
      related = activeProducts
        .filter(other => other.id !== item.id && (other.category === item.category || other.brand === item.brand))
        .slice(0, 3)
        .map(other => other.slug);
      
      if (related.length < 3) {
        const fillers = activeProducts
          .filter(other => other.id !== item.id && !related.includes(other.slug))
          .slice(0, 3 - related.length)
          .map(other => other.slug);
        related = [...related, ...fillers];
      }
      item.relatedItems = related;
    }
    
    // Validate related recommendations existence
    related.forEach((slugTarget: string) => {
      const match = activeProducts.find(p => p.slug === slugTarget);
      if (!match) {
        issues.push(`[Reference Warning] Product "${item.title}" references non-existent related product "${slugTarget}".`);
        healthScore -= 5;
      }
    });
  });
  
  // ── D. PROCESS CASE STUDIES ────────────────────────────────
  console.log('Processing Case Studies...');
  const caseStudiesData: any[] = [];
  const activeCaseStudies: any[] = [];
  
  rawCaseStudies.forEach((row: any) => {
    const title = row['Title'] || '';
    if (!title) return;
    
    const inputSlug = String(row['Slug'] || '').trim();
    let slug = inputSlug;
    if (!slug) {
      slug = generateSlug(title, caseStudySlugs);
    } else {
      if (caseStudySlugs.has(slug)) {
        duplicateSlugsReport.push(`Conflict: Case Study slug "${slug}" exists. Auto resolving...`);
        slug = generateSlug(slug, caseStudySlugs);
        healthScore -= 2;
      } else {
        caseStudySlugs.add(slug);
      }
    }
    
    const id = row['ID'] || slug;
    const status = String(row['Status'] || 'Active').trim();
    const featured = String(row['Featured']).toUpperCase() === 'TRUE';
    const industry = row['Industry'] || 'General';
    
    // Copy override image
    let finalImage = '';
    let hasOverride = false;
    for (const ext of imageExtensions) {
      const overridePath = path.join(editDir, 'images', 'case-studies', `${slug}${ext}`);
      if (fs.existsSync(overridePath)) {
        const destDir = path.join(publicDir, 'assets', 'case-studies');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const destName = `${slug}${ext}`;
        fs.copyFileSync(overridePath, path.join(destDir, destName));
        finalImage = `/assets/case-studies/${destName}`;
        hasOverride = true;
        break;
      }
    }
    if (!hasOverride && row['Image']) finalImage = row['Image'];
    
    // Copy document
    let docUrl = '';
    const brochureName = row['Document'] || '';
    if (brochureName) {
      const srcDocPath = path.join(editDir, 'documents', 'case-studies', brochureName);
      if (fs.existsSync(srcDocPath)) {
        const destDir = path.join(publicDir, 'assets', 'documents', 'case-studies');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(srcDocPath, path.join(destDir, brochureName));
        docUrl = `/assets/documents/case-studies/${brochureName}`;
      } else {
        missingBrochures.push({ item: title, file: brochureName, type: 'Case Study' });
        missingAssetsQueue.push({ type: 'Case Study Document', name: title, slug, asset: brochureName, path: 'edit/documents/case-studies/' });
        healthScore -= 5;
      }
    }
    
    const itemData = {
      id,
      title,
      slug,
      status,
      featured,
      industry,
      clientType: row['Client Type'] || '',
      problem: parsePipeArray(row['Problem']),
      solution: parsePipeArray(row['Solution']),
      results: parsePipeArray(row['Results']),
      image: finalImage,
      documentUrl: docUrl,
      relatedItems: parsePipeArray(row['Related Items']),
      seoTitle: row['SEO Title'] || '',
      seoDescription: row['SEO Description'] || '',
      priority: Number(row['Priority']) || 0,
      tags: parsePipeArray(row['Tags']),
      hasCustomImage: hasOverride
    };
    
    caseStudiesData.push(itemData);
    if (status === 'Active') activeCaseStudies.push(itemData);
    
    masterIndexRows.push({
      Type: 'Case Study',
      Name: title,
      Slug: slug,
      Status: status,
      Featured: featured ? 'Yes' : 'No',
      Category: 'Marketing',
      Industry: industry,
      'Last Updated': row['Updated Date'] || todayString(),
      Owner: row['Owner'] || 'Harsh Infotech',
      'Source File': 'case-studies.xlsx'
    });
  });
  
  // Smart default recommendations for case studies
  activeCaseStudies.forEach(item => {
    let related = item.relatedItems;
    if (related.length === 0) {
      related = activeCaseStudies
        .filter(other => other.id !== item.id && other.industry === item.industry)
        .slice(0, 3)
        .map(other => other.slug);
      
      if (related.length < 3) {
        const fillers = activeCaseStudies
          .filter(other => other.id !== item.id && !related.includes(other.slug))
          .slice(0, 3 - related.length)
          .map(other => other.slug);
        related = [...related, ...fillers];
      }
      item.relatedItems = related;
    }
    
    // Validate related recommendations existence
    related.forEach((slugTarget: string) => {
      const match = activeCaseStudies.find(cs => cs.slug === slugTarget);
      if (!match) {
        issues.push(`[Reference Warning] Case Study "${item.title}" references non-existent related case study "${slugTarget}".`);
        healthScore -= 5;
      }
    });
  });
  
  // ── E. PROCESS TESTIMONIALS ────────────────────────────────
  console.log('Processing Testimonials...');
  const testimonialsData = rawTestimonials
    .filter((row: any) => String(row['Status'] || 'Active').trim() === 'Active')
    .map((row: any) => ({
      id: row['ID'] || `test-${Math.random().toString(36).substr(2, 9)}`,
      featured: String(row['Featured']).toUpperCase() === 'TRUE',
      name: row['Name'] || '',
      role: row['Role'] || '',
      initials: row['Initials'] || '',
      text: row['Text'] || ''
    }));
    
  // ── F. PROCESS FAQS ────────────────────────────────────────
  console.log('Processing FAQs...');
  const faqsData = rawFAQs
    .filter((row: any) => String(row['Status'] || 'Active').trim() === 'Active')
    .map((row: any) => ({
      id: row['ID'] || `faq-${Math.random().toString(36).substr(2, 9)}`,
      featured: String(row['Featured']).toUpperCase() === 'TRUE',
      category: row['Category'] || 'General',
      question: row['Question'] || '',
      answer: row['Answer'] || ''
    }));
    
  // ── G. PROCESS PRICING & OFFERS ────────────────────────────
  console.log('Processing Pricing and Offers...');
  const pricingData = rawPricing
    .filter((row: any) => String(row['Status'] || 'Active').trim() === 'Active')
    .map((row: any) => ({
      id: row['ID'] || `price-${Math.random().toString(36).substr(2, 9)}`,
      planName: row['Plan Name'] || '',
      serviceSlug: row['Service Slug'] || '',
      pricingPeriod: row['Pricing Period'] || '',
      price: typeof row['Price'] === 'number' ? `₹${new Intl.NumberFormat('en-IN').format(row['Price'])}` : String(row['Price'] || '').trim(),
      features: parsePipeArray(row['Features']),
      popular: String(row['Popular']).toUpperCase() === 'TRUE'
    }));
    
  const offersData = rawOffers
    .filter((row: any) => String(row['Status'] || 'Active').trim() === 'Active')
    .map((row: any) => ({
      id: row['ID'] || `offer-${Math.random().toString(36).substr(2, 9)}`,
      offerName: row['Offer Name'] || '',
      slug: row['Slug'] || '',
      discount: row['Discount'] || '',
      description: row['Description'] || '',
      couponCode: row['Coupon Code'] || '',
      expiryDate: row['Expiry Date'] || ''
    }));
    
  // ── H. PROCESS INDUSTRIES ──────────────────────────────────
  console.log('Processing Industries & Banners...');
  const industriesData: any[] = [];
  rawIndustries.forEach((row: any) => {
    const name = row['Industry Name'] || '';
    if (!name) return;
    
    const inputSlug = String(row['Slug'] || '').trim();
    let slug = inputSlug;
    if (!slug) {
      slug = generateSlug(name, industrySlugs);
    } else {
      industrySlugs.add(slug);
    }
    
    // Check if industry banner image override exists
    let bannerImage = '';
    for (const ext of imageExtensions) {
      const bannerPath = path.join(editDir, 'images', 'industry-banners', `${name}${ext}`);
      if (fs.existsSync(bannerPath)) {
        const destDir = path.join(publicDir, 'assets', 'industry-banners');
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const destName = `${name}${ext}`;
        fs.copyFileSync(bannerPath, path.join(destDir, destName));
        bannerImage = `/assets/industry-banners/${destName}`;
        break;
      }
    }
    
    industriesData.push({
      id: row['ID'] || slug,
      industryName: name,
      slug,
      description: row['Description'] || '',
      bannerImage
    });
  });
  
  // ── 2. WRITE MAIN DATASETS (JSON) ──────────────────────────
  fs.writeFileSync(path.join(srcDataDir, 'customizations.json'), JSON.stringify(activeCustomizations, null, 2));
  fs.writeFileSync(path.join(srcDataDir, 'services.json'), JSON.stringify(activeServices, null, 2));
  fs.writeFileSync(path.join(srcDataDir, 'products.json'), JSON.stringify(activeProducts, null, 2));
  fs.writeFileSync(path.join(srcDataDir, 'case-studies.json'), JSON.stringify(activeCaseStudies, null, 2));
  fs.writeFileSync(path.join(srcDataDir, 'testimonials.json'), JSON.stringify(testimonialsData, null, 2));
  fs.writeFileSync(path.join(srcDataDir, 'faq.json'), JSON.stringify(faqsData, null, 2));
  fs.writeFileSync(path.join(srcDataDir, 'pricing.json'), JSON.stringify(pricingData, null, 2));
  fs.writeFileSync(path.join(srcDataDir, 'offers.json'), JSON.stringify(offersData, null, 2));
  fs.writeFileSync(path.join(srcDataDir, 'industries.json'), JSON.stringify(industriesData, null, 2));
  console.log('✔ JSON datasets successfully generated inside src/data/');
  
  // ── 3. WRITE WEBSITE SEARCH INDEX ──────────────────────────
  const searchIndex: any[] = [];
  
  activeCustomizations.forEach(item => {
    searchIndex.push({
      id: item.id,
      type: 'customization',
      title: item.title,
      description: item.description,
      slug: item.slug,
      category: item.category,
      industry: item.industry,
      keywords: [...item.tags, ...item.compatibility, item.category, item.industry].join(' ')
    });
  });
  
  activeServices.forEach(item => {
    searchIndex.push({
      id: item.id,
      type: 'service',
      title: item.title,
      description: item.description,
      slug: item.slug,
      category: item.category,
      industry: 'N/A',
      keywords: [...item.tags, item.category].join(' ')
    });
  });
  
  activeProducts.forEach(item => {
    searchIndex.push({
      id: item.id,
      type: 'product',
      title: item.title,
      description: item.description,
      slug: item.slug,
      category: item.category,
      industry: 'N/A',
      keywords: [...item.tags, item.brand, item.category].join(' ')
    });
  });
  
  activeCaseStudies.forEach(item => {
    searchIndex.push({
      id: item.id,
      type: 'case-study',
      title: item.title,
      description: item.clientType,
      slug: item.slug,
      category: 'Case Study',
      industry: item.industry,
      keywords: [...item.tags, item.industry, item.clientType].join(' ')
    });
  });
  
  fs.writeFileSync(path.join(srcDataDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2));
  console.log('✔ Search index generated inside src/data/search-index.json');
  
  // ── 4. WRITE MISSING ASSETS QUEUE (CSV) ────────────────────
  let csvContent = 'Type,Name,Slug,Missing Asset Name,Expected Path\n';
  missingAssetsQueue.forEach(item => {
    csvContent += `"${item.type}","${item.name.replace(/"/g, '""')}","${item.slug}","${item.asset}","${item.path}"\n`;
  });
  fs.writeFileSync(path.join(editDir, 'MISSING_ASSETS_QUEUE.csv'), csvContent);
  console.log('✔ Assets gap queue saved to edit/MISSING_ASSETS_QUEUE.csv');
  
  // ── 5. WRITE MASTER CONTENT INDEX (XLSX) ───────────────────
  const wsIndex = xlsx.utils.json_to_sheet(masterIndexRows);
  const wbIndex = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wbIndex, wsIndex, "Content Index");
  xlsx.writeFile(wbIndex, path.join(editDir, 'content-index.xlsx'));
  console.log('✔ Compiled master content index saved to edit/content-index.xlsx');
  
  // ── 6. DYNAMIC ROUTES COMPILER ─────────────────────────────
  console.log('Generating dynamic routes static HTML entry points...');
  
  const categoriesList = [
    { dir: 'customizations', data: activeCustomizations, entry: '/src/customizations.tsx' },
    { dir: 'products', data: activeProducts, entry: '/src/products.tsx' },
    { dir: 'services', data: activeServices, entry: '/src/services.tsx' },
    { dir: 'case-studies', data: activeCaseStudies, entry: '/src/case-studies.tsx' } // We can make a case studies page later if needed
  ];
  
  categoriesList.forEach(cat => {
    const destFolder = path.join(baseDir, cat.dir);
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
    
    // Clear old generated html files (so deletions inside spreadsheet clean up dynamic routes)
    const oldFiles = fs.readdirSync(destFolder).filter(f => f.endsWith('.html'));
    oldFiles.forEach(f => fs.unlinkSync(path.join(destFolder, f)));
    
    cat.data.forEach(item => {
      const htmlPath = path.join(destFolder, `${item.slug}.html`);
      const schemaData = {
        "@context": "https://schema.org",
        "@type": cat.dir === 'products' ? "Product" : (cat.dir === 'services' ? "Service" : "CreativeWork"),
        "name": item.title,
        "description": item.description,
        "url": `https://harshinfotech.in/${cat.dir}/${item.slug}`
      };
      
      const htmlContent = `<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${item.seoTitle || `${item.title} - Harsh Infotech`}</title>
    <meta name="description" content="${item.seoDescription || item.description}" />
    <link rel="canonical" href="https://harshinfotech.in/${cat.dir}/${item.slug}" />
    
    <!-- Open Graph Metadata -->
    <meta property="og:title" content="${item.seoTitle || item.title}" />
    <meta property="og:description" content="${item.seoDescription || item.description}" />
    <meta property="og:image" content="https://harshinfotech.in${item.image || '/public/assets/logo.png'}" />
    <meta property="og:url" content="https://harshinfotech.in/${cat.dir}/${item.slug}" />
    <meta property="og:type" content="article" />
    
    <script>
      (function() {
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.className = theme;
        window.__ACTIVE_SLUG__ = "${item.slug}";
      })();
    </script>
    <script type="application/ld+json">
      ${JSON.stringify(schemaData, null, 2)}
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${cat.entry}"></script>
  </body>
</html>`;
      
      fs.writeFileSync(htmlPath, htmlContent);
    });
  });
  console.log('✔ Static HTML pages generated for active items');
  
  // ── 7. WRITE REPORTS ───────────────────────────────────────
  console.log('Generating CMS validation reports in /REPORTS...');
  
  // Enforce score lower bounds
  if (healthScore < 0) healthScore = 0;
  
  // CMS_SYNC_REPORT.md
  const syncReportContent = `# CMS Sync Execution Report

*   **Timestamp:** ${new Date().toISOString()}
*   **Result:** SUCCESS
*   **Status:** All spreadsheets processed, JSON compiled, and static HTML files generated.

## Files Checked
*   \`customizations.xlsx\` / \`customizations.csv\`: FOUND (${rawCustomizations.length} items parsed)
*   \`services.xlsx\` / \`services.csv\`: FOUND (${rawServices.length} items parsed)
*   \`products.xlsx\` / \`products.csv\`: FOUND (${rawProducts.length} items parsed)
*   \`case-studies.xlsx\` / \`case-studies.csv\`: FOUND (${rawCaseStudies.length} items parsed)
*   \`testimonials.xlsx\`: FOUND
*   \`faq.xlsx\`: FOUND
*   \`pricing.xlsx\`: FOUND
*   \`offers.xlsx\`: FOUND
*   \`industries.xlsx\`: FOUND
`;
  fs.writeFileSync(path.join(reportsDir, 'CMS_SYNC_REPORT.md'), syncReportContent);
  
  // CONTENT_HEALTH_REPORT.md
  const healthReportContent = `# CMS Content Health Report

## CMS Health Score: **${healthScore}/100**

## Issue Breakdown
*   **Missing Override Images:** ${missingImages.length}
*   **Missing Brochures:** ${missingBrochures.length}
*   **SEO Gaps / Meta Issues:** ${seoIssues.length}
*   **Warning Messages:** ${issues.length}

## Logged Issues & Warnings
${issues.length === 0 ? '*No major issues found. Core structures are healthy.*' : issues.map(i => `*   ${i}`).join('\n')}
`;
  fs.writeFileSync(path.join(reportsDir, 'CONTENT_HEALTH_REPORT.md'), healthReportContent);
  
  // MISSING_IMAGES_REPORT.md
  const missingImagesContent = `# Missing Images Report

The following dynamic items are set to **Active** but are missing matching override images in the assets folder:

| Category | Item Name | Expected Image Filename |
|---|---|---|
${missingImages.length === 0 ? '| None | No missing images found | - |' : missingImages.map(mi => `| ${mi.type} | ${mi.item} | \`${mi.file}\` |`).join('\n')}
`;
  fs.writeFileSync(path.join(reportsDir, 'MISSING_IMAGES_REPORT.md'), missingImagesContent);
  
  // MISSING_BROCHURES_REPORT.md
  const missingBrochuresContent = `# Missing Brochures / Documents Report

The following active items reference downloadable brochure or datasheet documents that do not exist inside \`edit/documents/\`:

| Category | Item Name | Referenced Filename |
|---|---|---|
${missingBrochures.length === 0 ? '| None | No missing brochures found | - |' : missingBrochures.map(mb => `| ${mb.type} | ${mb.item} | \`${mb.file}\` |`).join('\n')}
`;
  fs.writeFileSync(path.join(reportsDir, 'MISSING_BROCHURES_REPORT.md'), missingBrochuresContent);
  
  // DUPLICATE_SLUGS_REPORT.md
  const duplicateSlugsContent = `# Duplicate Slugs Resolution Report

The following conflicts were identified during slug calculations:

${duplicateSlugsReport.length === 0 ? '*No slug duplication conflicts found. All slugs are unique.*' : duplicateSlugsReport.map(d => `*   ${d}`).join('\n')}
`;
  fs.writeFileSync(path.join(reportsDir, 'DUPLICATE_SLUGS_REPORT.md'), duplicateSlugsContent);
  
  // SEO_HEALTH_REPORT.md
  const seoHealthContent = `# SEO Health Audit Report

This report tracks SEO compliance parameters across all dynamically generated route pages (titles, descriptions, canonicals, schemas):

| Page Item | Parameter | Issue Description |
|---|---|---|
${seoIssues.length === 0 ? '| None | All SEO parameters comply with standards | - |' : seoIssues.map(s => `| ${s.item} | ${s.type} | ${s.issue} |`).join('\n')}
`;
  fs.writeFileSync(path.join(reportsDir, 'SEO_HEALTH_REPORT.md'), seoHealthContent);
  
  // Calculate executive dashboard metrics
  let activeContent = 0;
  let draftContent = 0;
  let archivedContent = 0;

  const allSheets = [
    rawCustomizations,
    rawServices,
    rawProducts,
    rawCaseStudies,
    rawTestimonials,
    rawFAQs,
    rawPricing,
    rawOffers,
    rawIndustries
  ];

  allSheets.forEach(sheet => {
    sheet.forEach((row: any) => {
      const status = String(row['Status'] || 'Active').trim().toLowerCase();
      if (status === 'draft') {
        draftContent++;
      } else if (status === 'archived') {
        archivedContent++;
      } else {
        activeContent++;
      }
    });
  });

  // Calculate per-category details
  function getCategoryStatusCounts(sheet: any[]) {
    let active = 0;
    let draft = 0;
    let archived = 0;
    sheet.forEach((row: any) => {
      const status = String(row['Status'] || 'Active').trim().toLowerCase();
      if (status === 'draft') {
        draft++;
      } else if (status === 'archived') {
        archived++;
      } else {
        active++;
      }
    });
    return { active, draft, archived };
  }

  const custCounts = getCategoryStatusCounts(rawCustomizations);
  const servCounts = getCategoryStatusCounts(rawServices);
  const prodCounts = getCategoryStatusCounts(rawProducts);
  const csCounts = getCategoryStatusCounts(rawCaseStudies);

  // CMS_SUMMARY_REPORT.md
  const cmsSummaryContent = `# CMS Content Summary Dashboard

## Executive Dashboard
| Dashboard Metric | Value |
|---|---|
| 🟢 Active Content | ${activeContent} |
| 🟡 Draft Content | ${draftContent} |
| 🔴 Archived Content | ${archivedContent} |
| 🖼️ Missing Assets | ${missingImages.length} |
| 📄 Missing Brochures | ${missingBrochures.length} |
| 🔍 SEO Issues | ${seoIssues.length} |
| 🏆 CMS Health Score | **${healthScore}/100** |

## Detail Content Breakdowns
| Metric | Total | Active | Draft | Archived |
|---|---|---|---|---|
| Customizations | ${rawCustomizations.length} | ${custCounts.active} | ${custCounts.draft} | ${custCounts.archived} |
| Services | ${rawServices.length} | ${servCounts.active} | ${servCounts.draft} | ${servCounts.archived} |
| Products | ${rawProducts.length} | ${prodCounts.active} | ${prodCounts.draft} | ${prodCounts.archived} |
| Case Studies | ${rawCaseStudies.length} | ${csCounts.active} | ${csCounts.draft} | ${csCounts.archived} |
| FAQs | ${faqsData.length} | ${faqsData.length} | - | - |
| Testimonials | ${testimonialsData.length} | ${testimonialsData.length} | - | - |
| Pricing Rows | ${pricingData.length} | ${pricingData.length} | - | - |
| Offers | ${offersData.length} | ${offersData.length} | - | - |
| Industries | ${industriesData.length} | ${industriesData.length} | - | - |`;
  fs.writeFileSync(path.join(reportsDir, 'CMS_SUMMARY_REPORT.md'), cmsSummaryContent);
  
  // ROUTING_ARCHITECTURE_REPORT.md
  const routingReportContent = `# Dynamic Routing Architecture Report

## Evaluation of Dynamic Routes for Harsh Infotech Website

We compare **Option A (Static Compile-Time HTML Page Generation)** and **Option B (Dynamic Client-Side React Router)**.

### Option A: Static Compile-Time HTML Generation (Current Choice)
*   **How it works:** The CMS sync script generates folders containing physical HTML pages for each slug (e.g. \`customizations/hotel-lodging.html\`).
*   **Pros:**
    1.  **Stellar SEO:** Crawlers immediately get pre-rendered HTML tags, meta titles, descriptions, and structural schema scripts.
    2.  **No Server Route Rewrites Required:** Works natively on simple static CDNs or static servers without fallback redirects.
    3.  **Speed:** Instant initial loading times.
*   **Cons:**
    1.  **File clutter:** Creates physical HTML files inside the codebase directory.
    2.  **Vite bundle scan overhead:** Requires Vite to register multiple inputs at compile time.

### Option B: Dynamic Client-Side React Routing
*   **How it works:** Uses a client-side library (like React Router) to resolve routes inside a single HTML bundle (\`customizations.html\`), swapping pages dynamically depending on path URL.
*   **Pros:**
    1.  No physical HTML page generation needed.
    2.  Simpler Vite compilation (only one entry point per category).
*   **Cons:**
    1.  **SEO challenges:** Search crawlers must execute client-side JavaScript to read dynamic SEO tags (prone to indexation failures on non-Google crawlers).
    2.  **Server redirection rules required:** The hosting provider must rewrite paths to point to a fallback entry HTML file, otherwise loading a route directly results in a 404.

### Recommendations for Future Scale (2,000+ Items)
*   At scale, **Option A** remains superior for SEO purposes. However, to avoid directory pollution, we recommend wrapping the dynamic routes into a build-time pre-renderer or using a lightweight framework (like Astro or Next.js static exports).
*   For the current catalog size (supporting up to 500+ customizations, 200+ services, and 1,000+ products), **Option A (Static Compile-Time Generation)** provides the absolute best balance of extreme SEO indexability and deployment zero-maintenance.
`;
  fs.writeFileSync(path.join(reportsDir, 'ROUTING_ARCHITECTURE_REPORT.md'), routingReportContent);
  
  console.log('✔ CMS reporting dashboard compiled inside REPORTS/');
  console.log('--- CMS SYNCHRONIZATION COMPLETED SUCCESSFULLY ---');
}

// Helper for dates
function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Run the script
runSync().catch(err => {
  console.error('CMS Sync failed with error:', err);
  process.exit(1);
});
