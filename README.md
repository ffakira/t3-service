# 📝 Todo

### Backend

- [x] Add node-pg pool library
- [x] Add docker compose with `Dockerfile` image for Express app and expose port 9000
- [x] Setup Sentry and set `NODE_ENV=production`
- [x] Fix Bug `req.session["value"]` not being sent from Next.js
- [ ] Fix Player Turn. Requires to listen to new
- [ ] Add Match history (requires to emit events from socket, after winning / loosing)
- [x] Implement minimax algorithm
- [ ] Implement best moves in order 
- [ ] Implement Player vs Bot
- [x] Add simple unit test
- [ ] Implement Winston logger with HTTP request middleware handler
- [ ] Re-implement `passport.authenticate("login")`. After fixing `req.session["value"]`
- [ ] Implement Sentry error tracing logs
- [ ] Add unit test for minimum 60% coverage; requires refactor, and remove the business logic from router handler

### Frontend

- [x] Add conditional win for X/O when they win
- [x] Simple login page with login / password
- [ ] Fix hardcoded values for Player vs. Enemy on `game/match/[id]/page.tsx`
- [ ] Fix Layout at `root/layout.tsx` to use grid
- [ ] Fix Sidebar to use `fr` units instead of `px` for better responsive
- [ ] Fix Sidebar Navbar, and hide on mobile version?
- [ ] Fix `timeInterval` not being initialized
- [x] Add /auth/login API endpoint
- [x] Add /auth/logout API endpoint
- [ ] Add hardcoded CSS values to `tailwind.config.js`
- [ ] Add Github workflows for unit test for Next.js

### Initial Deployment 🚀

- [ ] Deploy to prod server at ⏰ Jan 18, 2024 at 20:00 HKT
- [ ] Config HTTPS cookies and Secure only
- [ ] Config LetsEncrypt SSL certificate
- [ ] Config `t3` subdomain
- [ ] Config NGINX proxy for Express and Next.js ports
- [ ] Seed test accounts (4 accounts)
- [ ] Disable register API endpoint, add flag `process.env.NODE_ENV === "development"`
