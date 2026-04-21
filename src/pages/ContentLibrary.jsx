import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, BookOpen, Search, Zap, Hash, Library } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ContentItemCard from "@/components/library/ContentItemCard";
import AddContentModal from "@/components/library/AddContentModal";

const TYPE_TABS = [
  { key: "all",      label: "All",       icon: Library },
  { key: "template", label: "Templates", icon: BookOpen },
  { key: "hook",     label: "Hooks",     icon: Zap },
  { key: "thread",   label: "Threads",   icon: Hash },
];

export default function ContentLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const data = await base44.entities.ContentItem.list("-created_date");
    setItems(data);
    setLoading(false);
  }

  async function handleSave(itemData) {
    const created = await base44.entities.ContentItem.create(itemData);
    setItems(prev => [created, ...prev]);
  }

  async function handleDelete(id) {
    await base44.entities.ContentItem.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  const filtered = items.filter(item => {
    const matchType = typeFilter === "all" || item.type === typeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q) || item.tags?.some(t => t.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  const counts = {
    all: items.length,
    template: items.filter(i => i.type === "template").length,
    hook: items.filter(i => i.type === "hook").length,
    thread: items.filter(i => i.type === "thread").length,
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Library className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">Content Library</span>
            <span className="text-xs bg-xblue/10 border border-xblue/30 text-xblue px-2 py-0.5 rounded-full font-semibold">{items.length} saved</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 bg-xblue text-black text-sm font-black px-4 py-1.5 rounded-full hover:bg-xblue/90 transition-all"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search templates, hooks, threads..."
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {TYPE_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setTypeFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    typeFilter === tab.key
                      ? "bg-xblue text-black border-xblue"
                      : "border-border text-muted-foreground hover:border-xblue/40 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="opacity-60 text-xs">{counts[tab.key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-xblue rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Library className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-semibold">
              {search ? "No results found" : "Your library is empty"}
            </p>
            {!search && (
              <button
                onClick={() => setAddOpen(true)}
                className="bg-xblue text-black font-bold px-6 py-2.5 rounded-full hover:bg-xblue/90 transition-all text-sm"
              >
                Add Your First Item
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map(item => (
                <ContentItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AddContentModal open={addOpen} onClose={() => setAddOpen(false)} onSave={handleSave} />
    </div>
  );
}