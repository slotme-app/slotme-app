# E2E Test Cases: Authentication & User Management

**Feature:** US-001 Tenant & Salon Registration, US-002 User Authentication
**Version:** 1.0
**Last Updated:** 2026-02-15
**Status:** Ready for Testing

---

## Test Case TC-AUTH-001: Successful Salon Registration

**Priority:** Critical
**User Story:** US-001

**Description:** Verify that a new salon owner can successfully register their salon on SlotMe platform

**Preconditions:**
- Application is running on port 8080 (backend) and port 3033 (frontend)
- Database is clean (no existing tenant with test email)
- User has valid email address

**Test Steps:**
1. Navigate to the registration page at `http://localhost:3033/register`
2. Fill in Step 1 - Account Creation:
   - Email: `testsalon@example.com`
   - Password: `SecurePass123!`
   - Phone number: `+1234567890`
   - Click "Next"
3. Verify email (in test environment, skip or use auto-verification)
4. Fill in Step 2 - Salon Profile Setup:
   - Salon name: `Beauty Studio Test`
   - Address: `123 Main Street, New York, NY 10001`
   - Phone: `+1234567890`
   - Business hours: Mon-Fri 9:00-18:00, Sat 10:00-16:00
   - Timezone: `America/New_York`
   - Primary language: `English`
   - Salon type: `Multi-service`
   - Click "Next"
5. Skip service catalog (optional step)
6. Skip master invitation (optional step)
7. Click "Launch Your AI Receptionist"

**Expected Results:**
- Registration completes successfully
- User is redirected to the admin dashboard at `/admin/dashboard`
- Welcome message is displayed
- Tenant ID is generated and associated with the salon
- Database contains new tenant record
- Multi-tenancy is properly configured (tenant_id is set)
- Default roles (SALON_ADMIN, MASTER) are created for the tenant
- Success notification appears: "Welcome to SlotMe!"

**Test Data:**
- Email: `testsalon@example.com`
- Password: `SecurePass123!`

---

## Test Case TC-AUTH-002: Registration Validation Errors

**Priority:** High
**User Story:** US-001

**Description:** Verify that registration form properly validates input fields

**Preconditions:**
- Application is running
- User is on the registration page

**Test Steps:**
1. Navigate to `http://localhost:3033/register`
2. Test email validation:
   - Enter invalid email: `invalidemail`
   - Attempt to proceed
   - Expected: Error message "Please enter a valid email address"
3. Test password validation:
   - Enter weak password: `123`
   - Attempt to proceed
   - Expected: Error message "Password must be at least 8 characters"
4. Test required fields:
   - Leave email blank
   - Attempt to proceed
   - Expected: Error message "Email is required"
5. Test duplicate email:
   - Enter email of existing user
   - Complete registration
   - Expected: Error message "Email already registered"

**Expected Results:**
- All validation errors are displayed clearly
- User cannot proceed with invalid data
- Error messages are user-friendly and specific
- Form data is retained when validation fails (except password)

---

## Test Case TC-AUTH-003: Successful Login

**Priority:** Critical
**User Story:** US-002

**Description:** Verify that a registered user can successfully log in to the platform

**Preconditions:**
- User account exists in the database
- Test user: `testsalon@example.com` / `SecurePass123!`
- User is not currently logged in

**Test Steps:**
1. Navigate to `http://localhost:3033/login`
2. Enter email: `testsalon@example.com`
3. Enter password: `SecurePass123!`
4. Click "Login" button
5. Wait for authentication

**Expected Results:**
- Login succeeds within 2 seconds
- User is redirected to `/admin/dashboard`
- JWT access token is returned and stored (check localStorage/sessionStorage)
- JWT refresh token is returned and stored
- Token contains correct user info and tenant_id
- User can see their salon name in the header
- Backend logs show successful authentication with tenant context

**Test Data:**
- Email: `testsalon@example.com`
- Password: `SecurePass123!`

---

## Test Case TC-AUTH-004: Login with Invalid Credentials

**Priority:** High
**User Story:** US-002

**Description:** Verify that login fails with incorrect credentials

**Preconditions:**
- Application is running
- User is on the login page

**Test Steps:**
1. Navigate to `http://localhost:3033/login`
2. Test Case 1 - Wrong password:
   - Email: `testsalon@example.com`
   - Password: `WrongPassword123!`
   - Click "Login"
   - Expected: Error message "Invalid email or password"
3. Test Case 2 - Non-existent email:
   - Email: `nonexistent@example.com`
   - Password: `AnyPassword123!`
   - Click "Login"
   - Expected: Error message "Invalid email or password"
