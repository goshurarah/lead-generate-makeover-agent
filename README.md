# LeadGen Website Makeover Agent MVP

A full-stack application that automatically finds local businesses, analyzes their websites, scores them against best practices, and generates AI-powered redesigns with personalized outreach messages for lead generation.

## Features

- **Smart Business Discovery** - Uses Google Places API to find 5-10 local businesses
- **Comprehensive Website Analysis** - Scores websites against 25+ best practices
- **AI-Powered Redesigns** - Generates professional HTML templates for low-scoring sites
- **Multi-Channel Outreach** - Creates personalized email, WhatsApp, and SMS messages
- **Campaign Analytics** - ROI tracking, conversion estimates, and priority scoring
- **CSV Export** - Complete data export with all analysis and outreach content

## Prerequisites

- Node.js 18+ and npm
- Google Places API key (required for real business data)
- Modern web browser

## Installation

### 1. Clone/Download the Project
\`\`\`bash
# If using Git
git clone <your-repo-url>
cd leadgen-website-makeover-agent

# Or download and extract the ZIP file
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a `.env.local` file in the project root:
\`\`\`env
GOOGLE_PLACES_API_KEY=
\`\`\`

### 4. Get Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API (New)**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key to your `.env.local` file
6. (Optional) Restrict the API key to Places API for security

### 5. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the application.

## Usage

### Basic Workflow
1. **Enter Location & Niche**
   - Location: "Harrogate, North Yorkshire, UK" (primary test location)
   - Niche: "restaurants", "dentists", "plumbers", etc.

2. **Analyze Results**
   - View discovered businesses with contact details
   - Check website scores and detailed analysis
   - Review improvement recommendations

3. **Generate Redesigns**
   - Automatic redesigns for websites scoring <70
   - Professional templates with AI-generated copy
   - Mobile-responsive designs

4. **Export & Outreach**
   - Download comprehensive CSV with all data
   - Use personalized outreach messages
   - Track campaign performance

### Sample Test Data
For reliable testing, use:
- **Location**: "Harrogate, North Yorkshire, UK"
- **Niches**: restaurants, cafes, dentists, plumbers, hair salons

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── analyze-businesses/     # Main business analysis endpoint
│   │   ├── export-csv/            # CSV export functionality
│   │   ├── generate-redesign/     # AI redesign generation
│   │   └── outreach-campaign/     # Campaign management
│   ├── redesigns/[filename]/      # Dynamic redesign viewer
│   └── page.tsx                   # Main dashboard
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── api-setup-guide.tsx        # API setup instructions
│   └── outreach-dashboard.tsx     # Campaign management UI
├── lib/
│   ├── business-scraper.ts        # Google Places & web scraping
│   ├── website-scorer.ts          # Website analysis engine
│   ├── ai-redesign-generator.ts   # Template generation
│   └── outreach-system.ts         # Message personalization
└── public/                        # Static assets
\`\`\`

## Key Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **APIs**: Google Places API, Cheerio (web scraping)
- **AI**: OpenAI GPT for content generation
- **Styling**: Tailwind CSS with custom design system

## Troubleshooting

### Common Issues

**"Google Places API key is required" Error**
- Ensure `.env.local` file exists in project root
- Verify API key is correctly formatted
- Restart development server after adding key

**No businesses found**
- Check if location is spelled correctly
- Try broader search terms (e.g., "restaurants" vs "italian restaurants")
- Verify API key has Places API enabled

**Website scoring issues**
- Some websites may block scraping attempts
- Scoring continues with available data
- Check browser console for detailed error logs

**Module not found errors**
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then reinstall

### Performance Notes

- Initial searches may take 10-30 seconds for real data processing
- Website analysis includes actual HTTP requests to business websites
- Large result sets may require pagination in production

## Development

### Available Scripts
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

### Adding New Features
- Business scoring criteria: Edit `lib/website-scorer.ts`
- Redesign templates: Modify `lib/ai-redesign-generator.ts`
- Outreach messages: Update `lib/outreach-system.ts`

## Production Deployment

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set environment variables** on your hosting platform
   \`\`\`env
   GOOGLE_PLACES_API_KEY=AIzaSyCM0K-3geLgvOAHVkUjV7MNW3U0O9tMf9U
   \`\`\`

3. **Deploy to Vercel** (recommended)
   - Connect your GitHub repository
   - Add environment variables in project settings
   - Deploy automatically on push

## License

MIT License - feel free to use this project for your lead generation business.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error details
3. Ensure all environment variables are properly set
4. Verify Google Places API quotas and billing
