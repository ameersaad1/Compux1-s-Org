import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { 
  User, 
  Post, 
  Badge, 
  Resource, 
  Report, 
  EventItem, 
  StudyGroup, 
  DirectMessage, 
  NotificationItem, 
  AppView 
} from './types';
import { translations } from './i18n';

export const ALL_BADGES: Badge[] = [
  {
    id: "b_code",
    name: "Code Master",
    nameAr: "خبير البرمجة",
    desc: "Authored 50+ code snippets & technical discussions",
    descAr: "نشر أكثر من 50 نموذجاً برمجياً ومناقشة تقنية",
    emoji: "💻",
    color: "#6d5ef5",
    earnedAt: "Aug 2026",
  },
  {
    id: "b_mentor",
    name: "Campus Mentor",
    nameAr: "مرشد أكاديمي",
    desc: "Guided 20+ junior students through projects",
    descAr: "أرشد أكثر من 20 طالباً مستجداً في مشاريعهم",
    emoji: "🌟",
    color: "#f59e0b",
    earnedAt: "Jul 2026",
  },
  {
    id: "b_event",
    name: "Event Lead",
    nameAr: "منظم فعاليات",
    desc: "Organized 5+ campus hackathons & meetups",
    descAr: "نظم أكثر من 5 ملتقيات وهاكاثونات جامعية",
    emoji: "🎯",
    color: "#3b82f6",
    earnedAt: "Jun 2026",
  },
  {
    id: "b_research",
    name: "Top Researcher",
    nameAr: "باحث متميز",
    desc: "Published academic paper and shared research notes",
    descAr: "نشر ورقة بحثية وشارك ملخصات المذاكرة المعتمدة",
    emoji: "🔬",
    color: "#22c55e",
    earnedAt: "May 2026",
  },
  {
    id: "b_design",
    name: "UI/UX Artisan",
    nameAr: "فنان واجهات وتجربة",
    desc: "Contributed campus design systems & prototypes",
    descAr: "ساهم في تصاميم ومخططات الأنظمة الجامعية",
    emoji: "🎨",
    color: "#ec4899",
    earnedAt: "Apr 2026",
  },
  {
    id: "b_fresh",
    name: "New Student",
    nameAr: "طالب جديد",
    desc: "Joined the official campus network",
    descAr: "انضم رسمياً لشبكة الحرم الجامعي",
    emoji: "🌱",
    color: "#10b981",
    earnedAt: "Sep 2026",
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: "dev",
    email: "dev@compux.edu",
    password: "compux_admin",
    name: "Ameer Saad (Dev)",
    handle: "ameer_dev",
    role: "Lead Platform Engineer",
    bio: "Computer Science & Engineering | Building the next generation campus social network at Compux.",
    university: "Baghdad University",
    faculty: "College of Engineering",
    major: "Computer Engineering",
    studyLevel: "Senior",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format",
    coverUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=900&h=300&fit=crop&auto=format",
    isAdmin: true,
    isVerified: true,
    verificationPending: false,
    verificationColor: "#7c3aed",
    followers: ["u_sarah", "u_omar", "u_nour"],
    following: ["u_sarah", "u_omar"],
    postCount: 14,
    studyHours: 120,
    badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[2]],
    github: "https://github.com/ameersaad1",
    linkedin: "https://linkedin.com",
    phone: "+964 770 123 4567",
    phoneVerified: true,
    showPhone: false,
    banned: false,
  },
  {
    id: "u_sarah",
    email: "sarah@compux.edu",
    password: "password123",
    name: "Sarah Al-Hassan",
    handle: "sarah_tech",
    role: "AI & Data Science Student",
    bio: "Deep Learning enthusiast | President of Google Developer Student Club | Passionate about NLP.",
    university: "Technology University",
    faculty: "College of Information Technology",
    major: "Artificial Intelligence",
    studyLevel: "Junior",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format",
    coverUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&h=300&fit=crop&auto=format",
    isAdmin: false,
    isVerified: true,
    verificationPending: false,
    verificationColor: "#22c55e",
    followers: ["dev", "u_omar"],
    following: ["dev"],
    postCount: 9,
    studyHours: 85,
    badges: [ALL_BADGES[0], ALL_BADGES[3]],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    phone: "+964 771 987 6543",
    phoneVerified: true,
    showPhone: true,
    banned: false,
  },
  {
    id: "u_omar",
    email: "omar@compux.edu",
    password: "password123",
    name: "Omar K. Al-Bayati",
    handle: "omar_dev",
    role: "Software Architect",
    bio: "React, TypeScript & Rust fanatic. Love building fast, accessible web platforms.",
    university: "Baghdad University",
    faculty: "College of Science",
    major: "Computer Science",
    studyLevel: "Senior",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=300&fit=crop&auto=format",
    isAdmin: false,
    isVerified: true,
    verificationPending: false,
    verificationColor: "#3b82f6",
    followers: ["dev"],
    following: ["dev", "u_sarah"],
    postCount: 7,
    studyHours: 92,
    badges: [ALL_BADGES[0]],
    github: "https://github.com",
    phoneVerified: false,
    showPhone: false,
    banned: false,
  },
  {
    id: "u_nour",
    email: "nour@compux.edu",
    password: "password123",
    name: "Nour Tariq",
    handle: "nour_ui",
    role: "UX/UI Designer & Researcher",
    bio: "Transforming complex academic workflows into delightful, human-friendly experiences.",
    university: "Mustansiriyah University",
    faculty: "College of Fine Arts & Design",
    major: "Digital Media Design",
    studyLevel: "Sophomore",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&auto=format",
    coverUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&h=300&fit=crop&auto=format",
    isAdmin: false,
    isVerified: false,
    verificationPending: true,
    verificationColor: "#7c3aed",
    followers: ["dev", "u_sarah"],
    following: ["dev"],
    postCount: 4,
    studyHours: 46,
    badges: [ALL_BADGES[4], ALL_BADGES[5]],
    banned: false,
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 101,
    authorId: "dev",
    content: "🚀 Welcome to the rebuilt and optimized version of Compux! We've streamlined our component hierarchy, balanced all layout dimensions, integrated RTL Arabic support, and polished the student social experience. Explore our study circles and share your notes! #Compux #CampusLife #WebDev",
    time: "10m ago",
    likes: 42,
    shares: 11,
    comments: [
      {
        id: 1001,
        authorId: "u_sarah",
        text: "The new layout looks super sleek and runs with zero lag! Amazing work.",
        time: "5m ago",
        likes: 6,
        replies: []
      },
      {
        id: 1002,
        authorId: "u_omar",
        text: "Loving the typography and spacing system. Truly modern campus platform.",
        time: "3m ago",
        likes: 4,
        replies: []
      }
    ],
    hashtags: ["Compux", "CampusLife", "WebDev"],
    tag: "Announcement",
    tagColor: "#6d5ef5",
    pinned: true,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format"
  },
  {
    id: 102,
    authorId: "u_sarah",
    content: "We're hosting a hands-on workshop this Thursday on Fine-tuning Open LLMs for Arabic NLP tasks. Everyone interested in AI and Data Science is invited! Check out the event page to RSVP. #ArtificialIntelligence #NLP #MachineLearning",
    time: "1h ago",
    likes: 29,
    shares: 8,
    comments: [
      {
        id: 1003,
        authorId: "dev",
        text: "Count me in! Let me know if you need projector or venue prep.",
        time: "45m ago",
        likes: 2,
        replies: []
      }
    ],
    hashtags: ["ArtificialIntelligence", "NLP", "MachineLearning"],
    tag: "Workshop",
    tagColor: "#3b82f6"
  },
  {
    id: 103,
    authorId: "u_omar",
    content: "Just uploaded the complete exam review summary for Advanced Algorithms & Data Structures (Graph Theory, Dynamic Programming, Complexity Analysis). Available in the study resources section. #Algorithms #DataStructures #StudyGuide",
    time: "3h ago",
    likes: 38,
    shares: 19,
    comments: [],
    hashtags: ["Algorithms", "DataStructures", "StudyGuide"],
    tag: "Resource",
    tagColor: "#22c55e"
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 201,
    title: "Annual Campus Hackathon 2026",
    category: "Competition",
    description: "48-hour collaborative buildathon solving local urban & educational challenges.",
    date: "Sep 18, 2026",
    time: "10:00 AM",
    location: "Main Engineering Hall B",
    emoji: "⚡",
    color: "#6d5ef5",
    attending: ["dev", "u_sarah", "u_omar"],
    hashtags: ["Hackathon", "Buildathon"]
  },
  {
    id: 202,
    title: "Hands-on Arabic NLP Workshop",
    category: "Workshop",
    description: "Learn modern tokenization, transformer architectures, and fine-tuning datasets.",
    date: "Sep 12, 2026",
    time: "02:00 PM",
    location: "Computer Lab 4",
    emoji: "🤖",
    color: "#3b82f6",
    attending: ["dev", "u_sarah"],
    hashtags: ["NLP", "AI"]
  },
  {
    id: 203,
    title: "Open Source Club Meetup",
    category: "Networking",
    description: "Contributing to your first open-source project and writing clear pull requests.",
    date: "Sep 22, 2026",
    time: "04:30 PM",
    location: "Student Innovation Lounge",
    emoji: "🌐",
    color: "#10b981",
    attending: ["u_omar", "u_nour"],
    hashtags: ["OpenSource", "GitHub"]
  }
];

