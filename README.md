# MapVault 🗺️

A modern web application that allows users to export their Google Maps saved places to CSV or text files. Built with Next.js, Supabase, and TypeScript.

## ✨ Features

- **Google OAuth Authentication** - Secure login with Google account
- **Interactive Map Display** - View your saved places on an interactive map using MapLibre GL
- **Multiple Export Formats** - Export to CSV or TXT files
- **Real-time Processing** - Track export progress in real-time
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Secure Data Storage** - All data stored securely with Supabase
- **Export History** - Keep track of your previous exports

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Maps**: MapLibre GL + MapTiler
- **Email**: Resend
- **Deployment**: Vercel
- **Scraping**: Python (for Google Maps data extraction)

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Google Cloud Platform account with OAuth configured
- A MapTiler account for map services
- A Resend account for email notifications

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Zaid-Dildar/map-vault.git
   cd map-vault
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_key
   RESEND_API_KEY=your_resend_key
   ```

4. **Configure Google OAuth**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API and People API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     ```
     http://localhost:3000/auth/callback
     https://your-supabase-project.supabase.co/auth/v1/callback
     ```

5. **Set up Supabase**

   - Create a new Supabase project
   - Run the SQL schema (provided in the project)
   - Configure Google OAuth in Authentication settings
   - Enable Row Level Security

6. **Configure MapTiler**
   - Sign up at [MapTiler](https://maptiler.com)
   - Get your API key from the dashboard

## 🏃‍♂️ Running the Application

1. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
map-vault/           # Main Next.js application
├── app/                 # App Router pages
│   ├── auth/               # Authentication routes
│   ├── dashboard/          # Dashboard page
│   └── api/                # API routes
├── components/          # React components
│   ├── auth/               # Authentication components
│   ├── maps/               # Map-related components
│   └── dashboard/          # Dashboard components
├── lib/                 # Utility libraries
│   │   ├── supabase/        # Supabase clients
│   │   └── types.ts         # TypeScript types
└── types/               # Database types
```

## 🔧 Configuration

### Google Cloud Console Setup

1. **Enable APIs**:

   - Google+ API
   - People API

2. **OAuth 2.0 Credentials**:
   - Application type: Web application
   - Authorized redirect URIs: Add your Supabase callback URL

### Supabase Configuration

1. **Authentication**:

   - Enable Google provider
   - Add your Google OAuth credentials
   - Configure redirect URLs

2. **Database**:
   - Run the provided SQL schema
   - Enable Row Level Security
   - Set up proper policies

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your GitHub repository to Vercel**

2. **Set environment variables in Vercel dashboard**:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_key
   RESEND_API_KEY=your_resend_key
   ```

3. **Update Google OAuth redirect URIs** with your production domain

4. **Deploy**: Vercel will automatically deploy your application

## 📖 API Documentation

### Authentication

- `GET /auth/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Handle user logout

### Export

- `POST /api/export` - Start export job
- `GET /api/export/[id]` - Get export status
- `GET /api/export/[id]/download` - Download exported file

### Places

- `GET /api/places` - Get user's saved places
- `POST /api/scrape` - Trigger Google Maps scraping

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

- **Google Maps Scraping**: This application uses web scraping to access Google Maps saved places. Be aware of Google's Terms of Service and rate limiting.
- **Privacy**: All user data is stored securely and is only accessible by the authenticated user.
- **Rate Limits**: The application includes rate limiting to prevent abuse and comply with third-party service limits.

## 🐛 Known Issues

- Google Maps scraping may be affected by changes in Google's UI
- Large numbers of saved places may take longer to process
- Some places might not have complete address information

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Zaid-Dildar/mapvault/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer at zaiddidlar2002@gmail.com

## 🙏 Acknowledgments

- [Supabase](https://supabase.io) for the amazing backend platform
- [MapLibre GL](https://maplibre.org) for the mapping library
- [MapTiler](https://maptiler.com) for map tiles and services
- [Vercel](https://vercel.com) for hosting and deployment
- [Tailwind CSS](https://tailwindcss.com) for styling

---

Built with ❤️ by [Muhammad Zaid Dildar](https://github.com/Zaid-Dildar)
