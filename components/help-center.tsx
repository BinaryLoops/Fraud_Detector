'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search, HelpCircle, Book, MessageCircle, Mail, Phone, FileText, Video, Download } from 'lucide-react'

const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I set up fraud detection rules?',
        answer: 'Navigate to the Rules section in the dashboard. Click "Add Rule" and configure your fraud detection parameters including conditions, actions, and severity levels.'
      },
      {
        question: 'What types of transactions can be monitored?',
        answer: 'Our system can monitor all types of financial transactions including credit card payments, bank transfers, online purchases, and mobile payments.'
      },
      {
        question: 'How do I interpret fraud scores?',
        answer: 'Fraud scores range from 0-100. Scores above 70 indicate high risk, 40-70 medium risk, and below 40 low risk. You can customize these thresholds in the settings.'
      }
    ]
  },
  {
    category: 'Account Management',
    questions: [
      {
        question: 'How do I add new users to my account?',
        answer: 'Go to the Users section in the management panel. Click "Add User" and fill in the required information including role and permissions.'
      },
      {
        question: 'Can I customize user permissions?',
        answer: 'Yes, you can assign different roles (Admin, Analyst, User) with varying levels of access to different features and data.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on your profile in the top right corner, go to Settings > Security, and use the password reset option.'
      }
    ]
  },
  {
    category: 'Technical Support',
    questions: [
      {
        question: 'What browsers are supported?',
        answer: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For best performance, we recommend Chrome or Firefox.'
      },
      {
        question: 'Is there an API available?',
        answer: 'Yes, we provide a comprehensive REST API for integration with your existing systems. Documentation is available in the Downloads section.'
      },
      {
        question: 'How do I export data?',
        answer: 'Use the Reports section to generate and export data in various formats including CSV, PDF, and Excel.'
      }
    ]
  }
]

const tutorials = [
  {
    title: 'Getting Started with Fraud Detection',
    description: 'Learn the basics of setting up your fraud detection system',
    duration: '10 min',
    type: 'video'
  },
  {
    title: 'Creating Custom Rules',
    description: 'Step-by-step guide to creating effective fraud detection rules',
    duration: '15 min',
    type: 'article'
  },
  {
    title: 'Understanding Analytics',
    description: 'How to interpret fraud analytics and reports',
    duration: '12 min',
    type: 'video'
  },
  {
    title: 'API Integration Guide',
    description: 'Complete guide to integrating with our API',
    duration: '20 min',
    type: 'article'
  }
]

export function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const filteredTutorials = tutorials.filter(
    tutorial => tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Help Center</h1>
          <p className="text-muted-foreground">Find answers and get support</p>
        </div>
        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
              <DialogDescription>Send us a message and we'll get back to you</DialogDescription>
            </DialogHeader>
            <ContactForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles, FAQs, and tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Book className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <CardTitle className="text-lg">Documentation</CardTitle>
            <CardDescription>Complete guides and API documentation</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Video className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <CardTitle className="text-lg">Video Tutorials</CardTitle>
            <CardDescription>Step-by-step video guides</CardDescription>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <CardTitle className="text-lg">Live Chat</CardTitle>
            <CardDescription>Get instant help from our team</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <div className="space-y-6">
            {filteredFAQ.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials">
          <div className="grid gap-4">
            {filteredTutorials.map((tutorial, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {tutorial.type === 'video' ? (
                        <Video className="h-5 w-5 mt-1 text-blue-600" />
                      ) : (
                        <FileText className="h-5 w-5 mt-1 text-green-600" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                        <CardDescription>{tutorial.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{tutorial.duration}</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Support
                </CardTitle>
                <CardDescription>Get help via email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us an email and we'll respond within 24 hours
                </p>
                <Button variant="outline" className="w-full">
                  support@frauddetection.com
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Phone Support
                </CardTitle>
                <CardDescription>Speak with our team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Available Monday-Friday, 9 AM - 6 PM EST
                </p>
                <Button variant="outline" className="w-full">
                  +1 (555) 123-4567
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          required
        />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <DialogFooter>
        <Button type="submit">Send Message</Button>
      </DialogFooter>
    </form>
  )
}
