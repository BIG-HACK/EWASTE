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
import { Upload, X } from "lucide-react";

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

        window.cloudinary.openUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset,
                sources: ["local", "camera"],
                multiple: false,
                maxFileSize: 5000000, // 5MB
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                folder: "ewaste-listings",
            },
            (error: any, result: any) => {
                setIsUploading(false);

                if (!error && result && result.event === "success") {
                    setFormData({
                        ...formData,
                        photo: result.info.secure_url,
                    });
                } else if (error) {
                    console.error("Upload error:", error);
                    alert("Failed to upload image. Please try again.");
                }
            }
        );
    };

    const handleRemoveImage = () => {
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
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit Listing</CardTitle>
                <CardDescription>
                    Update your e-waste listing information
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
                            placeholder="e.g., Old Laptop"
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
                            placeholder="Describe the item, its condition, specifications, etc."
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
                            placeholder="e.g., 123 Main St, City, State"
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
                                    onClick={openUploadWidget}
                                    disabled={isUploading}
                                    variant="outline"
                                >
                                    {isUploading ? "Uploading..." : "Upload Image"}
                                </Button>
                                <p className="text-sm text-gray-500 mt-2">
                                    JPG, PNG or WEBP (Max 5MB)
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={formData.photo}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <Button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
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
                                setFormData({
                                    ...formData,
                                    needsRepair: checked as boolean,
                                })
                            }
                        />
                        <Label
                            htmlFor="needsRepair"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Item needs repair
                        </Label>
                    </div>

                    {/* Resolved */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="resolved"
                            checked={formData.resolved}
                            onCheckedChange={(checked) =>
                                setFormData({
                                    ...formData,
                                    resolved: checked as boolean,
                                })
                            }
                        />
                        <Label
                            htmlFor="resolved"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Mark as resolved
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
                            placeholder="e.g., laptop, electronics, working"
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
                            disabled={isLoading || !formData.photo}
                            className="flex-1"
                            size="lg"
                        >
                            {isLoading ? "Updating listing..." : "Update Listing"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onSuccess ? onSuccess() : router.push("/dashboard")}
                            disabled={isLoading}
                            size="lg"
                        >
                            Cancel
                        </Button>
                    </div>
                    {!formData.photo && (
                        <p className="text-sm text-red-500 text-center">
                            * Please upload an image to continue
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

