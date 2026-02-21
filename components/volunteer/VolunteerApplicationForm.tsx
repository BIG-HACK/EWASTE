"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { submitVolunteerApplication } from "@/lib/actions/volunteer.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Heart, CheckCircle2, Clock } from "lucide-react";

export function VolunteerApplicationForm() {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState<"pending" | "approved" | "rejected" | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        phone: "",
        wantMeeting: false,
        availability: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        const age = parseInt(formData.age, 10);
        if (isNaN(age) || age < 16 || age > 120) {
            alert("Please enter a valid age (16–120).");
            return;
        }

        setIsLoading(true);
        try {
            await submitVolunteerApplication({
                clerkId: user.id,
                name: formData.name.trim(),
                age,
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                wantMeeting: formData.wantMeeting,
                availability: formData.availability.trim() || undefined,
            });
            setSubmitted(true);
            setStatus("pending");
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted || status) {
        return (
            <Card className="w-full max-w-xl border-2 border-emerald-200 bg-emerald-50/50">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl">Application submitted</CardTitle>
                    <CardDescription className="text-base">
                        Your application has been submitted successfully. Your account will be
                        verified within <strong>3–5 business days</strong>. We’ll contact you at
                        the email or phone number you provided once you’re approved.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <div className="flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-amber-800">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Verification in progress</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-xl">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                    <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl">Apply to be a volunteer</CardTitle>
                <CardDescription className="text-base">
                    Help pick up e-waste from donors and deliver to organisations. Fill in your
                    details below—no essay required.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Jane Tan"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            min={16}
                            max={120}
                            placeholder="e.g. 25"
                            value={formData.age}
                            onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="e.g. +65 9123 4567"
                            value={formData.phone}
                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="availability">Availability (optional)</Label>
                        <Input
                            id="availability"
                            placeholder="e.g. Weekends, weekday evenings"
                            value={formData.availability}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, availability: e.target.value }))
                            }
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="wantMeeting"
                            checked={formData.wantMeeting}
                            onCheckedChange={(checked) =>
                                setFormData((p) => ({ ...p, wantMeeting: !!checked }))
                            }
                        />
                        <Label htmlFor="wantMeeting" className="cursor-pointer font-normal">
                            I’d like to have a short meeting with the team
                        </Label>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? "Submitting…" : "Submit application"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
