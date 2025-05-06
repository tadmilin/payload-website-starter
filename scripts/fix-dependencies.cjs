#!/usr/bin/env node
/**
 * Script สำหรับตรวจสอบและซ่อมแซม dependencies ที่มีปัญหา
 * โดยเฉพาะปัญหาเรื่องเวอร์ชันของ Payload packages
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// เวอร์ชันที่ต้องการให้ทุก Payload packages ใช้
const TARGET_VERSION = '3.35.1';

// บันทึกข้อความแบบสวยงาม
function log(type, message) {
  switch (type) {
    case 'info':
      console.log(chalk.blue('ℹ️ INFO: ') + message);
      break;
    case 'success':
      console.log(chalk.green('✅ SUCCESS: ') + message);
      break;
    case 'warning':
      console.log(chalk.yellow('⚠️ WARNING: ') + message);
      break;
    case 'error':
      console.log(chalk.red('❌ ERROR: ') + message);
      break;
    default:
      console.log(message);
  }
}

async function main() {
  try {
    log('info', 'เริ่มตรวจสอบและซ่อมแซม dependencies...');

    // อ่าน package.json
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // ตรวจสอบเวอร์ชันของ Payload packages
    const dependencies = packageJson.dependencies || {};
    let hasChanges = false;

    log('info', `กำหนดเวอร์ชันเป้าหมาย: ${TARGET_VERSION}`);

    // ตรวจสอบและแก้ไข Payload packages
    for (const [packageName, version] of Object.entries(dependencies)) {
      if (packageName.startsWith('@payloadcms/') || packageName === 'payload') {
        const fixedVersion = TARGET_VERSION;
        if (version !== fixedVersion) {
          log('warning', `${packageName}: ${version} -> ${fixedVersion}`);
          dependencies[packageName] = fixedVersion;
          hasChanges = true;
        }
      }
    }

    // บันทึกไฟล์ package.json ถ้ามีการเปลี่ยนแปลง
    if (hasChanges) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      log('success', 'อัปเดตไฟล์ package.json เรียบร้อยแล้ว');

      // รันคำสั่ง npm install เพื่ออัปเดต package-lock.json
      log('info', 'กำลังรัน npm install เพื่ออัปเดต dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      log('success', 'อัปเดต dependencies เรียบร้อยแล้ว');
    } else {
      log('success', 'Payload packages ทั้งหมดมีเวอร์ชันที่ถูกต้องแล้ว');
    }

    // แก้ไขปัญหาอื่นๆ ที่อาจเกิดขึ้น
    log('info', 'กำลังตรวจสอบความสมบูรณ์ของ node_modules...');
    execSync('npm cache verify', { stdio: 'inherit' });

    log('success', 'การซ่อมแซม dependencies เสร็จสมบูรณ์');
  } catch (error) {
    log('error', 'เกิดข้อผิดพลาดในการซ่อมแซม dependencies:');
    console.error(error);
    process.exit(1);
  }
}

// รันฟังก์ชันหลัก
main();
