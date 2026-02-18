"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Phone, Copy, Send, TrendingUp, Users, DollarSign, Target } from "lucide-react"

interface OutreachDashboardProps {
  businesses: any[]
  niche: string
  location: string
}

export function OutreachDashboard({ businesses, niche, location }: OutreachDashboardProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [customMessage, setCustomMessage] = useState<string>("")
  const [campaignStats, setCampaignStats] = useState({
    totalBusinesses: businesses.length,
    highPriority: businesses.filter((b) => b.score < 50).length,
    mediumPriority: businesses.filter((b) => b.score >= 50 && b.score < 70).length,
    potentialRevenue: businesses.filter((b) => b.score < 70).length * 2500,
  })

  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message)
    // You could add a toast notification here
  }

  const handleSendMessage = (business: any, type: "email" | "whatsapp" | "sms") => {
    // In a real implementation, this would integrate with email/SMS services
    console.log(`Sending ${type} to ${business.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignStats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">Businesses analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{campaignStats.highPriority}</div>
            <p className="text-xs text-muted-foreground">Score &lt; 50</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{campaignStats.mediumPriority}</div>
            <p className="text-xs text-muted-foreground">Score 50-69</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${campaignStats.potentialRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">15% conversion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Outreach Management */}
      <Tabs defaultValue="prospects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prospects">Prospect List</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="campaign">Campaign Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="prospects" className="space-y-4">
          <div className="grid gap-4">
            {businesses.map((business) => (
              <Card
                key={business.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedBusiness(business)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <CardDescription>{business.address}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={business.score < 50 ? "destructive" : business.score < 70 ? "secondary" : "default"}
                      >
                        Score: {business.score}
                      </Badge>
                      <Badge variant="outline">
                        {business.score < 50
                          ? "High Priority"
                          : business.score < 70
                            ? "Medium Priority"
                            : "Low Priority"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>📧 {business.email !== "Not available" ? "Email Available" : "No Email"}</span>
                      <span>📱 {business.phone !== "Not available" ? "Phone Available" : "No Phone"}</span>
                      <span>
                        🌐 {business.website && !business.website.includes("No website") ? "Has Website" : "No Website"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyMessage(business.outreachMessages?.email || "")
                        }}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSendMessage(business, "email")
                        }}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Pre-built templates for different scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4" />
                    <h3 className="font-medium">Low Score Website - Email</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">For businesses with website scores below 70</p>
                  <Textarea
                    value="Hi {{businessName}} team! I analyzed your website and found opportunities to increase traffic by {{trafficIncrease}} and leads by {{leadIncrease}}..."
                    readOnly
                    className="text-xs"
                  />
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <h3 className="font-medium">WhatsApp Follow-up</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Quick follow-up message for WhatsApp</p>
                  <Textarea
                    value="Hi! Following up on the website analysis for {{businessName}}. Found ways to boost leads by {{leadIncrease}}. Interested in the free mockup?"
                    readOnly
                    className="text-xs"
                  />
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    <h3 className="font-medium">SMS - Urgent</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Short, urgent message for SMS</p>
                  <Textarea
                    value="Hi {{businessName}}! Website needs updates. Missing {{leadIncrease}} customers monthly. Free analysis ready. Reply YES."
                    readOnly
                    className="text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Track your outreach campaign results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Messages Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Opened</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Replied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Converted</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
