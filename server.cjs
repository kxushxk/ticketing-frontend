const jsonServer = require("json-server");
const path = require("path");

const multer = require("multer");
const crypto = require("crypto");

const server = jsonServer.create();
const dbPath = path.join(__dirname, "db.json");
const router = jsonServer.router(dbPath);
const dbRaw = require("fs").readFileSync(dbPath, "utf-8").replace(/^\uFEFF/, "");
const db = JSON.parse(dbRaw);
const middlewares = jsonServer.defaults();

const uploadsDir = path.join(__dirname, "uploads");
if (!require("fs").existsSync(uploadsDir)) {
  require("fs").mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

function createToken() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return "jwt_" + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function findUserByToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const session = db.sessions?.find((s) => s.accessToken === token || s.refreshToken === token);
  if (!session) return null;
  return db.users.find((u) => u.id === session.userId);
}

// --- Auth routes ---

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const accessToken = createToken();
  const refreshToken = createToken();
  // Persist session
  const sessions = db.sessions || [];
  sessions.push({ userId: user.id, accessToken, refreshToken });
  db.sessions = sessions;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ user: sanitizeUser(user), accessToken, refreshToken });
});

server.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const newId = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
  const newUser = { id: newId, name, email, password, role: "USER" };
  db.users.push(newUser);
  const accessToken = createToken();
  const refreshToken = createToken();
  const sessions = db.sessions || [];
  sessions.push({ userId: newId, accessToken, refreshToken });
  db.sessions = sessions;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json({ user: sanitizeUser(newUser), accessToken, refreshToken });
});

server.post("/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });
  const session = db.sessions?.find((s) => s.refreshToken === refreshToken);
  if (!session) return res.status(401).json({ message: "Invalid refresh token" });
  const newAccess = createToken();
  const newRefresh = createToken();
  session.accessToken = newAccess;
  session.refreshToken = newRefresh;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ accessToken: newAccess, refreshToken: newRefresh });
});

server.get("/auth/me", (req, res) => {
  const user = findUserByToken(req.headers.authorization);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  res.json(sanitizeUser(user));
});

// --- Forgot/Reset Password ---

server.post("/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const user = db.users.find((u) => u.email === email);
  if (!user) {
    // Don't reveal whether the email exists
    return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
  }
  const resetToken = createToken();
  const resetTokens = db.resetTokens || [];
  resetTokens.push({ userId: user.id, token: resetToken, expiresAt: Date.now() + 3600000 });
  db.resetTokens = resetTokens;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`[DEV] Password reset link: http://localhost:5173/reset-password?token=${resetToken}`);
  res.json({ message: "If an account with that email exists, a password reset link has been sent." });
});

server.post("/auth/reset-password", (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: "Token and password are required" });
  const resetTokens = db.resetTokens || [];
  const idx = resetTokens.findIndex((rt) => rt.token === token);
  if (idx === -1) return res.status(400).json({ message: "Invalid or expired reset token" });
  const entry = resetTokens[idx];
  if (entry.expiresAt < Date.now()) {
    resetTokens.splice(idx, 1);
    db.resetTokens = resetTokens;
    require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return res.status(400).json({ message: "Reset token has expired" });
  }
  const user = db.users.find((u) => u.id === entry.userId);
  if (!user) return res.status(400).json({ message: "User not found" });
  user.password = password;
  resetTokens.splice(idx, 1);
  db.resetTokens = resetTokens;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ message: "Password has been reset successfully." });
});

// --- Ticket sub-routes ---

server.put("/tickets/:id/status", (req, res) => {
  const ticket = db.tickets.find((t) => t.id === Number(req.params.id));
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  const { status, userId } = req.body;
  const user = db.users.find((u) => u.id === userId);
  const oldStatus = ticket.status;
  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  const histId = db.history.length > 0 ? Math.max(...db.history.map((h) => h.id)) + 1 : 1;
  db.history.push({
    id: histId,
    ticketId: ticket.id,
    userId: userId,
    userName: user?.name ?? "Unknown",
    action: "status_changed",
    field: "status",
    oldValue: oldStatus,
    newValue: status,
    createdAt: new Date().toISOString(),
  });
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json(ticket);
});

