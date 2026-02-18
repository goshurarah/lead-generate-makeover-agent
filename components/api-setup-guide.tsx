import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ApiSetupGuide() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🔑 Google Places API Setup Required</CardTitle>
        <CardDescription>
          To use real business data from Harrogate and other locations, you need a Google Places API key.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-semibold">Quick Setup Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Go to{" "}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Cloud Console
              </a>
            </li>
            <li>Create a new project or select an existing one</li>
            <li>
              Enable the{" "}
              <Badge variant="secondary" className="text-xs">
                Places API
              </Badge>{" "}
              in the API Library
            </li>
            <li>Go to "Credentials" and create an API key</li>
            <li>
              Add your API key to{" "}
              <Badge variant="outline" className="text-xs font-mono">
                .env.local
              </Badge>
            </li>
          </ol>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Add this to your .env.local file:</p>
          <code className="text-xs bg-gray-800 text-green-400 p-2 rounded block">
           GOOGLE_PLACES_API_KEY=AIzaSyBWHz0bD2Qxck4-VDP0wxlVd7MTzmNaco8
          </code>
        </div>

        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm">
            <strong>💡 Tip:</strong> The API key is free for up to 1,000 requests per month. Perfect for testing with
            Harrogate businesses!
          </p>
        </div>

        <div className="bg-yellow-50 p-3 rounded-md">
          <p className="text-sm">
            <strong>⚠️ Important:</strong> Restart your development server after adding the API key.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
