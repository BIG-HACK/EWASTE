"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { updateOrganisationProfile } from "@/lib/actions/organisationprofile.actions";
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

interface EditOrganisationProfileFormProps {
    profile: OrganisationProfile;
}

export function EditOrganisationProfileForm({ profile }: EditOrganisationProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: profile.name,
        address: profile.address,
        phone: profile.phone,
        email: profile.email,
        website: profile.website,
        logo: profile.logo,
        description: profile.description,
        needs: profile.needs?.join(", ") || "",
        tags: profile.tags?.join(", ") || "",
    });
    const router = useRouter();
    const { user } = useUser();

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

        window.cloudinary.openUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset,
                sources: ["local", "camera"],
                multiple: false,
                maxFileSize: 5000000, // 5MB
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                folder: "organisation-logos",
            },
            (error: any, result: any) => {
                setIsUploading(false);

                if (!error && result && result.event === "success") {
                    setFormData({
                        ...formData,
                        logo: result.info.secure_url,
                    });
                } else if (error) {
                    console.error("Upload error:", error);
                    alert("Failed to upload logo. Please try again.");
                }
            }
        );
    };

    const handleRemoveLogo = () => {
        setFormData({
            ...formData,
            logo: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            alert("You must be logged in to update your profile");
            return;
        }

        setIsLoading(true);
        try {
            const profileData = {
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                website: formData.website,
                logo: formData.logo,
                description: formData.description,
                needs: formData.needs ? formData.needs.split(",").map(item => item.trim()).filter(Boolean) : undefined,
                tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
            };

            await updateOrganisationProfile(user.id, profileData);
            router.refresh();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Edit Organisation Profile</CardTitle>
                <CardDescription>
                    Update your organisation information
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
                            type="url"
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
                                    onClick={openUploadWidget}
                                    disabled={isUploading}
                                    variant="outline"
                                >
                                    {isUploading ? "Uploading..." : "Upload Logo"}
                                </Button>
                                <p className="text-sm text-gray-500 mt-2">
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
                                    onClick={handleRemoveLogo}
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">About Your Organisation *</Label>
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

                    {/* Needs */}
                    <div className="space-y-2">
                        <Label htmlFor="needs">What E-Waste Do You Need? (Optional)</Label>
                        <Input
                            id="needs"
                            name="needs"
                            type="text"
                            placeholder="e.g., laptops, monitors, phones (comma-separated)"
                            value={formData.needs}
                            onChange={handleChange}
                        />
                        <p className="text-sm text-gray-500">
                            Separate items with commas
                        </p>
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
                        <p className="text-sm text-gray-500">
                            Separate tags with commas
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.logo}
                            className="flex-1"
                            size="lg"
                        >
                            {isLoading ? "Updating profile..." : "Update Profile"}
                        </Button>
                    </div>
                    {!formData.logo && (
                        <p className="text-sm text-red-500 text-center">
                            * Please upload a logo to continue
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

