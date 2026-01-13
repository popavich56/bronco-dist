import { clx } from "@medusajs/ui"
import { ProductOption } from "@xclade/types"
import React from "react"

type OptionSelectProps = {
  option: ProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border-2 border-terminal-border h-12 p-2 flex-1 font-display font-medium text-sm tracking-wide uppercase transition-all duration-200",
                {
                  "bg-businessx-black text-businessx-white dark:bg-terminal-black dark:text-terminal-white":
                    v === current,
                  "bg-terminal-black text-terminal-white hover:bg-businessx-yellow dark:hover:bg-businessx-yellow":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
