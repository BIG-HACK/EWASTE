"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { setUserType } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function SelectType() {
    const [selectedType, setSelectedType] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    const handleSubmit = async () => {
        if (!selectedType) return;

        setIsLoading(true);
        try {
            await setUserType(selectedType);
            await user?.reload();
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Error setting user type:", error);
            alert("Failed to set user type. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader className="text-center space-y-2">
                <CardTitle className="text-4xl">Welcome! 👋</CardTitle>
                <CardDescription className="text-lg">
                    Let's get started by selecting your account type
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <RadioGroup
                    value={selectedType || ""}
                    onValueChange={(value) => setSelectedType(value as UserType)}
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Donor Card */}
                        <Label
                            htmlFor="donor"
                            className={`cursor-pointer`}
                        >
                            <Card
                                className={`relative transition-all duration-200 hover:shadow-lg ${selectedType === "donor"
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                                    : "hover:border-blue-300"
                                    }`}
                            >
                                <CardContent className="p-6">
                                    <RadioGroupItem
                                        value="donor"
                                        id="donor"
                                        className="absolute top-4 right-4"
                                    />
                                    <div className="text-4xl mb-4">🤝</div>
                                    <CardTitle className="text-2xl mb-2">
                                        Donor
                                    </CardTitle>
                                    <CardDescription>
                                        I want to donate e-waste items and contribute to a
                                        sustainable future
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Label>

                        {/* Organisation Card */}
                        <Label
                            htmlFor="organisation"
                            className={`cursor-pointer`}
                        >
                            <Card
                                className={`relative transition-all duration-200 hover:shadow-lg ${selectedType === "organisation"
                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg"
                                    : "hover:border-indigo-300"
                                    }`}
                            >
                                <CardContent className="p-6">
                                    <RadioGroupItem
                                        value="organisation"
                                        id="organisation"
                                        className="absolute top-4 right-4"
                                    />
                                    <div className="text-4xl mb-4">🏢</div>
                                    <CardTitle className="text-2xl mb-2">
                                        Organisation
                                    </CardTitle>
                                    <CardDescription>
                                        I represent an organization collecting and processing
                                        e-waste
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Label>
                    </div>
                </RadioGroup>

                <Button
                    onClick={handleSubmit}
                    disabled={!selectedType || isLoading}
                    className="w-full py-6 text-lg"
                    size="lg"
                >
                    {isLoading ? "Setting up your account..." : "Continue"}
                </Button>
            </CardContent>
        </Card>
    );
}

