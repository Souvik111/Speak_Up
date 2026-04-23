import RecordingInterface from "@/components/RecordingInterface";

export default async function RecordPage({ searchParams }) {
  // Next.js 15 requires awaiting searchParams
  const params = await searchParams;
  const topic = params?.topic || "Convince me why tea is better than coffee.";
  const topicId = params?.topicId || null;

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto pt-6 sm:pt-12">
      <div className="mb-10 text-center space-y-2">
        <h2 className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Focus on fluency</h2>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
          {topic}
        </h1>
      </div>
      
      <div className="w-full bg-white border border-gray-200 rounded-3xl shadow-sm p-8 sm:p-12 flex flex-col items-center">
        <RecordingInterface topicId={topicId} />
      </div>
    </div>
  );
}
