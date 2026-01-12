import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { Region } from "@xclade/types"

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: Region
  }
>(({ placeholder = "Country", region, defaultValue, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null)

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  )

  const countryOptions = useMemo(() => {
    if (!region) {
      return []
    }

    const options = region.countries?.map((country) => ({
      value: country?.iso_2,
      label: country?.display_name,
    })) || []
    
    return options
  }, [region])

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={placeholder}
      defaultValue={defaultValue}
      disabled={countryOptions.length === 0}
      {...props}
    >
      {countryOptions?.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  )
})

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
