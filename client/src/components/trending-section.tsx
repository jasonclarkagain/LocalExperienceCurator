import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function TrendingSection() {
  const { data: trends = [] } = useQuery({
    queryKey: ["/api/trends"],
  });

  const { data: trendingExperiences = [] } = useQuery({
    queryKey: ["/api/experiences/trending"],
  });

  const mainTrend = trends[0];
  const topTrendingImages = trendingExperiences.slice(0, 3);

  if (!mainTrend) return null;

  return (
    <motion.div
      className="px-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl text-slate font-['Poppins']">Trending Now</h2>
        <div className="flex items-center text-xs text-gray-500">
          <svg className="w-3 h-3 text-coral mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          Based on social activity
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 text-coral mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <span className="font-semibold text-slate">{mainTrend.hashtag}</span>
          <span className="ml-auto text-xs text-gray-500">
            +{mainTrend.growthRate}% today
          </span>
        </div>

        {topTrendingImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {topTrendingImages.map((experience, index) => (
              <motion.img
                key={experience.id}
                src={experience.imageUrl}
                alt={experience.name}
                className="rounded-lg object-cover h-20 w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500">
          <span className="font-medium">{mainTrend.mentions}</span> mentions in the last 24 hours
        </div>
      </div>
    </motion.div>
  );
}
