# SlotMe App - Frontend Technical Specification

> Version: 1.0
> Date: 2026-02-07
> Status: Draft

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Application Structure](#2-application-structure)
3. [Pages & Views](#3-pages--views)
4. [Component Architecture](#4-component-architecture)
5. [State Management Strategy](#5-state-management-strategy)
6. [API Integration Layer](#6-api-integration-layer)
7. [Real-Time Features](#7-real-time-features)
8. [Multi-Tenant Theming](#8-multi-tenant-theming)
9. [Responsive Design](#9-responsive-design)
10. [Testing Strategy](#10-testing-strategy)
11. [Performance Considerations](#11-performance-considerations)

---

## 1. Technology Stack

### Framework: React 19 + Vite 6

**Choice: React SPA with Vite** (not Next.js)

**Justification:**
- SlotMe's frontend is an **admin dashboard behind authentication** -- SEO is irrelevant, eliminating Next.js's primary advantage (SSR/SSG).
- Vite provides lightning-fast HMR and cold starts via native ES modules, resulting in a superior developer experience for SPA development.
- The backend is a separate Java/Quarkus service. A decoupled SPA architecture keeps frontend and backend independently deployable.
- Vite's build toolchain (Rollup-based) produces optimized production bundles with automatic code splitting.
- Simpler deployment model: the frontend compiles to static assets served from a CDN or any static host.

### UI Component Library: shadcn/ui + Radix UI Primitives

**Justification:**
- shadcn/ui provides pre-built, accessible components built on Radix UI and styled with Tailwind CSS.
- Components are copied into the project source, giving full ownership and customization control -- critical for multi-tenant theming.
- No dependency lock-in; components can be modified freely without fighting a library's API.
- Built-in accessibility (ARIA attributes, keyboard navigation) via Radix primitives.

### Styling: Tailwind CSS 4

- Utility-first approach for rapid, consistent UI development.
- CSS variables for dynamic multi-tenant theming.
- Tailwind's `@layer` and design token system align with shadcn/ui conventions.

### State Management

| Concern | Library |
|---------|---------|
| Server state (API data) | TanStack Query v5 (React Query) |
| Global client state | Zustand |
| Form state | React Hook Form + Zod |

### Build & Development Tools

| Tool | Purpose |
|------|---------|
| Vite 6 | Build tool and dev server |
| TypeScript 5.x | Type safety |
| ESLint + Prettier | Code quality and formatting |
| pnpm | Package manager (fast, disk-efficient) |

### Testing

| Tool | Purpose |
|------|---------|
| Vitest | Unit and integration tests |
| React Testing Library | Component testing |
| Playwright | E2E testing |
| MSW (Mock Service Worker) | API mocking for tests |

### Additional Libraries

| Library | Purpose |
|---------|---------|
| FullCalendar 6 | Calendar/scheduling component |
| TanStack Router | Type-safe file-based routing |
| react-use-websocket | WebSocket connection management |
| date-fns | Date manipulation |
| recharts | Charts and analytics |
| lucide-react | Icon set (pairs with shadcn/ui) |
| i18next + react-i18next | Internationalization |
| axios | HTTP client |

---

## 2. Application Structure

### Project Folder Structure

```
src/
  app/
    routes/                     # TanStack Router file-based routes
      __root.tsx                 # Root layout
      _auth/                    # Auth layout (no sidebar)
        login.tsx
        register.tsx
        password-reset.tsx
        invite.$token.tsx
      _dashboard/               # Dashboard layout (sidebar + header)
        _admin/                 # Salon admin routes
          index.tsx             # Admin overview/home
          masters/
            index.tsx           # Masters list
            $masterId.tsx       # Master detail/edit
            new.tsx             # Add master
          services/
            index.tsx           # Services catalog
          clients/
            index.tsx           # Client database
            $clientId.tsx       # Client detail
          calendar/
            index.tsx           # Calendar overview (all masters)
          channels/
            index.tsx           # Communication channels setup
          analytics/
            index.tsx           # Analytics & reports
          settings/
            index.tsx           # Salon settings
        _master/                # Master-specific routes
          index.tsx             # My calendar (day/week)
          appointments.tsx      # My appointments list
          services.tsx          # My services
          availability.tsx      # My availability settings
          clients.tsx           # My client history
          notifications.tsx     # Notifications
  components/
    ui/                         # shadcn/ui base components
      button.tsx
      dialog.tsx
      dropdown-menu.tsx
      input.tsx
      table.tsx
      ...
    calendar/                   # Calendar-specific components
      CalendarView.tsx
      AppointmentCard.tsx
      TimeSlotPicker.tsx
      MasterColumn.tsx
      DayView.tsx
      WeekView.tsx
      MonthView.tsx
    layout/
      DashboardLayout.tsx
      Sidebar.tsx
      Header.tsx
      MobileSidebar.tsx
      BreadcrumbNav.tsx
    masters/
      MasterCard.tsx
      MasterForm.tsx
      MasterSchedule.tsx
    services/
      ServiceCard.tsx
      ServiceForm.tsx
      ServiceCategoryList.tsx
    clients/
      ClientCard.tsx
      ClientHistory.tsx
      ClientSearchBar.tsx
    channels/
      ChannelCard.tsx
      WhatsAppSetup.tsx
      FacebookSetup.tsx
      SMSSetup.tsx
    conversations/
      ConversationViewer.tsx
      MessageBubble.tsx
      ConversationList.tsx
    notifications/
      NotificationBell.tsx
      NotificationPanel.tsx
      NotificationItem.tsx
    analytics/
      MetricCard.tsx
      AppointmentChart.tsx
      RevenueChart.tsx
      OccupancyChart.tsx
    common/
      LoadingSpinner.tsx
      EmptyState.tsx
      ErrorBoundary.tsx
      ConfirmDialog.tsx
      Avatar.tsx
      StatusBadge.tsx
      DateRangePicker.tsx
  hooks/
    useAuth.ts
    useTenant.ts
    useWebSocket.ts
    useCalendar.ts
    useNotifications.ts
    usePermissions.ts
    useDebounce.ts
  lib/
    api/
      client.ts               # Axios instance with interceptors
      auth.ts                  # Auth API calls
      masters.ts               # Masters API calls
      services.ts              # Services API calls
      clients.ts               # Clients API calls
      appointments.ts          # Appointments API calls
      channels.ts              # Channels API calls
      analytics.ts             # Analytics API calls
      settings.ts              # Settings API calls
    queries/
      auth.queries.ts          # TanStack Query options for auth
      masters.queries.ts
      services.queries.ts
      clients.queries.ts
      appointments.queries.ts
      channels.queries.ts
      analytics.queries.ts
    websocket/
      connection.ts            # WebSocket connection manager
      events.ts                # Event type definitions
      handlers.ts              # Event handler registry
    utils/
      date.ts                  # Date formatting utilities
      currency.ts              # Currency formatting
      validation.ts            # Shared Zod schemas
      permissions.ts           # Permission checking helpers
  stores/
    authStore.ts               # Auth state (Zustand)
    tenantStore.ts             # Tenant/salon state
    notificationStore.ts       # Notification state
    sidebarStore.ts            # UI sidebar state
  types/
    api.ts                     # API response types
    models.ts                  # Domain model types
    auth.ts                    # Auth-related types
    calendar.ts                # Calendar event types
    websocket.ts               # WebSocket event types
  theme/
    tokens.ts                  # Design token definitions
    provider.tsx               # TenantThemeProvider
    defaults.ts                # Default theme values
  i18n/
    config.ts
    locales/
      en.json
      ...
  assets/
    images/
    fonts/
```

### Routing Architecture

TanStack Router is chosen for its type-safe routing with first-class TypeScript support. File-based routing maps directly to the folder structure.

**Route hierarchy:**

```
/ (root)
  /login
  /register
  /password-reset
  /invite/:token
  /admin                         # Salon admin area
    /admin/                      # Overview dashboard
    /admin/masters               # Masters management
    /admin/masters/:id           # Master detail
    /admin/masters/new           # Add master
    /admin/services              # Services management
    /admin/clients               # Client database
    /admin/clients/:id           # Client detail
    /admin/calendar              # Calendar overview
    /admin/channels              # Communication channels
    /admin/analytics             # Analytics
    /admin/settings              # Salon settings
  /master                        # Master area
    /master/                     # My calendar
    /master/appointments         # My appointments
    /master/services             # My services
    /master/availability         # Availability settings
    /master/clients              # My client history
    /master/notifications        # Notifications
```

**Route guards** are implemented as layout route loaders that check authentication and role-based access before rendering child routes.

### Module Organization

The codebase follows a **feature-based structure** where each domain area (masters, services, clients, etc.) has co-located components, API calls, and query definitions. Shared UI primitives live in `components/ui/`. This keeps related code together while avoiding duplication of common utilities.

---

## 3. Pages & Views

### Authentication

#### Login Page (`/login`)
- **Purpose:** Authenticate salon admins and masters.
- **Key components:** Email input, password input, "Remember me" checkbox, "Forgot password" link, submit button.
- **Data requirements:** POST credentials to auth endpoint, receive JWT access + refresh tokens.
- **Notes:** After login, redirect based on user role (admin -> `/admin`, master -> `/master`).

#### Register Page (`/register`)
- **Purpose:** Register a new salon (tenant) and its first admin user.
- **Key components:** Multi-step form -- Step 1: Admin details (name, email, password). Step 2: Salon details (name, address, phone, timezone). Step 3: Confirmation.
- **Data requirements:** POST registration payload; backend creates tenant + admin user.

#### Password Reset (`/password-reset`)
- **Purpose:** Allow users to reset forgotten passwords.
- **Key components:** Email input (request stage), then code/token verification, then new password form.
- **Data requirements:** POST email for reset request; PUT new password with token.

#### Invite Accept (`/invite/:token`)
- **Purpose:** Allow a master to accept an invitation from a salon admin and create their account.
- **Key components:** Pre-filled salon name (read-only), master name, email (pre-filled), password creation.
- **Data requirements:** GET invite details by token, POST to accept invite with account credentials.

---

### Salon Admin Dashboard

#### Overview / Home (`/admin`)
- **Purpose:** High-level dashboard showing today's snapshot and key metrics.
- **Key components:**
  - Today's appointment count (with comparison to yesterday)
  - Active masters count (online today)
  - Upcoming appointments list (next 5-10)
  - Cancellation rate metric
  - Revenue summary (today/this week/this month)
  - Quick-action buttons: Add appointment, Add master, View calendar
  - Recent AI conversations summary (last 5 messages handled by bot)
- **Data requirements:** GET `/api/dashboard/overview` -- aggregated metrics. GET `/api/appointments?date=today&limit=10`. Real-time updates via WebSocket for new bookings.

#### Masters Management (`/admin/masters`)
- **Purpose:** Manage salon staff (stylists, beauticians, etc.).
- **Key components:**
  - Searchable/filterable table of masters (name, specialization, status, appointments today)
  - Status badge (active/inactive/on leave)
  - "Add Master" button (opens form or navigates to `/admin/masters/new`)
  - Row actions: Edit, View schedule, Deactivate, Send invite
- **Data requirements:** GET `/api/masters` with pagination and filters. POST/PUT/DELETE for CRUD.

**Master Detail / Edit (`/admin/masters/:id`):**
  - Profile information form (name, photo, phone, email, bio)
  - Services this master provides (multi-select from catalog)
  - Working hours configuration (per day of week)
  - Days off / vacation management
  - Performance stats (appointments completed, rating, revenue)

**Add Master (`/admin/masters/new`):**
  - Form to enter master details or send email invitation
  - Option to set initial services and schedule

#### Services Management (`/admin/services`)
- **Purpose:** Manage the salon's service catalog.
- **Key components:**
  - Category-grouped service list (e.g., Haircuts, Coloring, Nails, Skincare)
  - Service card showing: name, duration, price range, assigned masters count
  - Add/Edit service dialog (name, description, duration, price, category, assigned masters)
  - Drag-and-drop reordering within categories
  - Category management (add, rename, reorder, delete)
- **Data requirements:** GET `/api/services` grouped by category. CRUD operations on services and categories.

#### Client Database (`/admin/clients`)
- **Purpose:** View and search all clients who have interacted with the salon.
- **Key components:**
  - Search bar with autocomplete (by name, phone, email)
  - Filterable table: name, phone, last visit, total visits, preferred master, source channel
  - Sort by last visit, total spend, alphabetical
- **Data requirements:** GET `/api/clients` with search, pagination, sorting, and filtering.

**Client Detail (`/admin/clients/:id`):**
  - Client profile (name, phone, email, notes, preferred communication channel)
  - Visit history timeline (date, service, master, status, price)
  - AI conversation history (collapsible list of bot interactions)
  - Upcoming appointments
  - Client tags/labels

#### Calendar Overview (`/admin/calendar`)
- **Purpose:** View all masters' schedules in a unified calendar view.
- **Key components:**
  - FullCalendar integration with day/week/month views
  - Column view: each master gets a column (day view)
  - Color-coded appointments by status (confirmed, pending, cancelled, completed)
  - Click to create new appointment
  - Drag to reschedule appointment
  - Filter by master, service type, status
  - Mini-calendar for date navigation
- **Data requirements:** GET `/api/appointments?start=...&end=...&masterId=...` returns appointment blocks. Real-time updates via WebSocket.

#### Communication Channels Setup (`/admin/channels`)
- **Purpose:** Configure and monitor messaging integrations.
- **Key components:**
  - Channel cards: WhatsApp, Facebook Messenger, SMS, ElevenLabs Voice
  - Each card shows: connection status (connected/disconnected), message volume (today), configuration button
  - WhatsApp setup: WhatsApp Business API credentials, phone number, webhook URL
  - Facebook setup: Facebook Page connection, Messenger webhook
  - SMS setup: Twilio/provider credentials, phone number
  - ElevenLabs Voice: Agent ID, voice selection, greeting configuration
  - Test connection button per channel
  - Conversation log viewer (recent conversations per channel)
- **Data requirements:** GET `/api/channels` for status. PUT `/api/channels/:type` for configuration.

#### Analytics & Reports (`/admin/analytics`)
- **Purpose:** Business intelligence and performance tracking.
- **Key components:**
  - Date range selector (today, this week, this month, custom range)
  - Revenue chart (line/bar chart over time)
  - Appointments chart (booked vs completed vs cancelled)
  - Master performance table (appointments, revenue, rating per master)
  - Service popularity breakdown (pie/bar chart)
  - Client acquisition by channel (WhatsApp vs Facebook vs SMS vs Walk-in)
  - Peak hours heatmap
  - Occupancy rate per master
  - Export to CSV button
- **Data requirements:** GET `/api/analytics` with date range and dimension parameters.

#### Salon Settings (`/admin/settings`)
- **Purpose:** Configure salon-wide settings.
- **Key components:**
  - **General:** Salon name, address, phone, email, timezone, logo upload
  - **Branding:** Primary color picker, accent color, logo, custom greeting messages
  - **Working Hours:** Default salon hours (per day of week), holiday calendar
  - **Notifications:** Toggle and configure: appointment reminders (timing), cancellation notifications, follow-up messages, no-show handling
  - **Booking Rules:** Minimum advance booking time, cancellation policy window, max appointments per slot, buffer time between appointments
  - **AI Assistant:** Bot personality/tone, greeting templates, escalation rules (when to hand off to human)
- **Data requirements:** GET/PUT `/api/settings` with nested sections.

---

### Master Dashboard

#### My Calendar (`/master`)
- **Purpose:** Primary view for masters to see and manage their daily/weekly schedule.
- **Key components:**
  - FullCalendar in day and week view (no month -- masters focus on near-term)
  - Appointment blocks showing: client name, service, duration, status
  - Color coding: confirmed (green), pending (yellow), cancelled (red), break (gray)
  - Click appointment to view details / update status
  - Drag-and-drop to reschedule (with confirmation dialog)
  - "Block time" button for breaks or personal time
  - Today/navigation controls
- **Data requirements:** GET `/api/master/appointments?start=...&end=...`. Real-time updates for new bookings, cancellations.

#### My Appointments (`/master/appointments`)
- **Purpose:** List view of appointments with filtering and search.
- **Key components:**
  - Tab filters: Upcoming, Today, Past, Cancelled
  - Each item: client name, service, date/time, duration, status, actions
  - Actions: confirm, mark completed, cancel, reschedule, view client
  - Search by client name
  - Sort by date (ascending/descending)
- **Data requirements:** GET `/api/master/appointments` with filters and pagination.

#### My Services (`/master/services`)
- **Purpose:** View and manage which services this master provides.
- **Key components:**
  - List of services assigned to this master
  - Toggle to enable/disable specific services
  - Custom pricing override (if master charges differently from salon default)
  - Custom duration override
- **Data requirements:** GET `/api/master/services`. PUT to update pricing/availability.

#### My Availability (`/master/availability`)
- **Purpose:** Set working hours and manage days off.
- **Key components:**
  - Weekly schedule grid (for each day: start time, end time, breaks, or "day off")
  - Calendar view for requesting days off / vacation
  - Recurring schedule vs. one-time overrides
  - Effective schedule preview (combining defaults + overrides)
- **Data requirements:** GET/PUT `/api/master/availability`. POST `/api/master/days-off`.

#### Client History (`/master/clients`)
- **Purpose:** View clients this master has served.
- **Key components:**
  - List of clients with last visit date, total visits with this master, favorite service
  - Click to view full visit history for that client (within this master's scope)
  - Client notes (master can add personal notes about preferences)
- **Data requirements:** GET `/api/master/clients` with pagination.

#### Notifications (`/master/notifications`)
- **Purpose:** View real-time and historical notifications.
- **Key components:**
  - Notification list: new booking, cancellation, reschedule, client message, admin announcement
  - Read/unread status
  - Click to navigate to relevant appointment/client
  - Mark all as read
  - Notification preferences (which types to receive)
- **Data requirements:** GET `/api/master/notifications` with pagination. WebSocket for real-time delivery.

---

## 4. Component Architecture

### Shared / Common Components

All base UI components come from shadcn/ui, copied into `src/components/ui/`:

| Component | Notes |
|-----------|-------|
| Button | Primary, secondary, ghost, destructive variants |
| Input / Textarea | With label, error state, helper text |
| Select / Combobox | Searchable dropdowns |
| Dialog / Sheet | Modal dialogs and slide-over panels |
| Table | Sortable, filterable with pagination |
| Tabs | For view switching |
| Card | Content container |
| Badge | Status indicators |
| Toast | Notification toasts (via sonner) |
| Tooltip | Hover information |
| DropdownMenu | Action menus |
| Command | Command palette for quick navigation |
| Calendar (date picker) | Date selection (shadcn calendar) |
| Skeleton | Loading placeholders |
| Avatar | User/master profile images |
| Form | React Hook Form integrated wrappers |

### Calendar Component Specification

The calendar is the core component of the application. It is built on **FullCalendar 6** for its mature feature set.

**Required capabilities:**

- **Views:** Day (single master), Day (multi-master columns), Week, Month
- **Drag-and-drop:** Reschedule appointments by dragging. Resize to change duration. Drop external events (from unscheduled list).
- **Event rendering:** Custom event components showing client name, service, duration. Color-coded by status. Overlap handling for double-booked slots.
- **Time grid:** Configurable slot duration (15/30/60 min). Working hours highlighting (gray out non-working hours). Break time display.
- **Interaction:** Click empty slot to create appointment. Click event to view/edit. Right-click context menu (view, edit, cancel, reschedule).
- **Performance:** Lazy-load events by visible date range. Virtual scrolling for month view with many events.
- **Real-time:** Live updates when appointments are created/modified via WebSocket. Optimistic UI updates on drag-and-drop.

**Component hierarchy:**

```
<CalendarView>
  <CalendarToolbar>         # View switcher, date nav, filters
    <ViewSwitcher />        # Day | Week | Month
    <MasterFilter />        # Multi-select masters (admin only)
    <StatusFilter />        # Filter by appointment status
  </CalendarToolbar>
  <FullCalendarWrapper>     # FullCalendar instance
    <AppointmentCard />     # Custom event renderer
  </FullCalendarWrapper>
  <AppointmentDetail />     # Slide-over panel for event details
  <NewAppointmentDialog />  # Dialog for creating appointments
</CalendarView>
```

### Real-Time Notification Component

```
<NotificationProvider>          # Context provider + WebSocket listener
  <NotificationBell>            # Header icon with unread count badge
    <NotificationPanel>         # Dropdown panel
      <NotificationItem />      # Individual notification
    </NotificationPanel>
  </NotificationBell>
  <ToastNotification />         # Pop-up for high-priority events
</NotificationProvider>
```

**Behavior:**
- Badge shows unread count (fetched on mount, updated via WebSocket).
- Clicking bell opens dropdown with recent notifications.
- High-priority events (new booking, cancellation) also trigger a toast.
- Clicking a notification navigates to the relevant resource and marks it as read.

### Conversation Viewer Component

Displays AI chatbot conversations with clients (for admin review).

```
<ConversationViewer>
  <ConversationList>            # List of conversations with search
    <ConversationPreview />     # Client name, last message, timestamp, channel icon
  </ConversationList>
  <ConversationThread>          # Selected conversation messages
    <MessageBubble />           # Individual message (AI or client)
    <SystemMessage />           # System events (booking confirmed, etc.)
  </ConversationThread>
  <ConversationMeta>            # Sidebar: client info, booking made, channel
  </ConversationMeta>
</ConversationViewer>
```

**Features:**
- Differentiate AI messages vs client messages with distinct styling.
- Show channel icon (WhatsApp, Facebook, SMS, Voice) per conversation.
- Highlight conversations where AI escalated to human.
- Link to resulting appointment if a booking was made.

### Multi-Tenant Theme Provider

```tsx
<TenantThemeProvider tenantId={currentTenant.id}>
  {/* All dashboard content inherits tenant theme */}
  <DashboardLayout>
    ...
  </DashboardLayout>
</TenantThemeProvider>
```

The provider fetches tenant branding settings and injects CSS custom properties onto the root element. See [Section 8](#8-multi-tenant-theming) for details.

---

## 5. State Management Strategy

### Global Client State (Zustand)

Small, focused stores for UI and session state that does not come from the server.

**Auth Store (`authStore.ts`):**
```
- user: User | null
- accessToken: string | null
- refreshToken: string | null
- role: 'admin' | 'master'
- isAuthenticated: boolean
- login(credentials) -> void
- logout() -> void
- refreshAuth() -> void
```

**Tenant Store (`tenantStore.ts`):**
```
- tenant: Tenant | null
- branding: TenantBranding | null
- setTenant(tenant) -> void
```

**Notification Store (`notificationStore.ts`):**
```
- unreadCount: number
- recentNotifications: Notification[]
- addNotification(notification) -> void
- markAsRead(id) -> void
- markAllAsRead() -> void
```

**Sidebar Store (`sidebarStore.ts`):**
```
- isCollapsed: boolean
- toggle() -> void
```

### Server State (TanStack Query v5)

All data fetched from the API is managed by TanStack Query. Key patterns:

**Query key factory pattern** -- centralized in `lib/queries/` files:

```ts
// Example: masters.queries.ts
export const masterQueries = {
  all: () => queryOptions({ queryKey: ['masters'], queryFn: fetchMasters }),
  detail: (id: string) => queryOptions({
    queryKey: ['masters', id],
    queryFn: () => fetchMaster(id),
  }),
  schedule: (id: string, range: DateRange) => queryOptions({
    queryKey: ['masters', id, 'schedule', range],
    queryFn: () => fetchMasterSchedule(id, range),
  }),
};
```

**Default configuration:**

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 30 * 60 * 1000,         // 30 minutes
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});
```

**Mutation pattern** with optimistic updates and cache invalidation:

```ts
// On appointment reschedule:
// 1. Optimistically update the cache
// 2. Send mutation to server
// 3. On success: invalidate affected queries
// 4. On error: rollback optimistic update
```

### Real-Time State (WebSocket)

WebSocket events flow into the application via a centralized handler that:
1. Updates TanStack Query cache directly (e.g., new appointment appears in calendar).
2. Updates Zustand notification store (increment unread count, add notification).
3. Triggers toast notifications for high-priority events.

This avoids duplicating server state -- WebSocket events **patch the existing query cache** rather than maintaining a parallel data store.

### Form State (React Hook Form + Zod)

Forms are managed locally within components using React Hook Form. Zod schemas provide runtime validation:

```ts
const masterFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  services: z.array(z.string()).min(1),
  // ...
});

type MasterFormData = z.infer<typeof masterFormSchema>;
```

---

## 6. API Integration Layer

### HTTP Client Setup

A centralized Axios instance in `lib/api/client.ts`:

```ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});
```

**Request interceptor:**
- Attaches `Authorization: Bearer <accessToken>` from auth store.
- Attaches `X-Tenant-ID` header from tenant store.

**Response interceptor:**
- On 401: attempt silent token refresh using refresh token. If refresh fails, redirect to login.
- On 403: show "permission denied" toast.
- On 5xx: show generic error toast with retry suggestion.
- On network error: show "connection lost" banner.

### Authentication Token Handling

- Access token stored in Zustand (memory) -- never in localStorage.
- Refresh token stored in an httpOnly cookie (set by backend).
- On app load, attempt silent refresh to restore session.
- Token refresh uses a request queue to avoid concurrent refresh calls.

### API Error Handling Patterns

Standardized error response type:

```ts
interface ApiError {
  status: number;
  code: string;           // e.g., "APPOINTMENT_CONFLICT"
  message: string;        // Human-readable message
  details?: Record<string, string[]>; // Field-level validation errors
}
```

TanStack Query's `onError` callbacks handle domain-specific errors (e.g., booking conflicts), while the Axios interceptor handles infrastructure errors (auth, network).

### Expected API Endpoints

**Authentication:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register` | Register new salon + admin |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/password-reset/request` | Request password reset |
| POST | `/api/auth/password-reset/confirm` | Confirm password reset |
| GET | `/api/auth/invite/:token` | Get invite details |
| POST | `/api/auth/invite/:token/accept` | Accept invite |
| GET | `/api/auth/me` | Get current user profile |

**Dashboard:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/overview` | Admin dashboard metrics |

**Masters:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/masters` | List masters (paginated, filterable) |
| GET | `/api/masters/:id` | Get master detail |
| POST | `/api/masters` | Create master |
| PUT | `/api/masters/:id` | Update master |
| DELETE | `/api/masters/:id` | Deactivate master |
| POST | `/api/masters/invite` | Send invite to master |
| GET | `/api/masters/:id/schedule` | Get master schedule |
| PUT | `/api/masters/:id/availability` | Update availability |
| POST | `/api/masters/:id/days-off` | Add day off |

**Services:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List services (grouped by category) |
| POST | `/api/services` | Create service |
| PUT | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |
| GET | `/api/service-categories` | List categories |
| POST | `/api/service-categories` | Create category |
| PUT | `/api/service-categories/:id` | Update category |
| PUT | `/api/service-categories/reorder` | Reorder categories |

**Clients:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List clients (paginated, searchable) |
| GET | `/api/clients/:id` | Get client detail |
| GET | `/api/clients/:id/history` | Get client visit history |
| GET | `/api/clients/:id/conversations` | Get client AI conversations |

**Appointments:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List appointments (date range, master, status) |
| POST | `/api/appointments` | Create appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| PUT | `/api/appointments/:id/status` | Update appointment status |
| DELETE | `/api/appointments/:id` | Cancel appointment |
| PUT | `/api/appointments/:id/reschedule` | Reschedule appointment |

**Channels:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/channels` | Get all channel statuses |
| GET | `/api/channels/:type` | Get channel configuration |
| PUT | `/api/channels/:type` | Update channel configuration |
| POST | `/api/channels/:type/test` | Test channel connection |
| GET | `/api/channels/:type/conversations` | Get conversations for channel |

**Analytics:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Overview metrics for date range |
| GET | `/api/analytics/revenue` | Revenue time series |
| GET | `/api/analytics/appointments` | Appointment stats |
| GET | `/api/analytics/masters` | Per-master performance |
| GET | `/api/analytics/services` | Service popularity |
| GET | `/api/analytics/channels` | Channel performance |
| GET | `/api/analytics/export` | Export report as CSV |

**Settings:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all salon settings |
| PUT | `/api/settings/general` | Update general settings |
| PUT | `/api/settings/branding` | Update branding |
| PUT | `/api/settings/hours` | Update working hours |
| PUT | `/api/settings/notifications` | Update notification settings |
| PUT | `/api/settings/booking-rules` | Update booking rules |
| PUT | `/api/settings/ai` | Update AI assistant settings |
| POST | `/api/settings/logo` | Upload salon logo |

**Master-specific (authenticated as master):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/master/appointments` | My appointments |
| GET | `/api/master/services` | My services |
| PUT | `/api/master/services` | Update my service config |
| GET | `/api/master/availability` | My availability |
| PUT | `/api/master/availability` | Update my availability |
| GET | `/api/master/clients` | My clients |
| GET | `/api/master/notifications` | My notifications |
| PUT | `/api/master/notifications/:id/read` | Mark notification read |
| PUT | `/api/master/notifications/read-all` | Mark all notifications read |

---

## 7. Real-Time Features

### WebSocket Connection Management

**Library:** `react-use-websocket`

**Connection strategy:**
- Connect after successful authentication.
- Disconnect on logout.
- Use STOMP over WebSocket protocol (aligns with Spring/Quarkus backend with message broker).
- Automatic reconnection with exponential backoff (1s, 2s, 4s, 8s, max 30s).
- Heartbeat ping every 25 seconds to detect stale connections.

**Connection URL:** `wss://{api-host}/ws?token={accessToken}`

### Events to Subscribe To

| Event | Payload | Action |
|-------|---------|--------|
| `appointment.created` | Appointment object | Add to calendar query cache, show notification |
| `appointment.updated` | Appointment object | Update in calendar query cache |
| `appointment.cancelled` | { appointmentId, reason } | Update status in cache, show notification |
| `appointment.rescheduled` | { appointmentId, oldTime, newTime } | Move event in cache, show notification |
| `appointment.status_changed` | { appointmentId, newStatus } | Update status badge in cache |
| `client.message_received` | { clientId, channel, preview } | Show notification (admin) |
| `master.availability_changed` | { masterId, changes } | Update schedule view |
| `channel.status_changed` | { channelType, status } | Update channel card status |
| `notification.new` | Notification object | Add to notification store, show toast |

### Optimistic Updates Strategy

For user-initiated mutations (drag-and-drop reschedule, status change):

1. **Immediately update** the TanStack Query cache with the expected result.
2. **Send the mutation** to the server.
3. **On success:** Invalidate relevant queries to ensure consistency (the optimistic data is usually correct, but invalidation ensures eventual consistency).
4. **On error:** Roll back the cache to the previous state using TanStack Query's `onMutate` context. Show error toast explaining why the action failed (e.g., "Time slot already taken").

For external events (another user or the AI bot books an appointment):
- Simply patch the query cache based on the WebSocket event. No rollback needed.

---

## 8. Multi-Tenant Theming

### How Salon Branding Applies

Each salon (tenant) can customize:
- **Primary color**: Buttons, links, active states
- **Accent color**: Highlights, badges, secondary actions
- **Logo**: Displayed in sidebar header and login page
- **Salon name**: Displayed in header and page titles

Branding settings are fetched as part of the tenant data on login and stored in the tenant Zustand store.

### Theme Customization Capabilities

The theming system supports:
- Primary and accent color (any hex value)
- Logo upload (displayed in sidebar)
- Custom favicon (generated from logo)
- Salon name in title bar

Intentionally limited to maintain UI consistency and reduce support burden. Masters and admins get a professional, cohesive interface regardless of color choices.

### CSS Variable Approach

The `TenantThemeProvider` component computes a full color palette from the tenant's primary and accent colors, then sets CSS custom properties on `document.documentElement`:

```css
:root {
  /* Generated from tenant primary color */
  --primary: 221 83% 53%;           /* HSL values for Tailwind */
  --primary-foreground: 210 40% 98%;
  --primary-50: 214 100% 97%;
  --primary-100: 214 95% 93%;
  /* ... shades 200-900 */

  /* Generated from tenant accent color */
  --accent: 262 83% 58%;
  --accent-foreground: 210 40% 98%;

  /* Semantic tokens remain stable */
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;
  --card: 0 0% 100%;
  --card-foreground: 222 84% 5%;
  --border: 214 32% 91%;
  --ring: var(--primary);
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5% 26%;
  --sidebar-primary: var(--primary);
  --sidebar-accent: var(--accent);
}
```

Tailwind CSS classes reference these variables (e.g., `bg-primary`, `text-primary-foreground`), so the entire UI recolors automatically when variables change. No component-level changes are needed.

**Color palette generation** is done client-side using a utility that converts a hex color into a full HSL shade range (50-950) similar to Tailwind's default palettes.

---

## 9. Responsive Design

### Breakpoints Strategy

Following Tailwind CSS default breakpoints:

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Mobile-First Components for Master View

Masters frequently use the app on their phones between appointments. The master dashboard is designed **mobile-first**:

- **Calendar:** On mobile, defaults to day view (single column). Swipe left/right to change days. Appointments rendered as full-width cards.
- **Appointments list:** Full-width cards with large touch targets. Swipe actions (confirm, cancel) for quick updates.
- **Navigation:** Bottom tab bar on mobile (Calendar, Appointments, Notifications, Profile). Sidebar hidden entirely.
- **Notifications:** Full-screen panel on mobile with pull-to-refresh.
- **Forms:** Single-column layout, large input fields, native date/time pickers where possible.

### Desktop-Optimized Admin Views

Admin views prioritize information density on desktop:

- **Sidebar navigation** (collapsible) visible at `lg` and above. On smaller screens, use a hamburger menu with slide-over sidebar.
- **Calendar:** Multi-master column view utilizes full screen width. Side panel for appointment details (instead of modal).
- **Tables:** Full column visibility on desktop. On mobile, hide non-essential columns and provide expandable rows.
- **Analytics:** Multi-chart grid layout on desktop. Stacked single-column on mobile.
- **Master management:** Table view on desktop, card view on mobile.

### Layout Behavior

```
< 768px (mobile):
  - Bottom tab navigation (master) or hamburger menu (admin)
  - Single column content
  - Dialogs become full-screen sheets

768px - 1023px (tablet):
  - Collapsible sidebar (default collapsed)
  - Two-column layouts where appropriate
  - Dialogs remain as centered modals

>= 1024px (desktop):
  - Persistent sidebar (collapsible)
  - Multi-column layouts
  - Side panels instead of modals for detail views
```

---

## 10. Testing Strategy

### Unit Testing (Vitest)

**Scope:** Pure functions, utilities, store logic, hooks.

- All Zod validation schemas tested with valid and invalid inputs.
- Zustand stores tested for state transitions.
- Utility functions (date formatting, currency, permissions) have full coverage.
- Custom hooks tested with `renderHook` from React Testing Library.

**Target:** 90%+ coverage on `lib/`, `stores/`, `hooks/` directories.

### Component Testing (Vitest + React Testing Library)

**Scope:** Individual components rendered in isolation.

- Components tested for correct rendering with various props.
- User interactions tested (click, type, select).
- Form components tested for validation behavior.
- Conditional rendering tested (loading, error, empty states).
- API-dependent components tested with MSW for mocked responses.

**Target:** All components in `components/` have at least happy-path tests.

### E2E Testing (Playwright)

**Scope:** Critical user flows across the application.

**Priority flows:**
1. Login -> Dashboard loads -> Navigate to calendar
2. Create appointment flow (select master, service, time, client)
3. Reschedule appointment via drag-and-drop
4. Add new master (admin flow)
5. Master: view and confirm/complete an appointment
6. Register new salon

**Configuration:**
- Tests run against a local dev server with seeded test database.
- Multiple browser contexts to test admin and master simultaneously.
- Visual regression snapshots for calendar and key pages.

### API Mocking (MSW)

Mock Service Worker intercepts network requests during tests:
- Handlers defined per API module, matching the endpoint structure in Section 6.
- Shared between Vitest component tests and Storybook (if used for visual development).
- Enables testing error states, loading states, and edge cases without a running backend.

---

## 11. Performance Considerations

### Code Splitting Strategy

**Route-level splitting:** TanStack Router supports lazy route loading. Each route module is a separate chunk loaded on navigation.

```ts
// Routes are automatically code-split by TanStack Router's file-based routing.
// Each route file becomes its own chunk.
```

**Feature-level splitting:**
- FullCalendar (large library) loaded only on calendar routes.
- recharts loaded only on analytics route.
- Channel setup components loaded only on channels route.
- Conversation viewer loaded only when accessed.

### Lazy Loading

- **Images:** All images use `loading="lazy"` and `srcset` for responsive sizes. Master avatars use a low-res placeholder with progressive loading.
- **Routes:** All dashboard routes are lazy-loaded. Auth routes are in the main bundle (small).
- **Heavy components:** FullCalendar, chart libraries, and rich text editors wrapped in `React.lazy` with `Suspense` boundaries showing skeleton loaders.
- **Data:** Appointment data loaded by visible date range only. Client list uses cursor-based pagination. Infinite scroll on conversation/notification lists.

### Caching

**TanStack Query caching:**
- Appointments: `staleTime: 2 min` (frequently changing data). Calendar refetches on focus.
- Masters list: `staleTime: 10 min` (rarely changes).
- Services catalog: `staleTime: 30 min` (stable data).
- Settings: `staleTime: 60 min` (almost static).
- Analytics: `staleTime: 5 min` (dashboard metrics are near-real-time).

**Static asset caching:**
- Vite generates content-hashed filenames for all assets.
- Long-lived `Cache-Control` headers on production builds.
- Service worker for offline shell (optional future enhancement).

**Browser caching:**
- Tenant logo and branding cached after first load.
- Salon settings cached in Zustand and refreshed on navigation to settings page.

### Bundle Size Management

- Tree-shaking via Vite/Rollup eliminates unused code.
- Import only specific lodash-es functions (if needed) rather than full library.
- FullCalendar: import only required plugins (dayGrid, timeGrid, interaction) not the entire package.
- Monitor bundle size in CI with `vite-bundle-analyzer`.

### Rendering Performance

- Calendar events use `React.memo` with custom comparison to avoid unnecessary re-renders on WebSocket updates.
- Large lists (clients, appointments) use virtual scrolling via `@tanstack/react-virtual`.
- Debounce search inputs (300ms) to avoid excessive API calls.
- WebSocket messages batched at 100ms intervals before flushing to React state.

---

## Appendix A: Environment Variables

```
VITE_API_BASE_URL=http://localhost:8083/api
VITE_WS_URL=ws://localhost:8083/ws
VITE_APP_NAME=SlotMe
VITE_DEFAULT_LOCALE=en
```

## Appendix B: Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+
- Mobile Safari (iOS 15+)
- Chrome for Android
