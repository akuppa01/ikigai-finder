# Ikigai Career Discovery App

A production-oriented Next.js 14 web application that helps users discover their ideal career path through the Japanese concept of Ikigai. Users create a four-column board, take a personalized quiz, and receive AI-generated career recommendations.

## Features

- **Four-Column Ikigai Board**: Interactive drag-and-drop board with columns for Love, Good At, Earn, and World Needs
- **Smart Duplicate Detection**: AI-powered normalization to identify and group similar entries
- **Personalized Quiz**: 8-question assessment covering work preferences and goals
- **AI Career Report**: OpenAI-generated personalized career recommendations, majors, and entrepreneurial ideas
- **PDF Export**: Download your report as a professional PDF
- **Responsive Design**: Beautiful, mobile-first UI with smooth animations
- **Authentication**: Optional Supabase auth with magic link support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **PDF Generation**: html2canvas + jsPDF
- **State Management**: Zustand
- **Fuzzy Search**: Fuse.js

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nextjs-app-router
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_OPENAI_KEY=your_openai_api_key

# NextAuth (optional)
NEXTAUTH_URL=https://yourdomain.com
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL from `supabase/schema.sql` to create the required tables and policies

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── boards/        # Board management
│   │   ├── normalize-board/ # Duplicate detection
│   │   ├── generate-report/ # AI report generation
│   │   └── reports/       # Report retrieval
│   ├── board/             # Ikigai board page
│   ├── quiz/              # Quiz page
│   ├── report/[id]/       # Report display page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── board/             # Board-specific components
│   ├── quiz/              # Quiz components
│   ├── report/            # Report components
│   ├── ui/                # Reusable UI components
│   ├── BackgroundBlobs.tsx # Animated background
│   └── NinjaStar.tsx      # Ikigai visualization
├── hooks/                 # Custom React hooks
│   ├── useBoardStore.ts   # Board state management
│   └── useQuizStore.ts    # Quiz state management
├── lib/                   # Utilities and configurations
│   ├── supabase.ts        # Supabase client
│   ├── openai.ts          # OpenAI client and types
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
└── assets/                # Static assets
```

## Key Features Explained

### Four-Column Board

The Ikigai board consists of four columns:

- **LOVE**: What you love doing
- **GOOD AT**: What you're skilled at
- **EARN**: What you can be paid for
- **NEEDS**: What the world needs

Users can:

- Add up to 25 items per column
- Drag items between columns (creates copies)
- Edit items inline with keyboard shortcuts
- Delete items with hover actions or keyboard

### Smart Duplicate Detection

The `/api/normalize-board` endpoint:

1. Normalizes text by removing punctuation and converting to lowercase
2. Uses Fuse.js for fuzzy matching with 0.3 threshold
3. Groups similar items and reorders columns
4. Highlights common items across columns

### AI Report Generation

The `/api/generate-report` endpoint:

1. Organizes board entries by column
2. Sends structured prompt to OpenAI GPT-4o-mini
3. Returns JSON with career paths, majors, and entrepreneurial ideas
4. Stores results in Supabase for later retrieval

### PDF Export

Client-side PDF generation using:

- `html2canvas` to capture the report as an image
- `jsPDF` to convert to PDF with proper pagination
- Automatic download with professional formatting

## API Endpoints

### POST /api/boards

Creates a new board with entries.

**Request:**

```json
{
  "title": "My Ikigai Board",
  "entries": [
    {
      "id": "uuid",
      "text": "Teaching",
      "column": "love",
      "position": 0
    }
  ]
}
```

**Response:**

```json
{
  "boardId": "uuid"
}
```

### POST /api/normalize-board

Normalizes and groups similar entries.

**Request:**

```json
{
  "entries": [
    /* array of entries */
  ]
}
```

**Response:**

```json
{
  "groupedItems": [
    {
      "canonical": "teaching",
      "occurrences": [
        {
          "id": "uuid",
          "column": "love",
          "original": "Teaching"
        }
      ]
    }
  ],
  "columns": {
    "love": [
      /* normalized entries */
    ]
  }
}
```

### POST /api/generate-report

Generates AI-powered career report.

**Request:**

```json
{
  "boardId": "uuid",
  "entries": [
    /* array of entries */
  ],
  "quiz": {
    "q1": 4,
    "q2": 3
    // ... other quiz responses
  },
  "profile": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response:**

```json
{
  "reportId": "uuid",
  "report": {
    "careers": [
      {
        "title": "Software Engineer",
        "why": "Matches your technical interests...",
        "timeline": "6 months, 1 year, 4 years",
        "steps": ["Learn programming", "Build projects", "Apply for jobs"]
      }
    ],
    "majors": [
      /* recommended majors */
    ],
    "entrepreneurialIdeas": [
      /* business ideas */
    ],
    "nextSteps": [
      /* actionable steps */
    ]
  }
}
```

### GET /api/reports/[id]

Retrieves a generated report.

**Response:**

```json
{
  "report": {
    "careers": [
      /* career recommendations */
    ],
    "majors": [
      /* major recommendations */
    ]
    // ... other report data
  }
}
```

## Database Schema

### Tables

- **profiles**: User profiles (optional, managed by Supabase Auth)
- **boards**: Ikigai boards with metadata
- **entries**: Individual items in board columns
- **quizzes**: Quiz responses linked to boards
- **reports**: AI-generated reports with JSON data

### Row Level Security (RLS)

Currently set to permissive for development. For production, implement proper RLS policies:

```sql
-- Example production RLS policy
CREATE POLICY "Users can only see their own boards" ON boards
  FOR ALL USING (auth.uid() = user_id);
```

## Testing the Application

### 1. Basic Flow Test

1. Visit the home page
2. Click "Start Your Ikigai Journey"
3. Fill in some items in each column
4. Drag an item from one column to another (should copy)
5. Click "Confirm Board"
6. Complete the quiz
7. Enter email and generate report
8. View the generated report
9. Test PDF download

### 2. Keyboard Navigation Test

1. Click on a board item to select it
2. Press `Enter` to edit
3. Press `Escape` to cancel editing
4. Press `Delete` to remove item
5. Use `Tab` to navigate between items

### 3. Mobile Responsiveness Test

1. Open on mobile device or resize browser
2. Verify columns stack vertically
3. Test touch drag and drop
4. Ensure all buttons are tappable

### 4. Error Handling Test

1. Try to generate report without filling board
2. Test with invalid email format
3. Test network disconnection scenarios

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables Reference

| Variable                        | Description                  | Required |
| ------------------------------- | ---------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL         | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key       | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key    | Yes      |
| `OPENAI_API_KEY`                | OpenAI API key               | Yes      |
| `NEXT_PUBLIC_OPENAI_KEY`        | OpenAI API key (client-side) | Optional |
| `NEXTAUTH_URL`                  | NextAuth URL for production  | Optional |

## Troubleshooting

### Common Issues

1. **"Module not found" errors**: Run `npm install` to ensure all dependencies are installed
2. **Supabase connection errors**: Verify your environment variables are correct
3. **OpenAI API errors**: Check your API key and billing status
4. **PDF generation fails**: Ensure `html2canvas` and `jsPDF` are properly installed

### Debug Mode

Enable debug logging by adding to your environment:

```env
DEBUG=true
```

### Performance Issues

- The app uses React.memo and useMemo for optimization
- Large boards (25+ items per column) may impact performance
- Consider implementing pagination for very large datasets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed description

---

Built with ❤️ using Next.js, Supabase, and OpenAI