export const INITIAL_GROUPS: StudyGroup[] = [
  {
    id: "g_algo",
    name: "Advanced Algorithms Cohort",
    subject: "Computer Science · Dr. Tariq",
    members: ["dev", "u_omar", "u_sarah"],
    maxMembers: 12,
    nextSession: "Tomorrow, 4:00 PM",
    color: "#6d5ef5",
    active: true,
  },
  {
    id: "g_ai",
    name: "Computer Vision & Deep Learning",
    subject: "Artificial Intelligence · Lab 2",
    members: ["u_sarah", "dev"],
    maxMembers: 8,
    nextSession: "Wednesday, 6:00 PM",
    color: "#3b82f6",
    active: true,
  },
  {
    id: "g_calc",
    name: "Applied Calculus & Linear Algebra",
    subject: "Mathematics & Physics Dept",
    members: ["u_nour"],
    maxMembers: 15,
    nextSession: "Sunday, 11:00 AM",
    color: "#f59e0b",
    active: false,
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: "r_1",
    title: "Data Structures & Graph Algorithms Comprehensive Guide",
    subject: "Computer Science",
    fileType: "pdf",
    downloads: 148,
    uploadedBy: "u_omar",
    uploadedAt: "Aug 28, 2026",
  },
  {
    id: "r_2",
    title: "Machine Learning & PyTorch Practical Labs Notes",
    subject: "Artificial Intelligence",
    fileType: "pdf",
    downloads: 94,
    uploadedBy: "u_sarah",
    uploadedAt: "Sep 01, 2026",
  },
  {
    id: "r_3",
    title: "Operating Systems Lecture Slides & Past Exams",
    subject: "Computer Engineering",
    fileType: "ppt",
    downloads: 62,
    uploadedBy: "dev",
    uploadedAt: "Aug 20, 2026",
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: "rep_1",
    postId: 103,
    reportedBy: "u_nour",
    reason: "Verify textbook copyright licensing notice",
    status: "pending",
    createdAt: "Sep 03, 2026",
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    type: "like",
    fromId: "u_sarah",
    text: "Sarah Al-Hassan liked your post",
    time: "5m ago",
    read: false,
  },
  {
    id: "notif_2",
    type: "comment",
    fromId: "u_omar",
    text: "Omar K. commented: 'Loving the typography and spacing system.'",
    time: "15m ago",
    read: false,
  },
  {
    id: "notif_3",
    type: "event",
    fromId: "u_sarah",
    text: "New RSVP registered for Hands-on Arabic NLP Workshop",
    time: "1h ago",
    read: true,
  }
];

