"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { Cart, ShippingMethod } from "@xclade/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: Cart
  availableShippingMethods: any[] | null
  isOpen: boolean
  onEdit?: () => void
}

function formatAddress(address: any) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
  isOpen,
  onEdit,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get selected method details
  const selectedMethodId = cart.shipping_methods?.at(-1)?.shipping_option_id

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => (sm as any).service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => (sm as any).service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    } else {
      setIsLoadingPrices(false)
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
        router.refresh()
      })
  }

  return (
    <div className="bg-terminal-panel border border-terminal-border p-6 mb-4 relative transition-all">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-xl font-display font-black uppercase tracking-wide gap-x-2 items-baseline",
            {
              "text-terminal-white": isOpen || selectedMethodId,
              "text-terminal-dim": !isOpen && !selectedMethodId
            }
          )}
        >
          Delivery Method
          {selectedMethodId && !isOpen && <CheckCircleSolid className="text-businessx-orange" />}
        </Heading>
        {selectedMethodId && !isOpen && onEdit && (
          <Button
            onClick={onEdit}
            variant="transparent"
            className="text-businessx-orange hover:text-white font-bold uppercase tracking-wide decoration-2 hover:underline font-mono text-xs"
            data-testid="edit-delivery-button"
          >
            Edit
          </Button>
        )}
      </div>

      {isOpen ? (
        <>
          <div className="grid">
            <div data-testid="delivery-options-container">
              <div className="pb-8 md:pt-0 pt-2">
                {(!availableShippingMethods || availableShippingMethods.length === 0) && (
                    <div className="text-base-regular text-terminal-dim italic p-4 bg-terminal-black border border-terminal-border">
                      {cart.shipping_address
                        ? "No shipping methods available for this location."
                        : "Please confirm your shipping address above to view delivery options."}
                    </div>
                )}
                {hasPickupOptions && (
                  <RadioGroup
                    value={showPickupOptions}
                    onChange={(value) => {
                      const id = _pickupMethods.find(
                        (option) => !option.insufficient_inventory
                      )?.id

                      if (id) {
                        handleSetShippingMethod(id, "pickup")
                      }
                    }}
                  >
                    <Radio
                      value={PICKUP_OPTION_ON}
                      data-testid="delivery-option-radio"
                      className={clx(
                        "flex items-center justify-between text-base-regular cursor-pointer py-4 border border-terminal-border px-8 mb-4 transition-all hover:bg-terminal-highlight/20",
                        {
                          "bg-terminal-highlight/30 border-businessx-orange":
                            showPickupOptions === PICKUP_OPTION_ON,
                          "bg-terminal-black":
                            showPickupOptions !== PICKUP_OPTION_ON,
                        }
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <MedusaRadio
                          checked={showPickupOptions === PICKUP_OPTION_ON}
                        />
                        <span className="text-lg font-bold font-display uppercase tracking-wide text-terminal-white">
                          Pick up your order
                        </span>
                      </div>
                      <span className="justify-self-end text-terminal-white font-mono font-bold">
                        -
                      </span>
                    </Radio>
                  </RadioGroup>
                )}
                <RadioGroup
                  value={shippingMethodId}
                  onChange={(v) => {
                    if (v) {
                      return handleSetShippingMethod(v, "shipping")
                    }
                  }}
                >
                  {_shippingMethods?.map((option) => {
                    const isDisabled =
                      option.price_type === "calculated" &&
                      !isLoadingPrices &&
                      typeof calculatedPricesMap[option.id] !== "number"

                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        data-testid="delivery-option-radio"
                        disabled={isDisabled}
                        className={clx(
                          "flex items-center justify-between text-base-regular cursor-pointer py-4 border border-terminal-border px-8 mb-4 transition-all hover:bg-terminal-highlight/20",
                          {
                            "bg-terminal-highlight/30 border-businessx-orange":
                              option.id === shippingMethodId,
                            "bg-terminal-black":
                              option.id !== shippingMethodId,
                            "opacity-50 cursor-not-allowed":
                              isDisabled,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <MedusaRadio
                            checked={option.id === shippingMethodId}
                          />
                          <span className="text-lg font-bold font-display uppercase tracking-wide text-terminal-white">
                            {option.name}
                          </span>
                        </div>
                        <span className="justify-self-end text-terminal-white font-mono font-bold">
                          {option.price_type === "flat" ? (
                            convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })
                          ) : calculatedPricesMap[option.id] ? (
                            convertToLocale({
                              amount: calculatedPricesMap[option.id],
                              currency_code: cart?.currency_code,
                            })
                          ) : isLoadingPrices ? (
                            <Loader />
                          ) : (
                            "-"
                          )}
                        </span>
                      </Radio>
                    )
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="grid">
              <div className="flex flex-col">
                <span className="font-display font-bold uppercase text-terminal-white text-xl mb-2">
                  Store
                </span>
                <span className="mb-4 text-terminal-dim txt-medium">
                  Choose a store near you
                </span>
              </div>
              <div data-testid="delivery-options-container">
                <div className="pb-8 md:pt-0 pt-2">
                  <RadioGroup
                    value={shippingMethodId}
                    onChange={(v) => {
                      if (v) {
                        return handleSetShippingMethod(v, "pickup")
                      }
                    }}
                  >
                    {_pickupMethods?.map((option) => {
                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          disabled={option.insufficient_inventory}
                          data-testid="delivery-option-radio"
                          className={clx(
                            "flex items-center justify-between text-base-regular cursor-pointer py-4 border border-terminal-border px-8 mb-4 transition-all hover:bg-terminal-highlight/20",
                            {
                              "bg-terminal-highlight/30 border-businessx-orange":
                                option.id === shippingMethodId,
                              "bg-terminal-black":
                                  option.id !== shippingMethodId,
                              "opacity-50 cursor-not-allowed":
                                option.insufficient_inventory,
                            }
                          )}
                        >
                          <div className="flex items-start gap-x-4">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
                            <div className="flex flex-col">
                              <span className="text-lg font-bold font-display uppercase tracking-wide text-terminal-white">
                                {option.name}
                              </span>
                              <span className="text-sm font-medium text-terminal-dim font-mono">
                                {formatAddress(
                                  (option as any).service_zone?.fulfillment_set?.location
                                    ?.address
                                )}
                              </span>
                            </div>
                          </div>
                          <span className="justify-self-end text-terminal-white font-mono font-bold">
                            {convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })}
                          </span>
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
          </div>
        </>
      ) : (
        <div>
          {selectedMethodId && (availableShippingMethods?.length ?? 0) > 0 && (
             <div className="text-terminal-dim font-mono text-sm">
                <div className="flex flex-col gap-y-1 txt-medium">
                  <Text className="txt-large-plus font-bold text-terminal-white uppercase mb-2">
                     Method
                  </Text>
                  <Text>
                     {availableShippingMethods?.find(s => s.id === selectedMethodId)?.name} (
                       {convertToLocale({
                           amount: availableShippingMethods?.find(s => s.id === selectedMethodId)?.amount!,
                           currency_code: cart?.currency_code,
                       })}
                     )
                  </Text>
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Shipping
