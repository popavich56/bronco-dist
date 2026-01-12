"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateCompany } from "@lib/data/b2b"

type Company = {
  id: string
  name: string
  email: string
  phone: string
  currency_code: string
}

export default function CompanyDetails({ company }: { company: Company }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: company.name || "",
    email: company.email || "",
    phone: company.phone || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateCompany(formData)
      setIsEditing(false)
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <div className="bg-terminal-panel p-6 border border-terminal-border">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Details</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm underline text-terminal-dim hover:text-black"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-terminal-dim block">Company Name</span>
            <span className="font-medium">{company.name}</span>
          </div>
          <div>
            <span className="text-terminal-dim block">Email</span>
            <span className="font-medium">{company.email}</span>
          </div>
          <div>
            <span className="text-terminal-dim block">Phone</span>
            <span className="font-medium">{company.phone || "-"}</span>
          </div>
          <div>
            <span className="text-terminal-dim block">Currency</span>
            <span className="font-medium uppercase">
              {company.currency_code}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-terminal-panel p-6 border border-terminal-border">
      <h2 className="text-xl font-bold mb-4">Edit Details</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div>
          <label className="block text-sm text-terminal-dim mb-1">
            Company Name
          </label>
          <input
            className="border border-terminal-border p-2 w-full text-sm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-terminal-dim mb-1">Email</label>
          <input
            className="border border-terminal-border p-2 w-full text-sm"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm text-terminal-dim mb-1">Phone</label>
          <input
            className="border border-terminal-border p-2 w-full text-sm"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-2 text-sm font-bold uppercase hover:bg-gray-800"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm underline text-terminal-dim"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
