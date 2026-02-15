# US-002: User Authentication - E2E Test Cases

## Story Summary
As a salon owner or master, I want to log in securely with my credentials, so that I can access my dashboard. This includes login, logout, password reset, protected route guards, and token refresh.

## Preconditions
- App is running on http://localhost:2999
- A registered admin account exists (admin@slotme-demo.com / demo-password-123)
- No authenticated session for auth tests (clear storage state)

## Test Cases

### TC-002-01: Display Login Page
**Priority:** High
**Description:** Verify the login page renders all required elements.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Check for Email input field -> **Expected:** Email input is visible with label "Email"
3. Check for Password input field -> **Expected:** Password input is visible with label "Password"
4. Check for "Sign in" button -> **Expected:** Submit button is visible

### TC-002-02: Successful Login
**Priority:** High
**Description:** Verify a user can log in with valid credentials and is redirected to the dashboard.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Fill email: "admin@slotme-demo.com" -> **Expected:** Field accepts input
3. Fill password: "demo-password-123" -> **Expected:** Field accepts input (masked)
4. Click "Sign in" button -> **Expected:** Login succeeds
5. Verify URL -> **Expected:** Redirected to `/admin` dashboard
6. Verify dashboard elements -> **Expected:** Sidebar with navigation links is visible

### TC-002-03: Login with Invalid Credentials
**Priority:** High
**Description:** Verify the system shows an error for invalid credentials.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Fill email: "wrong@email.com" -> **Expected:** Field accepts input
3. Fill password: "wrongpassword" -> **Expected:** Field accepts input
4. Click "Sign in" button -> **Expected:** Error message appears or stays on `/login` page
5. Verify URL -> **Expected:** Remains on `/login`

### TC-002-04: Login with Valid Email but Wrong Password
**Priority:** High
**Description:** Verify the system rejects login when the password is incorrect.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Fill email: "admin@slotme-demo.com" -> **Expected:** Field accepts input
3. Fill password: "wrong-password" -> **Expected:** Field accepts input
4. Click "Sign in" button -> **Expected:** Error message appears, remains on login page

### TC-002-05: Login Form Validation - Empty Fields
**Priority:** High
**Description:** Verify the login form prevents submission with empty fields.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Leave both fields empty and click "Sign in" -> **Expected:** Validation errors for required fields
3. Fill only email and click "Sign in" -> **Expected:** Validation error for password
4. Clear email, fill only password and click "Sign in" -> **Expected:** Validation error for email

### TC-002-06: Protected Route Guard - Admin Routes
**Priority:** High
**Description:** Verify unauthenticated users cannot access admin routes.

**Steps:**
1. Navigate to `/admin` (without auth) -> **Expected:** Redirected to `/login`
2. Navigate to `/admin/calendar` (without auth) -> **Expected:** Redirected to `/login`
3. Navigate to `/admin/masters` (without auth) -> **Expected:** Redirected to `/login`
4. Navigate to `/admin/services` (without auth) -> **Expected:** Redirected to `/login`
5. Navigate to `/admin/clients` (without auth) -> **Expected:** Redirected to `/login`
6. Navigate to `/admin/channels` (without auth) -> **Expected:** Redirected to `/login`
7. Navigate to `/admin/settings` (without auth) -> **Expected:** Redirected to `/login`

### TC-002-07: Protected Route Guard - Master Routes
**Priority:** High
**Description:** Verify unauthenticated users cannot access master routes.

**Steps:**
1. Navigate to `/master` (without auth) -> **Expected:** Redirected to `/login`

### TC-002-08: Display Password Reset Page
**Priority:** High
**Description:** Verify the password reset page renders correctly.

**Steps:**
1. Navigate to `/password-reset` -> **Expected:** Page loads
2. Check for Email input -> **Expected:** Email input is visible
3. Check for submit button -> **Expected:** A button with text "Reset" or "Send" is visible

### TC-002-09: Password Reset Request
**Priority:** Medium
**Description:** Verify a user can request a password reset.

**Steps:**
1. Navigate to `/password-reset` -> **Expected:** Page loads
2. Fill email: "admin@slotme-demo.com" -> **Expected:** Field accepts input
3. Click the reset/send button -> **Expected:** Success message indicating reset email was sent

### TC-002-10: Navigate Between Login and Register
**Priority:** Medium
**Description:** Verify navigation links between login and register pages work.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Find and click "Register" or "Sign up" or "Create account" link -> **Expected:** Navigated to `/register`
3. Navigate back to `/login` -> **Expected:** Login page loads

### TC-002-11: Navigate from Login to Password Reset
**Priority:** Medium
**Description:** Verify the user can navigate to password reset from login.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Find and click "Forgot password" link -> **Expected:** Navigated to `/password-reset`

### TC-002-12: Logout
**Priority:** High
**Description:** Verify a logged-in user can log out.

**Steps:**
1. Log in with valid credentials -> **Expected:** Dashboard loads
2. Click the user/profile menu button -> **Expected:** Dropdown menu appears
3. Click "Sign out" menu item -> **Expected:** User is logged out
4. Verify URL -> **Expected:** Redirected to `/login`
5. Navigate to `/admin` -> **Expected:** Redirected to `/login` (session cleared)

## Edge Cases

### EC-002-01: Login with Email Case Sensitivity
**Description:** Verify login handles email case variations.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Fill email: "ADMIN@SLOTME-DEMO.COM" (uppercase) -> **Expected:** Field accepts input
3. Fill correct password -> **Expected:** Field accepts input
4. Click "Sign in" -> **Expected:** Login should succeed (email is case-insensitive)

### EC-002-02: Password Field Masking
**Description:** Verify the password field masks input.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Fill password: "test123" -> **Expected:** Characters are masked (shown as dots or asterisks)
3. Check password input type attribute -> **Expected:** Input type is "password"

### EC-002-03: Multiple Failed Login Attempts
**Description:** Verify the system handles multiple failed login attempts.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Attempt login with wrong credentials 5 times -> **Expected:** Error shown each time, no crash
3. Attempt login with correct credentials -> **Expected:** Login succeeds (unless rate-limited, in which case clear error message should appear)
