"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { BookOpen, FileText } from "lucide-react";

export default function MyCourses() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login"); // Not logged in? Go to login page!
      } else {
        setUserEmail(session.user.email || null);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        
        <div className="flex justify-between items-end mb-12 border-b border-black/10 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Student <span className="text-navy dark:text-blue-400">Dashboard.</span></h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, {userEmail}</p>
          </div>
          <button 
            onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            Log Out
          </button>
        </div>

        <h3 className="text-2xl font-bold mb-6">Your Active Courses</h3>
        
        {/* Placeholder Enrolled Course */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-black/50">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-navy dark:text-blue-400" />
              <h4 className="text-xl font-bold">Fundamentals of Artificial Intelligence</h4>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Course Progress</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-navy dark:bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>

            <div className="flex gap-4 border-t border-black/10 dark:border-white/10 pt-4">
              <button className="flex items-center gap-2 text-sm text-navy dark:text-blue-400 hover:underline">
                <FileText size={16}/> Download Syllabus PDF
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}