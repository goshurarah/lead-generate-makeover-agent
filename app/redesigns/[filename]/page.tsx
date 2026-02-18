"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface RedesignData {
  html: string
  css: string
  businessName: string
  improvements: string[]
  designNotes: string[]
}

export default function RedesignPreview() {
  const params = useParams()
  const [redesignData, setRedesignData] = useState<RedesignData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, this would fetch the actual redesign data
    // For demo purposes, we'll show a sample redesign
    const mockRedesign: RedesignData = {
      businessName: "Sample Business",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Professional Business Website Redesign</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
                .header { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 1rem 0; }
                .nav { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; }
                .logo { font-size: 1.5rem; font-weight: bold; color: #D97706; }
                .hero { background: linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%); padding: 4rem 2rem; text-align: center; }
                .hero h1 { font-size: 3rem; margin-bottom: 1rem; color: #1F2937; }
                .hero p { font-size: 1.25rem; margin-bottom: 2rem; color: #6B7280; }
                .btn { display: inline-block; padding: 12px 24px; background: #D97706; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
                .btn:hover { background: #92400E; }
                .section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
                .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                .footer { background: #1F2937; color: white; text-align: center; padding: 2rem; }
            </style>
        </head>
        <body>
            <header class="header">
                <nav class="nav">
                    <div class="logo">Your Business Name</div>
                    <div>
                        <a href="#about" style="margin-right: 2rem; text-decoration: none; color: #333;">About</a>
                        <a href="#services" style="margin-right: 2rem; text-decoration: none; color: #333;">Services</a>
                        <a href="#contact" class="btn">Contact</a>
                    </div>
                </nav>
            </header>
            
            <section class="hero">
                <h1>Professional Service You Can Trust</h1>
                <p>Delivering exceptional results with personalized attention to every client</p>
                <a href="#contact" class="btn">Get Started Today</a>
            </section>
            
            <section class="section">
                <h2 style="text-align: center; margin-bottom: 3rem; font-size: 2rem;">Why Choose Us</h2>
                <div class="grid">
                    <div class="card">
                        <h3 style="color: #D97706; margin-bottom: 1rem;">Expert Service</h3>
                        <p>Years of experience delivering high-quality results for our clients.</p>
                    </div>
                    <div class="card">
                        <h3 style="color: #D97706; margin-bottom: 1rem;">Customer Focused</h3>
                        <p>Your satisfaction is our priority. We listen and deliver exactly what you need.</p>
                    </div>
                    <div class="card">
                        <h3 style="color: #D97706; margin-bottom: 1rem;">Reliable & Trusted</h3>
                        <p>Count on us for consistent, dependable service every single time.</p>
                    </div>
                </div>
            </section>
            
            <footer class="footer">
                <p>&copy; 2024 Your Business Name. All rights reserved.</p>
            </footer>
        </body>
        </html>
      `,
      css: "",
      improvements: [
        "Modern, mobile-responsive design",
        "Clear call-to-action buttons",
        "Professional color scheme",
        "Optimized for search engines",
        "Fast loading performance",
      ],
      designNotes: [
        "Applied warm and inviting design theme",
        "Used orange as primary brand color",
        "Implemented mobile-first responsive design",
        "Added structured layout for better UX",
      ],
    }

    setTimeout(() => {
      setRedesignData(mockRedesign)
      setLoading(false)
    }, 1000)
  }, [params.filename])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading redesign preview...</p>
        </div>
      </div>
    )
  }

  if (!redesignData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redesign Not Found</h1>
          <p>The requested redesign could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Preview Controls */}
      <div className="bg-gray-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Website Redesign Preview</h1>
            <p className="text-sm text-gray-300">Business: {redesignData.businessName}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.history.back()} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
              Back to Results
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
              Print/Save
            </button>
          </div>
        </div>
      </div>

      {/* Redesign Preview */}
      <div className="bg-white">
        <iframe srcDoc={redesignData.html} className="w-full h-screen border-0" title="Website Redesign Preview" />
      </div>

      {/* Improvements Summary */}
      <div className="bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Redesign Improvements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Key Improvements</h3>
              <ul className="space-y-1">
                {redesignData.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Design Notes</h3>
              <ul className="space-y-1">
                {redesignData.designNotes.map((note, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
