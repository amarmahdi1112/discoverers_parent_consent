# Discoverers' Daycare - Parent Consent Form Application

A complete, professional-grade web application for managing daycare consent forms with digital signatures, statistics tracking, and comprehensive admin tools. Built with Next.js, TypeScript, Prisma, tRPC, and Tailwind CSS.

## ✨ Features

### Parent-Facing Features
- ✅ **Beautiful, responsive form** with Discoverers' Daycare branding
- ✅ **Digital signature capture** with touch/mouse support
- ✅ **Real-time form validation** with helpful error messages
- ✅ **Date constraints** to prevent invalid entries
- ✅ **Mobile-friendly** design that works on all devices
- ✅ **Thank you page** with submission confirmation

### Admin Dashboard Features
- 📊 **Statistics Dashboard** with real-time metrics:
  - Total submissions count
  - Permissions granted count
  - Photo/video release count
- 🔍 **Advanced Search** - Find submissions by child name, parent name, or phone number
- 🎯 **Smart Filtering** - Filter by permission status (all/granted/denied)
- 📑 **Flexible Sorting** - Sort by submission date or child's name
- 📥 **CSV Export** - Download all submissions as spreadsheet
- 📄 **Professional PDF Download** - Beautifully formatted consent documents
- 🗑️ **Delete Functionality** - Remove submissions with confirmation
- 🔐 **Password Protection** - Secure admin access
- 📱 **Responsive Design** - Works perfectly on all screen sizes
- 🎨 **Modern UI** - Clean, professional interface with Tailwind CSS

