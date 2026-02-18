"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OutreachDashboard } from "@/components/outreach-dashboard";
import { ApiSetupGuide } from "@/components/api-setup-guide";
import {
  Download,
  Search,
  Globe,
  MessageSquare,
  Phone,
  Mail,
  BarChart3,
  AlertCircle,
} from "lucide-react";

interface Business {
  id: string;
  name: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  score: number;
  issues: string[];
  redesignUrl?: string;
  outreachMessages: {
    email: string;
    whatsapp: string;
    sms: string;
  };
}

export default function LeadGenAgent() {
  const [location, setLocation] = useState("Harrogate, North Yorkshire, UK");
  const [niche, setNiche] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [apiSetupRequired, setApiSetupRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!location || !niche) return;

    setIsLoading(true);
    setActiveTab("results");
    setApiSetupRequired(false);
    setError(null);

    try {
      const response = await fetch("/api/analyze-businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, niche }),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.setupRequired) {
          setApiSetupRequired(true);
        } else {
          setError(data.details || data.error || "An error occurred");
        }
        setBusinesses([]);
      } else {
        setBusinesses(data.businesses || []);
      }
    } catch (error) {
      console.error("Error analyzing businesses:", error);
      setError("Network error occurred. Please try again.");
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/export-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businesses,
          includeOutreach: true,
          includeAnalysis: true,
          niche,
          location,
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leadgen-${location.replace(
        /[^a-zA-Z0-9]/g,
        "-"
      )}-${niche.replace(/[^a-zA-Z0-9]/g, "-")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LeadGen Website Makeover Agent
          </h1>
          <p className="text-lg text-gray-600">
            Find local businesses, analyze their websites, and generate redesign
            opportunities
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Search & Analyze</TabsTrigger>
            <TabsTrigger value="results">Results & Export</TabsTrigger>
            <TabsTrigger value="outreach">Outreach Campaign</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Business Search Parameters
                </CardTitle>
                <CardDescription>
                  Enter the location and business niche to find and analyze
                  local websites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Harrogate, North Yorkshire, UK"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niche">Business Niche</Label>
                    <Input
                      id="niche"
                      placeholder="e.g., restaurants, dentists, plumbers"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!location || !niche || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading
                    ? "Analyzing Businesses..."
                    : "Find & Analyze Businesses"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {businesses.length > 0 && (
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  Found {businesses.length} businesses in {location}
                </h2>
                <Button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Comprehensive CSV
                </Button>
              </div>
            )}

            {apiSetupRequired ? (
              <ApiSetupGuide />
            ) : error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-lg text-red-600 mb-2">Error occurred</p>
                  <p className="text-sm text-gray-600">{error}</p>
                  <Button
                    onClick={() => setActiveTab("search")}
                    variant="outline"
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg">
                    Analyzing businesses and their websites...
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    This may take a few minutes
                  </p>
                </CardContent>
              </Card>
            ) : businesses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">No results yet</p>
                  <p className="text-sm text-gray-500">
                    Use the search tab to find businesses
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {businesses.map((business) => (
                  <Card key={business.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            {business.name}
                          </CardTitle>
                          <CardDescription>{business.address}</CardDescription>
                        </div>
                        <Badge variant={getScoreBadgeVariant(business.score)}>
                          Score: {business.score}/100
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Website</Label>
                          <p className="text-sm text-blue-600 hover:underline">
                            <a
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {business.website}
                            </a>
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <p className="text-sm">{business.phone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <p className="text-sm">{business.email}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Website Score
                        </Label>
                        <Progress value={business.score} className="h-2" />
                      </div>

                      {business.issues.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Issues Found
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {business.issues.map((issue, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {business.score < 70 && business.redesignUrl && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <Label className="text-sm font-medium mb-2 block">
                            Generated Redesign
                          </Label>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={business.redesignUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Redesign Template
                            </a>
                          </Button>
                        </div>
                      )}

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Label className="text-sm font-medium mb-3 block">
                          Outreach Messages
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm font-medium">Email</span>
                            </div>
                            <p className="text-xs bg-white p-2 rounded border">
                              {business.outreachMessages.email}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                WhatsApp
                              </span>
                            </div>
                            <p className="text-xs bg-white p-2 rounded border">
                              {business.outreachMessages.whatsapp}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Phone className="h-4 w-4" />
                              <span className="text-sm font-medium">SMS</span>
                            </div>
                            <p className="text-xs bg-white p-2 rounded border">
                              {business.outreachMessages.sms}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="outreach" className="space-y-6">
            {businesses.length > 0 ? (
              <OutreachDashboard
                businesses={businesses}
                niche={niche}
                location={location}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">
                    No businesses to create outreach for
                  </p>
                  <p className="text-sm text-gray-500">
                    Search for businesses first
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {businesses.length > 0 ? (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Campaign Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {businesses.length}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Prospects
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">
                          {businesses.filter((b) => b.score < 50).length}
                        </div>
                        <div className="text-sm text-gray-600">
                          High Priority
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600">
                          {
                            businesses.filter(
                              (b) => b.score >= 50 && b.score < 70
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-600">
                          Medium Priority
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          $
                          {(
                            businesses.filter((b) => b.score < 70).length * 2500
                          ).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Potential Revenue
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">
                    No analytics data available
                  </p>
                  <p className="text-sm text-gray-500">
                    Search for businesses first
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
