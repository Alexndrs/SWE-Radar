import { UserPlus2Icon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface ToolTipReferralProps {
  potentialReferral: {
    name: string,
    image: string,
    linkedin: string
  }[]
}


export default function ToolTipReferral({ potentialReferral }: ToolTipReferralProps) {

  if (potentialReferral.length === 0) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex">
            {potentialReferral.slice(0, 3).map((referral, index) => (
              <img
                key={index}
                className={`rounded-full ${index > 0 ? '-ml-5' : ''} shadow-[4px_2px_8px_rgba(0,0,0,0.6)]`}
                style={{ zIndex: 2 - index }}
                src={referral.image}
                width={40}
                height={40}
                alt={referral.name}
              />
            ))}
          </div>
        </TooltipTrigger>
        <TooltipContent className="dark py-3">
          <div className="flex gap-3">
            <UserPlus2Icon
              className="mt-0.5 shrink-0 opacity-60"
              size={16}
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-[13px] font-medium">
                {potentialReferral.length} Potential Referral found
              </p>
              <p className="text-muted-foreground text-xs">
                <ul className="flex flex-col list-none m-0 p-0 gap-2">
                  {potentialReferral.map((referral, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <a
                        href={referral.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {referral.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
