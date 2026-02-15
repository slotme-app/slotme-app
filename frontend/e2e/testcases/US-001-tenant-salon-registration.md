# US-001: Tenant & Salon Registration - E2E Test Cases

## Story Summary
As a salon owner, I want to register my salon on SlotMe, so that I can start managing appointments digitally. The registration page collects admin details (name, email, password) and salon details (name, address, timezone).

## Preconditions
- App is running on http://localhost:2999
- No authenticated session (clear storage state)
- Database is accessible and accepts new registrations

## Test Cases

### TC-001-01: Display Registration Page
**Priority:** High
**Description:** Verify the registration page renders with all required fields.

**Steps:**
1. Navigate to `/register` -> **Expected:** Page loads without errors
2. Check for "Salon Name" label/input -> **Expected:** Salon name field is visible
3. Check for "Email" label/input -> **Expected:** Email field is visible
4. Check for "Password" label/input -> **Expected:** Password field is visible
5. Check for submit/register button -> **Expected:** A submit button is visible

### TC-001-02: Successful Registration
**Priority:** High
**Description:** Verify a new tenant and salon can be created with valid data.

**Steps:**
1. Navigate to `/register` -> **Expected:** Registration page loads
2. Fill in salon name: "Test Salon" -> **Expected:** Field accepts input
3. Fill in admin email: "newadmin@test.com" -> **Expected:** Field accepts input
4. Fill in password: "SecurePass123!" -> **Expected:** Field accepts input (masked)
5. Fill in any additional required fields (address, timezone, admin name) -> **Expected:** Fields accept input
6. Click the register/submit button -> **Expected:** Registration succeeds, user is redirected to `/admin` dashboard or onboarding flow

### TC-001-03: Registration Form Validation - Empty Fields
**Priority:** High
**Description:** Verify the form prevents submission with empty required fields.

**Steps:**
1. Navigate to `/register` -> **Expected:** Registration page loads
2. Leave all fields empty and click submit -> **Expected:** Validation errors appear for required fields
3. Fill only email, leave salon name and password empty, click submit -> **Expected:** Validation errors for salon name and password
4. Fill only salon name and email, leave password empty, click submit -> **Expected:** Validation error for password

### TC-001-04: Registration Form Validation - Invalid Email
**Priority:** High
**Description:** Verify the form validates email format.

**Steps:**
1. Navigate to `/register` -> **Expected:** Registration page loads
2. Fill salon name: "Test Salon" -> **Expected:** Field accepts input
3. Fill email: "not-an-email" -> **Expected:** Field accepts input
4. Fill password: "SecurePass123!" -> **Expected:** Field accepts input
5. Click submit -> **Expected:** Validation error indicating invalid email format

### TC-001-05: Registration Form Validation - Weak Password
**Priority:** Medium
**Description:** Verify the form enforces password strength requirements.

**Steps:**
1. Navigate to `/register` -> **Expected:** Registration page loads
2. Fill all fields with valid data except password: "123" -> **Expected:** Field accepts input
3. Click submit -> **Expected:** Validation error indicating password is too weak or short

### TC-001-06: Registration with Duplicate Email
**Priority:** High
**Description:** Verify the system prevents registration with an already-used email.

**Steps:**
1. Navigate to `/register` -> **Expected:** Registration page loads
2. Fill salon name: "Another Salon" -> **Expected:** Field accepts input
3. Fill email: "admin@slotme-demo.com" (existing admin) -> **Expected:** Field accepts input
4. Fill password: "SecurePass123!" -> **Expected:** Field accepts input
5. Click submit -> **Expected:** Error message indicating email is already in use

### TC-001-07: Navigate from Registration to Login
**Priority:** Medium
**Description:** Verify users can navigate from registration page to login page.

**Steps:**
1. Navigate to `/register` -> **Expected:** Registration page loads
2. Look for a "Sign in" or "Login" link -> **Expected:** Link is visible
3. Click the login link -> **Expected:** User is navigated to `/login`

## Edge Cases

### EC-001-01: Registration with Very Long Salon Name
**Description:** Verify the form handles a very long salon name gracefully.

**Steps:**
1. Navigate to `/register` -> **Expected:** Registration page loads
2. Fill salon name with 500+ character string -> **Expected:** Either field truncates input or validation error is shown
3. Fill remaining fields with valid data and submit -> **Expected:** Either success with truncated name or clear validation error

### EC-001-02: Registration with Special Characters
**Description:** Verify registration handles special characters in salon name and admin name.

**Steps:**
1. Navigate to `/register` -> **Expected:** Registration page loads
2. Fill salon name: "Maria's Hair & Beauty - Salon #1" -> **Expected:** Field accepts special characters
3. Fill remaining fields with valid data and submit -> **Expected:** Registration succeeds with special characters preserved

### EC-001-03: Double-Click Prevention on Submit
**Description:** Verify double-clicking the submit button does not create duplicate registrations.

**Steps:**
1. Navigate to `/register` -> **Expected:** Registration page loads
2. Fill all fields with valid data -> **Expected:** Fields populated
3. Double-click the submit button rapidly -> **Expected:** Only one registration attempt is made; button is disabled after first click or duplicate is prevented
