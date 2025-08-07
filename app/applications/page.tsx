/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { getSession } from '@/service/session'
import db from '@/service/prisma'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Building, DollarSign, Clock, Briefcase } from "lucide-react"

const ApplicationPage = async () => {
    const user = await getSession()
    const userId = user.id
    
    if (!user.id) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground">Please sign in to view your applications.</p>
                </div>
            </div>
        )
    }

    const applications = await db.application.findMany({
        where: {
            user_id: userId
        },
        include: {
            job: {
                include: {
                    company: true,
                }
            }
        },
    })

    const formatSalary = (salary) => {
        if (salary >= 100000) {
            return `$${(salary / 1000).toFixed(0)}k`;
        }
        return `$${salary?.toLocaleString()}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (applications.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h2 className="text-2xl font-bold mb-2">No Applications Yet</h2>
                    <p className="text-muted-foreground mb-4">
                        You have not applied to any jobs yet. Start exploring opportunities!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Applications</h1>
                <p className="text-muted-foreground">
                    You have applied to {applications.length} job{applications.length > 1 ? 's' : ''}
                </p>
            </div>

            <div className="grid gap-6">
                {applications.map((app, index) => {
                    const { job } = app;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl font-bold mb-2">
                                            {job.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 text-base">
                                            <Building className="w-4 h-4" />
                                            {job.company.name}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">
                                            {job.employment_type}
                                        </Badge>
                                        <Badge variant="secondary">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {job.job_type}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-semibold text-green-600">
                                                {formatSalary(job.salary)}/year
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                            <span>Applied on {formatDate(app.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                                            <span>Application ID: #{app.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Job Description:</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {job.description}
                                    </p>
                                </div>

                                <div className="mb-4 p-3 bg-muted rounded-lg">
                                    <h4 className="font-semibold mb-2">Company Info:</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {job.company.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4 border-t">
                                    <Badge variant="outline" className="ml-auto">
                                        Status: Applied
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}

export default ApplicationPage