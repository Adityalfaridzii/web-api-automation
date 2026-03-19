# 🎭 Web API Automation — Playwright

Automation testing project for REST API using **Playwright** with **TypeScript**.  
Endpoint under test: `https://reqres.in/api/users?page=2`

---

## 📋 Prerequisites

Make sure you have these installed before setup:

| Tool | Version | Check |
|------|---------|-------|
| Node.js | v18+ | `node --version` |
| npm | v8+ | `npm --version` |
| Git | any | `git --version` |

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/adityalfaridzi/web-api-automation.git
cd web-api-automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Set up environment variable

Create a `.env` file in the root folder:

```bash
cp .env.example .env
```

Then fill in your API key:

```env
REQRES_API_KEY=your_api_key_here
```

> 💡 You can get a free API key at [https://reqres.in](https://reqres.in)

---

## 🚀 Running the Tests

### Run all tests

```bash
npx playwright test
```

### Run only API tests

```bash
npx playwright test tests/api/
```

### Run a specific test file

```bash
npx playwright test tests/api/apireqres.spec.ts
```

### Run with HTML report

```bash
npx playwright test --reporter=html
npx playwright show-report
```

### Run in headed mode (show browser)

```bash
npx playwright test --headed
```

---

## 📊 Generate CSV Report

This project includes a bonus script to fetch user data from the API and export it to CSV format.

```bash
npx tsx tests/api/generatecsv.ts
```

Output file will be saved as `users_page2.csv` with the following format:

```
First Name,Last Name,Email
"Michael","Lawson","michael.lawson@reqres.in"
"Lindsay","Ferguson","lindsay.ferguson@reqres.in"
...
```

---

## 🗂️ Project Structure

```
web-api-automation/
├── tests/
│   ├── api/
│   │   ├── apireqres.spec.ts     # API automation test cases
│   │   └── generatecsv.ts        # Script to generate CSV from API
│   └── ui/
│       └── page/                 # UI Page Object Models
├── setup/
│   └── config.json               # Test configuration
├── playwright-report/            # Generated HTML report (git ignored)
├── test-results/                 # Test result artifacts (git ignored)
├── playwright.config.ts          # Playwright configuration
├── package.json
└── README.md
```

---

## 🧪 Test Coverage

| Test ID | Category | Description |
|---------|----------|-------------|
| AUTH-001 | Authentication | Request without API key → 401 |
| AUTH-002 | Authentication | Request with invalid API key → 401 |
| AUTH-003 | Authentication | Request with valid API key → 200 |
| TC-001 | Happy Path | Status code 200 & complete response body |
| TC-002 | Schema Validation | All field types are correct |
| TC-003 | Business Logic | Pagination values are consistent |
| TC-004 | Performance | Response time under 2000ms |
| TC-005 | Header Validation | Content-Type is application/json |
| TC-006 | Edge Case | No page param defaults to page=1 |
| TC-007 | Edge Case | page=0 does not crash |
| TC-008 | Boundary | page=999 returns empty data array |
| TC-009 | Edge Case | page=-1 does not crash |
| TC-010 | Invalid Input | page=abc does not return 500 |
| TC-011 | Extra Params | Unknown params are ignored |
| TC-012 | Wrong Method | POST/DELETE do not return 5xx |
| TC-013 | Data Integrity | Avatar URLs and emails are valid |
| TC-014 | Reliability | API is idempotent across 3 requests |
| TC-015 | Header | Accept header is respected |

---

## 🛠️ Tech Stack

- **[Playwright](https://playwright.dev/)** — API & UI automation framework
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[tsx](https://github.com/privatenumber/tsx)** — TypeScript executor for scripts
- **[Node.js](https://nodejs.org/)** — Runtime environment

---

## 📝 Notes

- API key is stored in `.env` file and should **never** be committed to Git
- `.env` is already included in `.gitignore`
- CSV output files are also excluded from Git (only the script is tracked)
