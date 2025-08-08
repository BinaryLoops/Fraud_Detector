'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, FileText, Code, Database, Settings, Book, Smartphone, Globe } from 'lucide-react'

const downloads = {
  reports: [
    {
      name: 'Monthly Fraud Report',
      description: 'Comprehensive fraud analysis for the current month',
      format: 'PDF',
      size: '2.4 MB',
      date: '2024-01-15',
      category: 'report'
    },
    {
      name: 'Transaction Analysis',
      description: 'Detailed transaction data and patterns',
      format: 'Excel',
      size: '5.1 MB',
      date: '2024-01-14',
      category: 'report'
    },
    {
      name: 'Risk Assessment Summary',
      description: 'Risk levels and recommendations',
      format: 'PDF',
      size: '1.8 MB',
      date: '2024-01-13',
      category: 'report'
    }
  ],
  documentation: [
    {
      name: 'API Documentation',
      description: 'Complete REST API reference and examples',
      format: 'PDF',
      size: '3.2 MB',
      date: '2024-01-10',
      category: 'docs'
    },
    {
      name: 'User Manual',
      description: 'Complete user guide for the fraud detection system',
      format: 'PDF',
      size: '4.5 MB',
      date: '2024-01-08',
      category: 'docs'
    },
    {
      name: 'Integration Guide',
      description: 'Step-by-step integration instructions',
      format: 'PDF',
      size: '2.1 MB',
      date: '2024-01-05',
      category: 'docs'
    }
  ],
  tools: [
    {
      name: 'SDK - JavaScript',
      description: 'JavaScript SDK for fraud detection integration',
      format: 'ZIP',
      size: '1.2 MB',
      date: '2024-01-12',
      category: 'sdk'
    },
    {
      name: 'SDK - Python',
      description: 'Python SDK with examples and documentation',
      format: 'ZIP',
      size: '980 KB',
      date: '2024-01-12',
      category: 'sdk'
    },
    {
      name: 'Mobile SDK - iOS',
      description: 'iOS SDK for mobile fraud detection',
      format: 'ZIP',
      size: '2.8 MB',
      date: '2024-01-10',
      category: 'mobile'
    },
    {
      name: 'Mobile SDK - Android',
      description: 'Android SDK for mobile fraud detection',
      format: 'ZIP',
      size: '3.1 MB',
      date: '2024-01-10',
      category: 'mobile'
    }
  ],
  templates: [
    {
      name: 'Fraud Rules Template',
      description: 'Pre-configured fraud detection rules',
      format: 'JSON',
      size: '45 KB',
      date: '2024-01-09',
      category: 'template'
    },
    {
      name: 'Dashboard Configuration',
      description: 'Sample dashboard configuration file',
      format: 'JSON',
      size: '23 KB',
      date: '2024-01-07',
      category: 'template'
    },
    {
      name: 'Alert Templates',
      description: 'Email and SMS alert templates',
      format: 'ZIP',
      size: '156 KB',
      date: '2024-01-06',
      category: 'template'
    }
  ]
}

export function DownloadsCenter() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const getIcon = (category: string) => {
    switch (category) {
      case 'report': return <FileText className="h-4 w-4" />
      case 'docs': return <Book className="h-4 w-4" />
      case 'sdk': return <Code className="h-4 w-4" />
      case 'mobile': return <Smartphone className="h-4 w-4" />
      case 'template': return <Settings className="h-4 w-4" />
      default: return <Download className="h-4 w-4" />
    }
  }

  const getFormatColor = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf': return 'bg-red-100 text-red-800'
      case 'excel': return 'bg-green-100 text-green-800'
      case 'zip': return 'bg-blue-100 text-blue-800'
      case 'json': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownload = (item: any) => {
    // Simulate download
    console.log('Downloading:', item.name)
    // In a real app, this would trigger the actual download
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Downloads</h1>
        <p className="text-muted-foreground">Access reports, documentation, and development tools</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloads.reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentation</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloads.documentation.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SDKs & Tools</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloads.tools.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloads.templates.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="tools">SDKs & Tools</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Reports & Analytics
              </CardTitle>
              <CardDescription>Download generated reports and analytics data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.reports.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getFormatColor(item.format)}>{item.format}</Badge>
                      </TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleDownload(item)}>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="h-5 w-5 mr-2" />
                Documentation & Guides
              </CardTitle>
              <CardDescription>Access user manuals, API docs, and integration guides</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.documentation.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getFormatColor(item.format)}>{item.format}</Badge>
                      </TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleDownload(item)}>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                SDKs & Development Tools
              </CardTitle>
              <CardDescription>Download SDKs and tools for integration</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.tools.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getIcon(item.category)}
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getFormatColor(item.format)}>{item.format}</Badge>
                      </TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleDownload(item)}>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configuration Templates
              </CardTitle>
              <CardDescription>Pre-built templates and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.templates.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getFormatColor(item.format)}>{item.format}</Badge>
                      </TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleDownload(item)}>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
