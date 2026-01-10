# Partner Onboarding Platform

Next.js application for managing partner onboarding processes with Google Apps Script backend.

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **Ant Design 6** for UI components
- **Google Apps Script** backend (Web App)
- **pnpm** for package management

## Features

- OTP-based authentication
- Onboarding tracker with checklist management
- Notes system for collaboration
- Support, training, and news sections
- Responsive design with Ant Design

## Project Structure

```
.
├── app/
│   ├── (public)/
│   │   └── page.tsx                    # Landing page
│   ├── login/
│   │   └── page.tsx                    # OTP login
│   ├── app/
│   │   ├── layout.tsx                  # Protected app layout
│   │   ├── page.tsx                    # Redirect to tracker
│   │   ├── onboarding-tracker/
│   │   │   ├── page.tsx               # Onboarding list
│   │   │   └── [clienteId]/
│   │   │       └── page.tsx           # Onboarding detail
│   │   ├── soporte/
│   │   │   └── page.tsx               # Support page
│   │   ├── formacion/
│   │   │   └── page.tsx               # Training page
│   │   └── growth-news/
│   │       └── page.tsx               # Growth news page
│   ├── api/
│   │   └── gas/
│   │       └── [...path]/
│   │           └── route.ts           # Proxy to GAS backend
│   ├── layout.tsx                      # Root layout
│   └── globals.css                     # Global styles
├── lib/
│   ├── api.ts                          # API client for GAS
│   └── session.ts                      # Session management
├── types/
│   └── index.ts                        # TypeScript types
├── middleware.ts                       # Route protection
├── next.config.ts                      # Next.js config
├── tsconfig.json                       # TypeScript config
├── .env.local.example                  # Environment variables template
└── package.json                        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd onboarding-Microsoft
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Google Apps Script URL:
```env
NEXT_PUBLIC_GAS_BASE_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_USE_GAS_PROXY=false
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Backend Integration

### Google Apps Script Endpoints

The application connects to a Google Apps Script Web App with the following endpoints:

#### Authentication
- `POST /exec?path=/auth/request-otp` - Request OTP code
  - Body: `{ email: string }`
- `POST /exec?path=/auth/verify-otp` - Verify OTP and login
  - Body: `{ email: string, otp: string }`
  - Response: `{ token: string, user: User }`

#### Onboarding Management
- `GET /exec?path=/onboardings&token=...` - List onboardings
- `GET /exec?path=/onboardings/{clienteId}&token=...` - Get detail
- `POST /exec?path=/onboardings/{clienteId}/fields&token=...` - Update field
  - Body: `{ fieldKey: string, value: any }`
- `POST /exec?path=/onboardings/{clienteId}/notes&token=...` - Add note
  - Body: `{ scopeType: string, visibility: string, body: string }`

### API Modes

**Direct Mode** (default):
- Frontend calls GAS directly
- Faster, no intermediate proxy
- May have CORS issues in some environments

**Proxy Mode**:
- Set `NEXT_PUBLIC_USE_GAS_PROXY=true`
- Requests go through Next.js API route
- Solves CORS issues
- Slightly slower due to extra hop

### Response Parsing

GAS returns `Content-Type: text/html` but the body is JSON. The API client handles this:

```typescript
const text = await response.text();
const json = JSON.parse(text);
```

## Authentication Flow

1. User enters email on `/login`
2. System calls `/auth/request-otp`
3. User receives OTP via email (sent by Power Automate + Outlook)
4. User enters OTP code
5. System calls `/auth/verify-otp`
6. On success, `{ token, user }` is saved to localStorage
7. User is redirected to `/app`

## Session Management

Sessions are stored in localStorage:

```typescript
import { saveSession, getToken, getUser, clearSession } from '@/lib/session';

// After login
saveSession({ token, user });

// Check auth
const token = getToken();
const user = getUser();

// Logout
clearSession();
```

## Route Protection

Protected routes under `/app/*` check for authentication in the layout component:

```typescript
// app/app/layout.tsx
useEffect(() => {
  if (!isAuthenticated()) {
    router.push('/login');
  }
}, []);
```

## Deployment to Vercel

1. Push code to GitHub

2. Import project in Vercel

3. Configure environment variables:
   - `NEXT_PUBLIC_GAS_BASE_URL`
   - `NEXT_PUBLIC_USE_GAS_PROXY=true` (recommended for production)

4. Deploy

## Key Features

### Onboarding Tracker
- List view with filtering and pagination
- Detail view with onboarding information
- Interactive checklist with toggle switches
- Notes system for collaboration

### Checklist Management
- Boolean fields detected automatically
- Real-time updates to Google Sheets
- Sync with SharePoint via Power Automate
- Visual feedback on changes

### Notes System
- Add notes to onboardings
- Scoped by type (GENERAL, SUBSTEP)
- Visibility control (PUBLIC, PRIVATE)
- Timestamp and author tracking

## API Client Usage

```typescript
import { requestOtp, verifyOtp, listOnboardings, getOnboardingDetail, updateField, addNote } from '@/lib/api';

// Request OTP
await requestOtp('user@example.com');

// Verify OTP
const { token, user } = await verifyOtp('user@example.com', '123456');

// List onboardings
const { items } = await listOnboardings(token);

// Get detail
const { onboarding, mirror, notes } = await getOnboardingDetail(token, 'CLIENT-123');

// Update checklist field
await updateField(token, 'CLIENT-123', 'Alta_Hola_TDSynnex_', true);

// Add note
await addNote(token, 'CLIENT-123', {
  scopeType: 'GENERAL',
  visibility: 'PUBLIC',
  body: 'This is a note'
});
```

## TypeScript Types

All types are defined in `types/index.ts`:

- `User` - User information
- `Session` - Session data
- `Onboarding` - Onboarding record
- `Mirror` - Checklist fields
- `Note` - Note record
- Response types for all API calls

## Styling

- Ant Design components for consistent UI
- Simple CSS in `globals.css`
- No Tailwind CSS (as per requirements)
- Responsive design with Ant Design Grid

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2017+ features
- Requires JavaScript enabled

## Troubleshooting

If you encounter issues:

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common problems
2. Visit `/diagnostics` in your browser for automated testing
3. Check the browser console for `[API]` logs
4. Verify your `.env.local` configuration

## License

ISC

## Support

For issues or questions, contact the development team or refer to the Support page in the application.
