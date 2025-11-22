"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { updateListing } from "@/lib/actions/listing.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Upload, X, MapPin, Type, Tag, FileText, Wrench, Info, CheckCircle2 } from "lucide-react";

// Declare Cloudinary widget type
declare global {
    interface Window {
        cloudinary: any;
    }
}

interface EditListingFormProps {
    listing: Listing;
    onSuccess?: () => void;
}

export function EditListingForm({ listing, onSuccess }: EditListingFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: listing.title,
        description: listing.description,
        address: listing.address,
        photo: listing.photo,
        needsRepair: listing.needsRepair,
        resolved: listing.resolved,
        notes: listing.notes || "",
        tags: listing.tags?.join(", ") || "",
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
                folder: "ewaste-listings",
            },
            (error: any, result: any) => {
                if (error) {
                    console.error("Upload error:", error);
                    alert("Failed to upload image. Please try again.");
                    setIsUploading(false);
                    return;
                }

                if (result.event === "success") {
                    setFormData({
                        ...formData,
                        photo: result.info.secure_url,
                    });
                    setIsUploading(false);
                    widget.close();
                }
            }
        );

        widget.open();
    };

    const removeImage = () => {
        setFormData({
            ...formData,
            photo: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            alert("You must be logged in to update a listing");
            return;
        }

        setIsLoading(true);
        try {
            const listingData = {
                title: formData.title,
                description: formData.description,
                address: formData.address,
                photo: formData.photo,
                needsRepair: formData.needsRepair,
                resolved: formData.resolved,
                notes: formData.notes || undefined,
                tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
            };

            await updateListing(listing._id, listingData);
            router.refresh();
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Error updating listing:", error);
            alert("Failed to update listing. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto border-none shadow-2xl bg-white/90 backdrop-blur-xl">
            <CardHeader className="text-center pb-10 pt-12 border-b border-gray-100/50">
                <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 pb-2">
                    Edit Listing
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Update your e-waste item details
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Title */}
                        <div className="space-y-3 group">
                            <Label htmlFor="title" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Type className="w-4 h-4 text-emerald-500" />
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g., Dell Monitor 24 inch"
                                    value={formData.title}
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
                                Pickup Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                placeholder="Enter your address for pickup"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="h-14 pl-4 text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all rounded-xl group-hover:bg-white"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3 group">
                        <Label htmlFor="description" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-500" />
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe the item, its condition, and any relevant details..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            required
                            className="text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none rounded-xl group-hover:bg-white p-4"
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-emerald-500" />
                            Item Photo <span className="text-red-500">*</span>
                        </Label>
                        {!formData.photo ? (
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
                                        Click to upload image
                                    </p>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Supported formats: JPG, PNG, WEBP (Max 5MB)
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
                                <img
                                    src={formData.photo}
                                    alt="Item preview"
                                    className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="lg"
                                        className="rounded-full px-8 font-semibold shadow-lg hover:scale-105 transition-transform"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                    >
                                        <X className="h-5 w-5 mr-2" />
                                        Remove Image
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Checkboxes Grid */}
                    <div className="grid gap-8 md:grid-cols-2 items-stretch">
                        {/* Needs Repair Checkbox */}
                        <label
                            htmlFor="needsRepair"
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer block h-full ${formData.needsRepair
                                ? "bg-emerald-50 border-emerald-500 shadow-md"
                                : "bg-gray-100 border-transparent hover:border-gray-300 hover:bg-gray-200/50"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`mt-0.5 p-2.5 rounded-xl transition-colors shrink-0 ${formData.needsRepair ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-gray-500 shadow-sm'}`}>
                                    <Wrench className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-lg font-semibold transition-colors ${formData.needsRepair ? 'text-emerald-900' : 'text-gray-800'}`}>
                                            Needs Repair?
                                        </span>
                                        <Checkbox
                                            id="needsRepair"
                                            checked={formData.needsRepair}
                                            onCheckedChange={(checked) =>
                                                setFormData({ ...formData, needsRepair: checked as boolean })
                                            }
                                            className="h-6 w-6 border-2 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                        />
                                    </div>
                                    <p className={`text-sm leading-relaxed transition-colors ${formData.needsRepair ? 'text-emerald-700' : 'text-gray-500'}`}>
                                        Item is damaged or not functional
                                    </p>
                                </div>
                            </div>
                        </label>

                        {/* Resolved Checkbox */}
                        <label
                            htmlFor="resolved"
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer block h-full ${formData.resolved
                                ? "bg-blue-50 border-blue-500 shadow-md"
                                : "bg-gray-100 border-transparent hover:border-gray-300 hover:bg-gray-200/50"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`mt-0.5 p-2.5 rounded-xl transition-colors shrink-0 ${formData.resolved ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 shadow-sm'}`}>
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-lg font-semibold transition-colors ${formData.resolved ? 'text-blue-900' : 'text-gray-800'}`}>
                                            Mark as Resolved?
                                        </span>
                                        <Checkbox
                                            id="resolved"
                                            checked={formData.resolved}
                                            onCheckedChange={(checked) =>
                                                setFormData({ ...formData, resolved: checked as boolean })
                                            }
                                            className="h-6 w-6 border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                    </div>
                                    <p className={`text-sm leading-relaxed transition-colors ${formData.resolved ? 'text-blue-700' : 'text-gray-500'}`}>
                                        Item has been donated/disposed
                                    </p>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Tags & Notes */}
                    <div className="space-y-8">
                        <div className="space-y-3 group">
                            <Label htmlFor="tags" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-emerald-500" />
                                Tags <span className="text-muted-foreground font-normal text-sm">(Optional)</span>
                            </Label>
                            <Input
                                id="tags"
                                name="tags"
                                type="text"
                                placeholder="e.g., monitor, electronics, working"
                                value={formData.tags}
                                onChange={handleChange}
                                className="h-14 pl-4 text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all rounded-xl group-hover:bg-white"
                            />
                        </div>

                        <div className="space-y-3 group">
                            <Label htmlFor="notes" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <Info className="w-4 h-4 text-emerald-500" />
                                Additional Notes <span className="text-muted-foreground font-normal text-sm">(Optional)</span>
                            </Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Any additional information..."
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="text-base bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none rounded-xl group-hover:bg-white p-4"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-8 border-t border-gray-100">
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.photo}
                            className="flex-1 h-16 text-lg font-bold tracking-wide rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {isLoading ? "Updating..." : "Save Changes"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onSuccess ? onSuccess() : router.push("/dashboard")}
                            disabled={isLoading}
                            className="h-16 px-10 rounded-full text-lg font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Cancel
                        </Button>
                    </div>
                    {!formData.photo && (
                        <p className="text-sm text-red-500 text-center font-medium">
                            * Please upload an image to continue
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
