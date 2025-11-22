"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createListing } from "@/lib/actions/listing.actions";
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
import { Upload, X } from "lucide-react";

// Declare Cloudinary widget type
declare global {
    interface Window {
        cloudinary: any;
    }
}

export function CreateListingForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        address: "",
        photo: "",
        needsRepair: false,
        notes: "",
        tags: "",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            alert("You must be logged in to create a listing");
            return;
        }

        setIsLoading(true);
        try {
            const listingData: CreateListingParams = {
                clerkId: user.id,
                title: formData.title,
                description: formData.description,
                address: formData.address,
                photo: formData.photo,
                needsRepair: formData.needsRepair,
                notes: formData.notes || undefined,
                tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
            };

            const result = await createListing(listingData);
            console.log("Listing created successfully:", result);

            // Navigation will happen after this
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error("Error creating listing:", error);
            alert("Failed to create listing. Please try again.");
        } finally {
            // Always reset loading state
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

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-3xl">Create New Listing</CardTitle>
                <CardDescription>
                    Add your e-waste item details to create a listing
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g., Dell Monitor 24 inch"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe the item, its condition, and any relevant details..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Pickup Address *</Label>
                        <Input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="Enter your address for pickup"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <Label>Item Photo *</Label>
                        {!formData.photo ? (
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={openUploadWidget}
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Uploading..." : "Upload Image"}
                                </Button>
                                <p className="text-sm text-muted-foreground mt-2">
                                    JPG, PNG or WEBP (Max 5MB)
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={formData.photo}
                                    alt="Item preview"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={removeImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Needs Repair */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="needsRepair"
                            checked={formData.needsRepair}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, needsRepair: checked as boolean })
                            }
                        />
                        <Label
                            htmlFor="needsRepair"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            This item needs repair
                        </Label>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Any additional information..."
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Optional)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            type="text"
                            placeholder="e.g., monitor, electronics, working (comma-separated)"
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
                        disabled={isLoading || !formData.photo}
                        className="w-full"
                        size="lg"
                    >
                        {isLoading ? "Creating listing..." : "Create Listing"}
                    </Button>
                    {!formData.photo && (
                        <p className="text-sm text-red-500 text-center">
                            Please upload an image before submitting
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

