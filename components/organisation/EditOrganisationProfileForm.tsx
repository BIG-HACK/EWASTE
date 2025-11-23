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
import { Upload, X, Building2, Mail, Phone, MapPin, Globe, FileText, Target, Tag } from "lucide-react";

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
        <Card className="w-full max-w-3xl mx-auto border-none shadow-2xl bg-white/90 backdrop-blur-xl">
            <CardHeader className="text-center pb-10 pt-12 border-b border-gray-100/50">
                <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 pb-2">
                    Edit Organisation Profile
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Update your organisation's information and preferences
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Logo Upload */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-emerald-500" />
                            Organisation Logo <span className="text-red-500">*</span>
                        </Label>
                        {!formData.logo ? (
                            <div
                                onClick={openUploadWidget}
                                className="group cursor-pointer relative overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-12 bg-gray-50/30 hover:bg-emerald-50/30 hover:border-emerald-400 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
                                <div className="h-20 w-20 rounded-full bg-white shadow-lg shadow-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <Upload className="h-10 w-10 text-emerald-500" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">
                                        Click to upload logo
                                    </p>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Supported formats: JPG, PNG, WEBP (Max 5MB)
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
                                <div className="w-full h-64 bg-gray-50 flex items-center justify-center p-8">
                                    <img
                                        src={formData.logo}
                                        alt="Logo preview"
                                        className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="lg"
                                        className="rounded-full px-8 font-semibold shadow-lg hover:scale-105 transition-transform"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveLogo();
                                        }}
                                    >
                                        <X className="h-5 w-5 mr-2" />
                                        Remove Logo
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Name */}
                        <div className="space-y-3 group">
                            <Label htmlFor="name" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-emerald-500" />
                                Organisation Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="e.g., Green Recycling Foundation"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="h-14 pl-4 text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all rounded-xl group-hover:bg-white"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-3 group">
                            <Label htmlFor="email" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-emerald-500" />
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="contact@organisation.org"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="h-14 pl-4 text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all rounded-xl group-hover:bg-white"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-3 group">
                            <Label htmlFor="phone" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-emerald-500" />
                                Phone Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="h-14 pl-4 text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all rounded-xl group-hover:bg-white"
                            />
                        </div>

                        {/* Website */}
                        <div className="space-y-3 group">
                            <Label htmlFor="website" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-emerald-500" />
                                Website <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="website"
                                name="website"
                                type="url"
                                placeholder="https://www.yourorganisation.org"
                                value={formData.website}
                                onChange={handleChange}
                                required
                                className="h-14 pl-4 text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all rounded-xl group-hover:bg-white"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-3 group">
                        <Label htmlFor="address" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="123 Green Street, City, State"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="h-14 pl-4 text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all rounded-xl group-hover:bg-white"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-3 group">
                        <Label htmlFor="description" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-500" />
                            About Your Organisation <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your organisation's mission, activities, and impact..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            required
                            className="text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none rounded-xl group-hover:bg-white p-4"
                        />
                    </div>

                    {/* Needs & Tags Grid */}
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-3 group">
                            <Label htmlFor="needs" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" />
                                What E-Waste Do You Need?
                            </Label>
                            <Input
                                id="needs"
                                name="needs"
                                type="text"
                                placeholder="e.g., laptops, monitors, phones"
                                value={formData.needs}
                                onChange={handleChange}
                                className="h-14 pl-4 text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all rounded-xl group-hover:bg-white"
                            />
                            <p className="text-sm text-gray-500 pl-1">Separate items with commas</p>
                        </div>

                        <div className="space-y-3 group">
                            <Label htmlFor="tags" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-emerald-500" />
                                Tags
                            </Label>
                            <Input
                                id="tags"
                                name="tags"
                                type="text"
                                placeholder="e.g., recycling, charity, education"
                                value={formData.tags}
                                onChange={handleChange}
                                className="h-14 pl-4 text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all rounded-xl group-hover:bg-white"
                            />
                            <p className="text-sm text-gray-500 pl-1">Separate tags with commas</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-8 border-t border-gray-100">
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.logo}
                            className="flex-1 h-16 text-lg font-bold tracking-wide rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {isLoading ? "Updating Profile..." : "Update Profile"}
                        </Button>
                    </div>
                    {!formData.logo && (
                        <p className="text-sm text-red-500 text-center font-medium">
                            * Please upload a logo to continue
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
