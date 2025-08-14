import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function BtnArrow({ content, onClick, icon }: { content: string, onClick?: () => void, icon?: string }) {
  return (
    <Button className="group hover:cursor-pointer py-5 rounded-lg min-w-55" onClick={onClick}>
      {icon && (<img
        src={icon}
        className="w-6 h-6"
      />)}
      {content}
      <ArrowRightIcon
        className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
        size={16}
        aria-hidden="true"
      />
    </Button>
  )
}
