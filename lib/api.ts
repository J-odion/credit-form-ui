import axios from "axios"

// === CONFIG ===
const BASE_URL = "https://stroom-interest-form.onrender.com"

// === AXIOS CLIENT ===
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// === INTERCEPTORS ===
apiClient.interceptors.request.use(
  (config) => {
    console.log(`➡️ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (res) => {
    console.log(`✅ ${res.status} from ${res.config.url}`)
    return res
  },
  async (error) => {
    const { config, response, code, message } = error

    const isNetworkError = code === "ERR_NETWORK" || message === "Network Error"
    const isTimeout = code === "ECONNABORTED"

    if (isNetworkError && config?.baseURL !== BASE_URL) {
      try {
        return await axios({ ...config, baseURL: BASE_URL })
      } catch {
        throw new Error("Connection error. Please try again.")
      }
    }

    if (isTimeout) throw new Error("Request timed out.")
    if (!response) throw new Error("No response from server.")
    if (response.status >= 500) throw new Error("Server error. Try again later.")
    if (response.status === 404) throw new Error("API not found.")
    if (response.status === 429) throw new Error("Too many requests.")
    if (response.status === 400) {
      const errorMessages = Array.isArray(response.data?.errors)
        ? response.data.errors.map((e: any) => e.message || e).join(", ")
        : response.data?.message
      throw new Error(`Bad Request: ${errorMessages || "Invalid input."}`)
    }

    throw new Error(response.data?.message || message || "Unexpected error.")
  }
)

// === TYPES ===
export interface FormSubmissionData {
  email: string
  fullName: string
  phoneNumber: string
  homeAddress: string
  residenceState: string
  systemCapacity: string
  systemPrice: string
  occupation?: string
  workplaceSector?: string
  otherSector?: string
  estimatedBudget?: string
  salaryRange?: string
  placeOfEmployment?: string
  paymentPlan: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

// === FORM API ===
export const formApi = {
  submitForm: async (
    formData: FormSubmissionData,
    retry = 0
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post("/api/forms", formData)
      return response.data
    } catch (error: any) {
      if (
        retry < 2 &&
        ["Network Error", "timeout", "unavailable"].some((msg) =>
          error.message.includes(msg)
        )
      ) {
        await new Promise((res) => setTimeout(res, (retry + 1) * 2000))
        return formApi.submitForm(formData, retry + 1)
      }
      throw error
    }
  },
}
