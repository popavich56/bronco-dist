"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { inviteEmployee, removeEmployee, updateEmployee } from "@lib/data/b2b"

type Employee = {
  id: string
  is_admin: boolean
  spending_limit: number
  customer: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

export default function EmployeeList({ employees }: { employees: Employee[] }) {
  const router = useRouter()
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Invite State
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await inviteEmployee(inviteEmail, inviteRole)
      setIsInviteOpen(false)
      setInviteEmail("")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to invite")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this employee?")) return
    setLoading(true)
    try {
      await removeEmployee(id)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, isAdmin: boolean) => {
    // Toggle admin status for example
    setLoading(true)
    try {
      await updateEmployee(id, { is_admin: !isAdmin })
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-terminal-panel p-6 border border-terminal-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Employees</h2>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="bg-black text-white px-4 py-2 text-sm uppercase font-bold hover:bg-gray-800 transition"
          disabled={loading}
        >
          Invite Employee
        </button>
      </div>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      {/* Invite Modal (Simple inline for now) */}
      {isInviteOpen && (
        <div className="mb-6 p-4 bg-terminal-surface border border-terminal-border">
          <h3 className="font-bold text-sm mb-2">Invite New Member</h3>
          <form onSubmit={handleInvite} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email Address"
              className="border p-2 text-sm w-full"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <select
              className="border p-2 text-sm w-full"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 text-black px-4 py-1 text-sm font-bold uppercase"
              >
                Send Invite
              </button>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="text-terminal-dim text-sm underline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {employees && employees.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {employees.map((emp) => (
            <li key={emp.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">
                  {emp.customer?.first_name || "New"}{" "}
                  {emp.customer?.last_name || "User"}
                </p>
                <p className="text-xs text-terminal-dim">{emp.customer?.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs">
                  {emp.is_admin ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 font-bold rounded">
                      ADMIN
                    </span>
                  ) : (
                    <span className="bg-terminal-highlight text-terminal-dim px-2 py-1 font-bold rounded">
                      MEMBER
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(emp.id, emp.is_admin)}
                    disabled={loading}
                    className="text-xs text-blue-600 underline"
                  >
                    {emp.is_admin ? "Demote" : "Promote"}
                  </button>
                  <button
                    onClick={() => handleRemove(emp.id)}
                    disabled={loading}
                    className="text-xs text-red-500 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-terminal-dim text-sm">No employees found.</p>
      )}
    </div>
  )
}
