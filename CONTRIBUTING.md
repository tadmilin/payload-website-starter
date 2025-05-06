# คู่มือสำหรับผู้ร่วมพัฒนา (Contributing Guide)

ขอบคุณที่สนใจร่วมพัฒนาโปรเจค! เอกสารนี้มีวัตถุประสงค์เพื่อช่วยให้คุณเข้าใจกระบวนการพัฒนา รูปแบบโค้ด และขั้นตอนในการส่ง Pull Request

## การติดตั้งโปรเจค

1. Clone โปรเจค:
```bash
git clone https://github.com/your-username/solar.git
cd solar
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. เริ่มการพัฒนา:
```bash
npm run dev
```

## โครงสร้างโปรเจค

```
/
├── public/               # Static assets
├── scripts/              # Utility scripts
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (frontend)/   # Frontend routes
│   │   ├── (payload)/    # Payload CMS routes
│   │   └── api/          # API endpoints
│   ├── blocks/           # Content blocks
│   ├── collections/      # Payload CMS collections
│   ├── components/       # Shared components
│   ├── endpoints/        # API endpoints
│   ├── heros/            # Hero components
│   ├── lib/              # Utility libraries
│   ├── providers/        # React context providers
│   ├── services/         # Service functions
│   ├── types/            # TypeScript definitions
│   └── utilities/        # Utility functions
├── .env                  # Environment variables
├── .eslintrc.mjs         # ESLint configuration
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## แนวทางการพัฒนา

### Code Style

โปรเจคนี้ใช้ ESLint และ Prettier เพื่อรักษาความสอดคล้องของรูปแบบโค้ด

- รันการตรวจสอบ linting:
```bash
npm run lint
```

- รันการจัดรูปแบบโค้ด:
```bash
npm run format
```

### TypeScript

- ใช้ `type` แทน `interface` สำหรับ public API
- หลีกเลี่ยงการใช้ `any` ให้มากที่สุด ใช้ `unknown` หรือ type ที่เหมาะสมแทน
- ใช้ explicit return types สำหรับฟังก์ชันสาธารณะ

### React Components

- ใช้ Function Components และ Hooks
- แยก components ที่มีความซับซ้อนออกเป็น components ย่อยๆ
- สร้าง custom hooks สำหรับตรรกะที่ใช้ซ้ำ

### API และ Data Fetching

- ใช้ helper functions ที่มีใน `src/lib/api-helpers.ts`
- จัดการ error อย่างเหมาะสมในทุก API calls
- ใช้ TypeScript สำหรับ request และ response types

## การแก้ไขปัญหา

### ปัญหาตัวแปรที่ไม่ได้ใช้

เราใช้ script `fix-unused-vars.js` เพื่อแก้ไขปัญหาตัวแปรที่ไม่ได้ใช้งานโดยอัตโนมัติ

```bash
npm run fix-unused-vars
```

### ปัญหา Build

ก่อนส่ง PR ให้แน่ใจว่าโปรเจคสามารถ build ได้โดยไม่มีข้อผิดพลาด:

```bash
npm run build
```

## การส่ง Pull Request

1. สร้าง branch ใหม่จาก `main`:
```bash
git checkout -b feature/my-new-feature
```

2. พัฒนาและ commit การเปลี่ยนแปลง:
```bash
git commit -m "feat: add new feature"
```

3. อัปโหลด branch ไปยัง GitHub:
```bash
git push origin feature/my-new-feature
```

4. สร้าง Pull Request บน GitHub

### เงื่อนไขสำหรับการรวม Pull Request

- ไม่มี TypeScript errors
- ไม่มี ESLint warnings ที่สำคัญ
- โค้ดผ่านการ build
- โค้ดได้รับการรีวิวจากสมาชิกในทีมอย่างน้อย 1 คน

## ติดต่อ

หากมีคำถามหรือข้อสงสัยเกี่ยวกับการร่วมพัฒนา กรุณาติดต่อ [your-email@example.com] 