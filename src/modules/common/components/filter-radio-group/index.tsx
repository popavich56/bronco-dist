import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <Text className="text-xl font-display font-black uppercase text-terminal-white  mb-2">{title}</Text>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange} className="flex flex-col gap-y-2">
        {items?.map((i) => (
          <div
            key={i.value}
            className={clx("flex gap-x-2 items-center group cursor-pointer")}
          >
            <RadioGroup.Item
              checked={i.value === value}
              className="hidden peer"
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(
                "text-sm uppercase tracking-wide cursor-pointer transition-all duration-200",
                {
                  "font-black text-terminal-white  translate-x-1": i.value === value,
                  "font-medium text-terminal-dim  hover:text-terminal-white dark:hover:text-white hover:translate-x-1": i.value !== value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.value === value && <span className="mr-2 text-bronco-yellow">►</span>}
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
