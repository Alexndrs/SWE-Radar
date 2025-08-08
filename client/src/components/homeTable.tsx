import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "./ui/checkbox"

import ToolTipReferral from "./toolTipReferral"
import BtnArrow from "./btnArrow"

const items = [
  {
    id: "1",
    job: "Software Engineer Intern 2026",
    compagnie: "Google",
    date: "15 minutes ago",
    location: "San Francisco, US",
    link: "https://example.com/job/software-engineer-intern",
    potentialReferral: [{ name: "Alex Thompson", image: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-02_upqrxi.jpg", linkedin: "https://www.linkedin.com/in/alexthompson" }, { name: "Sarah Chen", image: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-01_ij9v7j.jpg", linkedin: "https://www.linkedin.com/in/sarahChen" }]
  },
  {
    id: "2",
    job: "Frontend Engineer Intern 2026",
    compagnie: "Meta",
    date: "4 Hours ago",
    location: "San Francisco, US",
    link: "https://example.com/job/frontend-engineer-intern",
    potentialReferral: [{ name: "Sarah Chen", image: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-01_ij9v7j.jpg", linkedin: "https://www.linkedin.com/in/sarahChen" }]
  }
]

export default function HomeTable() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Job Title</TableHead>
            <TableHead>Compagnie</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Potential Referral</TableHead>
            <TableHead className="text-right">Applied?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.job}</TableCell>
              <TableCell>{item.compagnie}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell><a href={item.link}><BtnArrow content="apply" /></a></TableCell>
              <TableCell>
                <div className="flex items-center justify-center mr-5">
                  <ToolTipReferral potentialReferral={item.potentialReferral} />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="mr-7">
                  <Checkbox />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
