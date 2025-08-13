import { CheckInReport } from "@/components/check-in/check-in-report";

export default function CheckInPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl mb-2 text-primary">Karena setiap kehadiran bermakna</h1>
        <p className="text-muted-foreground max-w-2xl">
          Jangan biarkan satu pun moment ibadah terlewatkan. Fitur ini membantumu untuk mencatat check-in-mu dengan mudah sebagai bentuk perhatian dan kasih. 
        </p>
      </header>
      <CheckInReport />
    </div>
  );
}
