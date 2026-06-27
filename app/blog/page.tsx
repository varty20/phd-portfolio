"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("blog").select("*").order("created_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Articles...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div variants={fadeUp} className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Research & <span className="text-navy dark:text-blue-400">Articles.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Thoughts, tutorials, and deep dives into artificial intelligence, software engineering, and my academic research.
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <p className="text-gray-500">No articles published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.map((post) => (
              <motion.div 
                key={post.id} 
                variants={fadeUp} 
                whileHover={{ scale: 1.02 }}
                className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-navy/10 transition-all duration-300 cursor-pointer"
              >
                {/* Article Image */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-100 dark:bg-gray-900 border-b border-black/5 dark:border-white/5">
                  <Image 
                    src={post.image_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                
                {/* Article Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-navy dark:text-blue-400 font-medium mb-4">
                    <Calendar size={16} />
                    {post.date}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-navy dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-navy dark:text-blue-400 uppercase tracking-wider">
                    Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}