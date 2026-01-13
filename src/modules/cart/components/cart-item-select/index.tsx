"use client"

import { IconBadge, clx } from "@medusajs/ui"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import ChevronDown from "@modules/common/icons/chevron-down"

type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">

const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder = "Select...", className, children, ...props }, ref) => {
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true)
      } else {
        setIsPlaceholder(false)
      }
    }, [innerRef.current?.value])

    return (
      <div className="relative w-full h-full flex items-center justify-center group bg-terminal-black">
        <select
          ref={innerRef}
          {...props}
          className="appearance-none bg-transparent border-none w-full h-full text-center pl-2 pr-4 font-bold font-mono text-xs text-terminal-white focus:outline-none cursor-pointer z-10"
        >
          <option disabled value="">
            {placeholder}
          </option>
          {children}
        </select>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-terminal-dim group-hover:text-businessx-orange transition-colors w-4 h-4 flex items-center justify-center bg-terminal-black">
            <ChevronDown className="w-3 h-3" />
        </div>
      </div>
    )
  }
)

CartItemSelect.displayName = "CartItemSelect"

export default CartItemSelect
