"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

export default function VideoCourses() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase.from("video_courses").select("*").order("created_at", { ascending: false });
      if (data) setVideos(data);
      setLoading(false);
    };
    fetchVideos();
  }, []);

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Videos...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.h1 variants={fadeUp} className="text-4xl font-bold mb-4">Video <span className="text-navy dark:text-blue-400">Lectures.</span></motion.h1>
        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl">
          Watch recorded sessions, tutorials, and keynote talks directly from my YouTube channel.
        </motion.p>

        {videos.length === 0 ? (
          <p className="text-gray-500">No videos added yet. Add some in the Admin Panel!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((vid) => (
              <motion.div key={vid.id} variants={fadeUp} className="group">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-black/10 dark:border-white/10 shadow-lg bg-black">
                  {vid.youtube_id ? (
                    <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${vid.youtube_id}`} title={vid.title} allowFullScreen></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm">No Video ID</div>
                  )}
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">{vid.title}</h3>
                {vid.description && <p className="text-xs text-gray-500 mt-2">{vid.description}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}