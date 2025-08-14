import { useState } from "react";
import BtnArrow from "@/components/btnArrow";

const links = [
    {
        href: "https://www.google.com/about/careers/applications/jobs/results/?hl=en_US&employment_type=INTERN",
        label: "Google Careers",
    },
    {
        href: "https://www.metacareers.com/jobs?roles[0]=Internship",
        label: "Meta Careers",
    },
    {
        href: "https://jobs.careers.microsoft.com/global/en/search?p=Research%2C%20Applied%2C%20%26%20Data%20Sciences&p=Software%20Engineering&d=Research%20Sciences&et=Internship&l=en_us&pg=1&pgSz=20&o=Relevance&flt=true",
        label: "Microsoft Careers",
    },
    {
        href: "https://amazon.jobs/fr/search?offset=0&result_limit=10&sort=relevant&category%5B%5D=software-development&category%5B%5D=machine-learning-science&country%5B%5D=USA&country%5B%5D=CAN&category_type=studentprograms&distanceType=Mi&radius=24km&latitude=&longitude=&loc_group_id=&loc_query=&base_query=test&city=&country=&region=&county=&query_options=&",
        label: "Amazon Jobs",
    },
    {
        href: "https://jobs.apple.com/en-us/search?search=internship&sort=newest&location=united-states-USA+canada-CANC+france-FRAC",
        label: "Apple Careers",
    }
];


function getFaviconUrl(url: string) {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
}

export default function Home() {
    const [remainingLinks, setRemainingLinks] = useState(links);

    const handleClick = (index: number) => {
        window.open(remainingLinks[index].href, "_blank", "noopener,noreferrer");
        setRemainingLinks((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-[80vw] mx-auto">
            {remainingLinks.length === 0 ? (
                <div className="text-center my-8 font-bold text-lg">
                    All links have been checked. Good Job!
                </div>
            ) : (
                <div className="text-center my-8 font-bold text-lg">
                    {links.length - remainingLinks.length}/{links.length}
                </div>
            )}

            <div className="text-center my-8 flex flex-col items-start gap-2">
                {remainingLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <BtnArrow
                            content={link.label}
                            onClick={() => handleClick(idx)}
                            icon={getFaviconUrl(link.href)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
