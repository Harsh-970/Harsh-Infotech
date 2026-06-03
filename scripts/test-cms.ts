import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { execSync } from 'child_process';

const xlsx = (XLSX as any).default || XLSX;
const baseDir = process.cwd();
const editDir = path.join(baseDir, 'edit');
const dataDir = path.join(baseDir, 'src/data');

function editSheet(baseName: string, addRow: any) {
  const filePath = path.join(editDir, `${baseName}.xlsx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Spreadsheet database ${baseName}.xlsx not found!`);
  }
  
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    
    data.push(addRow);
    
    const newSheet = xlsx.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = newSheet;
    xlsx.writeFile(workbook, filePath);
    console.log(`✔ Appended temporary verification row to ${baseName}.xlsx`);
  } catch (err: any) {
    if (err.code === 'EBUSY') {
      console.error(`\n❌ LOCK ERROR: The spreadsheet '${baseName}.xlsx' is currently open and locked by Microsoft Excel.`);
      console.error(`   Please close Excel and re-run this script to run the content verification test.\n`);
    }
    throw err;
  }
}

function restoreSheet(baseName: string, slugToRemove: string) {
  const filePath = path.join(editDir, `${baseName}.xlsx`);
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    
    const cleanedData = data.filter((row: any) => String(row['Slug'] || '').trim() !== slugToRemove);
    
    const newSheet = xlsx.utils.json_to_sheet(cleanedData);
    workbook.Sheets[sheetName] = newSheet;
    xlsx.writeFile(workbook, filePath);
    console.log(`✔ Restored and cleaned ${baseName}.xlsx (removed ${slugToRemove})`);
  } catch (err: any) {
    // Suppress error if restore fails on cleanup during error recovery
  }
}

async function runTest() {
  console.log('=== CMS DYNAMIC CONTENT VERIFICATION TEST STARTING ===\n');
  
  // 1. Define temporary records
  const tempCustomization = {
    'ID': 'temp-test-module',
    'Status': 'Active',
    'Featured': 'TRUE',
    'Module Name': 'CMS Test Verification Customization',
    'Slug': 'temp-test-module',
    'Category': 'Test',
    'Industry': 'Automation',
    'Short Description': 'Temporary verification module description.',
    'Starting Price': 9999,
    'Related Items': 'garment-retail | tally-crm',
    'SEO Title': 'Temp Customization Verification Title',
    'SEO Description': 'SEO description for temporary customization verification purposes.'
  };

  const tempService = {
    'ID': 'temp-test-service',
    'Status': 'Active',
    'Featured': 'FALSE',
    'Service Name': 'CMS Test Verification Service',
    'Slug': 'temp-test-service',
    'Category': 'Test',
    'Description': 'Temporary verification service description.',
    'Price': 19999,
    'SEO Title': 'Temp Service Verification Title',
    'SEO Description': 'SEO description for temporary service verification purposes.'
  };

  const tempProduct = {
    'ID': 'temp-test-product',
    'Status': 'Active',
    'Featured': 'FALSE',
    'Product Name': 'CMS Test Verification Product',
    'Slug': 'temp-test-product',
    'Brand': 'TestBrand',
    'Category': 'Test',
    'Description': 'Temporary verification product description.',
    'Price': 29999,
    'SEO Title': 'Temp Product Verification Title',
    'SEO Description': 'SEO description for temporary product verification purposes.'
  };

  try {
    // 2. Edit Excel files
    editSheet('customizations', tempCustomization);
    editSheet('services', tempService);
    editSheet('products', tempProduct);

    // 3. Run sync-content
    console.log('\nRunning CMS sync content script...');
    execSync('npm run sync-content', { stdio: 'inherit' });
    console.log('CMS Sync finished. Beginning automated verification...\n');

    let errors = 0;

    // 4. Verification Check A: Static HTML File Generation
    const pathsToCheck = [
      'customizations/temp-test-module.html',
      'services/temp-test-service.html',
      'products/temp-test-product.html'
    ];

    pathsToCheck.forEach(p => {
      const fullPath = path.join(baseDir, p);
      if (fs.existsSync(fullPath)) {
        console.log(`🟢 PASSED: Dynamic route compiled successfully at: /${p}`);
        
        // Check SEO meta tags inside page
        const html = fs.readFileSync(fullPath, 'utf8');
        if (html.includes('Verification Title') && html.includes('canonical') && html.includes('application/ld+json')) {
          console.log(`   🟢 SEO meta headers & Structured Schema LD+JSON verified inside /${p}`);
        } else {
          console.log(`   ❌ FAILED: Missing SEO meta headers or schemas in /${p}`);
          errors++;
        }
      } else {
        console.log(`❌ FAILED: Static HTML page not found at: /${p}`);
        errors++;
      }
    });

    // 5. Verification Check B: Search Indexing
    const searchIndexPath = path.join(dataDir, 'search-index.json');
    if (fs.existsSync(searchIndexPath)) {
      const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
      const foundModule = searchIndex.find((i: any) => i.slug === 'temp-test-module');
      const foundService = searchIndex.find((i: any) => i.slug === 'temp-test-service');
      const foundProduct = searchIndex.find((i: any) => i.slug === 'temp-test-product');

      if (foundModule && foundService && foundProduct) {
        console.log('🟢 PASSED: Search index generated correctly with all temporary items.');
      } else {
        console.log('❌ FAILED: Missing temporary items inside search-index.json.');
        errors++;
      }
    } else {
      console.log('❌ FAILED: search-index.json not found!');
      errors++;
    }

    // 6. Verification Check C: Related Recommendations
    const customizationsDataPath = path.join(dataDir, 'customizations.json');
    if (fs.existsSync(customizationsDataPath)) {
      const customizations = JSON.parse(fs.readFileSync(customizationsDataPath, 'utf8'));
      const targetModule = customizations.find((c: any) => c.slug === 'temp-test-module');
      if (targetModule) {
        // Price conversion check
        if (targetModule.price === '₹9,999') {
          console.log('🟢 PASSED: Numeric price successfully formatted as localized currency text (9999 -> ₹9,999).');
        } else {
          console.log(`❌ FAILED: Price formatting error. Got: ${targetModule.price}`);
          errors++;
        }

        // Recommendations check
        const related = targetModule.relatedItems;
        if (related.includes('garment-retail') && related.includes('tally-crm')) {
          console.log('🟢 PASSED: Custom related items list parsed and mapped correctly.');
        } else {
          console.log(`❌ FAILED: Related items mapping error. Got: ${JSON.stringify(related)}`);
          errors++;
        }
      }
    }

    if (errors === 0) {
      console.log('\n🌟 SUCCESS: CMS AUTOMATED CONTENT VERIFICATION PASSED WITH 0 ERRORS!');
    } else {
      console.log(`\n⚠️ COMPLETED: CMS verification completed with ${errors} warnings.`);
    }

  } catch (error) {
    console.error('❌ Error during testing run:', error);
  } finally {
    // 7. Cleanup and Restore Excel files
    console.log('\nCleaning up verification records...');
    restoreSheet('customizations', 'temp-test-module');
    restoreSheet('services', 'temp-test-service');
    restoreSheet('products', 'temp-test-product');

    // 8. Re-run sync to restore database state
    console.log('\nRe-running content sync to clean up static files...');
    execSync('npm run sync-content', { stdio: 'inherit' });
    console.log('\n=== CMS DYNAMIC CONTENT VERIFICATION TEST COMPLETED ===');
  }
}

runTest();
