'use client'
import React from 'react'
import BlurPage from '@/components/global/blur-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MessageSquare, Users, Send, Clock, FileText, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { sendBulkSMS } from '@/lib/actions/marketing-actions'

type Props = {
    params: { subaccountId: string }
}

const BulkSMSPage = ({ params }: Props) => {
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState('')
    const [recipientsStr, setRecipientsStr] = React.useState('') // Simple comma separated for now
    const { toast } = useToast()

    const handleSend = async () => {
        if (!message || !recipientsStr) {
            toast({
                title: 'Error',
                description: 'Please provide a message and at least one recipient number.',
                variant: 'destructive',
            })
            return
        }

        setLoading(true)
        try {
            // Basic parsing of comma separated numbers
            const recipients = recipientsStr.split(',').map(s => s.trim()).filter(Boolean)

            const response = await sendBulkSMS(params.subaccountId, recipients, message)

            if (response.error) {
                throw new Error(response.error)
            }

            toast({
                title: 'Success',
                description: 'Messages sent successfully via Africa\'s Talking!',
            })
            setMessage('')
            setRecipientsStr('')
        } catch (error: any) {
            console.error(error)
            toast({
                title: 'Failed',
                description: error.message || 'Could not send messages',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <BlurPage>
            <div className="flex flex-col gap-6 w-full p-4 md:p-8 max-w-6xl mx-auto">
                <Link href={`/subaccount/${params.subaccountId}/campaigns/tools`} className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm mb-2">
                    <ChevronLeft size={16} /> Back to Tools
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                <MessageSquare size={24} />
                            </span>
                            Bulk SMS
                        </h1>
                        <p className="text-muted-foreground mt-2">Send SMS campaigns via Africa's Talking API.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Setup Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Campaign Details</CardTitle>
                                <CardDescription>Configure your message settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Sender ID</Label>
                                    <Input placeholder="e.g., BRANDNAME" defaultValue="ATLABS" disabled />
                                    <p className="text-xs text-muted-foreground">Using Sandbox Sender ID 'ATLABS'.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Recipients</Label>
                                    <Input
                                        placeholder="+2547..., +2547..."
                                        value={recipientsStr}
                                        onChange={(e) => setRecipientsStr(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Enter numbers separated by commas (e.g. +254700000000). For Sandbox, ensure new numbers are invited/verified if required.</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button variant="outline" className="w-full justify-start text-muted-foreground">
                                            <Users size={16} className="mr-2" /> Select from Contacts
                                        </Button>
                                        <Button variant="outline" className="highlight-hover">
                                            <FileText size={16} className="mr-2" /> Upload CSV
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Message</Label>
                                    <Textarea
                                        placeholder="Type your message here..."
                                        className="min-h-[150px] resize-none"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{message.length} characters</span>
                                        <span>{Math.ceil(message.length / 160) || 1} SMS credit(s)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-4">
                            <Button
                                size="lg"
                                className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                                onClick={handleSend}
                                disabled={loading}
                            >
                                {loading ? <Clock className="animate-spin" size={16} /> : <Send size={16} />}
                                {loading ? 'Sending...' : 'Send Now'}
                            </Button>
                            <Button size="lg" variant="secondary" className="flex-1 gap-2">
                                <Clock size={16} /> Schedule
                            </Button>
                        </div>
                    </div>

                    {/* Preview Column */}
                    <div className="space-y-6">
                        <Card className="bg-slate-100 dark:bg-slate-900 border-none shadow-inner h-[600px] rounded-[2.5rem] relative overflow-hidden flex flex-col items-center p-4 border-4 border-slate-300 dark:border-slate-700">
                            {/* Phone Notch */}
                            <div className="absolute top-0 w-1/2 h-6 bg-slate-300 dark:bg-slate-700 rounded-b-xl z-20"></div>

                            {/* Phone Screen */}
                            <div className="w-full h-full bg-white dark:bg-black rounded-[2rem] overflow-hidden flex flex-col relative">
                                {/* Header */}
                                <div className="bg-slate-100 dark:bg-zinc-900 p-4 pt-10 border-b flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                        AT
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm">ATLABS</div>
                                        <div className="text-[10px] text-muted-foreground">Today 10:23 AM</div>
                                    </div>
                                </div>

                                {/* Preview Body */}
                                <div className="flex-1 bg-slate-50 dark:bg-zinc-950 p-4 overflow-y-auto">
                                    <div className="bg-gray-200 dark:bg-zinc-800 rounded-tl-xl rounded-tr-xl rounded-br-xl p-3 text-sm max-w-[85%] mb-2 break-words">
                                        {message || 'Preview your message will appear here exactly as your customers see it.'}
                                    </div>
                                </div>

                                {/* Footer Input Mock */}
                                <div className="p-3 bg-slate-100 dark:bg-zinc-900 border-t flex gap-2 items-center">
                                    <div className="h-8 flex-1 bg-white dark:bg-black rounded-full border"></div>
                                    <div className="w-8 h-8 rounded-full bg-blue-500"></div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Cost Estimate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-muted-foreground">Recipients</span>
                                    <span className="font-medium">{recipientsStr.split(',').filter(Boolean).length}</span>
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-muted-foreground">Credits per SMS</span>
                                    <span className="font-medium">{Math.ceil(message.length / 160) || 1}</span>
                                </div>
                                <div className="border-t my-2 pt-2 flex justify-between items-center">
                                    <span className="font-bold">Total Cost</span>
                                    <span className="font-bold text-blue-600">KES {(recipientsStr.split(',').filter(Boolean).length * (Math.ceil(message.length / 160) || 1)).toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </BlurPage>
    )
}

export default BulkSMSPage
