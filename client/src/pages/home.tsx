import HomeTable from "@/components/homeTable";

export default function Home() {
    return (
        <div className="max-w-[80vw] mx-auto">
            <h1 className="text-2xl font-bold text-center py-8">Home</h1>
            <HomeTable />
        </div>
    );
}