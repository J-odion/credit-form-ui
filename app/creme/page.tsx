"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useFormSubmission } from "@/hooks/useFormSubmission"
import type { FormSubmissionData } from "@/lib/api"
import {
  Zap,
  Sun,
  Battery,
  Home,
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Lightbulb,
  Shield,
  Leaf,
  Play,
  Sparkles,
  Clock,
  Award,
  AlertCircle,
} from "lucide-react"
import { nigerianStates, systemCapacities, occupations, workplaceSectors, paymentPlans, salaryRanges } from "@/lib/data"

export default function Component() {
  const [currentStep, setCurrentStep] = useState(0) // Start at 0 for introduction
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    homeAddress: "",
    residenceState: "",
    systemCapacity: "",
    occupation: "",
    workplaceSector: "",
    otherSector: "",
    estimatedBudget: "",
    paymentPlan: "",
    salaryRange: "",
    placeOfEmployment: "",
    systemPrice: "",
    provider: "creme",
  })
  const [selectedSystem, setSelectedSystem] = useState<any>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const { toast } = useToast()

  // React Query mutation for form submission
  const formSubmission = useFormSubmission({
    onSuccess: (data) => {
      console.log("Form submitted successfully:", data)
      toast({
        title: "Success!",
        description: "Your interest form has been submitted successfully.",
      })
      setCurrentStep(5) // Move to completion step
      setSubmissionError(null)
    },
    onError: (error) => {
      console.error("Form submission failed:", error)
      const errorMessage = error.message || "Failed to submit form. Please try again."
      setSubmissionError(errorMessage)
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      })
    },
  })

  const totalSteps = 4 // Form steps (1-4)
  const progress = currentStep === 0 ? 0 : ((currentStep - 1) / (totalSteps - 1)) * 100

  useEffect(() => {
    if (formData.systemCapacity) {
      const system = systemCapacities.find((s) => s.value === formData.systemCapacity)
      setSelectedSystem(system)
      if (system) {
        setFormData((prev) => ({ ...prev, systemPrice: system.price }))
      }
    }
  }, [formData.systemCapacity])

  const handleStart = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(1)
      setIsAnimating(false)
    }, 300)
  }

  const handleNext = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
      setIsAnimating(false)
    }, 300)
  }

  const handlePrev = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1))
      setIsAnimating(false)
    }, 300)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear any previous submission errors when user starts typing
    if (submissionError) {
      setSubmissionError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionError(null)

    // Prepare form data for API
    const submissionData: FormSubmissionData = {
      email: formData.email.trim(),
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      homeAddress: formData.homeAddress.trim(),
      residenceState: formData.residenceState,
      systemCapacity: formData.systemCapacity,
      occupation: formData.occupation || undefined,
      workplaceSector: formData.workplaceSector || undefined,
      otherSector: formData.otherSector?.trim() || undefined,
      paymentPlan: formData.paymentPlan,
      salaryRange: formData.salaryRange?.trim() || undefined,
      placeOfEmployment: formData.placeOfEmployment?.trim() || undefined,
      systemPrice: formData.systemPrice,
      provider: "creme",
    }

    // Log the data being sent for debugging
    console.log("📤 Submitting form data:", submissionData)

    // Submit form using React Query mutation
    formSubmission.mutate(submissionData)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phoneNumber
      case 2:
        return formData.homeAddress && formData.residenceState
      case 3:
        return formData.systemCapacity && formData.paymentPlan
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3b211] via-[#f3b211] to-[#f3b211] relative">
      {/* Background Device Image */}
      <div className="fixed  ">
        <div className="relative  w-full h-full">
          <Image
            src="/hero-bg.png"
            alt="creme dbanj"
            width={600}
            height={800}
            className="w-full h-screen object-cover"
          />
        </div>
      </div>

      {/* Header - Only show during form steps */}
      {currentStep > 0 && currentStep < 5 && (
        <div className="bg-[#efe1c0] shadow-lg border-b top-0 z-50 relative">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Image
                src="/kairos-logo.png"
                alt="Kairos Hof Energy Ltd"
                width={300}
                height={119}
                className="h-12 w-auto"
              />
              <Image
                src="/creme-logo.png"
                alt="Kairos Hof Energy Ltd"
                width={200}
                height={119}
                className="h-8 w-auto"
              />
              <div className=" hidden md:flex items-center gap-4">
                <div className=" items-center gap-2 text-sm text-slate-600">
                  <span>
                    Step {currentStep} of {totalSteps}
                  </span>
                </div>
                <div className="w-32">
                  <Progress value={progress} className="h-2 bg-slate-200">
                    <div
                      className="h-full  bg-gradient-to-r from-[#221909] to-[#f59e0c] transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </Progress>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Introduction Step */}
          {currentStep === 0 && (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-8 max-w-4xl mx-auto">
                {/* Logo */}
                <div className="mb-8 w-1/2 mx-auto flex  gap-2 items-center align-middle justify-center">
                  <Image
                    src="/kairos-logo.png"
                    alt="Kairos Hof Energy Ltd"
                    width={400}
                    height={159}
                    className="h-auto w-24 md:h-20 md:w-auto mx-auto"
                  />
                  <Image
                    src="/creme-logo.png"
                    alt="Kairos Hof Energy Ltd"
                    width={200}
                    height={119}
                    className=" h-6 md:h-8 w-auto"
                  />
                </div>

                {/* Hero Content */}
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
                    Power Your Future with
                    <span className="text-white block">Clean Energy</span>
                  </h1>

                  <p className="text-sm md:text-2xl text-black max-w-3xl mx-auto leading-relaxed">
                    Join thousands of Nigerians who have made the switch to reliable, sustainable solar energy. Get a
                    personalized renewable energy solution tailored to your needs.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="p-2 grid md:grid-cols-3 gap-6 my-12">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#f3b211] to-[#f5b000] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-black mb-2">Quick & Easy</h3>
                      <p className="text-slate-600">Complete in just 5 minutes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-[#2b200c] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#2b200c] mb-2">Expert Consultation</h3>
                      <p className="text-slate-600">Free professional assessment</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#f3b211] to-[#f5b000] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#2b200c] mb-2">Trusted Brand</h3>
                      <p className="text-slate-600">Nigeria's leading solar provider</p>
                    </CardContent>
                  </Card>
                </div>

                {/* CTA Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-black">
                    <Sparkles className="h-5 w-5 text-[#f3b211]" />
                    <span>Get your personalized energy solution in 4 simple steps</span>
                    <Sparkles className="h-5 w-5 text-[#f3b211]" />
                  </div>

                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="bg-gradient-to-r from-[#2b200c] to-[#f3b211] hover:from-slate-900 hover:to-[#f3b211] text-white font-semibold md:px-12 py-4 md:text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <Play className="mr-3 h-6 w-6" />
                    Start Your Energy Journey
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="pt-8 border-t border-slate-200">
                  <p className="text-sm text-black mb-4">Trusted by over 10,000+ Nigerian homes and businesses</p>
                  <div className="flex justify-center items-center gap-2 md:gap-8 text-black">
                    <div className="flex items-center gap-1 md:gap-2">
                      <CheckCircle className="h-4 w-4 text-white" />
                      <span className="text-xs md:text-sm">No spam, ever</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Shield className="h-4 w-4 text-white" />
                      <span className="text-xs md:text-sm">Secure & private</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Clock className="h-4 w-4 text-white" />
                      <span className="text-xs md:text-sm">24/7 support</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4 ">
                  <h1 className=" text-xl mb:text-2xl font-bold text-black leading-tight">
                    Powered by :
                  </h1>
                  <div className="flex justify-center items-center gap-3 ">
                    <Image
                      src="creditcorp.png"
                      alt="Creditcorp"
                      width={120}
                      height={100}
                      className="h-10 md:h-15 w-auto mx-auto"
                    />
                    <Image
                      src="Fidelity_Bank_Plc_Main_Logo.svg"
                      alt="fidelitybank"
                      width={100}
                      height={59}
                      className="h-10 md:h-auto w-18 mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Steps */}
          {currentStep > 0 && currentStep < 5 && (
            <>
              {/* Step Indicator */}
              <div className="flex justify-center  mb-8">
                <div className="flex items-center space-x-2 md:space-x-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full text-xs flex items-center justify-center font-semibold transition-all duration-300 ${step <= currentStep
                            ? "bg-gradient-to-r from-[#2b200c] to-[#291e0c] text-white shadow-lg"
                            : "bg-slate-200 text-slate-500"
                          }`}
                      >
                        {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`w-6 md:w-16 h-1 mx-2 transition-all duration-300 ${step < currentStep ? "bg-gradient-to-r from-[#2b200c] to-[#291e0c]" : "bg-slate-200"
                            }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {submissionError && (
                <div className="mb-6 max-w-2xl mx-auto">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                      <p className="text-sm text-red-700 mt-1">{submissionError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Content */}
              <div
                className={`transition-all duration-300 ${isAnimating ? "opacity-0 transform translate-x-4" : "opacity-100 transform translate-x-0"}`}
              >
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-[#2b200c] to-slate-700 text-white">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <User className="h-6 w-6" />
                          Tell Us About Yourself
                        </CardTitle>
                        <CardDescription className="text-slate-200">
                          Let's start with your basic information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="space-y-6">
                          <div className="relative">
                            <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="fullName"
                              type="text"
                              placeholder="Enter your full name"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                              className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c] focus:ring-[#f59e0c] transition-all duration-300"
                            />
                          </div>

                          <div className="relative">
                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c] focus:ring-[#f59e0c] transition-all duration-300"
                            />
                          </div>

                          <div className="relative">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Phone Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="phoneNumber"
                              type="tel"
                              placeholder="+234 xxx xxx xxxx"
                              value={formData.phoneNumber}
                              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                              className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c] focus:ring-[#f59e0c] transition-all duration-300"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className=" hidden md:block space-y-6">
                      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-[#f59e0c] to-[#f59e0c] rounded-full flex items-center justify-center mx-auto">
                              <Lightbulb className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#2b200c]">Why Choose Solar?</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-400">
                                <Sun className="h-6 w-6 text-[#825b18] mx-auto mb-2" />
                                <p className="font-medium text-slate-700">Clean Energy</p>
                              </div>
                              <div className="text-center p-3 bg-yellow-100 rounded-lg border border-yellow-100">
                                <Calculator className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                                <p className="font-medium text-slate-700">Cost Savings</p>
                              </div>
                              <div className="text-center p-3 bg-yellow-100 rounded-lg border border-yellow-100">
                                <Shield className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                                <p className="font-medium text-slate-700">Reliable Power</p>
                              </div>
                              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-400">
                                <Leaf className="h-6 w-6 text-[#221a0b] mx-auto mb-2" />
                                <p className="font-medium text-slate-700">Eco-Friendly</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Step 2: Location Information */}
                {currentStep === 2 && (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-[#f59e0c] to-[#f59e0c] text-white">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <MapPin className="h-6 w-6" />
                          Your Location
                        </CardTitle>
                        <CardDescription className="text-yellow-100">
                          Help us understand your location for better service
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="space-y-6">
                          <div className="relative">
                            <Label htmlFor="residenceState" className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Residence State <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.residenceState}
                              onValueChange={(value) => handleInputChange("residenceState", value)}
                            >
                              <SelectTrigger className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c] focus:ring-[#f59e0c] transition-all duration-300">
                                <SelectValue placeholder="Select your state" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60">
                                {nigerianStates.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="relative">
                            <Label htmlFor="homeAddress" className="text-sm font-medium flex items-center gap-2">
                              <Home className="h-4 w-4" />
                              Home Address <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="homeAddress"
                              placeholder="Enter your complete home address"
                              value={formData.homeAddress}
                              onChange={(e) => handleInputChange("homeAddress", e.target.value)}
                              className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c] focus:ring-[#f59e0c] min-h-[120px] transition-all duration-300"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="hidden md:block space-y-6">
                      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4 text-center text-[#2b200c]">
                            Installation Process
                          </h3>
                          <div className="space-y-4">
                            {[
                              { step: 1, title: "Site Survey", desc: "Free assessment of your location" },
                              { step: 2, title: "Custom Design", desc: "Tailored system for your needs" },
                              { step: 3, title: "Professional Installation", desc: "Expert installation team" },
                              { step: 4, title: "System Activation", desc: "Testing and commissioning" },
                            ].map((item) => (
                              <div
                                key={item.step}
                                className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                <div className="w-8 h-8 bg-gradient-to-r from-[#f59e0c] to-[#f59e0c] rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white font-semibold text-sm">{item.step}</span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-[#2b200c]">{item.title}</h4>
                                  <p className="text-sm text-slate-600">{item.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Step 3: System Selection */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4 text-[#2b200c]">Choose Your Perfect System</h2>
                      <p className="text-slate-600">Select the system capacity that best fits your energy needs</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {systemCapacities.map((system) => {
                        const Icon = system.icon
                        const isSelected = formData.systemCapacity === system.value
                        return (
                          <Card
                            key={system.value}
                            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/95 backdrop-blur-sm ${isSelected
                                ? "ring-4 ring-[#2b200c] shadow-2xl bg-gradient-to-br from-yellow-50 to-slate-50"
                                : "hover:shadow-lg"
                              }`}
                            onClick={() => handleInputChange("systemCapacity", system.value)}
                          >
                            <CardHeader className="text-center">
                              <div
                                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${isSelected
                                    ? "bg-gradient-to-r from-[#2b200c] to-[#f59e0c]"
                                    : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                  }`}
                              >
                                <Icon className="h-8 w-8 text-white" />
                              </div>
                              <CardTitle className="text-lg text-[#2b200c]">{system.label}</CardTitle>
                              <CardDescription className="text-slate-600">{system.description}</CardDescription>
                              <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-800">
                                {system.price}
                              </Badge>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2 text-sm">
                                {system.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-[#f59e0c]" />
                                    <span className="text-slate-700">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {selectedSystem && (
                      <Card className="shadow-xl border-0 bg-gradient-to-r from-yellow-50 to-slate-50 bg-white/95 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-xl font-semibold mb-4 text-[#2b200c]">Payment Options</h3>
                              <div className="space-y-3">
                                {paymentPlans.map((plan) => (
                                  <div
                                    key={plan.value}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${formData.paymentPlan === plan.value
                                        ? "border-[#f59e0c] bg-yellow-50"
                                        : "border-slate-200 hover:border-slate-300 bg-white"
                                      }`}
                                    onClick={() => handleInputChange("paymentPlan", plan.value)}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-[#2b200c]">{plan.label}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-xl font-semibold mb-4 text-[#2b200c]">System Details</h3>
                              <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-3 mb-3">
                                  <selectedSystem.icon className="h-6 w-6 text-[#f59e0c]" />
                                  <span className="font-medium text-[#2b200c]">{selectedSystem.label}</span>
                                </div>
                                <p className="text-slate-600 mb-3">{selectedSystem.description}</p>
                                <div className="text-lg font-semibold text-[#f59e0c]">{selectedSystem.price}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Step 4: Professional Info & Review */}
                {currentStep === 4 && (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-slate-700 to-[#2b200c] text-white">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                          <Briefcase className="h-6 w-6" />
                          Professional Information
                        </CardTitle>
                        <CardDescription className="text-slate-200">
                          Optional information to better serve you
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="occupation" className="text-sm font-medium flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              Occupation
                            </Label>
                            <Select
                              value={formData.occupation}
                              onValueChange={(value) => handleInputChange("occupation", value)}
                            >
                              <SelectTrigger className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c]">
                                <SelectValue placeholder="Select occupation" />
                              </SelectTrigger>
                              <SelectContent>
                                {occupations.map((occupation) => (
                                  <SelectItem key={occupation} value={occupation}>
                                    {occupation}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="workplaceSector" className="text-sm font-medium">
                              Workplace Sector
                            </Label>
                            <Select
                              value={formData.workplaceSector}
                              onValueChange={(value) => handleInputChange("workplaceSector", value)}
                            >
                              <SelectTrigger className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c]">
                                <SelectValue placeholder="Select sector" />
                              </SelectTrigger>
                              <SelectContent>
                                {workplaceSectors.map((sector) => (
                                  <SelectItem key={sector} value={sector}>
                                    {sector}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {/* Conditional input field for "Other" option */}
                            {formData.workplaceSector === "Other - please specify" && (
                              <div className="mt-4">
                                <Label htmlFor="otherSector" className="text-sm font-medium">
                                  Please specify your workplace sector
                                </Label>
                                <Input
                                  id="otherSector"
                                  type="text"
                                  placeholder="Enter your specific workplace sector"
                                  value={formData.otherSector || ""}
                                  onChange={(e) => handleInputChange("otherSector", e.target.value)}
                                  className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c] transition-all duration-300"
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="placeOfEmployment" className="text-sm font-medium flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              Place of Work
                            </Label>
                            <Input
                              id="placeOfEmployment"
                              type="text"
                              placeholder="e.g., Company Name or Organization"
                              value={formData.placeOfEmployment}
                              onChange={(e) => handleInputChange("placeOfEmployment", e.target.value)}
                              className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c] transition-all duration-300"
                            />
                          </div>

                          <div>
                            <Label htmlFor="salaryRange" className="text-sm font-medium flex items-center gap-2">
                              <Calculator className="h-4 w-4" />
                              Salary Range
                            </Label>
                            <Select
                              value={formData.salaryRange}
                              onValueChange={(value) => handleInputChange("salaryRange", value)}
                            >
                              <SelectTrigger className="mt-2 border-2 border-slate-200 focus:border-[#f59e0c]">
                                <SelectValue placeholder="Select Salary Range" />
                              </SelectTrigger>
                              <SelectContent>
                                {salaryRanges.map((range) => (
                                  <SelectItem key={range.label} value={range.value}>
                                    {range.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>


                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-[#f59e0c] to-[#f59e0c] text-white">
                        <CardTitle>Review Your Information</CardTitle>
                        <CardDescription className="text-yellow-100">
                          Please review your details before submitting
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Name:</span>
                            <span className="font-medium text-[#2b200c]">{formData.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Email:</span>
                            <span className="font-medium text-[#2b200c]">{formData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Phone:</span>
                            <span className="font-medium text-[#2b200c]">{formData.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">State:</span>
                            <span className="font-medium text-[#2b200c]">{formData.homeAddress}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">State:</span>
                            <span className="font-medium text-[#2b200c]">{formData.residenceState}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">System:</span>
                            <span className="font-medium text-[#2b200c]">{selectedSystem?.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">System Price:</span>
                            <span className="font-medium text-[#2b200c]">{formData.systemPrice}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-600">Payment:</span>
                            <span className="font-medium text-[#2b200c]">{formData.paymentPlan}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Workplace:</span>
                            <span className="font-medium text-[#2b200c]">
                              {formData.workplaceSector === "Other - please specify"
                                ? formData.otherSector || "Other"
                                : formData.workplaceSector}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Place of Work:</span>
                            <span className="font-medium text-[#2b200c]">{formData.placeOfEmployment || "Not specified"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Salary Range:</span>
                            <span className="font-medium text-[#2b200c]">{formData.salaryRange || "Not specified"}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <Button
                            onClick={handleSubmit}
                            disabled={formSubmission.isPending}
                            className="w-full bg-gradient-to-r from-[#2b200c] to-[#f59e0c] hover:from-slate-900 hover:to-[#f59e0c] text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {formSubmission.isPending ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Interest Form
                                <CheckCircle className="ml-2 h-5 w-5" />
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#2b200c] to-[#f59e0c] hover:from-slate-900 hover:to-[#f59e0c]"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </>
          )}

          {/* Completion Step */}
          {currentStep === 5 && (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-8 max-w-2xl mx-auto">
                {/* Success Animation */}
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-[#f59e0c] to-[#f59e0c] rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <CheckCircle className="h-16 w-16 text-white animate-bounce" />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 bg-[#f59e0c] rounded-full mx-auto animate-ping opacity-20"></div>
                </div>

                {/* Success Message */}
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#2b200c]">Thank You!</h1>
                  <p className="text-xl text-[#f59e0c] font-semibold">
                    Your interest form has been successfully submitted
                  </p>
                  <p className="text-lg text-slate-600 max-w-xl mx-auto">
                    Our energy experts will review your requirements and contact you within 24 hours to discuss your
                    personalized solar solution.
                  </p>
                </div>

                {/* Next Steps */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-6 text-[#2b200c]">What happens next?</h3>
                    <div className="space-y-4">
                      {[
                        {
                          step: 1,
                          title: "Expert Review",
                          desc: "Our team reviews your requirements",
                          time: "Within 24 hours",
                        },
                        {
                          step: 2,
                          title: "Personal Consultation",
                          desc: "Schedule your free consultation call",
                          time: "1-2 days",
                        },
                        { step: 3, title: "Site Assessment", desc: "Free on-site energy audit", time: "3-5 days" },
                        { step: 4, title: "Custom Proposal", desc: "Receive your tailored solution", time: "5-7 days" },
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#f59e0c] to-[#f59e0c] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">{item.step}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-[#2b200c]">{item.title}</h4>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {item.time}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <div className="pt-8 border-t border-slate-200">
                  <p className="text-slate-600 mb-4">Have questions? Our team is here to help!</p>
                  <div className="flex justify-center items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#f59e0c]" />
                      <span>+234 8170001441</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#f59e0c]" />
                      <span>hello@kairoshofenergy.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Only show on intro and completion */}
      {(currentStep === 0 || currentStep === 5) && (
        <footer className="bg-[#f59e0c] text-white py-8 mt-12 relative z-10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-black">© 2025 Kairos Hof Energy Ltd. Powering Nigeria's sustainable future.</p>
          </div>
        </footer>
      )}
    </div>
  )
}