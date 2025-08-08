'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FileText, Download, CalendarIcon, TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Clock, Filter, Search, Plus, Eye, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Report {
  id: string
  name: string
  type: 'fraud_summary' | 'transaction_analysis' | 'risk_assessment' | 'performance_metrics'
  status: 'completed' | 'generating' | 'scheduled' | 'failed'
  createdAt: string
  size: string
  format: 'PDF' | 'CSV' | 'Excel'
}

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [reports] = useState<Report[]>([
    {
      id: 'RPT-001',
      name: 'Weekly Fraud Summary',
      type: 'fraud_summary',
      status: 'completed',
      createdAt: '2024-01-15 14:30',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 'RPT-002',
      name: 'Transaction Analysis Q1',
      type: 'transaction_analysis',
      status: 'generating',
      createdAt: '2024-01-15 13:45',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: 'RPT-003',
      name: 'Risk Assessment Report',
      type: 'risk_assessment',
      status: 'completed',
      createdAt: '2024-01-15 12:20',
      size: '3.2 MB',
      format: 'PDF'
    },
    {
      id: 'RPT-004',
      name: 'Performance Metrics',
      type: 'performance_metrics',
      status: 'scheduled',
      createdAt: '2024-01-15 11:00',
      size: '0.9 MB',
      format: 'CSV'
    },
    {
      id: 'RPT-005',
      name: 'Monthly Compliance Report',
      type: 'fraud_summary',
      status: 'failed',
      createdAt: '2024-01-15 10:15',
      size: '2.1 MB',
      format: 'PDF'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'generating': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud_summary': return <FileText className="w-4 h-4 text-red-500" />
      case 'transaction_analysis': return <BarChart3 className="w-4 h-4 text-blue-500" />
      case 'risk_assessment': return <Activity className="w-4 h-4 text-orange-500" />
      case 'performance_metrics': return <TrendingUp className="w-4 h-4 text-green-500" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'fraud_summary': return 'Fraud Summary'
      case 'transaction_analysis': return 'Transaction Analysis'
      case 'risk_assessment': return 'Risk Assessment'
      case 'performance_metrics': return 'Performance Metrics'
      default: return 'Unknown'
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || report.type === filterType
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    totalReports: reports.length,
    completedReports: reports.filter(r => r.status === 'completed').length,
    scheduledReports: reports.filter(r => r.status === 'scheduled').length,
    failedReports: reports.filter(r => r.status === 'failed').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
            <p className="text-gray-400 mt-1">Generate and manage fraud detection reports</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalReports}</div>
              <div className="flex items-center text-sm text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% this month
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.completedReports}</div>
              <div className="flex items-center text-sm text-green-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8% success rate
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.scheduledReports}</div>
              <div className="flex items-center text-sm text-yellow-400">
                <Clock className="w-4 h-4 mr-1" />
                Pending execution
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Failed</CardTitle>
              <Activity className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.failedReports}</div>
              <div className="flex items-center text-sm text-red-400">
                <TrendingDown className="w-4 h-4 mr-1" />
                Needs attention
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <TabsTrigger value="generate" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Generate Report
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Recent Reports
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Scheduled Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Report Generation Form */}
              <Card className="glass-effect border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Generate New Report</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create custom fraud detection and analytics reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name" className="text-gray-300">Report Name</Label>
                    <Input
                      id="report-name"
                      placeholder="Enter report name..."
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-type" className="text-gray-300">Report Type</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="fraud_summary">Fraud Summary</SelectItem>
                        <SelectItem value="transaction_analysis">Transaction Analysis</SelectItem>
                        <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                        <SelectItem value="performance_metrics">Performance Metrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-gray-900 border-gray-700 text-white",
                              !dateFrom && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={setDateFrom}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-gray-900 border-gray-700 text-white",
                              !dateTo && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Output Format</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              {/* Report Templates */}
              <Card className="glass-effect border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Templates</CardTitle>
                  <CardDescription className="text-gray-400">
                    Pre-configured report templates for common use cases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 border-gray-700 text-gray-300 hover:bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">Daily Fraud Summary</p>
                        <p className="text-sm text-gray-400">Last 24 hours fraud detection overview</p>
                      </div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-auto p-4 border-gray-700 text-gray-300 hover:bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">Weekly Transaction Analysis</p>
                        <p className="text-sm text-gray-400">Comprehensive transaction patterns and trends</p>
                      </div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-auto p-4 border-gray-700 text-gray-300 hover:bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">Monthly Risk Assessment</p>
                        <p className="text-sm text-gray-400">Risk metrics and threat analysis</p>
                      </div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-auto p-4 border-gray-700 text-gray-300 hover:bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">Performance Dashboard</p>
                        <p className="text-sm text-gray-400">System performance and accuracy metrics</p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card className="glass-effect border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Recent Reports</CardTitle>
                    <CardDescription className="text-gray-400">
                      View and manage your generated reports
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="fraud_summary">Fraud Summary</SelectItem>
                        <SelectItem value="transaction_analysis">Transaction Analysis</SelectItem>
                        <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                        <SelectItem value="performance_metrics">Performance Metrics</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="generating">Generating</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{report.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-400">{report.id}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-gray-400">{getTypeName(report.type)}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-gray-400">{report.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <p className="text-sm text-gray-400 mt-1">
                            {report.size} • {report.format}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                              <Eye className="w-4 h-4 mr-2" />
                              View Report
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-gray-800">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  
                  {filteredReports.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No reports found</p>
                      <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <Card className="glass-effect border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Scheduled Reports</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage automated report generation schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No scheduled reports</p>
                  <p className="text-gray-500 text-sm mt-2 mb-4">Set up automated report generation to save time</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
