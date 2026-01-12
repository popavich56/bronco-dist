import { Container } from "@medusajs/ui"

const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <Container className="aspect-square w-full bg-terminal-highlight  bg-ui-bg-subtle" />
      <div className="flex justify-between text-base-regular mt-2">
        <div className="w-2/5 h-6 bg-terminal-highlight "></div>
        <div className="w-1/5 h-6 bg-terminal-highlight "></div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
