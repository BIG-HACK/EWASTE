"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createOrganisationProfile } from "@/lib/actions/organisationprofile.actions";
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
import { Upload, X } from "lucide-react";

// Declare Cloudinary widget type
declare global {
    interface Window {
        cloudinary: any;
    }
}

const CATEGORY_OPTIONS = [
    "Laptops",
    "Monitors",
    "Phones & Tablets",
    "Desktops & Components",
    "Cables & Accessories",
];

export type CreateOrganisationProfileInitialData = {
    name?: string;
    email?: string;
    phone?: string;
    description?: string;
};

export function CreateOrganisationProfileForm({
    initialData,
}: {
    initialData?: CreateOrganisationProfileInitialData;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name ?? "",
        address: "",
        phone: initialData?.phone ?? "",
        email: initialData?.email ?? "",
        website: "",
        logo: "",
        description: initialData?.description ?? "",
        needs: "",
        tags: "",
        selectedCategories: [] as string[],
    });
    const router = useRouter();
    const { user } = useUser();

    const toggleCategory = (cat: string) => {
        setFormData((prev) => {
            const next = prev.selectedCategories.includes(cat)
                ? prev.selectedCategories.filter((c) => c !== cat)
                : prev.selectedCategories.length < 3
                  ? [...prev.selectedCategories, cat]
                  : prev.selectedCategories;
            return { ...prev, selectedCategories: next };
        });
    };

    // Load Cloudinary widget script
    useEffect(() => {
        if (!document.getElementById("cloudinary-upload-widget")) {
            const script = document.createElement("script");
            script.id = "cloudinary-upload-widget";
            script.src = "https://upload-widget.cloudinary.com/global/all.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            alert("You must be logged in to create a profile");
            return;
        }

        setIsLoading(true);
        try {
            const needsList =
                formData.selectedCategories.length === 3
                    ? formData.selectedCategories
                    : formData.needs
                      ? formData.needs.split(",").map((item) => item.trim()).filter(Boolean)
                      : undefined;

            const profileData: CreateOrganisationProfileParams = {
                clerkId: user.id,
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                website: formData.website,
                logo: formData.logo,
                description: formData.description,
                needs: needsList?.length ? needsList : formData.needs ? formData.needs.split(",").map(item => item.trim()).filter(Boolean) : undefined,
                tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
            };

            await createOrganisationProfile(profileData);
            if (formData.selectedCategories.length === 3) {
                const params = new URLSearchParams();
                formData.selectedCategories.forEach((c) => params.append("category", c));
                router.push(`/listings?${params.toString()}`);
            } else {
                router.push("/dashboard");
            }
            router.refresh();
        } catch (error) {
            console.error("Error creating profile:", error);
            alert("Failed to create profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const openUploadWidget = () => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            alert("Cloudinary is not configured. Please add your cloud name and upload preset to environment variables.");
            return;
        }

        setIsUploading(true);

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset,
                sources: ["local", "camera"],
                multiple: false,
                maxFiles: 1,
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                maxFileSize: 5000000, // 5MB
                folder: "organisation-logos",
            },
            (error: any, result: any) => {
                if (error) {
                    console.error("Upload error:", error);
                    alert("Failed to upload logo. Please try again.");
                    setIsUploading(false);
                    return;
                }

                if (result.event === "success") {
                    setFormData({
                        ...formData,
                        logo: result.info.secure_url,
                    });
                    setIsUploading(false);
                    widget.close();
                }
            }
        );

        widget.open();
    };

    const removeLogo = () => {
        setFormData({
            ...formData,
            logo: "",
        });
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-3xl">Create Organisation Profile</CardTitle>
                <CardDescription>
                    Set up your organisation profile to start collecting e-waste
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Organisation Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Organisation Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g., Green Recycling Foundation"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="contact@organisation.org"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="123 Green Street, City, State"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <Label htmlFor="website">Website *</Label>
                        <Input
                            id="website"
                            name="website"
                            type="text"
                            placeholder="https://www.yourorganisation.org"
                            value={formData.website}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <Label>Organisation Logo *</Label>
                        {!formData.logo ? (
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={openUploadWidget}
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Uploading..." : "Upload Logo"}
                                </Button>
                                <p className="text-sm text-muted-foreground mt-2">
                                    JPG, PNG or WEBP (Max 5MB)
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={formData.logo}
                                    alt="Logo preview"
                                    className="w-full h-64 object-contain bg-gray-50 rounded-lg p-4"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={removeLogo}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">About Your Organisation *</Label>
                        {initialData?.description && (
                            <p className="text-sm text-muted-foreground">
                                We’ve pre-filled this from your registration. Use as your official description or edit below.
                            </p>
                        )}
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your organisation's mission, activities, and impact..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                        />
                    </div>

                    {/* Choose 3 of 5 categories */}
                    <div className="space-y-2">
                        <Label>What do you want to get? Choose 3 categories *</Label>
                        <p className="text-sm text-muted-foreground">
                            Select exactly 3 — we’ll show you listings that match.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORY_OPTIONS.map((cat) => (
                                <Button
                                    key={cat}
                                    type="button"
                                    variant={formData.selectedCategories.includes(cat) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleCategory(cat)}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                        {formData.selectedCategories.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {formData.selectedCategories.length} of 3 selected
                            </p>
                        )}
                    </div>

                    {/* Needs (fallback if not using 3 categories) */}
                    <div className="space-y-2">
                        <Label htmlFor="needs">Additional items (optional)</Label>
                        <Input
                            id="needs"
                            name="needs"
                            type="text"
                            placeholder="e.g., keyboards, mice (comma-separated)"
                            value={formData.needs}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Optional)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            type="text"
                            placeholder="e.g., recycling, charity, education (comma-separated)"
                            value={formData.tags}
                            onChange={handleChange}
                        />
                        <p className="text-sm text-muted-foreground">
                            Separate tags with commas
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={
                            isLoading ||
                            !formData.logo ||
                            formData.selectedCategories.length !== 3
                        }
                        className="w-full"
                        size="lg"
                    >
                        {isLoading ? "Creating profile..." : "Create Profile & view listings"}
                    </Button>
                    {!formData.logo && (
                        <p className="text-sm text-red-500 text-center">
                            Please upload a logo before submitting
                        </p>
                    )}
                    {formData.selectedCategories.length !== 3 && (
                        <p className="text-sm text-amber-600 text-center">
                            Please select exactly 3 categories
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

