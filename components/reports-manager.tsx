'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FileText, Download, CalendarIcon, TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign, Shield, AlertTriangle, Clock, Filter, Search, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

interface Report {
  id: string
  name: string
  type: 'fraud-summary' | 'transaction-analysis' | 'risk-assessment' | 'performance-metrics' | 'compliance'
  description: string
  lastGenerated: Date
  status: 'ready' | 'generating' | 'scheduled'
  size: string
  format: 'PDF' | 'CSV' | 'Excel'
}

export function ReportsManager() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<{from: Date, to: Date}>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    // Initialize reports
    const initialReports: Report[] = [
      {
        id: '1',
        name: 'Monthly Fraud Summary',
        type: 'fraud-summary',
        description: 'Comprehensive overview of fraud detection activities for the past month',
        lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'ready',
        size: '2.4 MB',
        format: 'PDF'
      },
      {
        id: '2',
        name: 'Transaction Risk Analysis',
        type: 'transaction-analysis',
        description: 'Detailed analysis of transaction patterns and risk factors',
        lastGenerated: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'ready',
        size: '1.8 MB',
        format: 'Excel'
      },
      {
        id: '3',
        name: 'Weekly Performance Metrics',
        type: 'performance-metrics',
        description: 'System performance and detection accuracy metrics',
        lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'ready',
        size: '856 KB',
        format: 'PDF'
      },
      {
        id: '4',
        name: 'Compliance Report',
        type: 'compliance',
        description: 'Regulatory compliance and audit trail documentation',
        lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        size: '3.2 MB',
        format: 'PDF'
      },
      {
        id: '5',
        name: 'Risk Assessment Dashboard',
        type: 'risk-assessment',
        description: 'Current risk levels and threat landscape analysis',
        lastGenerated: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'generating',
        size: '1.2 MB',
        format: 'CSV'
      }
    ]
    setReports(initialReports)
  }, [])

  const handleGenerateReport = async (reportId: string) => {
    setGenerating(reportId)
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'generating' as const } : r
    ))

    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === reportId ? { 
          ...r, 
          status: 'ready' as const, 
          lastGenerated: new Date() 
        } : r
      ))
      setGenerating(null)
    }, 3000)
  }

  const handleDownloadReport = (reportId: string) => {
    // Simulate download
    const report = reports.find(r => r.id === reportId)
    if (report) {
      // In a real app, this would trigger an actual download
      console.log(`Downloading ${report.name}`)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Ready</Badge>
      case 'generating':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 animate-pulse">Generating</Badge>
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud-summary':
        return <Shield className="w-4 h-4 text-red-500" />
      case 'transaction-analysis':
        return <BarChart3 className="w-4 h-4 text-blue-500" />
      case 'risk-assessment':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'performance-metrics':
        return <Activity className="w-4 h-4 text-green-500" />
      case 'compliance':
        return <FileText className="w-4 h-4 text-purple-500" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    return matchesSearch && matchesType
  })

  const stats = {
    totalReports: reports.length,
    readyReports: reports.filter(r => r.status === 'ready').length,
    generatingReports: reports.filter(r => r.status === 'generating').length,
    scheduledReports: reports.filter(r => r.status === 'scheduled').length
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate and download comprehensive fraud detection reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hover:bg-blue-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <FileText className="w-4 h-4 mr-2" />
            Create Custom Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalReports}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +3 this month
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ready to Download</CardTitle>
            <Download className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.readyReports}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              Available now
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Generating</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.generatingReports}</div>
            <div className="flex items-center text-sm text-blue-600">
              <Clock className="w-4 h-4 mr-1" />
              In progress
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
            <CalendarIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.scheduledReports}</div>
            <div className="flex items-center text-sm text-purple-600">
              <Clock className="w-4 h-4 mr-1" />
              Auto-generated
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report Management</CardTitle>
              <CardDescription>
                Generate, schedule, and download fraud detection reports
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fraud-summary">Fraud Summary</SelectItem>
                  <SelectItem value="transaction-analysis">Transaction Analysis</SelectItem>
                  <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                  <SelectItem value="performance-metrics">Performance Metrics</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reports" className="space-y-4">
            <TabsList>
              <TabsTrigger value="reports">Available Reports</TabsTrigger>
              <TabsTrigger value="custom">Custom Reports</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4">
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(report.type)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(report.status)}
                        <Badge variant="outline">{report.format}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Size: {report.size}</span>
                        <span>Last generated: {report.lastGenerated.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.status === 'ready' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadReport(report.id)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGenerateReport(report.id)}
                          disabled={generating === report.id || report.status === 'generating'}
                        >
                          {generating === report.id || report.status === 'generating' ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Regenerate
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create Custom Report</CardTitle>
                  <CardDescription>
                    Build a custom report with specific metrics and date ranges
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Name</label>
                      <Input placeholder="Enter report name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fraud-summary">Fraud Summary</SelectItem>
                          <SelectItem value="transaction-analysis">Transaction Analysis</SelectItem>
                          <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                          <SelectItem value="performance-metrics">Performance Metrics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDateRange.from && selectedDateRange.to ? (
                              `${format(selectedDateRange.from, 'PPP')} - ${format(selectedDateRange.to, 'PPP')}`
                            ) : (
                              'Select date range'
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={{
                              from: selectedDateRange.from,
                              to: selectedDateRange.to
                            }}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                setSelectedDateRange({ from: range.from, to: range.to })
                              }
                            }}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Custom Report
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scheduled Reports</h3>
                <p className="text-gray-600 mb-4">Set up automatic report generation on a schedule</p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
