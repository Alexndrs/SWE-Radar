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
    },
    {
        href: "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?jobFamilyGroup=0c40f6bd1d8f10ae43ffaefd46dc7e78&workerSubType=ab40a98049581037a3ada55b087049b7",
        label: "NVIDIA Careers",
    },
    {
        href: "https://www.tesla.com/careers/search/?department=ai-robotics&type=fulltime&site=US",
        label: "Tesla Careers",
        warining: "internship with no return to school should browse full-time jobs + should check for CA/FR"
    },
    {
        href: "https://explore.jobs.netflix.net/careers?query=internship&location=any&pid=790304043022&Teams=Engineering&domain=netflix.com&sort_by=relevance&triggerGoButton=false",
        label: "Netflix Careers",
    },
    {
        href: "https://www.pinterestcareers.com/jobs/?search=&team=Engineering&type=Intern&pagesize=20#results",
        label: "Pinterest Careers",
    },
    {
        href: "https://www.linkedin.com/jobs/search/?currentJobId=4270526785&f_C=1337%2C2587638%2C39939&f_E=1%2C2&f_I=3242&f_TPR=r86400&geoId=92000000&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=R",
        label: "LinkedIn Jobs",
    },
    {
        href: "https://www.lifeatspotify.com/jobs?j=internship&j=early-career-program&c=data-insights-leadership&c=data-science&c=machine-learning-data-research-insights&c=tech-research-data-research-insights&c=user-research&c=backend&c=client-c&c=data&c=developer-tools-infrastructure&c=engineering-leadership&c=machine-learning&c=mobile&c=network-engineering-it&c=security&c=tech-research&c=web",
        label: "Spotify Careers",
    },
    {
        href: "https://www.uber.com/be/fr/careers/list/?query=intern&department=Engineering",
        label: "Uber Careers",
    },
    {
        href: "https://careers.airbnb.com/positions/",
        label: "Airbnb Careers",
    },
    {
        href: "https://www.ibm.com/careers/search?field_keyword_08[0]=Software%20Engineering&field_keyword_18[0]=Internship&field_keyword_05[0]=France&field_keyword_05[1]=Canada&field_keyword_05[2]=United%20States",
        label: "IBM Careers",
    },
    {
        href: "https://intel.wd1.myworkdayjobs.com/External?workerSubType=dc8bf79476611087dfde99931439ae75",
        label: "Intel Careers",
    },
    {
        href: "https://careers.oracle.com/en/sites/jobsearch/jobs?keyword=engineering&lastSelectedFacet=AttributeChar12&mode=location&selectedFlexFieldsFacets=%22AttributeChar4%7CStudent%2FIntern%22",
        label: "Oracle Careers",
    },
    {
        href: "https://careers.salesforce.com/en/jobs/?search=&team=Software+Engineering&jobtype=Intern&pagesize=20#results",
        label: "Salesforce Careers",
    },
    {
        href: "https://sec.wd3.myworkdayjobs.com/fr-FR/Samsung_Careers?workerSubType=189767dd6c920145d5c3e59c2c297819&Location_Country=bc33aa3152ec42d4995f4791a106ed09&Location_Country=54c5b6971ffb4bf0b116fe7651ec789a&Location_Country=a30a87ed25634629aa6c3958aa2b91ea",
        label: "Samsung Careers",
    },
    {
        href: "https://careers.adobe.com/us/en/c/engineering-and-product-jobs",
        label: "Adobe Careers",
        warning: "should reset the filter at each visit"
    },
    {
        href: "https://autodesk.wd1.myworkdayjobs.com/fr-CA/uni?jobFamilyGroup=1f75c4299c9201c0f3b5f8e6fa01c5bf",
        label: "Autodesk Careers",
    },
    {
        href: "https://www.lyft.com/careers#openings?search=engineering",
        label: "Lyft Careers",
        warning: "should check for intern roles"
    },
    {
        href: "https://www.yahooinc.com/careers/search.html?searchText=undefined&category=%22Internship%2CInternship%22&location=%22Canada%2CFrance%2CUnited%20States%2CCanada%2CFrance%2CUnited%20States%22",
        label: "Yahoo Careers",
        warning: "should ckeck for intern roles"
    },
    {
        href: "https://redditinc.com/careers",
        label: "Reddit Careers",
        warning: "should check for intern roles"

    },
    {
        href: "https://www.squarespace.com/careers/early-career",
        label: "Squarespace Careers",
    },
    {
        href: "https://stripe.com/jobs/search?query=software&teams=Banking+as+a+Service&teams=Climate&teams=Connect&teams=Crypto&teams=Mobile&teams=Money+Movement+and+Storage&teams=New+Financial+Products&teams=Payments&teams=Platform&teams=Professional+Services&teams=Revenue+%26+Financial+Automation&teams=Stripe+Tax&teams=Terminal&teams=University",
        label: "Stripe Careers",
        warning: "should check for intern roles"
    },
    {
        href: "https://careers.datadoghq.com/all-jobs/?s=engineering&time_type%5B0%5D=Early%20Career",
        label: "Datadog Careers",
        warning: "should check for intern roles"
    },
    {
        href: "https://www.atlassian.com/company/careers/all-jobs?team=Engineering&location=France%2CCanada&search=",
        label: "Atlassian Careers",
        warning: "should check for intern roles"
    },
    {
        href: "https://www.figma.com/careers/#job-openings",
        label: "Figma Careers",
        warning: "should check for intern roles"
    },
    {
        href: "https://www.notion.com/careers?department=university#open-positions",
        label: "Notion Careers",
    },
    {
        href: "https://discord.com/careers",
        label: "Discord Careers",
        warning: "should check manually for intern engineering roles"
    },
    {
        href: "https://careersatdoordash.com/job-search/?function=Machine%20Learning%20Engineering%7CSoftware%20Engineering%7CData%20Engineering%7C&intern=1&spage=1",
        label: "DoorDash Careers",
    },
    {
        href: "https://instacart.careers/current-openings/",
        label: "Instacart Careers",
        warning: "should check for intern engineering roles"
    },
    {
        href: "https://slack.com/careers/dept/software-engineering/type/intern",
        label: "Slack Careers",
    },
    {
        href: "https://openai.com/careers/search/?q=internship",
        label: "OpenAI Careers",
    },
    {
        href: "https://www.anthropic.com/jobs",
        label: "Anthropic Careers",
        warning: "should check for intern engineering roles"
    },
    {
        href: "https://deepmind.google/about/careers/?category=engineering#open-roles",
        label: "DeepMind Careers",
        warning: "should check for intern roles"
    },
    {
        href: "https://www.perplexity.ai/fr/hub/careers#open-roles",
        label: "Perplexity Careers",
        warning: "should check for intern engineering roles"
    },
    {
        href: "https://scale.com/careers#open-roles",
        label: "Scale AI Careers",
        warning: "should check for intern engineering roles"
    },
    {
        href: "https://jobs.lever.co/mistral",
        label: "Mistral Careers",
        warning: "should check for intern engineering roles",
    },
    {
        href: "https://apply.workable.com/huggingface/#jobs",
        label: "HuggingFace Careers",
        warning: "should check for intern engineering roles"
    },
    {
        href: "https://www.deezerjobs.com/fr/offres/?ct=intern&wr=",
        label: "Deezer Careers",
        warning: "should check for engineering roles"
    },
    {
        href: "https://careers.ledger.com/jobs/search?page=1&department_uids%5B%5D=064b14638be2fe3bed7d6cb6ed84fe13&employment_type_uids%5B%5D=dc10ff355d240f20285cba711c173b01&query=",
        label: "Ledger Careers",
    },
    {
        href: "https://qonto.com/en/careers#jobs",
        label: "Qonto Careers",
        warning: "should check for intern engineering roles"
    },
    {
        href: "https://jobs.ashbyhq.com/alan?departmentId=8ba0fb44-ec79-4731-bf45-d65a821e24f0",
        label: "Alan Careers",
        warning: "should check for intern engineering roles"
    },
    {
        href: "https://careers.doctolib.fr/career-jobs/?categories=Engineering&locations=Bologna%2CBrescia%2CForl%C3%AC%2CImperia%2CMilan%2CRimini%2CItalie%2CBastia%2CBrest%2CCaen%2CGrenoble%2CLille%2CLyon%2CNantes%2CParis%2CPerpignan%2CFrance&types=Intern",
        label: "Doctolib Careers",
    },
    {
        href: "https://jobs.blablacar.com/vacancies?where=Paris+or+Remote+from+France&department=Engineering&contract=Internship#jobs",
        label: "BlaBlaCar Careers",
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