### Technical Features
- ✅ **TypeScript** for type safety
- ✅ **tRPC** for end-to-end type-safe APIs
- ✅ **Prisma ORM** for database management
- ✅ **SQLite** for local development (PostgreSQL for production)
- ✅ **Server-side validation** for security
- ✅ **Optimistic updates** for better UX
- ✅ **Easy Vercel deployment** with one-click setup

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, tRPC
- **Database**: PostgreSQL (via Prisma ORM)
- **Signature**: react-signature-canvas
- **Hosting**: Vercel (recommended)

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- A PostgreSQL database (we'll use Supabase free tier)
- Git installed

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Database

#### Option A: Using Supabase (Recommended - Free)

1. Go to [https://supabase.com](https://supabase.com) and sign up for a free account
2. Click "New Project"
3. Fill in your project details:
   - Name: `daycare-consent-form`
   - Database Password: Choose a strong password (save this!)
   - Region: Choose closest to you
4. Wait for the project to be created (2-3 minutes)
5. Once ready, go to **Settings** → **Database**
6. Scroll down to "Connection string" → "URI"
7. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
8. Replace `[YOUR-PASSWORD]` with the password you set earlier

#### Option B: Using PlanetScale (Free)

1. Go to [https://planetscale.com](https://planetscale.com) and sign up
2. Create a new database
3. Get your connection string from the "Connect" page
4. Note: PlanetScale uses MySQL, so you'll need to change the provider in `prisma/schema.prisma` from `postgresql` to `mysql`

### Step 3: Configure Environment Variables

1. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

2. Open `.env` and add your configuration:

```env
DATABASE_URL="your_database_connection_string_from_step_2"
ADMIN_PASSWORD="your_secure_admin_password"
```

**Important**: Choose a strong admin password. This will be used to access the admin dashboard.

### Step 4: Set Up the Database Schema

Run these commands to create the database tables:

```bash
npx prisma db push
npx prisma generate
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the form.

To access the admin dashboard, go to [http://localhost:3000/admin](http://localhost:3000/admin) and use the password you set in `.env`.

## Deployment to Vercel

### Step 1: Prepare Your Code

1. Make sure all your code is committed to a Git repository (GitHub, GitLab, or Bitbucket)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/daycare-consent-form.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your Git repository
4. Configure your project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables in Vercel

1. In the Vercel project settings, go to **Settings** → **Environment Variables**
2. Add the following variables:
   - `DATABASE_URL`: Your Supabase/PlanetScale connection string
   - `ADMIN_PASSWORD`: Your admin password
   - `NEXT_PUBLIC_ADMIN_PASSWORD`: Same admin password (for client-side check)

3. Click "Save"

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. Once deployed, Vercel will give you a URL like `https://your-project.vercel.app`
4. Visit your URL to see the live form!

### Step 5: Set Up Database (Production)

After your first deployment, you need to push the database schema:

1. In your terminal, with your production DATABASE_URL in `.env`:

```bash
npx prisma db push
```

Or use Vercel's CLI:

```bash
vercel env pull .env.production
npx prisma db push
```

## Usage

### For Parents

1. Visit your deployed URL (e.g., `https://your-app.vercel.app`)
2. Fill out the consent form with all required information:
   - Child's information
   - Parent/guardian details
   - Emergency contact
   - Medical information
   - Permissions and authorizations
3. Sign using the digital signature pad
4. Click "Submit Consent Form"
5. You'll see a confirmation message with the Discoverers' Daycare branding

### For Administrators

1. **Access the Admin Dashboard**
   - Visit `https://your-url.vercel.app/admin`
   - Enter the admin password (default: `admin123`)

2. **View Statistics**
   - See total submissions count
   - Track permissions granted
   - Monitor photo/video releases

3. **Search & Filter**
   - Use the search bar to find specific submissions by name or phone
   - Filter by permission status (all/granted/denied)
   - Sort by date or child's name alphabetically

4. **Manage Submissions**
   - Click "View Details" to see complete submission information
   - Download individual submissions as professionally formatted PDFs
   - Delete submissions with confirmation (permanent action)

5. **Export Data**
   - Click "Export to CSV" to download all submissions as a spreadsheet
   - Perfect for record-keeping or data analysis

6. **PDF Features**
   - Each PDF includes Discoverers' Daycare branding
   - Gold accent lines for professional appearance
   - Digital signature embedded in document
   - Document ID for tracking
   - Electronic signing timestamp

## Project Structure

```
daycare-consent-form/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── components/
│   │   └── SignaturePad.tsx   # Signature component
│   ├── pages/
│   │   ├── _app.tsx           # App wrapper
│   │   ├── index.tsx          # Main consent form
│   │   ├── admin.tsx          # Admin dashboard
│   │   └── api/
│   │       └── trpc/[trpc].ts # tRPC API endpoint
│   ├── server/
│   │   ├── db.ts              # Prisma client
│   │   └── api/
│   │       ├── root.ts        # tRPC root router
│   │       ├── trpc.ts        # tRPC setup
│   │       └── routers/
│   │           └── submission.ts # Submission routes
│   ├── styles/
│   │   └── globals.css        # Global styles
│   └── utils/
│       └── api.ts             # tRPC client
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Security Notes

1. **Admin Password**: The current implementation uses a simple password check. For production, consider implementing proper authentication (NextAuth.js, Clerk, etc.)
2. **Environment Variables**: Never commit your `.env` file to Git
3. **Database**: Make sure your database credentials are secure
4. **HTTPS**: Vercel automatically provides HTTPS for all deployments

## Customization

### Changing Colors

Edit `tailwind.config.ts` to customize the color scheme. The current theme uses indigo/blue.

### Adding Fields

1. Update `prisma/schema.prisma` to add new database fields
2. Run `npx prisma db push`
3. Update the form in `src/pages/index.tsx`
4. Update the submission router in `src/server/api/routers/submission.ts`
5. Update the admin view in `src/pages/admin.tsx`

### Changing Form Title

Edit the heading text in `src/pages/index.tsx`.

## Troubleshooting

### "Database connection failed"

- Check that your `DATABASE_URL` is correct in `.env`
- Make sure your database is accessible from your location
- For Supabase, ensure the connection pooler is enabled

### "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma errors

```bash
npx prisma generate
npx prisma db push
```

### Build fails on Vercel

- Check the build logs
- Make sure all environment variables are set in Vercel
- Ensure your `DATABASE_URL` is accessible from Vercel's servers

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Review the [Prisma documentation](https://www.prisma.io/docs)
4. Review the [tRPC documentation](https://trpc.io/docs)

## License

MIT License - feel free to use this for your daycare or modify as needed.
