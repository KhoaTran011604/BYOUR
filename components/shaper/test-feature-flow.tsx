"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Send,
  Loader2,
  ClipboardList,
  MessageSquare,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Play,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type {
  ShaperTestingFeature,
  ShaperTestHistory,
  ShaperTestChecklist,
  ShaperTestResult,
  FeatureRollout,
} from "@/lib/types"
import { getDemoComponent } from "./demos"
import { GenericDemo } from "./demos/generic-demo"

interface TestFeatureFlowProps {
  userId: string
  feature: ShaperTestingFeature
  testHistory: ShaperTestHistory
  checklists: ShaperTestChecklist[]
  existingResults: ShaperTestResult[]
  rollout: FeatureRollout | null
}

type TestStep = "demo" | "checklist" | "feedback" | "complete"

interface TestResultState {
  [checklistId: string]: {
    passed: boolean | null
    notes: string
  }
}

interface FeedbackState {
  overall_rating: number
  usability_score: number
  performance_score: number
  design_score: number
  recommend_release: boolean | null
  pros: string
  cons: string
  suggestions: string
}

const initialFeedback: FeedbackState = {
  overall_rating: 0,
  usability_score: 0,
  performance_score: 0,
  design_score: 0,
  recommend_release: null,
  pros: "",
  cons: "",
  suggestions: "",
}

