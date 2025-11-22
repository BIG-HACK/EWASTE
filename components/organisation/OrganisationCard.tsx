import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Phone, Mail } from "lucide-react";

interface OrganisationCardProps {
    organisation: OrganisationProfile;
}

export function OrganisationCard({ organisation }: OrganisationCardProps) {
    // Ensure website URL has protocol
    const websiteUrl = organisation.website.startsWith('http://') || organisation.website.startsWith('https://')
        ? organisation.website
        : `https://${organisation.website}`;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Logo */}
            <div className="relative h-56 w-full bg-white border-b">
                <Image
                    src={organisation.logo}
                    alt={organisation.name}
                    fill
                    className="object-contain p-2"
                />
            </div>

            {/* Content */}
            <CardHeader>
                <CardTitle className="text-xl">{organisation.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {organisation.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{organisation.address}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <a
                        href={`mailto:${organisation.email}`}
                        className="hover:text-blue-600 hover:underline"
                    >
                        {organisation.email}
                    </a>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <a
                        href={`tel:${organisation.phone}`}
                        className="hover:text-blue-600 hover:underline"
                    >
                        {organisation.phone}
                    </a>
                </div>

                {/* Website */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4 flex-shrink-0" />
                    <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 hover:underline truncate"
                    >
                        {organisation.website}
                    </a>
                </div>

                {/* Needs */}
                {organisation.needs && organisation.needs.length > 0 && (
                    <div className="pt-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Looking for:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {organisation.needs.map((need, index) => (
                                <Badge key={index} variant="secondary">
                                    {need}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {organisation.tags && organisation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {organisation.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