server.put("/tickets/:id/assign", (req, res) => {
  const ticket = db.tickets.find((t) => t.id === Number(req.params.id));
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  const { assigneeId } = req.body;
  const assignee = db.users.find((u) => u.id === assigneeId);
  const oldName = ticket.assigneeName;
  ticket.assigneeId = assigneeId;
  ticket.assigneeName = assignee?.name ?? null;
  ticket.updatedAt = new Date().toISOString();
  const histId = db.history.length > 0 ? Math.max(...db.history.map((h) => h.id)) + 1 : 1;
  db.history.push({
    id: histId,
    ticketId: ticket.id,
    userId: assigneeId,
    userName: assignee?.name ?? "Unknown",
    action: "assigned",
    field: "assignee",
    oldValue: oldName,
    newValue: assignee?.name ?? null,
    createdAt: new Date().toISOString(),
  });
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json(ticket);
});

// Override POST /tickets to also add creation history
const defaultCreateHandler = router.render?.bind(router) || ((req, res) => res.status(201).json(res.locals.data));
router.render = (req, res) => {
  if (req.method === "POST" && req.path === "/tickets") {
    const newTicket = res.locals.data;
    const user = db.users.find((u) => u.id === newTicket.createdBy);
    const histId = db.history.length > 0 ? Math.max(...db.history.map((h) => h.id)) + 1 : 1;
    db.history.push({
      id: histId,
      ticketId: newTicket.id,
      userId: newTicket.createdBy,
      userName: user?.name ?? "Unknown",
      action: "created",
      field: null,
      oldValue: null,
      newValue: null,
      createdAt: new Date().toISOString(),
    });
    require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
  res.status(res.statusCode).json(res.locals.data);
};

server.use("/tickets/:id/comments", (req, res, next) => {
  // json-server treats POST /tickets/:id/comments as POST /comments with ticketId set
  // We need to set the ticketId from the URL param
  if (req.method === "POST") {
    req.body.ticketId = Number(req.params.id);
    const user = db.users.find((u) => u.id === req.body.userId);
    req.body.authorId = req.body.userId;
    req.body.authorName = user?.name ?? "Unknown";
    req.body.createdAt = new Date().toISOString();
    // Add history entry for comment
    const histId = db.history.length > 0 ? Math.max(...db.history.map((h) => h.id)) + 1 : 1;
    db.history.push({
      id: histId,
      ticketId: Number(req.params.id),
      userId: req.body.userId,
      userName: user?.name ?? "Unknown",
      action: "commented",
      field: null,
      oldValue: null,
      newValue: null,
      createdAt: new Date().toISOString(),
    });
    require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
  next();
});

// --- Attachment routes ---

server.get("/tickets/:id/attachments", (req, res) => {
  const ticketId = Number(req.params.id);
  const attachments = (db.attachments || []).filter((a) => a.ticketId === ticketId);
  res.json(attachments);
});

server.post("/tickets/:id/attachments", upload.single("file"), (req, res) => {
  const ticketId = Number(req.params.id);
  const userId = Number(req.body.userId);
  const file = req.file;
  if (!file) return res.status(400).json({ message: "No file provided" });

  const user = db.users.find((u) => u.id === userId);
  const attachments = db.attachments || [];
  const newId = attachments.length > 0 ? Math.max(...attachments.map((a) => a.id)) + 1 : 1;
  const attachment = {
    id: newId,
    ticketId,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype,
    url: `/uploads/${file.filename}`,
    uploadedById: userId,
    uploadedByName: user?.name ?? "Unknown",
    createdAt: new Date().toISOString(),
  };
  attachments.push(attachment);
  db.attachments = attachments;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json(attachment);
});

server.use("/uploads", require("express").static(uploadsDir));

// --- OTP + Pending Registration Approval ---

// In-memory OTP store (not persisted to db.json)
const otpStore = new Map(); // email -> { otp, expiresAt }

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

server.post("/auth/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const otp = generateOtp();
  otpStore.set(email, { otp, expiresAt: Date.now() + 600000 }); // 10 min expiry
  console.log(`[DEV] OTP for ${email}: ${otp}`);
  res.json({ message: "OTP sent to your email" });
});

server.post("/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
  const stored = otpStore.get(email);
  if (!stored) return res.status(400).json({ message: "No OTP sent to this email" });
  if (stored.expiresAt < Date.now()) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP has expired" });
  }
  if (stored.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  otpStore.delete(email);
  // Mark as verified in a temporary set
  if (!db._emailVerified) db._emailVerified = [];
  if (!db._emailVerified.includes(email)) db._emailVerified.push(email);
  res.json({ message: "OTP verified successfully" });
});