4. Test Case 3 - Empty fields:
   - Email: (blank)
   - Password: (blank)
   - Click "Login"
   - Expected: Validation errors for both fields

**Expected Results:**
- Login fails with appropriate error message
- User remains on login page
- No JWT tokens are generated
- Error message does not reveal whether email exists (security best practice)
- No sensitive information is logged in browser console

---

## Test Case TC-AUTH-005: Token Refresh Flow

**Priority:** High
**User Story:** US-002

**Description:** Verify that expired access tokens are automatically refreshed

**Preconditions:**
- User is logged in
- Access token is about to expire or has expired
- Refresh token is still valid (< 30 days old)

**Test Steps:**
1. Log in as `testsalon@example.com`
2. Capture the initial access token from localStorage
3. Wait for access token to expire (1 hour in production, may be shorter in test)
   OR manually set a short-lived token for testing
4. Make an API call that requires authentication (e.g., GET /api/v1/auth/me)
5. Observe the automatic refresh process

**Expected Results:**
- When access token expires, refresh endpoint is automatically called
- New access token is received and stored
- Original API call succeeds after token refresh
- User experience is seamless (no logout or login prompt)
- No 401 error is shown to the user
- Both old and new tokens maintain the same tenant_id and user context

---

## Test Case TC-AUTH-006: Logout Functionality

**Priority:** Medium
**User Story:** US-002

**Description:** Verify that user can successfully log out

**Preconditions:**
- User is logged in as `testsalon@example.com`

**Test Steps:**
1. Click on user profile avatar in the top right corner
2. Click "Logout" from the dropdown menu
3. Confirm logout if prompted

**Expected Results:**
- User is logged out successfully
- JWT tokens are cleared from storage (localStorage/sessionStorage)
- User is redirected to `/login` page
- Attempting to access protected routes redirects to login
- Backend session is terminated
- Notification confirms: "You have been logged out"

---

## Test Case TC-AUTH-007: Password Reset Request

**Priority:** High
**User Story:** US-002

**Description:** Verify that user can request a password reset

**Preconditions:**
- User account exists: `testsalon@example.com`
- User is not logged in
- Email service is configured (or mocked for testing)

**Test Steps:**
1. Navigate to `http://localhost:3033/login`
2. Click "Forgot Password?" link
3. Enter email: `testsalon@example.com`
4. Click "Send Reset Link"

**Expected Results:**
- Success message: "Password reset link sent to your email"
- Email is sent to `testsalon@example.com` with reset link
- Reset link contains valid token
- Reset token is stored in database with expiration time
- User can click the link in email to access reset form
- Link expires after configured time (e.g., 1 hour)

---

## Test Case TC-AUTH-008: Password Reset Completion

**Priority:** High
**User Story:** US-002

**Description:** Verify that user can successfully reset their password using reset link

**Preconditions:**
- User has received a valid password reset email
- Reset token has not expired

**Test Steps:**
1. Click the reset link from email (format: `/password-reset?token=VALID_TOKEN`)
2. Enter new password: `NewSecurePass456!`
3. Confirm new password: `NewSecurePass456!`
4. Click "Reset Password"

**Expected Results:**
- Password is successfully updated in database
- Success message: "Password has been reset successfully"
- User is redirected to login page
- Old password no longer works
- User can log in with new password
- Reset token is invalidated after use

---

## Test Case TC-AUTH-009: Invalid Reset Token

**Priority:** Medium
**User Story:** US-002

**Description:** Verify that expired or invalid reset tokens are rejected

**Preconditions:**
- User has an expired or invalid reset token

**Test Steps:**
1. Navigate to `/password-reset?token=INVALID_OR_EXPIRED_TOKEN`
2. Attempt to enter new password
3. Click "Reset Password"

**Expected Results:**
- Error message: "Invalid or expired reset link"
- Password is not changed
- User is prompted to request a new reset link
- Link to request new reset is provided

---

## Test Case TC-AUTH-010: Get Current User Info

**Priority:** Medium
**User Story:** US-002

**Description:** Verify that authenticated user can retrieve their profile information

**Preconditions:**
- User is logged in as `testsalon@example.com`

**Test Steps:**
1. Make GET request to `/api/v1/auth/me` with valid JWT token in Authorization header
2. Verify response

**Expected Results:**
- API returns 200 OK
- Response contains:
  - User ID
  - Email
  - Name
  - Role (SALON_ADMIN or MASTER)
  - Tenant ID
  - Salon name
- No sensitive data (password hash) is included in response
- Response time < 500ms

---

## Test Case TC-AUTH-011: Multi-Tenant Isolation on Authentication

**Priority:** Critical
**User Story:** US-001, US-002

