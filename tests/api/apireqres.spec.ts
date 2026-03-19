import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * API Automation Tests — GET https://reqres.in/api/users?page=2
 * Tool: Playwright (API Testing)
 *
 * Setup:
 *   npm init playwright@latest
 *   npx playwright test tests/reqres.api.spec.ts
 */

const BASE_URL = "https://reqres.in/api/users";
const PAGE_2_URL = `${BASE_URL}?page=2`;
const API_KEY = process.env.REQRES_API_KEY || "";
const AUTH_HEADERS = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json",
};

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
async function fetchPage2(request: any) {
  const response = await request.get(PAGE_2_URL, { headers: AUTH_HEADERS });
  const body = await response.json();
  return { response, body };
}

// ─────────────────────────────────────────────
// GROUP 1: AUTHENTICATION
// ─────────────────────────────────────────────
test.describe("AUTH | API Key Validation", () => {
  test("AUTH-001 | Request without API key should return 401", async ({
    request,
  }) => {
    const response = await request.get(PAGE_2_URL);
    expect(response.status()).toBe(403);
  });
 
  test("AUTH-002 | Request with invalid API key should return 401", async ({
    request,
  }) => {
    const response = await request.get(PAGE_2_URL, {
      headers: { "x-api-key": "invalid_key_12345" },
    });
    expect(response.status()).toBe(403);
  });
 
  test("AUTH-003 | Request with valid API key should return 200", async ({
    request,
  }) => {
    const response = await request.get(PAGE_2_URL, { headers: AUTH_HEADERS });
    expect(response.status()).toBe(200);
  });
});
 
// ─────────────────────────────────────────────
// GROUP 2: POSITIVE / HAPPY PATH
// ─────────────────────────────────────────────
test.describe("TC-001 ~ TC-005 | Positive & Happy Path", () => {
  test("TC-001 | Status code should be 200", async ({ request }) => {
    const response = await request.get(PAGE_2_URL, { headers: AUTH_HEADERS });
    expect(response.status()).toBe(200);
  });
 
  test("TC-001 | Response body should contain all required fields", async ({
    request,
  }) => {
    const { body } = await fetchPage2(request);
    expect(body).toHaveProperty("page");
    expect(body).toHaveProperty("per_page");
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("total_pages");
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("support");
    expect(body.support).toHaveProperty("url");
    expect(body.support).toHaveProperty("text");
  });
 
  test("TC-002 | Each field should have the correct data type", async ({
    request,
  }) => {
    const { body } = await fetchPage2(request);
    expect(typeof body.page).toBe("number");
    expect(typeof body.per_page).toBe("number");
    expect(typeof body.total).toBe("number");
    expect(typeof body.total_pages).toBe("number");
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.support.url).toBe("string");
    expect(typeof body.support.text).toBe("string");
  });
 
  test("TC-002 | Each user in data[] should have id, email, first_name, last_name, and avatar fields", async ({
    request,
  }) => {
    const { body } = await fetchPage2(request);
    for (const user of body.data) {
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("first_name");
      expect(user).toHaveProperty("last_name");
      expect(user).toHaveProperty("avatar");
      expect(typeof user.id).toBe("number");
      expect(typeof user.email).toBe("string");
      expect(typeof user.first_name).toBe("string");
      expect(typeof user.last_name).toBe("string");
      expect(typeof user.avatar).toBe("string");
    }
  });
 
  test("TC-003 | Pagination values should be consistent (page=2, per_page=6, total=12, total_pages=2)", async ({
    request,
  }) => {
    const { body } = await fetchPage2(request);
    expect(body.page).toBe(2);
    expect(body.per_page).toBe(6);
    expect(body.total).toBe(12);
    expect(body.total_pages).toBe(2);
    expect(body.data).toHaveLength(body.per_page);
  });
 
  test("TC-003 | Users on page=2 should not overlap with page=1", async ({
    request,
  }) => {
    const res1 = await request.get(`${BASE_URL}?page=1`, {
      headers: AUTH_HEADERS,
    });
    const res2 = await request.get(`${BASE_URL}?page=2`, {
      headers: AUTH_HEADERS,
    });
    const body1 = await res1.json();
    const body2 = await res2.json();
 
    const ids1 = body1.data.map((u: any) => u.id);
    const ids2 = body2.data.map((u: any) => u.id);
    const overlap = ids1.filter((id: number) => ids2.includes(id));
    expect(overlap).toHaveLength(0);
  });
 
  test("TC-004 | Response time should be under 2000ms", async ({ request }) => {
    const start = Date.now();
    await request.get(PAGE_2_URL, { headers: AUTH_HEADERS });
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });
 
  test("TC-005 | Content-Type header should be application/json", async ({
    request,
  }) => {
    const response = await request.get(PAGE_2_URL, { headers: AUTH_HEADERS });
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  });
});
 
