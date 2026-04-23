import RecordingInterface from "@/components/RecordingInterface";

export default async function RecordPage({ searchParams }) {
  // Next.js 15 requires awaiting searchParams
  const params = await searchParams;
  const topic = params?.topic || "Convince me why tea is better than coffee.";
  const topicId = params?.topicId || null;

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto pt-6 sm:pt-12">
      <div className="mb-10 text-center space-y-3 animate-fade-in-up">
        <span className="gradient-pill inline-block px-3 py-1">
          Focus on fluency
        </span>
        <h1 className="text-2xl sm:text-3xl font-black leading-snug tracking-tight gradient-text">
          {topic}
        </h1>
      </div>
      
      <div className="w-full glass-card p-8 sm:p-12 flex flex-col items-center animate-fade-in-up-delay-1">
        <RecordingInterface topicId={topicId} />
      </div>
    </div>
  );
}