**Description:** Verify that users from different tenants cannot access each other's data

**Preconditions:**
- Two separate tenants exist:
  - Tenant A: `salon_a@example.com`
  - Tenant B: `salon_b@example.com`
- Both users are registered

**Test Steps:**
1. Log in as Tenant A user (`salon_a@example.com`)
2. Capture Tenant A's JWT token and tenant_id
3. Make API call to get appointments: GET `/api/v1/appointments`
4. Note the appointments returned (should only be Tenant A's)
5. Log out
6. Log in as Tenant B user (`salon_b@example.com`)
7. Capture Tenant B's JWT token and tenant_id
8. Make API call to get appointments: GET `/api/v1/appointments`
9. Note the appointments returned (should only be Tenant B's)
10. Attempt to use Tenant A's token to access Tenant B's resources (manual API call)

**Expected Results:**
- Each tenant sees only their own data
- Tenant A's JWT contains tenant_id for Tenant A
- Tenant B's JWT contains tenant_id for Tenant B
- Attempting to access another tenant's data returns 403 Forbidden or 404 Not Found
- Database queries include tenant_id filter (verify in logs)
- No cross-tenant data leakage occurs

---

## Test Case TC-AUTH-012: Session Timeout and Redirect

**Priority:** Medium
**User Story:** US-002

**Description:** Verify that user is redirected to login when session expires

**Preconditions:**
- User is logged in
- Both access and refresh tokens expire

**Test Steps:**
1. Log in as `testsalon@example.com`
2. Wait for both tokens to expire OR manually delete tokens from storage
3. Attempt to navigate to a protected route (e.g., `/admin/calendar`)
4. Attempt to make an API call

**Expected Results:**
- User is automatically redirected to `/login`
- Error message: "Session expired. Please log in again."
- Protected routes are inaccessible
- API calls return 401 Unauthorized
- After logging in again, user can access protected routes

---

## Test Case TC-AUTH-013: Login on Mobile Devices

**Priority:** Medium
**User Story:** US-002

**Description:** Verify that login works correctly on mobile browsers

**Preconditions:**
- Application is accessible from mobile device or browser in mobile view
- Test user account exists

**Test Steps:**
1. Open mobile browser (Chrome, Safari on iOS/Android)
   OR use Chrome DevTools mobile emulation
2. Navigate to `http://localhost:3033/login`
3. Verify responsive layout
4. Enter email: `testsalon@example.com`
5. Enter password: `SecurePass123!`
6. Tap "Login" button

**Expected Results:**
- Login page is mobile-responsive
- Input fields are easily tappable (touch targets at least 44x44px)
- Keyboard doesn't obscure input fields
- Login succeeds
- User is redirected to mobile-optimized dashboard
- Touch interactions work smoothly

---

## Edge Cases and Error Scenarios

### TC-AUTH-014: Rapid Login Attempts (Rate Limiting)

**Priority:** High
**Description:** Verify that excessive login attempts are rate-limited

**Test Steps:**
1. Attempt to log in with wrong password 10 times in quick succession
2. Observe behavior

**Expected Results:**
- After 5 failed attempts, account is temporarily locked or CAPTCHA is required
- Error message: "Too many failed login attempts. Please try again in 15 minutes."
- Rate limiting prevents brute-force attacks

---

### TC-AUTH-015: Concurrent Login Sessions

**Priority:** Low
**Description:** Verify behavior when same user logs in from multiple devices

**Test Steps:**
1. Log in from Browser A
2. Log in from Browser B with the same credentials
3. Verify both sessions

**Expected Results:**
- Both sessions remain active (default behavior)
OR
- First session is invalidated if single-session policy is enforced
- User is notified of concurrent login if configured

---

### TC-AUTH-016: SQL Injection Attempts

**Priority:** Critical
**Description:** Verify that authentication is secure against SQL injection

**Test Steps:**
1. Attempt login with SQL injection payloads in email and password fields:
   - Email: `admin' OR '1'='1`
   - Password: `' OR '1'='1 --`
2. Attempt registration with malicious input

**Expected Results:**
- Login fails gracefully
- No SQL errors are exposed to the user
- Application handles malicious input safely
- Database queries use parameterized statements (verify in code)

---

## Summary

**Total Test Cases:** 16
- Critical Priority: 6
- High Priority: 6
- Medium Priority: 3
- Low Priority: 1

**Coverage:**
- User Registration: 2 test cases
- User Login: 5 test cases
- Password Reset: 3 test cases
- Token Management: 2 test cases
- Multi-Tenancy: 1 test case
- Security & Edge Cases: 3 test cases

**Estimated Testing Time:** 2-3 hours for full manual execution