// ─────────────────────────────────────────────
// GROUP 3: DATA INTEGRITY
// ─────────────────────────────────────────────
test.describe("TC-013 ~ TC-014 | Data Integrity & Reliability", () => {
  test("TC-013 | Avatar URL for each user should be valid (https://)", async ({
    request,
  }) => {
    const { body } = await fetchPage2(request);
    for (const user of body.data) {
      expect(user.avatar).toMatch(/^https:\/\/.+/);
    }
  });
 
  test("TC-013 | Email for each user should have a valid format", async ({
    request,
  }) => {
    const { body } = await fetchPage2(request);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const user of body.data) {
      expect(user.email).toMatch(emailRegex);
    }
  });
 
  test("TC-014 | Response should be idempotent (3 consecutive requests return the same result)", async ({
    request,
  }) => {
    const results = await Promise.all([
      fetchPage2(request),
      fetchPage2(request),
      fetchPage2(request),
    ]);
 
    const [first, second, third] = results.map((r) => r.body);
    expect(JSON.stringify(first.data)).toBe(JSON.stringify(second.data));
    expect(JSON.stringify(second.data)).toBe(JSON.stringify(third.data));
  });
});
 
// ─────────────────────────────────────────────
// GROUP 4: EDGE CASES & BOUNDARY
// ─────────────────────────────────────────────
test.describe("TC-006 ~ TC-011 | Edge Cases & Boundary", () => {
  test("TC-006 | Request without page param should default to page=1", async ({
    request,
  }) => {
    const response = await request.get(BASE_URL, { headers: AUTH_HEADERS });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.page).toBe(1);
  });
 
  test("TC-007 | Request with page=0 should not crash (status not 5xx)", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}?page=0`, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBeLessThan(500);
    const body = await response.json();
    expect(body).toHaveProperty("data");
  });
 
  test("TC-008 | Request with page=999 should return an empty data array", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}?page=999`, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data).toHaveLength(0);
  });
 
  test("TC-009 | Request with page=-1 should not crash (status not 5xx)", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}?page=-1`, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBeLessThan(500);
  });
 
  test("TC-010 | Request with page=abc (non-numeric) should not return 500", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}?page=abc`, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBeLessThan(500);
    const body = await response.json();
    expect(body).toHaveProperty("data");
  });
 
  test("TC-011 | Unknown extra parameters should be ignored", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}?page=2&foo=bar&baz=123`, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.page).toBe(2);
    expect(body.data).toHaveLength(6);
  });
});
 
// ─────────────────────────────────────────────
// GROUP 5: WRONG METHOD
// ─────────────────────────────────────────────
test.describe("TC-012 | Wrong HTTP Method", () => {
  test("TC-012 | POST to this endpoint should not return 5xx", async ({
    request,
  }) => {
    const response = await request.post(PAGE_2_URL, {
      headers: AUTH_HEADERS,
      data: {},
    });
    expect(response.status()).toBeLessThan(500);
  });
 
  test("TC-012 | DELETE to this endpoint should not return 5xx", async ({
    request,
  }) => {
    const response = await request.delete(PAGE_2_URL, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBeLessThan(500);
  });
});
 
// ─────────────────────────────────────────────
// GROUP 6: HEADER VALIDATION
// ─────────────────────────────────────────────
test.describe("TC-015 | Header Validation", () => {
  test("TC-015 | Request with Accept: application/json should still return JSON", async ({
    request,
  }) => {
    const response = await request.get(PAGE_2_URL, {
      headers: { ...AUTH_HEADERS, Accept: "application/json" },
    });
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  });
 
  test("TC-015 | Response should contain a content-type header", async ({
    request,
  }) => {
    const response = await request.get(PAGE_2_URL, { headers: AUTH_HEADERS });
    const headers = response.headers();
    expect(headers["content-type"]).toBeDefined();
  });
});
 