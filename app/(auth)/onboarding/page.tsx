"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { setUserType } from "@/lib/actions/user.actions";

export default function OnboardingPage() {
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
            router.push("/"); // Redirect to home after completion
            router.refresh();
        } catch (error) {
            console.error("Error setting user type:", error);
            alert("Failed to set user type. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Welcome! 👋
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Let's get started by selecting your account type
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Donor Card */}
                    <button
                        onClick={() => setSelectedType("donor")}
                        className={`relative p-8 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${selectedType === "donor"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                            }`}
                    >
                        {selectedType === "donor" && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        )}
                        <div className="text-4xl mb-4">🤝</div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Donor
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            I want to donate e-waste items and contribute to a sustainable future
                        </p>
                    </button>

                    {/* Organisation Card */}
                    <button
                        onClick={() => setSelectedType("organisation")}
                        className={`relative p-8 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${selectedType === "organisation"
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg scale-105"
                            : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                            }`}
                    >
                        {selectedType === "organisation" && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        )}
                        <div className="text-4xl mb-4">🏢</div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Organisation
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            I represent an organization collecting and processing e-waste
                        </p>
                    </button>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!selectedType || isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${selectedType && !isLoading
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isLoading ? "Setting up your account..." : "Continue"}
                </button>
            </div>
        </div>
    );
}

