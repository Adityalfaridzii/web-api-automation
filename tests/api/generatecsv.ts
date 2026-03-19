import * as fs from "fs";
import * as path from "path";

const API_URL = "https://reqres.in/api/users?page=2";
import * as dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.REQRES_API_KEY || "";
const OUTPUT_FILE = path.join(__dirname, "users_page2.csv");

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface ApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

async function fetchUsers(): Promise<User[]> {
  console.log(`Fetching data from: ${API_URL}`);

  const response = await fetch(API_URL, {
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }

  const json = await response.json() as ApiResponse;

  console.log(`Berhasil fetch ${json.data.length} users dari page ${json.page}`);
  return json.data;
}

function generateCSV(users: User[]): string {
  const header = "First Name,Last Name,Email";
  const rows = users.map(
    (user) =>
      `"${user.first_name}","${user.last_name}","${user.email}"`
  );

  return [header, ...rows].join("\n");
}

function saveToFile(content: string, filePath: string): void {
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`CSV tersimpan di: ${filePath}`);
}

async function main() {
  try {
    const users = await fetchUsers();

    console.log("Preview data:");
    console.table(
      users.map((u) => ({
        "First Name": u.first_name,
        "Last Name": u.last_name,
        Email: u.email,
      }))
    );

    const csvContent = generateCSV(users);

    saveToFile(csvContent, OUTPUT_FILE);

    console.log("Isi file CSV:");
    console.log(csvContent);

    console.log("Selesai!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();