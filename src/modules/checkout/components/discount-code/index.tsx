"use client"

import { Badge, Heading, Input, Label, Text } from "@medusajs/ui"
import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { Cart, Promotion } from "@xclade/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: Cart
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = (promotions || []).filter(
      (promotion) => promotion?.code !== code
    )

    await applyPromotions(
      validPromotions
        .filter((p) => p?.code !== undefined && p?.code !== null)
        .map((p) => p!.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = (promotions || [])
      .filter((p) => p?.code !== undefined && p?.code !== null)
      .map((p) => p!.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full bg-terminal-black flex flex-col">
      <div className="txt-medium">
        <form action={(a) => addPromotionCode(a)} className="w-full mb-5">
          <Label className="flex gap-x-1 my-2 items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="txt-medium text-terminal-white hover:text-bronco-orange transition-colors font-bold uppercase underline"
              data-testid="add-discount-button"
            >
              Add Promotion Code(s)
            </button>
          </Label>

          {isOpen && (
            <>
              <div className="flex w-full gap-x-2">
                <Input
                  className="size-full bg-terminal-black border border-terminal-border text-terminal-white rounded-none focus:border-bronco-orange transition-all placeholder:text-terminal-dim font-mono font-medium"
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={true}
                  data-testid="discount-input"
                  placeholder="CODE"
                />
                <SubmitButton
                  variant="secondary"
                  data-testid="discount-apply-button"
                  className="bg-terminal-black text-terminal-white hover:bg-bronco-orange hover:text-black font-bold uppercase tracking-wider rounded-none border border-terminal-border transition-all"
                >
                  Apply
                </SubmitButton>
              </div>

              <ErrorMessage
                error={errorMessage}
                data-testid="discount-error-message"
              />
            </>
          )}
        </form>

        {(promotions || []).length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium mb-2 text-terminal-white uppercase font-display font-bold">
                Promotion(s) applied:
              </Heading>

              {(promotions || []).map((promotion) => {
                if (!promotion) return null
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1 text-terminal-dim font-mono">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          className="bg-terminal-highlight border-terminal-border text-terminal-white rounded-none font-mono"
                          size="small"
                        >
                          {promotion.code}
                        </Badge>
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {" ("}
                              {promotion.application_method?.type ===
                              "percentage"
                                ? `${promotion.application_method?.value}%`
                                : convertToLocale({
                                    amount: +(promotion.application_method?.value || 0),
                                    currency_code:
                                      promotion.application_method
                                        .currency_code!,
                                  })}
                              {")"}
                            </>
                          )}
                      </span>
                    </Text>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center text-terminal-dim hover:text-red-500 transition-colors"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">
                          Remove discount code from order
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
