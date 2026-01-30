import React from 'react'
import BlurPage from '@/components/global/blur-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Users, UploadCloud, Mic, PlayCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Props = {
    params: { subaccountId: string }
}

const BulkVoicePage = ({ params }: Props) => {
    return (
        <BlurPage>
            <div className="flex flex-col gap-6 w-full p-4 md:p-8 max-w-6xl mx-auto">
                <Link href={`/subaccount/${params.subaccountId}/campaigns/tools`} className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm mb-2">
                    <ChevronLeft size={16} /> Back to Tools
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                <Phone size={24} />
                            </span>
                            Bulk Voice
                        </h1>
                        <p className="text-muted-foreground mt-2">Broadcast voice messages to your contact lists.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Audio Setup</CardTitle>
                                <CardDescription>Provide the audio message to broadcast</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                            <UploadCloud size={24} className="text-muted-foreground" />
                                        </div>
                                        <span className="font-medium text-sm">Upload Audio File</span>
                                        <span className="text-xs text-muted-foreground">MP3 or WAV (max 5MB)</span>
                                    </div>
                                    <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                            <Mic size={24} className="text-muted-foreground" />
                                        </div>
                                        <span className="font-medium text-sm">Text to Speech</span>
                                        <span className="text-xs text-muted-foreground">Generate audio from text</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Caller ID</Label>
                                    <Input placeholder="+2547..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Recipients</Label>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="w-full justify-start text-muted-foreground">
                                            <Users size={16} className="mr-2" /> From Contacts
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                            Launch Voice Broadcast
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>How it works</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</div>
                                    <p className="text-sm opacity-90">Upload your prerecorded message or type text to convert.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</div>
                                    <p className="text-sm opacity-90">Select contact list to dial.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">3</div>
                                    <p className="text-sm opacity-90">System dials numbers simultaneously and plays audio on pickup.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </BlurPage>
    )
}

export default BulkVoicePage
