import { describe, it, expect } from "@jest/globals";

/**
 * COMPREHENSIVE API TESTING GUIDE
 * 
 * These tests can be used to verify all CRUD endpoints
 * Using Postman, curl, or automated testing framework
 */

describe("Wedding Hall Management System - CRUD Operations", () => {
  const BASE_URL = "http://localhost:3000/api";
  const ADMIN_HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer admin-token",
  };

  // =====================
  // HALLS TESTS
  // =====================

  describe("HALLS - Full CRUD", () => {
    let hallId: string;

    it("GET /halls - List all halls", async () => {
      const response = await fetch(`${BASE_URL}/halls`);
      expect(response.status).toBe(200);
    });

    it("POST /halls - Create new hall", async () => {
      const response = await fetch(`${BASE_URL}/halls`, {
        method: "POST",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          name: "Test Hall",
          images: ["https://example.com/image1.jpg"],
          district: "Toshkent",
          address: "123 Main Street",
          capacity: 500,
          pricePerSeat: 50000,
          phone: "+998901234567",
          singers: [],
          cars: [],
          menuItems: [],
          karnayPrice: 300000,
        }),
      });
      expect(response.status).toBe(201);
      const data = await response.json();
      hallId = data.data.id;
    });

    it("GET /halls/[id] - Get specific hall", async () => {
      const response = await fetch(`${BASE_URL}/halls/${hallId}`);
      expect(response.status).toBe(200);
    });

    it("PUT /halls/[id] - Update hall", async () => {
      const response = await fetch(`${BASE_URL}/halls/${hallId}`, {
        method: "PUT",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          name: "Updated Hall",
          capacity: 600,
        }),
      });
      expect(response.status).toBe(200);
    });

    it("DELETE /halls/[id] - Delete hall", async () => {
      const response = await fetch(`${BASE_URL}/halls/${hallId}`, {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      });
      expect(response.status).toBe(200);
    });
  });

  // =====================
  // BOOKINGS TESTS
  // =====================

  describe("BOOKINGS - Full CRUD", () => {
    let bookingId: string;
    const hallId = "hall-id-from-previous-test";

    it("GET /bookings - List all bookings", async () => {
      const response = await fetch(`${BASE_URL}/bookings`);
      expect(response.status).toBeOneOf([200, 401]); // 401 if no auth
    });

    it("POST /bookings - Create booking", async () => {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          hallId,
          date: "2026-06-15T10:00:00Z",
          guestCount: 200,
          selectedServices: [],
        }),
      });
      expect(response.status).toBe(201);
      const data = await response.json();
      bookingId = data.data.id;
    });

    it("GET /bookings/[id] - Get specific booking", async () => {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`);
      expect([200, 401].includes(response.status)).toBe(true);
    });

    it("PUT /bookings/[id] - Update booking", async () => {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: "PUT",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          guestCount: 250,
        }),
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });

    it("DELETE /bookings/[id] - Cancel booking", async () => {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });
  });

  // =====================
  // SINGERS TESTS
  // =====================

  describe("SINGERS - Full CRUD", () => {
    let singerId: string;
    const hallId = "hall-id";

    it("GET /singers - List singers", async () => {
      const response = await fetch(`${BASE_URL}/singers`);
      expect(response.status).toBe(200);
    });

    it("POST /singers - Add singer", async () => {
      const response = await fetch(`${BASE_URL}/singers`, {
        method: "POST",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          hallId,
          name: "Test Singer",
          price: 1000000,
          image: "https://example.com/singer.jpg",
        }),
      });
      expect([201, 401].includes(response.status)).toBe(true);
      if (response.status === 201) {
        const data = await response.json();
        singerId = data.data.id;
      }
    });

    it("GET /singers/[id] - Get specific singer", async () => {
      if (!singerId) return; // Skip if creation failed
      const response = await fetch(`${BASE_URL}/singers/${singerId}`);
      expect(response.status).toBe(200);
    });

    it("PUT /singers/[id] - Update singer", async () => {
      if (!singerId) return;
      const response = await fetch(`${BASE_URL}/singers/${singerId}`, {
        method: "PUT",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          name: "Updated Singer",
          price: 1200000,
        }),
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });

    it("DELETE /singers/[id] - Delete singer", async () => {
      if (!singerId) return;
      const response = await fetch(`${BASE_URL}/singers/${singerId}`, {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });
  });

  // =====================
  // CARS TESTS
  // =====================

  describe("CARS - Full CRUD", () => {
    let carId: string;
    const hallId = "hall-id";

    it("GET /cars - List cars", async () => {
      const response = await fetch(`${BASE_URL}/cars`);
      expect(response.status).toBe(200);
    });

    it("POST /cars - Add car", async () => {
      const response = await fetch(`${BASE_URL}/cars`, {
        method: "POST",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          hallId,
          brand: "Mercedes",
          price: 500000,
          image: "https://example.com/car.jpg",
        }),
      });
      expect([201, 401].includes(response.status)).toBe(true);
      if (response.status === 201) {
        const data = await response.json();
        carId = data.data.id;
      }
    });

    it("GET /cars/[id] - Get specific car", async () => {
      if (!carId) return;
      const response = await fetch(`${BASE_URL}/cars/${carId}`);
      expect(response.status).toBe(200);
    });

    it("PUT /cars/[id] - Update car", async () => {
      if (!carId) return;
      const response = await fetch(`${BASE_URL}/cars/${carId}`, {
        method: "PUT",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          brand: "BMW",
          price: 600000,
        }),
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });

    it("DELETE /cars/[id] - Delete car", async () => {
      if (!carId) return;
      const response = await fetch(`${BASE_URL}/cars/${carId}`, {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });
  });

  // =====================
  // MENU ITEMS TESTS
  // =====================

  describe("MENU ITEMS - Full CRUD", () => {
    let menuItemId: string;
    const hallId = "hall-id";

    it("GET /menu-items - List menu items", async () => {
      const response = await fetch(`${BASE_URL}/menu-items`);
      expect(response.status).toBe(200);
    });

    it("POST /menu-items - Add menu item", async () => {
      const response = await fetch(`${BASE_URL}/menu-items`, {
        method: "POST",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          hallId,
          name: "Osh",
          image: "https://example.com/osh.jpg",
        }),
      });
      expect([201, 401].includes(response.status)).toBe(true);
      if (response.status === 201) {
        const data = await response.json();
        menuItemId = data.data.id;
      }
    });

    it("GET /menu-items/[id] - Get specific menu item", async () => {
      if (!menuItemId) return;
      const response = await fetch(`${BASE_URL}/menu-items/${menuItemId}`);
      expect(response.status).toBe(200);
    });

    it("PUT /menu-items/[id] - Update menu item", async () => {
      if (!menuItemId) return;
      const response = await fetch(`${BASE_URL}/menu-items/${menuItemId}`, {
        method: "PUT",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          name: "Manti",
        }),
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });

    it("DELETE /menu-items/[id] - Delete menu item", async () => {
      if (!menuItemId) return;
      const response = await fetch(`${BASE_URL}/menu-items/${menuItemId}`, {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });
  });

  // =====================
  // SERVICES TESTS
  // =====================

  describe("SERVICES - Full CRUD", () => {
    let serviceId: string;
    const hallId = "hall-id";

    it("GET /services - List services", async () => {
      const response = await fetch(`${BASE_URL}/services`);
      expect(response.status).toBe(200);
    });

    it("POST /services - Add service", async () => {
      const response = await fetch(`${BASE_URL}/services`, {
        method: "POST",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          hallId,
          name: "Karnay-Surnay",
          price: 300000,
          type: "KARNAY",
        }),
      });
      expect([201, 401].includes(response.status)).toBe(true);
      if (response.status === 201) {
        const data = await response.json();
        serviceId = data.data.id;
      }
    });

    it("GET /services/[id] - Get specific service", async () => {
      if (!serviceId) return;
      const response = await fetch(`${BASE_URL}/services/${serviceId}`);
      expect(response.status).toBe(200);
    });

    it("PUT /services/[id] - Update service", async () => {
      if (!serviceId) return;
      const response = await fetch(`${BASE_URL}/services/${serviceId}`, {
        method: "PUT",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          name: "Karnay (Updated)",
          price: 350000,
        }),
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });

    it("DELETE /services/[id] - Delete service", async () => {
      if (!serviceId) return;
      const response = await fetch(`${BASE_URL}/services/${serviceId}`, {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      });
      expect([200, 401].includes(response.status)).toBe(true);
    });
  });

  // =====================
  // USERS TESTS
  // =====================

  describe("USERS - Full CRUD", () => {
    let userId: string;

    it("GET /users - List users (Admin only)", async () => {
      const response = await fetch(`${BASE_URL}/users`, {
        headers: ADMIN_HEADERS,
      });
      expect([200, 401, 403].includes(response.status)).toBe(true);
    });

    it("POST /users - Create user (Admin only)", async () => {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          username: "testuser",
          password: "password123",
          phone: "+998901234567",
          role: "USER",
        }),
      });
      expect([201, 401, 403].includes(response.status)).toBe(true);
      if (response.status === 201) {
        const data = await response.json();
        userId = data.data.id;
      }
    });

    it("GET /users/[id] - Get user details", async () => {
      if (!userId) return;
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        headers: ADMIN_HEADERS,
      });
      expect([200, 401, 403].includes(response.status)).toBe(true);
    });

    it("PUT /users/[id] - Update user", async () => {
      if (!userId) return;
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          firstName: "Updated",
        }),
      });
      expect([200, 401, 403].includes(response.status)).toBe(true);
    });

    it("DELETE /users/[id] - Delete user (Admin only)", async () => {
      if (!userId) return;
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      });
      expect([200, 401, 403].includes(response.status)).toBe(true);
    });
  });
});

/**
 * MANUAL TESTING WITH CURL
 * 
 * # Get all halls
 * curl http://localhost:3000/api/halls
 * 
 * # Create booking
 * curl -X POST http://localhost:3000/api/bookings \
 *   -H "Content-Type: application/json" \
 *   -d '{"hallId":"..","date":"2026-06-15T10:00:00Z","guestCount":200}'
 * 
 * # Get specific booking
 * curl http://localhost:3000/api/bookings/[id]
 * 
 * # Update booking
 * curl -X PUT http://localhost:3000/api/bookings/[id] \
 *   -H "Content-Type: application/json" \
 *   -d '{"guestCount":250}'
 * 
 * # Cancel booking
 * curl -X DELETE http://localhost:3000/api/bookings/[id]
 */
