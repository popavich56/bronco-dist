import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import Spinner from "@modules/common/icons/spinner"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const { pending } = useFormStatus()

  useEffect(() => {
    if (isSuccess) {
      setIsEditing(false)
      clearState()
    }
  }, [isSuccess, clearState])

  const handleEdit = () => {
    setIsEditing(true)
    clearState()
  }

  const handleCancel = () => {
    setIsEditing(false)
    clearState()
  }

  return (
    <div className="py-8 border-b border-terminal-border" data-testid={dataTestid}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold uppercase tracking-widest text-terminal-dim">
          {label}
        </span>
        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="text-xs font-bold uppercase text-terminal-white border-b border-transparent hover:border-terminal-border transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-6">{children}</div>
          <div className="flex items-center justify-end gap-x-4">
            <button
              onClick={handleCancel}
              type="button"
              className="w-[120px] h-[40px] flex items-center justify-center bg-terminal-panel border border-terminal-border text-terminal-white text-xs font-bold uppercase tracking-widest hover:border-terminal-border transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="w-[120px] h-[40px] flex items-center justify-center bg-businessx-black text-white text-xs font-bold uppercase tracking-widest hover:bg-businessx-yellow hover:text-terminal-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? <Spinner /> : "Save"}
            </button>
          </div>
          {isError && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-100 text-red-500 text-sm font-medium rounded-none">
              {errorMessage}
            </div>
          )}
        </div>
      ) : (
        <div className="text-xl md:text-2xl font-black uppercase text-terminal-white font-display break-words">
          {currentInfo || (
            <span className="text-terminal-tech italic normal-case font-normal">
              Not set
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default AccountInfo
