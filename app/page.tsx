import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recycle, Users, Building2, ArrowRight, CheckCircle2, Leaf, AlertTriangle } from "lucide-react";
import Image from "next/image";
import landingPageImage from "@/assets/landingpageimage.png";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 md:py-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Text Content */}
                    <div className="space-y-8">
                        <Badge variant="outline" className="mb-4">
                            <Leaf className="h-3 w-3 mr-1" />
                            Sustainable E-Waste Management
                        </Badge>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                            Second<span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Spark</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground">
                            Connecting donors with registered NGOs to repurpose{" "}
                            <span className="text-foreground font-semibold">
                                discarded electrical or electronic equipment
                            </span>{" "}
                            that is no longer wanted or useful
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-start pt-8">
                            <Button asChild size="lg" className="text-lg px-12 py-7 h-auto rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all w-80">
                                <Link href="/dashboard">
                                    Start Your Green Impact
                                    <Leaf className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="text-lg px-12 py-7 h-auto rounded-full border-2 shadow-lg hover:shadow-xl transition-all w-80 bg-tertiary">
                                <Link href="/organisations">
                                    Browse Organisations
                                    <Building2 className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-xl h-[600px]">
                            <Image
                                src={landingPageImage}
                                alt="People sharing e-waste devices"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="container mx-auto px-4 py-16 bg-muted/30">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge variant="destructive" className="mb-4">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            The E-Waste Crisis
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Singapore's E-Waste Problem
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The numbers tell a story we can't ignore
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="border-2">
                            <CardHeader className="text-center pb-2">
                                <Badge variant="destructive" className="w-fit mx-auto mb-3">
                                    Annual Waste
                                </Badge>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-5xl md:text-6xl font-bold text-destructive mb-2">
                                    60,000+
                                </div>
                                <p className="text-lg font-semibold mb-1">tonnes of e-waste</p>
                                <p className="text-sm text-muted-foreground">
                                    generated annually in Singapore
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardHeader className="text-center pb-2">
                                <Badge variant="secondary" className="w-fit mx-auto mb-3">
                                    Recycling Rate
                                </Badge>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-5xl md:text-6xl font-bold text-muted-foreground mb-2">
                                    6%
                                </div>
                                <p className="text-lg font-semibold mb-1">only recycled</p>
                                <p className="text-sm text-muted-foreground">
                                    94% of e-waste is not recycled
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-primary">
                            <CardHeader className="text-center pb-2">
                                <Badge className="w-fit mx-auto mb-3">
                                    <Leaf className="h-3 w-3 mr-1" />
                                    Your Impact
                                </Badge>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                    58-80 kg
                                </div>
                                <p className="text-lg font-semibold mb-1">CO₂ equivalent saved</p>
                                <p className="text-sm text-muted-foreground">
                                    by refurbishing just one phone
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How It Works
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A simple platform connecting those who want to donate with organizations ready to collect
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <Card className="border-2 hover:border-primary transition-colors">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Recycle className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>List Your E-Waste</CardTitle>
                            <CardDescription>
                                Easily create listings for your unwanted electronic devices with photos and details
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 hover:border-primary transition-colors">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                                <Building2 className="h-6 w-6 text-accent-foreground" />
                            </div>
                            <CardTitle>Connect with NGOs</CardTitle>
                            <CardDescription>
                                We coordinate with NGOs to collect your e-waste and repair and repurpose it.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 hover:border-primary transition-colors">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                                <Leaf className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Devices Repurposed</CardTitle>
                            <CardDescription>
                                Electronics get a second life, reducing waste and helping communities
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-2">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl">Why Donate with SecondSpark?</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Environmentally Responsible</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Keep electronics out of landfills and reduce environmental impact
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Support Communities</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Help NGOs provide technology access to those in need
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Simple & Secure</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Easy listing process with verified organizations
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Donations at your doorstep</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Our volunteers will collect your e-waste at your chosen location.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <Card className="bg-primary/5 border-2 border-primary/20">
                    <CardContent className="text-center py-16 px-4">
                        <Leaf className="h-16 w-16 mx-auto mb-6 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Be Part of the Solution
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Every device you donate helps reduce waste, save CO₂, and support communities in need
                        </p>
                        <Button asChild size="lg" className="text-xl px-12 py-7 h-auto rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all w-96">
                            <Link href="/dashboard">
                                Start Your Green Impact
                                <Leaf className="ml-2 h-6 w-6" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