export const INITIAL_DMS: DirectMessage[] = [
  {
    userId: "u_sarah",
    unread: 1,
    messages: [
      { from: "u_sarah", text: "Hey Ameer! Are we still reviewing the platform layout today?", time: "11:20 AM" },
      { from: "dev", text: "Yes! All components are being neatly structured now.", time: "11:25 AM" },
      { from: "u_sarah", text: "Awesome, let me know when it's live!", time: "11:28 AM" },
    ]
  },
  {
    userId: "u_omar",
    unread: 0,
    messages: [
      { from: "u_omar", text: "I shared the algorithm notes with the study group.", time: "Yesterday" },
      { from: "dev", text: "Great, I'll pin them to the resources tab.", time: "Yesterday" }
    ]
  }
];

export const ANALYTICS = {
  dailyUsers: [142, 168, 195, 230, 280, 340, 420, 490, 560, 620, 710, 840],
  labels: [
    "Aug 24", "Aug 26", "Aug 28", "Aug 30", 
    "Sep 01", "Sep 02", "Sep 03", "Sep 04", 
    "Sep 05", "Sep 06", "Sep 07", "Sep 08"
  ],
  dailyPosts: [18, 25, 32, 28, 45, 52, 64, 58, 70, 85, 94, 110]
};

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  groups: StudyGroup[];
  setGroups: React.Dispatch<React.SetStateAction<StudyGroup[]>>;
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  dms: DirectMessage[];
  setDms: React.Dispatch<React.SetStateAction<DirectMessage[]>>;
  likedPosts: Set<number>;
  toggleLike: (postId: number) => Promise<void>;
  followUser: (targetId: string) => Promise<void>;
  isFollowing: (targetId: string) => boolean;
  view: AppView;
  setView: (view: AppView) => void;
  viewUserId: string | null;
  setViewUserId: (id: string | null) => void;
  activePostModal: number | null;
  setActivePostModal: (id: number | null) => void;
  activeHashtag: string;
  setActiveHashtag: (tag: string) => void;
  dark: boolean;
  setDark: (val: boolean | ((prev: boolean) => boolean)) => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  t: typeof translations['ar'];
  toast: string | null;
  showToast: (msg: string) => void;
  getUserById: (id: string) => User | undefined;
  addPost: (content: string, hashtags: string[], image?: string) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
  addComment: (postId: number, text: string, parentCommentId?: number) => Promise<void>;
  verifyUser: (userId: string, status: boolean, color?: string) => Promise<void>;
  banUser: (userId: string) => Promise<void>;
  requestVerification: () => Promise<void>;
  verifyPhone: (userId: string, phone: string) => void;
  resolveReport: (reportId: string, action: 'delete' | 'warn' | 'dismiss') => Promise<void>;
  addReport: (postId: number, reason: string) => Promise<void>;
  sendDM: (targetUserId: string, text: string) => Promise<void>;
  incrementDownload: (resourceId: string) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
  registerUser: (data: { email: string; password: string; name: string; university?: string; faculty?: string; major?: string; studyLevel?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  uploadUserPhoto: (type: 'avatar' | 'cover', file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  reportUser: (targetUserId: string, reason: string) => Promise<{ success: boolean; message?: string }>;
  handleNotificationClick: (notif: NotificationItem) => void;
  markAllNotificationsRead: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Session hydration from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('compux_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [groups, setGroups] = useState<StudyGroup[]>(INITIAL_GROUPS);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [dms, setDms] = useState<DirectMessage[]>(INITIAL_DMS);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set([101]));
  const [view, setView] = useState<AppView>('feed');
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [activePostModal, setActivePostModal] = useState<number | null>(null);
  const [activeHashtag, setActiveHashtag] = useState<string>('Compux');
  const [dark, setDark] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [toast, setToast] = useState<string | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  // Sync RTL / LTR on html element
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Initial fetch from Server Persistent DB
  useEffect(() => {
    async function loadServerData() {
      try {
        const res = await fetch('/api/init');
        if (res.ok) {
          const data = await res.json();
          if (data.users) setUsers(data.users);
          if (data.posts) {
            setPosts(data.posts);
            // Restore liked posts for current user
            if (currentUser) {
              const likedIds = data.posts
                .filter((p: any) => p.likedBy?.includes(currentUser.id))
                .map((p: any) => p.id);
              setLikedPosts(new Set(likedIds));
            }
          }
          if (data.events) setEvents(data.events);
          if (data.groups) setGroups(data.groups);
          if (data.resources) setResources(data.resources);
          if (data.reports) setReports(data.reports);
          if (data.notifications) setNotifications(data.notifications);
          if (data.dms) setDms(data.dms);

          // Update current user object if fresh copy exists in DB
          if (currentUser) {
            const fresh = data.users.find((u: any) => u.id === currentUser.id);
            if (fresh) {
              setCurrentUser(fresh);
              localStorage.setItem('compux_session_user', JSON.stringify(fresh));
            }
          }
          // Verify and restore authenticated session via secure HttpOnly cookie
          try {
            const meRes = await fetch('/api/auth/me');
            if (meRes.ok) {
              const meData = await meRes.json();
              if (meData.authenticated && meData.user) {
                setCurrentUser(meData.user);
                localStorage.setItem('compux_session_user', JSON.stringify(meData.user));
              }
            }
          } catch {
            // Ignore if offline
          }
        }
      } catch (err) {
        console.warn("Could not connect to /api/init, running on local fallback state", err);
      }
    }

    loadServerData();
  }, []);

  // Sync session in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('compux_session_user', JSON.stringify(currentUser));
      // Refresh likes according to current user
      const likedIds = posts
        .filter((p) => p.likedBy?.includes(currentUser.id))
        .map((p) => p.id);
      setLikedPosts(new Set(likedIds));
    } else {
      localStorage.removeItem('compux_session_user');
      setLikedPosts(new Set());
    }
  }, [currentUser?.id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getUserById = (id: string) => {
    return users.find((u) => u.id === id);
  };

  // REAL REGISTER WITH SERVER PERSISTENCE
  const registerUser = async (data: {
    email: string;
    password: string;
    name: string;
    university?: string;
    faculty?: string;
    major?: string;
    studyLevel?: string;
    phone?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();

      if (!res.ok) {
        return { success: false, error: resData.error || 'فشل إنشاء الحساب' };
      }

      const newUser: User = resData.user;
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      showToast(lang === 'ar' ? 'تم تسجيل حسابك الجامعي وتثبيته في السيرفر بنجاح! 🎓' : 'Account registered and securely persisted to server! 🎓');
      return { success: true };
    } catch (err) {
      // Offline fallback
      const baseClean = data.name.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'student';
      const fallbackUser: User = {
        id: `u_${Date.now()}`,
        email: data.email,
        password: data.password,
        name: data.name,
        handle: baseClean,
        role: data.major ? `${data.major} Student` : 'Student',
        bio: `طالب في ${data.university || 'الجامعة'} · تخصص ${data.major || 'عام'}.`,
        university: data.university || 'Baghdad University',
        faculty: data.faculty || 'College of Engineering',
        major: data.major || 'Computer Science',
        studyLevel: data.studyLevel || 'Freshman',
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format",
        coverUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&h=300&fit=crop&auto=format",
        isAdmin: false,
        isVerified: false,
        verificationPending: false,
        verificationColor: "#7c3aed",
        followers: [],
        following: ["dev"],
        postCount: 0,
        studyHours: 0,
        badges: [ALL_BADGES[5]],
        phone: data.phone || "",
        phoneVerified: false,
        showPhone: false,
        banned: false,
      };
      setUsers((prev) => [...prev, fallbackUser]);
      setCurrentUser(fallbackUser);
      return { success: true };
    }
  };

  // REAL LOGIN CHECKING SERVER DATABASE
  const loginUser = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const resData = await res.json();

      if (!res.ok) {
        return { success: false, error: resData.error || 'البريد أو كلمة المرور غير صحيحة' };
      }

      const user: User = resData.user;
      setCurrentUser(user);
      showToast(lang === 'ar' ? `أهلاً بك مجدداً ${user.name}! ✨` : `Welcome back ${user.name}! ✨`);
      return { success: true };
    } catch (err) {
      // Local fallback lookup
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === pass);
      if (found) {
        setCurrentUser(found);
        return { success: true };
      }
      return { success: false, error: 'تعذر الاتصال بالسيرفر، يرجى المحاولة لاحقاً.' };
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setCurrentUser(null);
    localStorage.removeItem('compux_session_user');
    setView('feed');
    showToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Logged out successfully.');
  };

  // REAL LIKES ENGINE WITH SERVER PERSISTENCE & AUTHOR NOTIFICATION
  const toggleLike = async (postId: number) => {
    if (!currentUser) return;

    // Optimistic UI state
    setLikedPosts((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(postId);
      if (isLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isCurrentlyLiked = p.likedBy?.includes(currentUser.id) ?? false;
          const updatedLikedBy = isCurrentlyLiked
            ? (p.likedBy || []).filter((id) => id !== currentUser.id)
            : [...(p.likedBy || []), currentUser.id];
          return {
            ...p,
            likes: Math.max(0, p.likes + (isCurrentlyLiked ? -1 : 1)),
            likedBy: updatedLikedBy,
          };
        }
        return p;
      })
    );

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.post) {
          setPosts((prev) => prev.map((p) => (p.id === postId ? data.post : p)));
        }
        // Refresh notifications
        const notifRes = await fetch(`/api/notifications?userId=${currentUser.id}`);
        if (notifRes.ok) {
          setNotifications(await notifRes.json());
        }
      }
    } catch (err) {
      console.warn("Could not sync like with server:", err);
    }
  };

  // FOLLOW USER WITH SERVER PERSISTENCE
  const followUser = async (targetId: string) => {
    if (!currentUser || currentUser.id === targetId) return;
    const currentlyFollowing = isFollowing(targetId);

    const updatedCurrent: User = {
      ...currentUser,
      following: currentlyFollowing
        ? currentUser.following.filter((id) => id !== targetId)
        : [...currentUser.following, targetId]
    };

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) return updatedCurrent;
        if (u.id === targetId) {
          return {
            ...u,
            followers: currentlyFollowing
              ? u.followers.filter((id) => id !== currentUser.id)
              : [...u.followers, currentUser.id]
          };
        }
        return u;
      })
    );
    setCurrentUser(updatedCurrent);
    showToast(currentlyFollowing 
      ? (lang === 'ar' ? "تم إلغاء المتابعة" : "Unfollowed student") 
      : (lang === 'ar' ? "تمت المتابعة بنجاح! 🎉" : "Following student! 🎉"));

    try {
      await fetch(`/api/users/${targetId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId: currentUser.id })
      });
    } catch (err) {
      console.warn("Follow server error:", err);
    }
  };

  const isFollowing = (targetId: string) => {
    if (!currentUser) return false;
    return currentUser.following.includes(targetId);
  };

  // REAL POST CREATION
  const addPost = async (content: string, hashtags: string[], image?: string) => {
    if (!currentUser) return;

    const newPost: Post = {
      id: Date.now(),
      authorId: currentUser.id,
      content,
      time: "الآن",
      likes: 0,
      likedBy: [],
      shares: 0,
      comments: [],
      hashtags: hashtags.length > 0 ? hashtags : ["CampusLife"],
      image,
      tag: "General",
      tagColor: "#6d5ef5",
      createdAt: new Date().toISOString()
    };

    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => prev ? { ...prev, postCount: prev.postCount + 1 } : null);
    showToast(lang === 'ar' ? "تم نشر وتثبيت المنشور في السيرفر! ✨" : "Post published to server! ✨");

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          content,
          hashtags,
          image,
          tag: "General",
          tagColor: "#6d5ef5"
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.post) {
          setPosts((prev) => [data.post, ...prev.filter((p) => p.id !== newPost.id)]);
        }
      }
    } catch (err) {
      console.warn("Post sync error:", err);
    }
  };

  // DELETE POST
  const deletePost = async (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast(lang === 'ar' ? "تم حذف المنشور." : "Post deleted.");
    try {
      await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn("Delete post error:", err);
    }
  };

  // REAL COMMENT WITH SERVER PERSISTENCE & NOTIFICATION
  const addComment = async (postId: number, text: string, parentCommentId?: number) => {
    if (!currentUser || !text.trim()) return;

    const newComment = {
      id: Date.now(),
      authorId: currentUser.id,
      text: text.trim(),
      time: "الآن",
      likes: 0,
      replies: []
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          if (parentCommentId) {
            return {
              ...p,
              comments: p.comments.map((c) =>
                c.id === parentCommentId
                  ? { ...c, replies: [...c.replies, newComment] }
                  : c
              )
            };
          }
          return { ...p, comments: [newComment, ...p.comments] };
        }
        return p;
      })
    );

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          text,
          parentCommentId
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.post) {
          setPosts((prev) => prev.map((p) => (p.id === postId ? data.post : p)));
        }
      }
    } catch (err) {
      console.warn("Comment sync error:", err);
    }
  };

  // INTERACTIVE NOTIFICATION CLICK HANDLER
  const handleNotificationClick = async (notif: NotificationItem) => {
    // 1. Mark as read in state
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    // 2. Persist read state on server
    try {
      await fetch(`/api/notifications/${notif.id}/read`, { method: 'PUT' });
    } catch (err) {
      console.warn("Notification read sync error:", err);
    }

    // 3. Smart routing based on notification origin
    if (notif.targetType === 'post' && notif.targetId) {
      setActivePostModal(Number(notif.targetId));
      setView('feed');
    } else if (notif.targetType === 'profile' && notif.targetId) {
      setViewUserId(String(notif.targetId));
      setView('profile');
    } else if (notif.targetType === 'event') {
      setView('events');
    } else if (notif.targetType === 'group') {
      setView('groups');
    } else if (notif.targetType === 'resource') {
      setView('study');
    } else {
      setView('feed');
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id })
      });
    } catch (err) {
      console.warn("Mark all read error:", err);
    }
  };

  const verifyUser = async (userId: string, status: boolean, color?: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              isVerified: status,
              verificationPending: false,
              verificationColor: color || (status ? "#7c3aed" : u.verificationColor)
            }
          : u
      )
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? { ...prev, isVerified: status, verificationPending: false, verificationColor: color || prev.verificationColor }
          : null
      );
    }
    showToast(status ? (lang === 'ar' ? "تمت الموافقة على توثيق الطالب! ✓" : "Student verified! ✓") : "Verification rejected.");

    try {
      await fetch(`/api/users/${userId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, color })
      });
    } catch (err) {
      console.warn("Verify user error:", err);
    }
  };

  const banUser = async (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, banned: !u.banned } : u))
    );
    showToast(lang === 'ar' ? "تم تحديث حالة المستخدم." : "User status updated.");
    try {
      await fetch(`/api/users/${userId}/ban`, { method: 'POST' });
    } catch (err) {
      console.warn("Ban user error:", err);
    }
  };

  const requestVerification = async () => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, verificationPending: true };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast(lang === 'ar' ? "تم إرسال طلب التوثيق للمراجعة! ⏳" : "Verification request submitted! ⏳");

    try {
      await fetch(`/api/users/${currentUser.id}/verify-request`, { method: 'POST' });
    } catch (err) {
      console.warn("Verification request error:", err);
    }
  };

  const verifyPhone = (userId: string, phone: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, phone, phoneVerified: true } : u
      )
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, phone, phoneVerified: true } : null
      );
    }
    showToast(lang === 'ar' ? "تم توثيق رقم الهاتف بنجاح! 📱" : "Phone number verified! 📱");
  };

  const resolveReport = async (reportId: string, action: 'delete' | 'warn' | 'dismiss') => {
    const report = reports.find((r) => r.id === reportId);
    if (report && action === 'delete' && report.postId) {
      deletePost(report.postId);
    }
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    showToast(`Report resolved: ${action}`);

    try {
      await fetch(`/api/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
    } catch (err) {
      console.warn("Resolve report error:", err);
    }
  };

  const addReport = async (postId: number, reason: string) => {
    if (!currentUser) return;
    const newRep: Report = {
      id: "rep_" + Date.now(),
      postId,
      reportedBy: currentUser.id,
      reason,
      status: "pending",
      createdAt: "الآن",
    };
    setReports((prev) => [newRep, ...prev]);
    showToast(lang === 'ar' ? "تم إرسال البلاغ لفريق الإشراف الأكاديمي." : "Report submitted.");

    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, reportedBy: currentUser.id, reason })
      });
    } catch (err) {
      console.warn("Report error:", err);
    }
  };

  const sendDM = async (targetUserId: string, text: string) => {
    if (!currentUser) return;
    const newMsg = { from: currentUser.id, text, time: "الآن" };

    setDms((prev) => {
      const exists = prev.find((d) => d.userId === targetUserId);
      if (exists) {
        return prev.map((d) =>
          d.userId === targetUserId
            ? { ...d, messages: [...d.messages, newMsg] }
            : d
        );
      } else {
        return [
          { userId: targetUserId, unread: 0, messages: [newMsg] },
          ...prev
        ];
      }
    });

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromId: currentUser.id, toId: targetUserId, text })
      });
    } catch (err) {
      console.warn("Send DM error:", err);
    }
  };

  const incrementDownload = async (resourceId: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId ? { ...r, downloads: r.downloads + 1 } : r
      )
    );
    try {
      await fetch(`/api/resources/${resourceId}/download`, { method: 'POST' });
    } catch (err) {
      console.warn("Download error:", err);
    }
  };

  const updateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    showToast(lang === 'ar' ? "تم حفظ وتحديث بيانات حسابك في السيرفر! ✓" : "Profile updated on server! ✓");

    try {
      await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
    } catch (err) {
      console.warn("Update user error:", err);
    }
  };

  // SECURE IMAGE UPLOAD WITH BINARY MAGIC-BYTES & PERMANENT STORAGE
  const uploadUserPhoto = async (type: 'avatar' | 'cover', file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!currentUser) return { success: false, error: 'User not logged in' };

    // Client-side pre-flight size check (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      const err = lang === 'ar' ? 'حجم الصورة يتجاوز الحد الأقصى (5 ميجابايت)' : 'Image size exceeds maximum limit of 5MB';
      showToast(err);
      return { success: false, error: err };
    }

    try {
      // Convert to Base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Optimistic UI preview
      const localUrl = URL.createObjectURL(file);
      const optimisticUser = {
        ...currentUser,
        [type === 'avatar' ? 'avatar' : 'coverUrl']: localUrl
      };
      setCurrentUser(optimisticUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? optimisticUser : u)));

      // Real Server Upload with Magic Bytes inspection
      const res = await fetch(`/api/upload/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          imageBase64: base64Data
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const verifiedUrl = data.url;
      const verifiedUser = {
        ...currentUser,
        [type === 'avatar' ? 'avatar' : 'coverUrl']: verifiedUrl
      };
      setCurrentUser(verifiedUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? verifiedUser : u)));
      showToast(lang === 'ar' ? 'تم فحص وضغط ورفع الصورة بنجاح! 📸' : 'Image verified and uploaded successfully! 📸');

      return { success: true, url: verifiedUrl };
    } catch (err: any) {
      console.error('Upload failed:', err);
      const errMsg = err.message || (lang === 'ar' ? 'فشل فحص ورفع الصورة' : 'Image upload failed');
      showToast(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // REPORT USER TO ADMIN TEAM
  const reportUser = async (targetUserId: string, reason: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/users/${targetUserId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedBy: currentUser?.id,
          reason
        })
      });
      const data = await res.json();
      showToast(lang === 'ar' ? 'تم استلام البلاغ وسيتولى فريق الأمان مراجعته.' : 'Report received and submitted for review.');
      return { success: true, message: data.message };
    } catch (err) {
      showToast(lang === 'ar' ? 'حدث خطأ أثناء إرسال البلاغ.' : 'Error sending report.');
      return { success: false };
    }
  };

  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        posts,
        setPosts,
        events,
        setEvents,
        groups,
        setGroups,
        resources,
        setResources,
        reports,
        setReports,
        notifications,
        setNotifications,
        dms,
        setDms,
        likedPosts,
        toggleLike,
        followUser,
        isFollowing,
        view,
        setView,
        viewUserId,
        setViewUserId,
        activePostModal,
        setActivePostModal,
        activeHashtag,
        setActiveHashtag,
        dark,
        setDark,
        lang,
        setLang,
        t,
        toast,
        showToast,
        getUserById,
        addPost,
        deletePost,
        addComment,
        verifyUser,
        banUser,
        requestVerification,
        verifyPhone,
        resolveReport,
        addReport,
        sendDM,
        incrementDownload,
        updateUser,
        registerUser,
        loginUser,
        logoutUser,
        uploadUserPhoto,
        reportUser,
        handleNotificationClick,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
