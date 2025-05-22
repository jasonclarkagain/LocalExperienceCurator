import { motion } from "framer-motion";

interface QuickFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All", icon: "✨" },
  { id: "cafe", label: "Cafés", icon: "☕" },
  { id: "art", label: "Art", icon: "🎨" },
  { id: "events", label: "Events", icon: "🎵" },
  { id: "food", label: "Food", icon: "🍽️" },
];

export default function QuickFilters({ selectedCategory, onCategoryChange }: QuickFiltersProps) {
  return (
    <div className="px-4 mb-6">
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-coral text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