export function TestFeatureFlow({
  userId,
  feature,
  testHistory,
  checklists,
  existingResults,
  rollout,
}: TestFeatureFlowProps) {
  const [currentStep, setCurrentStep] = useState<TestStep>("demo")
  const [demoInteracted, setDemoInteracted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize test results from existing results
  const [testResults, setTestResults] = useState<TestResultState>(() => {
    const initial: TestResultState = {}
    checklists.forEach((c) => {
      const existing = existingResults.find((r) => r.checklist_id === c.id)
      initial[c.id] = {
        passed: existing?.passed ?? null,
        notes: existing?.notes || "",
      }
    })
    return initial
  })

  const [feedback, setFeedback] = useState<FeedbackState>(initialFeedback)
  const [activeChecklistIndex, setActiveChecklistIndex] = useState(0)

  // Calculate progress
  const completedTests = Object.values(testResults).filter((r) => r.passed !== null).length
  const totalTests = checklists.length
  const progress = totalTests > 0 ? (completedTests / totalTests) * 100 : 0
  const passedTests = Object.values(testResults).filter((r) => r.passed === true).length
  const criticalTests = checklists.filter((c) => c.is_critical)
  const criticalPassed = criticalTests.filter((c) => testResults[c.id]?.passed === true).length
  const allCriticalPassed = criticalPassed === criticalTests.length

  const canProceedToFeedback = completedTests === totalTests

  const handleTestResult = async (checklistId: string, passed: boolean) => {
    setTestResults((prev) => ({
      ...prev,
      [checklistId]: { ...prev[checklistId], passed },
    }))

    // Save to database
    const supabase = createClient()
    await supabase.from("shaper_test_results").upsert(
      {
        test_history_id: testHistory.id,
        checklist_id: checklistId,
        user_id: userId,
        passed,
        notes: testResults[checklistId]?.notes || null,
      },
      { onConflict: "test_history_id,checklist_id" }
    )
  }

  const handleNotesChange = (checklistId: string, notes: string) => {
    setTestResults((prev) => ({
      ...prev,
      [checklistId]: { ...prev[checklistId], notes },
    }))
  }

  const saveNotes = async (checklistId: string) => {
    if (testResults[checklistId]?.passed === null) return

    const supabase = createClient()
    await supabase
      .from("shaper_test_results")
      .update({ notes: testResults[checklistId].notes })
      .eq("test_history_id", testHistory.id)
      .eq("checklist_id", checklistId)
  }

  const handleSubmitFeedback = async () => {
    if (feedback.overall_rating === 0 || feedback.recommend_release === null) {
      setError("Please provide overall rating and recommendation")
      return
    }

    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    // Save feedback
    const { error: feedbackError } = await supabase.from("shaper_feature_feedback").upsert(
      {
        test_history_id: testHistory.id,
        feature_id: feature.id,
        user_id: userId,
        overall_rating: feedback.overall_rating,
        usability_score: feedback.usability_score,
        performance_score: feedback.performance_score,
        design_score: feedback.design_score,
        recommend_release: feedback.recommend_release,
        pros: feedback.pros || null,
        cons: feedback.cons || null,
        suggestions: feedback.suggestions || null,
      },
      { onConflict: "test_history_id,feature_id" }
    )

    if (feedbackError) {
      setError(feedbackError.message)
      setIsSubmitting(false)
      return
    }

    // Complete the test
    const { error: completeError } = await supabase.rpc("complete_feature_test", {
      p_test_history_id: testHistory.id,
      p_feature_id: feature.id,
      p_passed_count: passedTests,
      p_total_count: totalTests,
      p_recommend_release: feedback.recommend_release,
    })

    if (completeError) {
      setError(completeError.message)
      setIsSubmitting(false)
      return
    }

    setCurrentStep("complete")
    setIsSubmitting(false)
  }

  const renderStarRating = (
    value: number,
    onChange: (val: number) => void,
    label: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )

  const activeChecklist = checklists[activeChecklistIndex]
  console.log("🚀 ~ TestFeatureFlow ~ feature:", feature)

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/shaper/testing">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Testing Zone
            </Link>
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{feature.name}</h1>
              <p className="text-muted-foreground text-sm">{feature.version}</p>
            </div>
            <Badge
              variant={currentStep === "complete" ? "default" : "secondary"}
              className={currentStep === "complete" ? "bg-green-500" : ""}
            >
              {currentStep === "checklist" && "Testing"}
              {currentStep === "feedback" && "Feedback"}
              {currentStep === "complete" && "Completed"}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Test Progress: {completedTests}/{totalTests}
              </span>
              <span className="text-sm text-muted-foreground">
                {passedTests} passed, {completedTests - passedTests} failed
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            {!allCriticalPassed && completedTests === totalTests && (
              <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Some critical tests failed. Consider retesting.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <Tabs value={currentStep} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demo" onClick={() => setCurrentStep("demo")}>
              <Play className="mr-2 h-4 w-4" />
              Demo
            </TabsTrigger>
            <TabsTrigger value="checklist" onClick={() => setCurrentStep("checklist")}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Checklist
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              disabled={!canProceedToFeedback}
              onClick={() => canProceedToFeedback && setCurrentStep("feedback")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="complete" disabled={currentStep !== "complete"}>
              <Flag className="mr-2 h-4 w-4" />
              Complete
            </TabsTrigger>
          </TabsList>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trải nghiệm tính năng</CardTitle>
                <CardDescription>
                  Hãy dùng thử tính năng bên dưới trước khi chuyển sang đánh giá checklist
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const DemoComponent = getDemoComponent(feature.demo_component)
                  if (DemoComponent) {
                    return (
                      <DemoComponent
                        featureId={feature.id}
                        userId={userId}
                        onInteraction={() => setDemoInteracted(true)}
                      />
                    )
                  }
                  return (
                    <GenericDemo
                      featureId={feature.id}
                      userId={userId}
                      testUrl={feature.test_url}
                      instructions={feature.demo_instructions}
                      onInteraction={() => setDemoInteracted(true)}
                    />
                  )
                })()}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep("checklist")}>
                Tiếp tục đến Checklist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Checklist Navigation */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Test Cases</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      {checklists.map((c, index) => {
                        const result = testResults[c.id]
                        return (
                          <button
                            key={c.id}
                            onClick={() => setActiveChecklistIndex(index)}
                            className={`w-full text-left p-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                              activeChecklistIndex === index
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-muted"
                            }`}
                          >
                            {result?.passed === true && (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            )}
                            {result?.passed === false && (
                              <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            )}
                            {result?.passed === null && (
                              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground shrink-0" />
                            )}
                            <span className="truncate flex-1">
                              {index + 1}. {c.title}
                            </span>
                            {c.is_critical && (
                              <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Checklist Detail */}
              <div className="md:col-span-3">
                {activeChecklist && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {activeChecklist.title}
                            {activeChecklist.is_critical && (
                              <Badge variant="destructive" className="text-xs">
                                Critical
                              </Badge>
                            )}
                          </CardTitle>
                          {activeChecklist.description && (
                            <CardDescription className="mt-1">
                              {activeChecklist.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Test Steps */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Test Steps</Label>
                        <ol className="space-y-2">
                          {activeChecklist.test_steps.map((step, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Expected Result */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Expected Result</Label>
                        <div className="rounded-md bg-green-50 dark:bg-green-950/20 p-3 text-sm text-green-700 dark:text-green-400">
                          {activeChecklist.expected_result}
                        </div>
                      </div>

                      {/* Pass/Fail Buttons */}
                      <div className="flex gap-4">
                        <Button
                          size="lg"
                          variant={testResults[activeChecklist.id]?.passed === true ? "default" : "outline"}
                          className={`flex-1 ${
                            testResults[activeChecklist.id]?.passed === true
                              ? "bg-green-500 hover:bg-green-600"
                              : "border-green-500 text-green-600 hover:bg-green-50"
                          }`}
                          onClick={() => handleTestResult(activeChecklist.id, true)}
                        >
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Pass
                        </Button>
                        <Button
                          size="lg"
                          variant={testResults[activeChecklist.id]?.passed === false ? "default" : "outline"}
                          className={`flex-1 ${
                            testResults[activeChecklist.id]?.passed === false
                              ? "bg-red-500 hover:bg-red-600"
                              : "border-red-500 text-red-600 hover:bg-red-50"
                          }`}
                          onClick={() => handleTestResult(activeChecklist.id, false)}
                        >
                          <XCircle className="mr-2 h-5 w-5" />
                          Fail
                        </Button>
                      </div>

                      {/* Notes */}
                      <div>
                        <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                          Notes (optional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Add any notes about the test result..."
                          value={testResults[activeChecklist.id]?.notes || ""}
                          onChange={(e) => handleNotesChange(activeChecklist.id, e.target.value)}
                          onBlur={() => saveNotes(activeChecklist.id)}
                          rows={3}
                        />
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setActiveChecklistIndex(Math.max(0, activeChecklistIndex - 1))}
                          disabled={activeChecklistIndex === 0}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                        {activeChecklistIndex === checklists.length - 1 ? (
                          <Button
                            onClick={() => setCurrentStep("feedback")}
                            disabled={!canProceedToFeedback}
                          >
                            Continue to Feedback
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              setActiveChecklistIndex(
                                Math.min(checklists.length - 1, activeChecklistIndex + 1)
                              )
                            }
                          >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Feedback</CardTitle>
                <CardDescription>
                  Share your detailed feedback about this feature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Test Summary */}
                <div className="rounded-md bg-muted p-4">
                  <h4 className="font-medium mb-2">Test Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-500">{passedTests}</div>
                      <div className="text-xs text-muted-foreground">Passed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">
                        {completedTests - passedTests}
                      </div>
                      <div className="text-xs text-muted-foreground">Failed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round((passedTests / totalTests) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>

                {/* Ratings */}
                <div className="grid gap-6 md:grid-cols-2">
                  {renderStarRating(
                    feedback.overall_rating,
                    (val) => setFeedback({ ...feedback, overall_rating: val }),
                    "Overall Rating *"
                  )}
                  {renderStarRating(
                    feedback.usability_score,
                    (val) => setFeedback({ ...feedback, usability_score: val }),
                    "Usability"
                  )}
                  {renderStarRating(
                    feedback.performance_score,
                    (val) => setFeedback({ ...feedback, performance_score: val }),
                    "Performance"
                  )}
                  {renderStarRating(
                    feedback.design_score,
                    (val) => setFeedback({ ...feedback, design_score: val }),
                    "Design"
                  )}
                </div>

                {/* Recommend Release */}
                <div className="space-y-2">
                  <Label>Do you recommend releasing this feature? *</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      size="lg"
                      variant={feedback.recommend_release === true ? "default" : "outline"}
                      className={`flex-1 ${
                        feedback.recommend_release === true
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }`}
                      onClick={() => setFeedback({ ...feedback, recommend_release: true })}
                    >
                      <ThumbsUp className="mr-2 h-5 w-5" />
                      Yes, recommend
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant={feedback.recommend_release === false ? "default" : "outline"}
                      className={`flex-1 ${
                        feedback.recommend_release === false
                          ? "bg-red-500 hover:bg-red-600"
                          : ""
                      }`}
                      onClick={() => setFeedback({ ...feedback, recommend_release: false })}
                    >
                      <ThumbsDown className="mr-2 h-5 w-5" />
                      Not yet
                    </Button>
                  </div>
                </div>

                {/* Text Feedback */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pros">What did you like? (Pros)</Label>
                    <Textarea
                      id="pros"
                      placeholder="Describe what works well..."
                      value={feedback.pros}
                      onChange={(e) => setFeedback({ ...feedback, pros: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cons">What needs improvement? (Cons)</Label>
                    <Textarea
                      id="cons"
                      placeholder="Describe issues or areas for improvement..."
                      value={feedback.cons}
                      onChange={(e) => setFeedback({ ...feedback, cons: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="suggestions">Suggestions</Label>
                    <Textarea
                      id="suggestions"
                      placeholder="Any suggestions for the feature..."
                      value={feedback.suggestions}
                      onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setCurrentStep("checklist")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Checklist
                  </Button>
                  <Button onClick={handleSubmitFeedback} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit & Complete Test"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complete Tab */}
          <TabsContent value="complete">
            <Card className="text-center">
              <CardContent className="pt-12 pb-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Test Completed!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for testing {feature.name}. Your feedback has been submitted.
                </p>

                {rollout && (
                  <div className="mb-6 p-4 rounded-lg bg-muted max-w-md mx-auto">
                    <h4 className="font-medium mb-2">Feature Rollout Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tests completed:</span>
                        <span className="font-medium">
                          {rollout.current_tests_count + 1}/{rollout.min_tests_required}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Success rate:</span>
                        <span className="font-medium">
                          {Math.round(
                            ((rollout.current_success_count + (feedback.recommend_release ? 1 : 0)) /
                              (rollout.current_tests_count + 1)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          ((rollout.current_tests_count + 1) / rollout.min_tests_required) * 100
                        }
                        className="h-2 mt-2"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/shaper/testing">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Testing Zone
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/shaper">Go to Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
