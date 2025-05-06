#!/usr/bin/env node
/**
 * Script สำหรับการตรวจหาและแก้ปัญหาตัวแปรที่ไม่ได้ใช้งานโดยอัตโนมัติ
 *
 * วิธีการใช้งาน:
 * 1. npm run fix-unused-vars
 * หรือ
 * 2. node scripts/fix-unused-vars.js
 */

const fs = require('fs')
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const chalk = require('chalk') // เพิ่ม chalk เพื่อทำสีใน terminal

// รายการปัญหาที่ต้องแก้ไข
const ISSUES = {
  'no-unused-vars': /['"]([^'"]+)['"] is defined but never used/,
  'no-unused-vars-assigned': /['"]([^'"]+)['"] is assigned a value but never used/,
  'no-unused-args': /['"]([^'"]+)['"] is defined but never used. Allowed unused args/,
  'no-unused-array':
    /['"]([^'"]+)['"] is assigned a value but never used. Allowed unused elements of array/,
  'no-unused-caught': /['"]([^'"]+)['"] is defined but never used. Allowed unused caught errors/,
}

/**
 * บันทึกข้อความแบบสวยงาม
 */
function log(type, message) {
  switch (type) {
    case 'info':
      console.log(chalk.blue('ℹ️ INFO: ') + message)
      break
    case 'success':
      console.log(chalk.green('✅ SUCCESS: ') + message)
      break
    case 'warning':
      console.log(chalk.yellow('⚠️ WARNING: ') + message)
      break
    case 'error':
      console.log(chalk.red('❌ ERROR: ') + message)
      break
    default:
      console.log(message)
  }
}

/**
 * ฟังก์ชันหลักในการค้นหาและแก้ไขปัญหา
 */
async function main() {
  try {
    // แสดงข้อความต้อนรับ
    console.log(chalk.bold.green('\n=== TypeScript Unused Variables Fixer ===\n'))
    log('info', 'กำลังตรวจสอบปัญหาตัวแปรที่ไม่ได้ใช้งานด้วย ESLint...')

    // รัน ESLint เพื่อค้นหาปัญหา
    let eslintOutput = ''
    try {
      const { stdout } = await exec('npx eslint "src/**/*.{ts,tsx}" --format json')
      eslintOutput = stdout
    } catch (error) {
      // ESLint จะ exit ด้วย code 1 ถ้าพบปัญหา ซึ่งเป็นเรื่องปกติ
      eslintOutput = error.stdout
    }

    if (!eslintOutput) {
      log('success', 'ไม่พบปัญหาตัวแปรที่ไม่ได้ใช้งาน')
      return
    }

    const issues = JSON.parse(eslintOutput)

    if (issues.length === 0) {
      log('success', 'ไม่พบปัญหาตัวแปรที่ไม่ได้ใช้งาน')
      return
    }

    log('info', `พบไฟล์ทั้งหมด ${issues.length} ไฟล์ที่มีปัญหา`)

    let totalFixedVars = 0
    let totalFiles = 0

    // ประมวลผลปัญหาแต่ละรายการ
    for (const fileIssue of issues) {
      const filePath = fileIssue.filePath
      const messages = fileIssue.messages

      if (messages.length === 0) continue

      let fileContent = fs.readFileSync(filePath, 'utf8')
      let modified = false
      let fixedVarsInFile = 0

      console.log(chalk.bold.blue(`\nกำลังตรวจสอบ: ${path.relative(process.cwd(), filePath)}`))
      console.log(chalk.gray(`พบปัญหา ${messages.length} รายการ`))

      for (const message of messages) {
        // ค้นหาปัญหาตัวแปรที่ไม่ได้ใช้
        if (message.ruleId && message.ruleId.includes('no-unused-vars')) {
          let match = null
          let variableName = null

          // ค้นหา pattern ที่ตรงกัน
          for (const [issueType, pattern] of Object.entries(ISSUES)) {
            match = message.message.match(pattern)
            if (match) {
              variableName = match[1]
              break
            }
          }

          if (variableName) {
            // แก้ไขตัวแปรโดยเติม _ นำหน้า
            const regex = new RegExp(`\\b${variableName}\\b(?!\\s*=\\s*_${variableName})`, 'g')
            const newFileContent = fileContent.replace(regex, `_${variableName}`)

            if (newFileContent !== fileContent) {
              fileContent = newFileContent
              modified = true
              fixedVarsInFile++
              console.log(
                `  ${chalk.green('✓')} แก้ไข: ${chalk.yellow(variableName)} → ${chalk.green('_' + variableName)}`,
              )
            }
          }
        }
      }

      // บันทึกไฟล์ที่แก้ไขแล้ว
      if (modified) {
        fs.writeFileSync(filePath, fileContent, 'utf8')
        log(
          'success',
          `แก้ไข ${fixedVarsInFile} ตัวแปรใน ${path.relative(process.cwd(), filePath)}`,
        )
        totalFixedVars += fixedVarsInFile
        totalFiles++
      }
    }

    if (totalFixedVars > 0) {
      log(
        'success',
        `แก้ไขตัวแปรที่ไม่ได้ใช้ทั้งหมด ${totalFixedVars} ตัวแปร ใน ${totalFiles} ไฟล์`,
      )
    } else {
      log('info', 'ไม่พบตัวแปรที่ต้องแก้ไข หรือไม่สามารถแก้ไขได้อัตโนมัติ')
    }

    log('info', 'แนะนำให้รัน "npm run lint" เพื่อตรวจสอบว่ายังมีปัญหาตกค้างหรือไม่')
  } catch (error) {
    log('error', 'เกิดข้อผิดพลาดในการประมวลผล:')
    console.error(error)
    process.exit(1)
  }
}

// รันฟังก์ชันหลัก
main()
