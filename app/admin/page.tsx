"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Plus, Trash2, Users, CheckCircle, Video, Mic, FileText, LayoutDashboard, UserCircle, Save, Briefcase, GraduationCap, Loader2, Edit, Brain, Paperclip, Download } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("about");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingYoutube, setFetchingYoutube] = useState(false);
  
  const [aboutData, setAboutData] = useState({ title: "", description: "", image_url: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // NEW: State to hold the uploaded file
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const defaultForm = { title: "", description: "", status: "Upcoming", price: "", date: "", location: "", image_url: "", youtube_id: "", duration: "", event: "", tech_stack: "", company: "", role: "", institution: "", degree: "", years: "", youtube_url: "", link: "", content: "", file_url: "", file_name: "" };
  const [formData, setFormData] = useState(defaultForm);

  const menuItems = [
    { id: "requests", label: "Student Requests", icon: Users },
    { id: "ai_knowledge", label: "AI Knowledge Base", icon: Brain },
    { id: "about", label: "About Page Basic", icon: UserCircle },
    { id: "experience", label: "Work Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "workshops", label: "Workshops", icon: Calendar },
    { id: "video_courses", label: "Video Courses", icon: Video },
    { id: "talks", label: "Talks & Keynotes", icon: Mic },
    { id: "blog", label: "Blog & Articles", icon: FileText },
    { id: "projects", label: "Projects", icon: LayoutDashboard },
  ];

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === "about") {
      const { data: result } = await supabase.from("site_content").select("*").eq("id", "about_bio").single();
      if (result) setAboutData({ title: result.title, description: result.description, image_url: result.image_url });
    } else {
      const { data: result, error } = await supabase.from(activeTab).select("*").order("created_at", { ascending: false });
      if (error) { setData([]); } else if (result) { setData(result); }
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleSaveAbout = async () => {
    setLoading(true);
    const { error } = await supabase.from("site_content").upsert({ id: "about_bio", ...aboutData });
    if (error) alert("Error: " + error.message);
    else alert("About Page Updated Successfully!");
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    const { error } = await supabase.from(activeTab).delete().eq("id", id);
    if (!error) fetchData();
  };

  const handleEdit = (row: any) => {
    setFormData({ ...defaultForm, ...row }); 
    setEditingId(row.id); 
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsUploading(true);
    let finalFileUrl = formData.file_url;
    let finalFileName = formData.file_name;

    // FILE UPLOAD LOGIC FOR AI KNOWLEDGE BASE
    if (activeTab === "ai_knowledge" && uploadFile) {
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('knowledge_files').upload(fileName, uploadFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('knowledge_files').getPublicUrl(fileName);
        finalFileUrl = data.publicUrl;
        finalFileName = uploadFile.name;
      } else {
        alert("File upload failed: " + uploadError.message);
      }
    }

    let payload: any = {};
    switch (activeTab) {
      case "ai_knowledge": payload = { title: formData.title, content: formData.content, file_url: finalFileUrl, file_name: finalFileName }; break;
      case "experience": payload = { company: formData.company, role: formData.role, duration: formData.duration, description: formData.description }; break;
      case "education": payload = { institution: formData.institution, degree: formData.degree, years: formData.years }; break;
      case "video_courses": payload = { title: formData.title, youtube_id: formData.youtube_id }; break;
      case "talks":
      case "blog": payload = { title: formData.title, date: formData.date, description: formData.description, image_url: formData.image_url }; break;
      case "projects": payload = { title: formData.title, role: formData.role, link: formData.link, tech_stack: formData.tech_stack, description: formData.description, image_url: formData.image_url }; break;
      case "courses": payload = { title: formData.title, status: formData.status, description: formData.description, price: formData.price, start_date: formData.date, location: formData.location, image_url: formData.image_url }; break;
      case "workshops": payload = { title: formData.title, status: formData.status, description: formData.description, date: formData.date, location: formData.location, image_url: formData.image_url }; break;
    }

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from(activeTab).update(payload).eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from(activeTab).insert([payload]);
      error = insertError;
    }
    
    setIsUploading(false);

    if (!error) {
      setIsModalOpen(false); setEditingId(null); setFormData(defaultForm); setUploadFile(null); fetchData();
    } else alert("Error saving: " + error.message);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-[#020202]">
      
      {/* SIDEBAR */}
      <div className="w-64 border-r border-black/10 dark:border-white/10 bg-white dark:bg-[#050505] p-6 hidden md:block overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"}`}>
              <item.icon size={18}/> {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold capitalize">{activeTab.replace("_", " ")}</h1>
            <p className="text-gray-500 mt-1">Manage your platform content dynamically.</p>
          </div>
          {activeTab !== "requests" && activeTab !== "about" && (
            <button onClick={() => { setFormData(defaultForm); setEditingId(null); setUploadFile(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-medium hover:bg-navy-dark transition-colors shadow-lg"><Plus size={18} /> Add New</button>
          )}
        </div>

        {/* ... (About Page code remains the same) ... */}
        {activeTab === "about" && (
          <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-sm max-w-3xl">
            <h3 className="text-xl font-bold mb-6">Main Profile Header</h3>
            <div className="space-y-6">
              <div><label className="block text-sm font-medium mb-2 text-gray-500">Name / Title</label><input type="text" value={aboutData.title} onChange={e => setAboutData({...aboutData, title: e.target.value})} className="w-full p-4 rounded-xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:border-navy" /></div>
              <div><label className="block text-sm font-medium mb-2 text-gray-500">Short Biography summary</label><textarea rows={4} value={aboutData.description} onChange={e => setAboutData({...aboutData, description: e.target.value})} className="w-full p-4 rounded-xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:border-navy"></textarea></div>
              <div><label className="block text-sm font-medium mb-2 text-gray-500">Profile Image URL (/profile.jpg)</label><input type="text" value={aboutData.image_url} onChange={e => setAboutData({...aboutData, image_url: e.target.value})} className="w-full p-4 rounded-xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:border-navy" /></div>
              <button onClick={handleSaveAbout} disabled={loading} className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-navy-dark transition-colors shadow-lg"><Save size={18} /> {loading ? "Saving..." : "Update Base Info"}</button>
            </div>
          </div>
        )}

        {/* DATA TABLES */}
        {activeTab !== "about" && (
          <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : data.length === 0 ? <div className="p-8 text-center text-gray-500">No entries found. Click "Add New".</div> : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-500">
                    <th className="p-4 font-medium">Main Header</th>
                    <th className="p-4 font-medium">Details</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id} className="border-b border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-navy dark:text-blue-400">{row.title || row.company || row.institution || row.user_email}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate">
                        {/* Show file name if it's an AI document! */}
                        {activeTab === "ai_knowledge" && row.file_url ? (
                          <a href={row.file_url} target="_blank" className="flex items-center gap-1 text-blue-500 hover:underline"><Download size={14}/> {row.file_name}</a>
                        ) : (
                          <>{row.role || row.degree || row.status || row.date || row.tech_stack || row.youtube_id || row.content || "No extra details"}{row.duration || row.years ? ` (${row.duration || row.years})` : ""}</>
                        )}
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        {activeTab === "requests" && row.status === "Pending" && <button className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-bold"><CheckCircle size={14}/> Approve</button>}
                        {activeTab !== "requests" && <button onClick={() => handleEdit(row)} className="p-2 text-navy hover:text-navy-dark transition-colors"><Edit size={16} /></button>}
                        <button onClick={() => handleDelete(row.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* DYNAMIC POP-UP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 capitalize">{editingId ? "Edit" : "Add New"} {activeTab.replace("_", " ")}</h2>
            
            <div className="space-y-4">
              
              {/* AI KNOWLEDGE BASE INPUTS WITH FILE UPLOAD */}
              {activeTab === "ai_knowledge" && (
                <>
                  <input type="text" placeholder="Document Name (e.g. Course Syllabus)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" />
                  
                  {/* The File Upload Button! */}
                  <div className="w-full p-4 rounded-xl border-2 border-dashed border-black/20 dark:border-white/20 bg-gray-50 dark:bg-white/5 text-center">
                    <input type="file" id="file-upload" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)} />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-navy transition-colors">
                      <Paperclip size={24} />
                      <span className="text-sm font-medium">{uploadFile ? uploadFile.name : formData.file_name ? `Current file: ${formData.file_name}` : "Click to upload a PDF or Word Doc"}</span>
                    </label>
                  </div>

                  <div className="relative flex items-center justify-center my-4">
                    <div className="absolute border-t border-gray-300 dark:border-gray-700 w-full"></div>
                    <span className="relative bg-white dark:bg-[#0a0a0a] px-4 text-xs text-gray-400 uppercase tracking-widest">Or paste text</span>
                  </div>

                  <textarea placeholder="Paste plain text, rules, and facts you want the AI to know here..." rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none"></textarea>
                </>
              )}

              {/* ... (Other inputs remain exactly the same) ... */}
              {activeTab !== "ai_knowledge" && (
                <>
                  {activeTab === "experience" && (
                    <><input type="text" placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" /><input type="text" placeholder="Role / Job Title" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" /><input type="text" placeholder="Duration" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" /></>
                  )}
                  {activeTab === "education" && (
                    <><input type="text" placeholder="Institution" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" /><input type="text" placeholder="Degree" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" /><input type="text" placeholder="Years" value={formData.years} onChange={e => setFormData({...formData, years: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" /></>
                  )}
                  {activeTab !== "experience" && activeTab !== "education" && (
                    <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" />
                  )}
                  {(activeTab === "courses" || activeTab === "workshops") && (
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none">
                      <option value="Upcoming">Upcoming</option>
                      <option value="Active Now">Active Now</option>
                      <option value="Archived">Archived</option>
                    </select>
                  )}
                  {activeTab === "courses" && <input type="text" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" />}
                  {activeTab === "projects" && (
                    <><input type="text" placeholder="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" /><input type="text" placeholder="Tech Stack" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" /><input type="text" placeholder="External Link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" /></>
                  )}
                  {(activeTab === "talks" || activeTab === "workshops" || activeTab === "blog" || activeTab === "courses") && <input type="text" placeholder="Date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" />}
                  {(activeTab === "courses" || activeTab === "workshops") && <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none" />}
                  {activeTab !== "education" && activeTab !== "video_courses" && (
                    <textarea placeholder="Description" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border border-black/20 bg-transparent outline-none"></textarea>
                  )}
                </>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => {setIsModalOpen(false); setEditingId(null); setUploadFile(null); setFormData(defaultForm);}} className="px-5 py-2 text-gray-500 bg-gray-100 dark:bg-white/5 rounded-xl transition-colors font-medium">Cancel</button>
              
              <button onClick={handleSave} disabled={isUploading} className="flex items-center gap-2 px-5 py-2 bg-navy text-white rounded-xl hover:bg-navy-dark transition-colors font-medium shadow-lg disabled:bg-gray-400">
                {isUploading && <Loader2 size={16} className="animate-spin" />}
                {isUploading ? "Uploading..." : editingId ? "Update Changes" : "Save to Database"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}