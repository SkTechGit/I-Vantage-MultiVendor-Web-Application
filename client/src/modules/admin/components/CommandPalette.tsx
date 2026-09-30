"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Newspaper,
  Images,
  FolderOpen,
  Briefcase,
  Users,
  ClipboardList,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Quick Actions";
  href: string;
  icon: typeof LayoutDashboard;
  keywords?: string[];
}

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: "nav-dashboard",
    title: "Dashboard Overview",
    subtitle: "High-level metrics and recent customer leads",
    category: "Navigation",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    keywords: ["home", "stats", "kpi", "overview"],
  },
  {
    id: "nav-blogs",
    title: "Blogs & Articles",
    subtitle: "Manage editorial articles, drafts, and categories",
    category: "Navigation",
    href: "/admin/blogs",
    icon: Newspaper,
    keywords: ["content", "cms", "posts", "write"],
  },
  {
    id: "nav-media",
    title: "Media Asset Library",
    subtitle: "Browse and upload Cloudinary image assets",
    category: "Navigation",
    href: "/admin/media",
    icon: Images,
    keywords: ["images", "photos", "gallery", "upload"],
  },
  {
    id: "nav-categories",
    title: "Service Categories",
    subtitle: "Organize taxonomy and business offerings",
    category: "Navigation",
    href: "/admin/categories",
    icon: FolderOpen,
    keywords: ["taxonomy", "groups", "sectors"],
  },
  {
    id: "nav-services",
    title: "Business Services",
    subtitle: "Configure services, pricing, and descriptions",
    category: "Navigation",
    href: "/admin/services",
    icon: Briefcase,
    keywords: ["products", "catalog", "offerings"],
  },
  {
    id: "nav-leads",
    title: "Customer Leads",
    subtitle: "Review incoming customer inquiries and contacts",
    category: "Navigation",
    href: "/admin/leads",
    icon: Users,
    keywords: ["inquiries", "contacts", "clients"],
  },
  {
    id: "nav-crm",
    title: "CRM Pipeline",
    subtitle: "Track follow-ups, lead stages, and deal statuses",
    category: "Navigation",
    href: "/admin/crm",
    icon: ClipboardList,
    keywords: ["pipeline", "sales", "deals", "stages"],
  },
  {
    id: "nav-team",
    title: "Team & Role Access",
    subtitle: "Manage administrators, invitations, and permissions",
    category: "Navigation",
    href: "/admin/team",
    icon: ShieldCheck,
    keywords: ["users", "security", "invites", "superadmin"],
  },
  {
    id: "action-new-blog",
    title: "Write New Blog Article",
    subtitle: "Open the rich text editor to compose an article",
    category: "Quick Actions",
    href: "/admin/blogs",
    icon: PlusCircle,
    keywords: ["create", "publish"],
  },
  {
    id: "action-add-service",
    title: "Create New Service",
    subtitle: "Add a new business service listing",
    category: "Quick Actions",
    href: "/admin/services",
    icon: PlusCircle,
    keywords: ["create", "new", "offering"],
  },
  {
    id: "action-invite-admin",
    title: "Invite Team Member",
    subtitle: "Send an invitation link to a colleague",
    category: "Quick Actions",
    href: "/admin/team",
    icon: PlusCircle,
    keywords: ["invite", "colleague", "role"],
  },
];

export default function CommandPalette({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return COMMAND_ITEMS;
    const q = query.toLowerCase().trim();
    return COMMAND_ITEMS.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev + 1 >= filteredItems.length ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev - 1 < 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          router.push(selected.href);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-100 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search pages, operations, tools..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 mr-2"
            >
              Clear
            </button>
          )}
          <span className="text-[11px] font-medium tracking-wide text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Sparkles className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium">No matching commands found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for &quot;leads&quot;, &quot;services&quot;, or &quot;blogs&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors duration-100 ${
                      isSelected
                        ? "bg-blue-50/80 text-blue-900"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                          isSelected
                            ? "bg-[#2563EB] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">
                            {item.title}
                          </p>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${
                              item.category === "Quick Actions"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        {item.subtitle && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <ArrowRight className="h-4 w-4 text-[#2563EB] shrink-0 ml-2 animate-in fade-in" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Navigate:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-600">
              ↑
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-600">
              ↓
            </kbd>
            <span className="ml-2">Select:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-600">
              ↵ Enter
            </kbd>
          </div>
          <span className="text-slate-400">i-VANTAGE Command System</span>
        </div>
      </div>
    </div>
  );
}
