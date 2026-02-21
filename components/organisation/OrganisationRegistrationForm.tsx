"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { submitOrganisationRegistration } from "@/lib/actions/organisation-registration.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Building2, CheckCircle2, Clock } from "lucide-react";

const PRODUCT_OPTIONS = [
    "Laptops",
    "Monitors",
    "Phones & Tablets",
    "Desktops & Components",
    "Cables & Accessories",
];

export function OrganisationRegistrationForm() {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        phone: "",
        productTypes: [] as string[],
        aboutOrg: "",
        identificationTag: "",
    });

    const toggleProduct = (item: string) => {
        setFormData((prev) => ({
            ...prev,
            productTypes: prev.productTypes.includes(item)
                ? prev.productTypes.filter((p) => p !== item)
                : [...prev.productTypes, item],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        if (formData.productTypes.length === 0) {
            alert("Please select at least one product type you're looking for.");
            return;
        }

        setIsLoading(true);
        try {
            await submitOrganisationRegistration({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                productTypes: formData.productTypes,
                aboutOrg: formData.aboutOrg.trim(),
                identificationTag: formData.identificationTag.trim() || undefined,
            });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <Card className="w-full max-w-xl border-2 border-indigo-200 bg-indigo-50/50">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                        <CheckCircle2 className="h-8 w-8 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl">Registration submitted</CardTitle>
                    <CardDescription className="text-base">
                        We have received your organisation details. We will <strong>confirm your
                        identity within 3 business days</strong> after a manual check. We’ve sent a
                        confirmation email to the address you provided.
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
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                    <Building2 className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl">Register your organisation</CardTitle>
                <CardDescription className="text-base">
                    Tell us about your organisation. We’ll verify your identity within 3 days and
                    then you can set up your profile and browse e-waste listings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Organisation name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Green Tech Recyclers"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, name: e.target.value }))
                            }
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Contact email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="contact@organisation.org"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, email: e.target.value }))
                            }
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Contact phone *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="e.g. +65 6123 4567"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, phone: e.target.value }))
                            }
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>What types of products are you looking for? *</Label>
                        <p className="text-sm text-muted-foreground">
                            Select all that apply
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {PRODUCT_OPTIONS.map((opt) => (
                                <Button
                                    key={opt}
                                    type="button"
                                    variant={
                                        formData.productTypes.includes(opt) ? "default" : "outline"
                                    }
                                    size="sm"
                                    onClick={() => toggleProduct(opt)}
                                >
                                    {opt}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="aboutOrg">About your organisation *</Label>
                        <Textarea
                            id="aboutOrg"
                            placeholder="Mission, what you do with donated tech, who you serve..."
                            value={formData.aboutOrg}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, aboutOrg: e.target.value }))
                            }
                            rows={4}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="identificationTag">
                            Identification tag (optional)
                        </Label>
                        <Input
                            id="identificationTag"
                            placeholder="e.g. registration number, charity ID"
                            value={formData.identificationTag}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, identificationTag: e.target.value }))
                            }
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading || !formData.name || !formData.email || !formData.phone || !formData.aboutOrg || formData.productTypes.length === 0}
                    >
                        {isLoading ? "Submitting…" : "Submit registration"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
