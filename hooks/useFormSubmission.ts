import { useMutation } from "@tanstack/react-query"
import { formApi, type FormSubmissionData, type ApiResponse } from "@/lib/api"

export interface UseFormSubmissionOptions {
  onSuccess?: (data: ApiResponse) => void
  onError?: (error: Error) => void
}

export const useFormSubmission = (options?: UseFormSubmissionOptions) => {
  return useMutation({
    mutationFn: async (formData: FormSubmissionData) => {
      console.log("🚀 Starting form submission...")
      const result = await formApi.submitForm(formData)
      console.log("✅ Form submission completed:", result)
      return result
    },
    onSuccess: (data) => {
      console.log("🎉 Form submitted successfully:", data)
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      console.error("💥 Form submission failed:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
      options?.onError?.(error)
    },
    retry: false, // Disable React Query retry since we handle it in the API layer
  })
}

// Optional: Hook for health check
export const useHealthCheck = () => {
  return useMutation({
    mutationFn: async () => {
      console.log("🏥 Running health check...")
      const result = await formApi.healthCheck()
      console.log("✅ Health check completed:", result)
      return result
    },
    onSuccess: (data) => {
      console.log("🎉 Health check successful:", data)
    },
    onError: (error: Error) => {
      console.error("💥 Health check failed:", error)
    },
  })
}
