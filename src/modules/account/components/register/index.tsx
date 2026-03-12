"use client"

import { useRef, useState } from "react"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type FormData = {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
  store_name: string
  address_1: string
  city: string
  state: string
  postal_code: string
  phone: string
  store_type: string
  permit_number: string
  permit_expiry: string
}

const INITIAL_FORM: FormData = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  store_name: "",
  address_1: "",
  city: "",
  state: "",
  postal_code: "",
  phone: "",
  store_type: "",
  permit_number: "",
  permit_expiry: "",
}

const STORE_TYPES = [
  { value: "", label: "Select store type" },
  { value: "smoke_shop", label: "Smoke Shop" },
  { value: "vape_shop", label: "Vape Shop" },
  { value: "convenience", label: "Convenience Store" },
  { value: "other", label: "Other" },
]

const INPUT_CLASS =
  "pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none rounded-xl border border-terminal-border bg-terminal-black focus:ring-2 focus:ring-sky-400/50 focus:outline-none focus:border-transparent transition-all placeholder:text-terminal-dim text-terminal-white font-medium"

const BroncoRegisterPage = ({ countryCode }: { countryCode: string }) => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [permitFile, setPermitFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password || !form.confirm_password) {
      setError("All fields are required.")
      return false
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return false
    }
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!form.store_name || !form.address_1 || !form.city || !form.state || !form.postal_code || !form.phone || !form.store_type) {
      setError("All fields are required.")
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!form.permit_number || !form.permit_expiry) {
      setError("Permit number and expiry date are required.")
      return false
    }
    if (!permitFile) {
      setError("Please upload your reseller permit document.")
      return false
    }
    return true
  }

  const nextStep = () => {
    setError(null)
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep((s) => s + 1)
  }

  const prevStep = () => {
    setError(null)
    setStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    setError(null)
    if (!validateStep3()) return

    setSubmitting(true)
    try {
      // 1. Upload permit file
      const uploadBody = new globalThis.FormData()
      uploadBody.set("file", permitFile!)
      const uploadRes = await fetch("/api/upload-permit", {
        method: "POST",
        body: uploadBody,
      })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok || !uploadData.url) {
        setError(uploadData.error || "Permit upload failed. Please try again.")
        return
      }

      // 2. Register customer with permit file URL
      const fd = new globalThis.FormData()
      fd.set("first_name", form.first_name)
      fd.set("last_name", form.last_name)
      fd.set("email", form.email)
      fd.set("password", form.password)
      fd.set("phone", form.phone)
      fd.set("company_name", form.store_name)
      fd.set("address_1", form.address_1)
      fd.set("city", form.city)
      fd.set("state", form.state)
      fd.set("postal_code", form.postal_code)
      fd.set("store_type", form.store_type)
      fd.set("permit_number", form.permit_number)
      fd.set("permit_expiry", form.permit_expiry)
      fd.set("permit_file_url", uploadData.url)
      fd.set("country_code", countryCode)

      const result = await signup(null, fd)
      if (result && typeof result === "string") {
        setError(result)
      } else {
        setSubmitted(true)
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success State ──
  if (submitted) {
    return (
      <div className="w-full flex flex-col items-center text-center" data-testid="register-success">
        <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-bold uppercase mb-4 tracking-wide text-terminal-white">
          Application Submitted!
        </h1>
        <p className="text-base font-body text-terminal-dim max-w-md leading-relaxed">
          Your application is under review. Bronco Distribution reviews wholesale
          applications within 1–2 business days. Pricing and ordering will remain
          unavailable until your account is approved.
        </p>
        <LocalizedClientLink
          href="/account/login"
          className="mt-8 inline-block text-sm font-bold text-businessx-orange hover:text-businessx-yellow underline transition-colors"
        >
          Back to Sign In
        </LocalizedClientLink>
      </div>
    )
  }

  // ── Step indicators ──
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
              s === step
                ? "bg-businessx-orange text-black"
                : s < step
                ? "bg-green-600 text-white"
                : "bg-terminal-border text-terminal-dim"
            }`}
          >
            {s < step ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              s
            )}
          </div>
          {s < 3 && (
            <div
              className={`w-8 h-px ${
                s < step ? "bg-green-600" : "bg-terminal-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="w-full flex flex-col items-center" data-testid="register-page">
      <h1 className="text-3xl font-display font-bold uppercase mb-2 tracking-wide text-terminal-white w-full text-center">
        Apply for Wholesale
      </h1>
      <p className="text-center text-base font-body text-terminal-dim mb-6 max-w-[380px]">
        {step === 1 && "Create your account credentials."}
        {step === 2 && "Tell us about your business."}
        {step === 3 && "Provide your reseller permit details."}
      </p>

      <StepIndicator />

      {/* ── Step 1: Account Info ── */}
      {step === 1 && (
        <div className="w-full flex flex-col gap-y-2">
          <Input
            label="First Name"
            name="first_name"
            required
            autoComplete="given-name"
            value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            className={INPUT_CLASS}
          />
          <Input
            label="Last Name"
            name="last_name"
            required
            autoComplete="family-name"
            value={form.last_name}
            onChange={(e) => update("last_name", e.target.value)}
            className={INPUT_CLASS}
          />
          <Input
            label="Business Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={INPUT_CLASS}
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className={INPUT_CLASS}
          />
          <Input
            label="Confirm Password"
            name="confirm_password"
            required
            type="password"
            autoComplete="new-password"
            value={form.confirm_password}
            onChange={(e) => update("confirm_password", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      )}

      {/* ── Step 2: Business Info ── */}
      {step === 2 && (
        <div className="w-full flex flex-col gap-y-2">
          <Input
            label="Store Name"
            name="store_name"
            required
            autoComplete="organization"
            value={form.store_name}
            onChange={(e) => update("store_name", e.target.value)}
            className={INPUT_CLASS}
          />
          <Input
            label="Address"
            name="address_1"
            required
            autoComplete="address-line1"
            value={form.address_1}
            onChange={(e) => update("address_1", e.target.value)}
            className={INPUT_CLASS}
          />
          <div className="grid grid-cols-2 gap-x-2">
            <Input
              label="City"
              name="city"
              required
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className={INPUT_CLASS}
            />
            <Input
              label="State"
              name="state"
              required
              autoComplete="address-level1"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <Input
            label="ZIP Code"
            name="postal_code"
            required
            autoComplete="postal-code"
            value={form.postal_code}
            onChange={(e) => update("postal_code", e.target.value)}
            className={INPUT_CLASS}
          />
          <Input
            label="Phone"
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={INPUT_CLASS}
          />
          <div className="relative">
            <select
              name="store_type"
              required
              value={form.store_type}
              onChange={(e) => update("store_type", e.target.value)}
              className={`${INPUT_CLASS} ${
                !form.store_type ? "text-terminal-dim" : ""
              }`}
            >
              {STORE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ── Step 3: Reseller Permit ── */}
      {step === 3 && (
        <div className="w-full flex flex-col gap-y-2">
          <Input
            label="Reseller Permit Number"
            name="permit_number"
            required
            value={form.permit_number}
            onChange={(e) => update("permit_number", e.target.value)}
            className={INPUT_CLASS}
          />
          <Input
            label="Permit Expiry Date (MM/DD/YYYY)"
            name="permit_expiry"
            required
            value={form.permit_expiry}
            onChange={(e) => update("permit_expiry", e.target.value)}
            className={INPUT_CLASS}
          />
          <div className="mt-2">
            <label className="block text-sm font-body text-terminal-dim mb-2">
              Upload Reseller Permit <span className="text-red-400">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                if (file && file.size > 10 * 1024 * 1024) {
                  setError("File is too large. Maximum size is 10MB.")
                  e.target.value = ""
                  setPermitFile(null)
                  return
                }
                setError(null)
                setPermitFile(file)
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-11 px-4 rounded-xl border text-sm font-medium text-left transition-all ${
                permitFile
                  ? "border-green-600 bg-green-600/10 text-green-400"
                  : "border-terminal-border bg-terminal-black text-terminal-dim hover:border-businessx-orange"
              }`}
            >
              {permitFile ? permitFile.name : "Choose file (PDF, JPG, or PNG)"}
            </button>
            {permitFile && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-terminal-dim font-body">
                  {(permitFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPermitFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
            <p className="text-xs font-body text-terminal-dim mt-2 leading-relaxed">
              PDF, JPG, or PNG — max 10MB.
            </p>
          </div>
        </div>
      )}

      <ErrorMessage error={error} data-testid="register-error" />

      {/* ── Navigation Buttons ── */}
      <div className="w-full flex gap-3 mt-8">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 h-12 rounded-xl border border-terminal-border text-terminal-white font-display font-bold uppercase tracking-wider text-sm hover:bg-terminal-panel transition-all duration-150"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex-1 h-12 rounded-xl bg-businessx-orange text-black font-display font-bold uppercase tracking-wider text-sm hover:brightness-110 border border-transparent transition-all duration-150"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 h-12 rounded-xl bg-businessx-orange text-black font-display font-bold uppercase tracking-wider text-sm hover:brightness-110 border border-transparent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        )}
      </div>

      <span className="text-center text-terminal-dim text-sm font-body mt-8 font-medium">
        Already have an account?{" "}
        <LocalizedClientLink
          href="/account/login"
          className="underline font-bold text-businessx-orange hover:text-businessx-yellow transition-colors"
        >
          Sign in
        </LocalizedClientLink>
        .
      </span>
    </div>
  )
}

export default BroncoRegisterPage
