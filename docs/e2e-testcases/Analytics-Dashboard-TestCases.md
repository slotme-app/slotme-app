# E2E Test Cases: Analytics & Dashboard

**Feature:** Analytics, Reporting, and Dashboard Features
**Version:** 1.0
**Last Updated:** 2026-02-15
**Status:** Ready for Testing

---

## ANALYTICS DASHBOARD

### Test Case TC-ANALYTICS-001: View Analytics Dashboard

**Priority:** Medium
**User Story:** Analytics

**Description:** Verify that admin can access and view analytics dashboard

**Preconditions:**
- User is logged in as SALON_ADMIN
- Historical data exists (appointments over past 30 days)

**Test Steps:**
1. Navigate to Analytics page (`/admin/analytics`)
2. Observe dashboard layout
3. Review all sections

**Expected Results:**
- Dashboard loads within 3 seconds
- Key metrics cards display at top:
  - Total Bookings (with % change from previous period)
  - Revenue Estimate (with % change)
  - Average Utilization Rate (with % change)
  - No-show Rate (with % change)
  - New Clients (with % change)
- Charts are rendered correctly
- Date range selector visible (default: Last 30 Days)
- All data is tenant-isolated (only current salon's data)

---

### Test Case TC-ANALYTICS-002: Bookings Over Time Chart

**Priority:** Medium
**User Story:** Analytics

**Description:** Verify that bookings trend chart displays correctly

**Preconditions:**
- Analytics dashboard is open
- Booking data exists

**Test Steps:**
1. View "Bookings Over Time" line chart
2. Hover over data points
3. Change date range to "This Week"
4. Observe chart update

**Expected Results:**
- Line chart shows daily booking counts
- X-axis: Dates
- Y-axis: Number of bookings
- Overlay line shows cancellations
- Tooltip on hover shows:
  - Date
  - Bookings count
  - Cancellations count
- Chart updates when date range changes
- Data is accurate (matches database query)

---

### Test Case TC-ANALYTICS-003: Revenue by Service Chart

**Priority:** Medium
**User Story:** Analytics

**Description:** Verify revenue breakdown by service category

**Preconditions:**
- Multiple services exist with different prices
- Completed appointments in selected date range

**Test Steps:**
1. View "Revenue by Service" bar chart
2. Review data

**Expected Results:**
- Horizontal bar chart displayed
- Bars represent service categories:
  - Hair services: $X
  - Nail services: $Y
  - Other: $Z
- Bars sorted by revenue (highest first)
- Tooltip shows exact revenue amount
- Revenue calculated from COMPLETED appointments only
- Data matches actual transaction records

---

### Test Case TC-ANALYTICS-004: Master Utilization Report

**Priority:** High
**User Story:** Analytics

**Description:** Verify master utilization calculation and display

**Preconditions:**
- Multiple masters exist
- Working hours configured for each master
- Appointments exist

**Test Steps:**
1. View "Master Utilization" stacked bar chart
2. Review each master's utilization

**Expected Results:**
- Each master shown as a bar
- Bar shows:
  - Booked hours (colored)
  - Available hours (lighter shade)
  - Percentage displayed
- Calculation: (Booked hours / Total working hours) × 100
- Example:
  - Alina: 32h booked / 40h available = 80% utilization
- Masters sorted by utilization (highest first)
- Date range filtering works
- Hover shows exact hours

---

### Test Case TC-ANALYTICS-005: Bookings by Channel Chart

**Priority:** Medium
**User Story:** Analytics

**Description:** Verify booking source tracking and visualization

**Preconditions:**
- Appointments booked via different channels
- WhatsApp, Manual (admin), AI channels used

**Test Steps:**
1. View "Bookings by Channel" pie/donut chart
2. Review breakdown

**Expected Results:**
- Chart shows percentage breakdown:
  - WhatsApp: 60%
  - Manual (Admin): 30%
  - Facebook Messenger: 10%
- Each channel has distinct color
- Legend shows channel names and counts
- Click on segment to filter dashboard by channel
- Total equals 100%

---

### Test Case TC-ANALYTICS-006: Popular Booking Times Heatmap

**Priority:** Low
**User Story:** Analytics

**Description:** Verify heatmap showing booking patterns by day and hour

**Preconditions:**
- Historical booking data exists

**Test Steps:**
1. View "Popular Booking Times" heatmap
2. Analyze patterns

**Expected Results:**
- Heatmap grid displayed:
  - Rows: Days of week (Mon-Sun)
  - Columns: Hours of day (9am-6pm)
- Color intensity indicates booking volume:
  - Dark green: High volume (10+ bookings)
  - Light green: Medium volume (5-9 bookings)
  - Yellow: Low volume (1-4 bookings)
  - White: No bookings
- Hover shows exact count
- Helps identify peak hours and slow periods

---

### Test Case TC-ANALYTICS-007: Client Retention Metrics

**Priority:** Medium
**User Story:** Analytics

**Description:** Verify client retention tracking

**Preconditions:**
- Clients with multiple visits exist

**Test Steps:**
1. View "Client Insights" section
2. Review retention metrics

**Expected Results:**
- Metrics displayed:
  - Client retention rate: X% (clients who rebooked within 60 days)
  - New vs Returning ratio: Pie chart
  - Top 10 clients by visit count
  - Average visits per client
- Calculations are accurate
- Trend over time shown (if historical data available)

---

### Test Case TC-ANALYTICS-008: Date Range Filtering

**Priority:** High
**User Story:** Analytics

**Description:** Verify that analytics can be filtered by date range

**Preconditions:**
- Data exists for multiple time periods

**Test Steps:**
1. Use date range selector
2. Test presets:
   - Today
   - This Week
   - This Month
   - Last 30 Days
   - Custom Range
3. For each, verify data updates

**Expected Results:**
- All charts and metrics update when date range changes
- Custom range allows selecting any start and end date
- Date range is displayed clearly
- "Compare to previous period" toggle works:
  - Shows percentage change
  - Comparison period automatically calculated
- All data accurately reflects selected period

---

### Test Case TC-ANALYTICS-009: Export Analytics Report

**Priority:** Low
**User Story:** Analytics

**Description:** Verify that analytics can be exported

**Preconditions:**
- Analytics dashboard is open
- Data is displayed

**Test Steps:**
1. Click "Export" button
2. Select format: PDF or CSV
3. Confirm export

**Expected Results:**
- PDF format:
  - Professional layout
  - All charts included as images
  - Summary statistics table
  - Salon branding (logo, name)
  - Date range and generation date
- CSV format:
  - Raw data in tabular format
  - One row per appointment/metric
  - Column headers clear
- File downloads successfully
- Filename includes date range

---

## DASHBOARD HOME PAGE

### Test Case TC-DASH-001: Admin Home Dashboard Overview

**Priority:** High
**User Story:** Dashboard

**Description:** Verify admin dashboard home page displays key information

**Preconditions:**
- User is logged in as SALON_ADMIN
- Appointments exist for today

**Test Steps:**
1. Log in and land on dashboard home (`/admin/dashboard`)
2. Review all dashboard sections

**Expected Results:**
- **Header:** Salon name, date, quick stats
- **Today's Appointments Section:**
  - Timeline of today's appointments across all masters
  - Each appointment shows: Time, Master, Client, Service
  - Color-coded by status
  - Real-time or refreshed every 30 seconds
- **Key Metrics Cards:**
  - Bookings today: Count
  - Revenue estimate today: $
  - Utilization today: %
  - No-shows today: Count
- **Recent Activity Feed:**
  - Last 10-20 events:
    - New bookings
    - Cancellations
    - New clients
    - Master updates
  - Each with timestamp
- **Quick Actions:**
  - "New Appointment" button
  - "View Calendar" button
- Load time < 3 seconds
- Mobile responsive

---

### Test Case TC-DASH-002: Master Dashboard - My Day View

**Priority:** High
**User Story:** Dashboard

**Description:** Verify master sees their personalized dashboard

**Preconditions:**
- User is logged in as MASTER (Alina)
- Alina has appointments today

**Test Steps:**
1. Log in as master
2. Land on master dashboard (`/master`)

**Expected Results:**
- **Next Up Card (prominent):**
  - Next appointment details
  - Client name and photo
  - Service and duration
  - Time
  - Client notes/preferences
  - Quick actions: Call, Message, View Details
- **Today's Schedule Timeline:**
  - All of master's appointments for today
  - Time slots
  - Booked vs available slots
  - Lunch breaks and blocked time
- **Quick Stats:**
  - Appointments today: Count
  - Hours booked: X/Y
  - Gaps in schedule: List
- **Notifications:**
  - Unread notifications badge
- Mobile-optimized layout

---

### Test Case TC-DASH-003: Dashboard Real-Time Updates

**Priority:** Medium
**User Story:** Dashboard

**Description:** Verify dashboard updates when new appointments are created

**Preconditions:**
- Admin has dashboard open
- Second user or client creates new appointment

**Test Steps:**
1. Admin A has dashboard open
2. Admin B (or client via AI) creates new appointment for today
3. Wait 30 seconds

**Expected Results:**
- Dashboard auto-refreshes or polls every 30 seconds
- New appointment appears in "Today's Appointments"
- Activity feed shows "New booking: [details]"
- Metrics update (bookings count increments)
- Optional: Toast notification "New appointment added"
- No manual refresh needed

---

### Test Case TC-DASH-004: Empty State Handling

**Priority:** Low
**User Story:** Dashboard

**Description:** Verify dashboard displays appropriately when no data exists

**Preconditions:**
- New salon with no appointments yet

**Test Steps:**
1. Log in to new salon account
2. View dashboard

**Expected Results:**
- No errors or broken UI
- Empty state messages:
  - "No appointments today"
  - "Get started by adding your first master or service"
- Helpful onboarding tips
- Quick setup wizard or checklist
- Invitation to complete setup

---

## MOBILE RESPONSIVENESS

### Test Case TC-MOBILE-001: Dashboard on Mobile Device

**Priority:** Medium
**User Story:** Dashboard, Mobile

**Description:** Verify dashboard is mobile-responsive

**Preconditions:**
- Access from mobile device or browser in mobile view (375px width)

**Test Steps:**
1. Open dashboard on mobile
2. Navigate through sections
3. Test interactions

**Expected Results:**
- Layout adapts to mobile screen
- Bottom tab navigation (Home, Calendar, Masters, Messages, More)
- Cards stack vertically
- Charts are readable and interactive
- Touch targets are at least 44x44px
- Horizontal scrolling on tables (if needed)
- Floating action button for quick "New Appointment"
- No broken layout or overlapping elements

---

### Test Case TC-MOBILE-002: Calendar View on Mobile

**Priority:** Medium
**User Story:** Calendar, Mobile

**Description:** Verify calendar is usable on mobile

**Test Steps:**
1. Open calendar on mobile
2. View day/week views

**Expected Results:**
- Day view: Single master at a time, swipe between masters
- Week view: Simplified grid or list view
- Appointments are tappable
- Create appointment button easily accessible
- Zoom and pan work smoothly
- No performance issues

---

## PERFORMANCE & RELIABILITY

### Test Case TC-PERF-001: Dashboard Load Performance

**Priority:** Medium
**User Story:** Performance

**Description:** Verify dashboard loads quickly with large datasets

**Preconditions:**
- Database has 1000+ appointments
- 10+ masters
- 50+ services

**Test Steps:**
1. Clear browser cache
2. Navigate to dashboard
3. Measure load time

**Expected Results:**
- Initial page load < 3 seconds
- Charts render progressively
- Data queries are optimized (indexed)
- Pagination used for large lists
- No UI freezing or lag

---

### Test Case TC-PERF-002: Analytics with Large Date Range

**Priority:** Medium
**User Story:** Performance

**Description:** Verify analytics performs well with large date ranges

**Test Steps:**
1. Select date range: Last 365 days
2. Load analytics dashboard

**Expected Results:**
- Query completes within 5 seconds
- Charts render without freezing
- Data may be aggregated (daily → weekly → monthly for large ranges)
- Progress indicator shown during load
- Browser doesn't crash

---

## Edge Cases

### TC-DASH-005: Multi-Tenant Data Isolation in Dashboard

**Priority:** Critical
**User Story:** Multi-tenancy

**Description:** Verify dashboard shows only tenant-specific data

**Test Steps:**
1. Log in as Tenant A
2. View dashboard, note appointment count
3. Log in as Tenant B
4. View dashboard

**Expected Results:**
- Each tenant sees only their own data
- No data leakage
- All queries filtered by tenant_id
- Metrics calculations are tenant-specific

---

### TC-ANALYTICS-010: No Data Available State

**Priority:** Low
**User Story:** Analytics

**Description:** Verify analytics handles no data gracefully

**Test Steps:**
1. Select date range with no appointments
2. View analytics

**Expected Results:**
- Charts show empty state
- Message: "No data available for this period"
- No errors or broken charts
- Suggestion to try different date range

---

## Summary

**Total Test Cases:** 23
- Critical Priority: 2
- High Priority: 5
- Medium Priority: 13
- Low Priority: 3

**Coverage:**
- Analytics Dashboard: 10 test cases
- Admin Dashboard: 4 test cases
- Master Dashboard: 1 test case
- Mobile Responsiveness: 2 test cases
- Performance: 2 test cases
- Edge Cases: 4 test cases

**Estimated Testing Time:** 2-3 hours for full manual execution

**Dependencies:**
- Test data must be seeded for meaningful analytics
- Date/time mocking may be needed for time-based tests
- Performance tests require production-like data volumes