server.post("/auth/request-registration", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already registered" });
  }
  // Check OTP verified
  if (!db._emailVerified || !db._emailVerified.includes(email)) {
    return res.status(400).json({ message: "Email not verified. Please verify OTP first." });
  }
  // Remove from verified set
  db._emailVerified = (db._emailVerified || []).filter((e) => e !== email);

  const pending = db.pendingRegistrations || [];
  if (pending.find((p) => p.email === email && p.status === "pending")) {
    return res.status(409).json({ message: "A pending request already exists for this email" });
  }
  const newId = pending.length > 0 ? Math.max(...pending.map((p) => p.id)) + 1 : 1;
  pending.push({
    id: newId,
    name,
    email,
    password,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  db.pendingRegistrations = pending;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json({
    message: "Registration request submitted. Waiting for admin approval.",
    requestId: newId,
  });
});

server.get("/auth/pending-requests", (req, res) => {
  const user = findUserByToken(req.headers.authorization);
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can view pending requests" });
  }
  const pending = (db.pendingRegistrations || []).filter((p) => p.status === "pending");
  const safe = pending.map((p) => ({ id: p.id, name: p.name, email: p.email, createdAt: p.createdAt }));
  res.json(safe);
});

server.post("/auth/approve-request/:id", (req, res) => {
  const user = findUserByToken(req.headers.authorization);
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can approve requests" });
  }
  const id = Number(req.params.id);
  const pending = db.pendingRegistrations || [];
  const idx = pending.findIndex((p) => p.id === id && p.status === "pending");
  if (idx === -1) return res.status(404).json({ message: "Pending request not found" });
  const request = pending[idx];

  // Check if email already taken (might have been created in another way)
  if (db.users.find((u) => u.email === request.email)) {
    pending.splice(idx, 1);
    db.pendingRegistrations = pending;
    require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return res.status(409).json({ message: "Email already registered" });
  }

  // Create the user
  const newId = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
  const newUser = {
    id: newId,
    name: request.name,
    email: request.email,
    password: request.password,
    role: "USER",
    active: true,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  // Update request status
  request.status = "approved";
  db.pendingRegistrations = pending;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.json({ message: "Registration approved. User can now log in.", user: sanitizeUser(newUser) });
});

server.post("/auth/reject-request/:id", (req, res) => {
  const user = findUserByToken(req.headers.authorization);
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can reject requests" });
  }
  const id = Number(req.params.id);
  const pending = db.pendingRegistrations || [];
  const idx = pending.findIndex((p) => p.id === id && p.status === "pending");
  if (idx === -1) return res.status(404).json({ message: "Pending request not found" });
  pending[idx].status = "rejected";
  db.pendingRegistrations = pending;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ message: "Registration request rejected" });
});

// --- User management (sanitized) ---

server.get("/users", (req, res) => {
  const safe = db.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    active: u.active !== false,
    createdAt: u.createdAt || new Date().toISOString(),
  }));
  res.json(safe);
});

server.post("/users", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already exists" });
  }
  const newId = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
  const newUser = { id: newId, name, email, password, role: role || "USER", active: true, createdAt: new Date().toISOString() };
  db.users.push(newUser);
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json(sanitizeUser(newUser));
});

server.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = db.users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { name, email, role, active } = req.body;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (active !== undefined) user.active = active;
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json(sanitizeUser(user));
});

server.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return res.status(404).json({ message: "User not found" });
  db.users.splice(idx, 1);
  require("fs").writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(204).send();
});

server.use(router);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`JSON Server running on http://localhost:${PORT}`);
  console.log(`Auth: POST /auth/login, POST /auth/register`);
  console.log(`Tickets: GET/POST/PUT/DELETE /tickets, /tickets/:id`);
  console.log(`Comments: GET/POST /comments, GET /tickets/:id/comments`);
  console.log(`History: GET /history, GET /tickets/:id/history`);
});
