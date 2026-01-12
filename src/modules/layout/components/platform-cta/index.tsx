import { Text } from "@medusajs/ui"

import NextJs from "../../../common/icons/nextjs"

const PlatformCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center">
      Built with
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">
        <NextJs fill="#9ca3af" />
      </a>
      & xClade
    </Text>
  )
}

export default PlatformCTA
