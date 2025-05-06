const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// รายการปัญหาที่ต้องแก้ไข
const ISSUES = {
  'no-unused-vars': /['"]([^'"]+)['"] is defined but never used/,
  'no-unused-vars-assigned': /['"]([^'"]+)['"] is assigned a value but never used/,
  'no-unused-args': /['"]([^'"]+)['"] is defined but never used. Allowed unused args/,
  'no-unused-array': /['"]([^'"]+)['"] is assigned a value but never used. Allowed unused elements of array/,
  'no-unused-caught': /['"]([^'"]+)['"] is defined but never used. Allowed unused caught errors/,
};

// รัน ESLint เพื่อหาปัญหา
console.log('Running ESLint to find issues...');
let eslintOutput;
try {
  eslintOutput = execSync('npx eslint "src/**/*.{ts,tsx}" --format json').toString();
  const issues = JSON.parse(eslintOutput);
  
  // ประมวลผลปัญหาแต่ละรายการ
  issues.forEach(fileIssue => {
    const filePath = fileIssue.filePath;
    const messages = fileIssue.messages;
    
    if (messages.length === 0) return;
    
    console.log(`\nProcessing ${filePath}`);
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    messages.forEach(message => {
      // ค้นหาปัญหาตัวแปรที่ไม่ได้ใช้
      if (message.ruleId && message.ruleId.includes('no-unused-vars')) {
        let match = null;
        let variableName = null;
        
        // ค้นหา pattern ที่ตรงกัน
        for (const [issueType, pattern] of Object.entries(ISSUES)) {
          match = message.message.match(pattern);
          if (match) {
            variableName = match[1];
            break;
          }
        }
        
        if (variableName) {
          // แก้ไขตัวแปรโดยเติม _ นำหน้า
          const regex = new RegExp(`\\b${variableName}\\b(?!\\s*=\\s*_${variableName})`, 'g');
          const newFileContent = fileContent.replace(regex, `_${variableName}`);
          
          if (newFileContent !== fileContent) {
            fileContent = newFileContent;
            modified = true;
            console.log(`  Fixed: ${variableName} -> _${variableName}`);
          }
        }
      }
    });
    
    // บันทึกไฟล์ที่แก้ไขแล้ว
    if (modified) {
      fs.writeFileSync(filePath, fileContent, 'utf8');
      console.log(`  Saved changes to ${filePath}`);
    }
  });
  
  console.log('\nDone! Run ESLint again to check for remaining issues.');
} catch (error) {
  console.error('Error running ESLint:', error.message);
  process.exit(1);
} 