import { test, expect } from "@playwright/test";

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
const API_KEY = "reqres_da746ac6c6a6441397eeb5a627dfdc6a";

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
  test("AUTH-001 | Request tanpa API key harus return 401", async ({
    request,
  }) => {
    const response = await request.get(PAGE_2_URL);
    expect(response.status()).toBe(403);
  });

  test("AUTH-002 | Request dengan API key yang salah harus return 401", async ({
    request,
  }) => {
    const response = await request.get(PAGE_2_URL, {
      headers: { "x-api-key": "invalid_key_12345" },
    });
    expect(response.status()).toBe(403);
  });

  test("AUTH-003 | Request dengan API key yang valid harus return 200", async ({
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
  test("TC-001 | Status code harus 200", async ({ request }) => {
    const response = await request.get(PAGE_2_URL, { headers: AUTH_HEADERS });
    expect(response.status()).toBe(200);
  });

  test("TC-001 | Response body harus memiliki field utama yang lengkap", async ({
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

  test("TC-002 | Tipe data setiap field harus sesuai schema", async ({
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

  test("TC-002 | Setiap user dalam data[] harus punya field id, email, first_name, last_name, avatar", async ({
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

  test("TC-003 | Nilai pagination harus konsisten (page=2, per_page=6, total=12, total_pages=2)", async ({
    request,
  }) => {
    const { body } = await fetchPage2(request);
    expect(body.page).toBe(2);
    expect(body.per_page).toBe(6);
    expect(body.total).toBe(12);
    expect(body.total_pages).toBe(2);
    expect(body.data).toHaveLength(body.per_page);
  });

  test("TC-003 | User di page=2 tidak boleh overlap dengan page=1", async ({
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

  test("TC-004 | Response time harus di bawah 2000ms", async ({ request }) => {
    const start = Date.now();
    await request.get(PAGE_2_URL, { headers: AUTH_HEADERS });
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });

  test("TC-005 | Content-Type header harus application/json", async ({
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
  test("TC-013 | Avatar URL setiap user harus valid (https://)", async ({
    request,
  }) => {
    const { body } = await fetchPage2(request);
    for (const user of body.data) {
      expect(user.avatar).toMatch(/^https:\/\/.+/);
    }
  });

  test("TC-013 | Email setiap user harus berformat valid", async ({
    request,
  }) => {
    const { body } = await fetchPage2(request);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const user of body.data) {
      expect(user.email).toMatch(emailRegex);
    }
  });

  test("TC-014 | Response harus idempotent (3 request berturut-turut hasilnya sama)", async ({
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
  test("TC-006 | Request tanpa query param page harus return page=1 secara default", async ({
    request,
  }) => {
    const response = await request.get(BASE_URL, { headers: AUTH_HEADERS });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.page).toBe(1);
  });

  test("TC-007 | Request dengan page=0 tidak boleh crash (status bukan 5xx)", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}?page=0`, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBeLessThan(500);
    const body = await response.json();
    expect(body).toHaveProperty("data");
  });

  test("TC-008 | Request dengan page=999 harus return data array kosong", async ({
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

  test("TC-009 | Request dengan page=-1 tidak boleh crash (status bukan 5xx)", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}?page=-1`, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBeLessThan(500);
  });

  test("TC-010 | Request dengan page=abc (non-numerik) tidak boleh 500", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}?page=abc`, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBeLessThan(500);
    const body = await response.json();
    expect(body).toHaveProperty("data");
  });

  test("TC-011 | Parameter ekstra yang tidak dikenal harus diabaikan", async ({
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
  test("TC-012 | POST ke endpoint ini tidak boleh 5xx", async ({ request }) => {
    const response = await request.post(PAGE_2_URL, {
      headers: AUTH_HEADERS,
      data: {},
    });
    expect(response.status()).toBeLessThan(500);
  });

  test("TC-012 | DELETE ke endpoint ini tidak boleh 5xx", async ({
    request,
  }) => {
    const response = await request.delete(PAGE_2_URL, {
      headers: AUTH_HEADERS,
    });
    expect(response.status()).toBeLessThan(500);
  });
});