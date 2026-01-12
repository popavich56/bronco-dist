import { Text, clx } from "@medusajs/ui"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"
import { Plus, Minus } from "lucide-react"

type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  title: string
  subtitle?: string
  description?: string
  required?: boolean
  tooltip?: string
  forceMountContent?: true
  headingSize?: "small" | "medium" | "large"
  customTrigger?: React.ReactNode
  complete?: boolean
  active?: boolean
  triggerable?: boolean
  children: React.ReactNode
}

type AccordionProps =
  | (AccordionPrimitive.AccordionSingleProps &
      React.RefAttributes<HTMLDivElement>)
  | (AccordionPrimitive.AccordionMultipleProps &
      React.RefAttributes<HTMLDivElement>)

const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>
} = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
  )
}

const Item: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  description,
  children,
  className,
  headingSize = "large",
  customTrigger = undefined,
  forceMountContent = undefined,
  triggerable,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={clx(
        "border-terminal-border bg-terminal-black/40 border-t first:border-t-0 last:border-b",
        "py-4 transition-colors hover:bg-terminal-highlight",
        className
      )}
    >
      <AccordionPrimitive.Header className="px-1">
        <AccordionPrimitive.Trigger className="w-full flex items-center justify-between group focus:outline-none">
          <div className="flex flex-col text-left">
            <span className="font-display font-bold uppercase tracking-wide text-sm text-terminal-white group-hover:text-bronco-orange transition-colors">
              {title}
            </span>
            {subtitle && (
              <span className="text-terminal-dim font-mono text-[10px] mt-1">
                {subtitle}
              </span>
            )}
          </div>
          {customTrigger || <TerminalTrigger />}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content
        forceMount={forceMountContent}
        className={clx(
          "overflow-hidden data-[state=closed]:animate-accordion-close data-[state=open]:animate-accordion-open"
        )}
      >
        <div className="pt-4 pr-12 pb-2 text-terminal-dim font-mono text-xs leading-relaxed">
          {description && <p className="mb-4">{description}</p>}
          <div className="w-full">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

const TerminalTrigger = () => {
  return (
    <div className="relative w-4 h-4 text-terminal-dim group-hover:text-bronco-orange transition-colors">
      <Minus className="absolute inset-0 w-4 h-4 transition-transform duration-300 group-data-[state=closed]:rotate-90 group-data-[state=closed]:opacity-0" />
      <Plus className="absolute inset-0 w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0" />
    </div>
  )
}

export default Accordion
