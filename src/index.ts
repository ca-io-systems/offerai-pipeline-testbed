import indexPage from "./pages/index.html";
import loginPage from "./pages/login.html";
import signupPage from "./pages/signup.html";
import dashboardPage from "./pages/dashboard.html";
import { signup, login, logout, getCurrentUser } from "./auth/actions";
import { authMiddleware } from "./middleware/auth";
import { seedUsers } from "./db/seed";

await seedUsers();

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": indexPage,
    "/login": loginPage,
    "/signup": signupPage,
    "/dashboard": dashboardPage,
    "/dashboard/*": dashboardPage,
    "/bookings": dashboardPage,
    "/bookings/*": dashboardPage,
    "/messages": dashboardPage,
    "/messages/*": dashboardPage,
    "/wishlists": dashboardPage,
    "/wishlists/*": dashboardPage,
    "/api/auth/signup": {
      POST: async (request) => {
        const body = await request.json();
        const result = await signup(body.email, body.password, body.name);

        const headers = new Headers({ "Content-Type": "application/json" });
        if (result.cookie) {
          headers.set("Set-Cookie", result.cookie);
        }

        return new Response(JSON.stringify(result), { headers });
      },
    },
    "/api/auth/login": {
      POST: async (request) => {
        const body = await request.json();
        const result = await login(body.email, body.password);

        const headers = new Headers({ "Content-Type": "application/json" });
        if (result.cookie) {
          headers.set("Set-Cookie", result.cookie);
        }

        return new Response(JSON.stringify(result), { headers });
      },
    },
    "/api/auth/logout": {
      POST: (request) => {
        const result = logout(request);

        return new Response(JSON.stringify({ success: true }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": result.cookie,
          },
        });
      },
    },
    "/api/auth/me": {
      GET: (request) => {
        const user = getCurrentUser(request);
        return new Response(JSON.stringify({ user }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
  async fetch(request) {
    const middlewareResponse = authMiddleware(request);
    if (middlewareResponse) {
      return middlewareResponse;
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
