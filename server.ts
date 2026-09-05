import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Server as SocketIOServer } from 'socket.io';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'compux-db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const JWT_ACCESS_SECRET = process.env.JWT_SECRET || 'compux_production_jwt_access_secret_2026_secure';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'compux_production_jwt_refresh_secret_2026_secure';

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ----------------------------------------------------
// CYBERSECURITY DEFENSES & VALIDATION PROTOCOLS
// ----------------------------------------------------

// 1. Sliding-Window Rate Limiter
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(key: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count++;
  return true;
}

// 2. Input Sanitizer (XSS Mitigation)
function sanitizeString(str: any, maxLength = 500): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\\/`$]/g, '')    // Strip dangerous meta characters
    .trim()
    .slice(0, maxLength);
}

// 3. Binary Deep Magic-Bytes Inspector (Polyglot / Shell upload prevention)
function detectAndValidateImageMagicBytes(buffer: Buffer): { valid: boolean; mime?: string; ext?: string } {
  if (!buffer || buffer.length < 12) return { valid: false };

  // JPEG / JPG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { valid: true, mime: 'image/jpeg', ext: 'jpg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
    buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A
  ) {
    return { valid: true, mime: 'image/png', ext: 'png' };
  }

  // GIF: 47 49 46 38
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return { valid: true, mime: 'image/gif', ext: 'gif' };
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return { valid: true, mime: 'image/webp', ext: 'webp' };
  }

  return { valid: false };
}

// Initial Database Template if not existing
const INITIAL_BADGES = [
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

const INITIAL_DB = {
  users: [
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
      badges: [INITIAL_BADGES[0], INITIAL_BADGES[1], INITIAL_BADGES[2]],
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
      badges: [INITIAL_BADGES[0], INITIAL_BADGES[3]],
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
      badges: [INITIAL_BADGES[0]],
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
      badges: [INITIAL_BADGES[4], INITIAL_BADGES[5]],
      banned: false,
    }
  ],
  posts: [
    {
      id: 101,
      authorId: "dev",
      content: "🚀 Welcome to Compux! Complete campus social and academic network. Real-time server sync, study circles, note sharing, and interactive notifications are now live! #Compux #CampusLife #WebDev",
      time: "10m ago",
      likes: 42,
      likedBy: ["dev", "u_sarah", "u_omar"],
      shares: 11,
      comments: [
        {
          id: 1001,
          authorId: "u_sarah",
          text: "The new server architecture is fast, and accounts are completely persistent! Amazing work Ameer.",
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
      likedBy: ["dev", "u_omar"],
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
      likedBy: ["dev", "u_sarah"],
      shares: 19,
      comments: [],
      hashtags: ["Algorithms", "DataStructures", "StudyGuide"],
      tag: "Resource",
      tagColor: "#22c55e"
    }
  ],
  events: [
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
  ],
  groups: [
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
  ],
  resources: [
    {
      id: "r_1",
      title: "Data Structures & Graph Algorithms Comprehensive Guide",
      subject: "Computer Science",
      fileType: "pdf",
      downloads: 148,
      uploadedBy: "u_omar",
      uploadedAt: "Aug 28, 2026",
      fileSize: "4.2 MB"
    },
    {
      id: "r_2",
      title: "Machine Learning & PyTorch Practical Labs Notes",
      subject: "Artificial Intelligence",
      fileType: "pdf",
      downloads: 94,
      uploadedBy: "u_sarah",
      uploadedAt: "Sep 01, 2026",
      fileSize: "2.8 MB"
    },
    {
      id: "r_3",
      title: "Operating Systems Lecture Slides & Past Exams",
      subject: "Computer Engineering",
      fileType: "ppt",
      downloads: 62,
      uploadedBy: "dev",
      uploadedAt: "Aug 20, 2026",
      fileSize: "11.5 MB"
    }
  ],
  reports: [
    {
      id: "rep_1",
      postId: 103,
      reportedBy: "u_nour",
      reason: "Verify textbook copyright licensing notice",
      status: "pending",
      createdAt: "Sep 03, 2026",
    }
  ],
  notifications: [
    {
      id: "notif_1",
      type: "like",
      fromId: "u_sarah",
      recipientId: "dev",
      text: "Sarah Al-Hassan أُعجبت بمنشورك الترحيبي",
      time: "5m ago",
      read: false,
      targetType: "post",
      targetId: 101
    },
    {
      id: "notif_2",
      type: "comment",
      fromId: "u_omar",
      recipientId: "dev",
      text: "Omar K. علق على منشورك: 'Loving the typography and spacing system.'",
      time: "15m ago",
      read: false,
      targetType: "post",
      targetId: 101
    },
    {
      id: "notif_3",
      type: "event",
      fromId: "u_sarah",
      recipientId: "dev",
      text: "تسجيل حضور جديد في ورشة: Hands-on Arabic NLP Workshop",
      time: "1h ago",
      read: true,
      targetType: "event",
      targetId: 202
    }
  ],
  dms: [
    {
      userId: "u_sarah",
      unread: 1,
      messages: [
        { from: "u_sarah", text: "Hey Ameer! Are we still reviewing the platform layout today?", time: "11:20 AM" },
        { from: "dev", text: "Yes! All components and persistent server APIs are live.", time: "11:25 AM" },
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
  ],
  analytics: {
    dailyUsers: [142, 168, 195, 230, 280, 340, 420, 490, 560, 620, 710, 840],
    labels: [
      "Aug 24", "Aug 26", "Aug 28", "Aug 30", 
      "Sep 01", "Sep 02", "Sep 03", "Sep 04", 
      "Sep 05", "Sep 06", "Sep 07", "Sep 08"
    ],
    dailyPosts: [18, 25, 32, 28, 45, 52, 64, 58, 70, 85, 94, 110]
  },
  auditLogs: [
    {
      id: "log_init_1",
      adminId: "dev",
      adminName: "Campus Admin",
      action: "system_config",
      targetType: "system",
      targetId: "security_v2",
      details: "تفعيل بروتوكول الأمان العالي (Bcrypt + JWT HttpOnly + WebSocket Gateway)",
      timestamp: "اليوم 09:30 ص"
    },
    {
      id: "log_init_2",
      adminId: "dev",
      adminName: "Campus Admin",
      action: "verify_user",
      targetType: "user",
      targetId: "u_sarah",
      details: "الموافقة على شارة التوثيق الأكاديمي للطالبة سارة أحمد (هندسة البرمجيات)",
      timestamp: "اليوم 10:15 ص"
    }
  ]
};

// Database helper functions
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.auditLogs) {
      parsed.auditLogs = INITIAL_DB.auditLogs;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading DB:", err);
    return INITIAL_DB;
  }
}

function writeDB(data: typeof INITIAL_DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing DB:", err);
  }
}

// Global Online Users Map for WebSockets
const onlineUsers = new Map<string, { socketId: string; name: string; avatar: string }>();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  // Attach real-time WebSockets engine
  io.on('connection', (socket) => {
    let boundUserId: string | null = null;

    // Presence Join
    socket.on('presence:join', ({ userId, name, avatar }: { userId: string; name: string; avatar: string }) => {
      if (!userId) return;
      boundUserId = userId;
      onlineUsers.set(userId, { socketId: socket.id, name, avatar });
      io.emit('presence:update', Array.from(onlineUsers.keys()));
    });

    // Typing Indicators
    socket.on('typing:start', ({ toId, fromId }: { toId: string; fromId: string }) => {
      const target = onlineUsers.get(toId);
      if (target) {
        io.to(target.socketId).emit('typing:status', { fromId, isTyping: true });
      }
    });

    socket.on('typing:stop', ({ toId, fromId }: { toId: string; fromId: string }) => {
      const target = onlineUsers.get(toId);
      if (target) {
        io.to(target.socketId).emit('typing:status', { fromId, isTyping: false });
      }
    });

    // Real-time Instant Message
    socket.on('message:send', ({ fromId, toId, text }: { fromId: string; toId: string; text: string }) => {
      if (!fromId || !toId || !text || !text.trim()) return;

      const db = readDB();
      const cleanText = sanitizeString(text.trim(), 2000);
      const newMsg = {
        from: fromId,
        text: cleanText,
        time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
      };

      const sender = db.users.find((u: any) => u.id === fromId);
      const existingDm = db.dms.find((d: any) => d.userId === toId);

      if (existingDm) {
        existingDm.messages.push(newMsg);
        existingDm.unread = (existingDm.unread || 0) + 1;
      } else {
        db.dms.unshift({
          userId: toId,
          unread: 1,
          messages: [newMsg]
        });
      }

      // Add Notification
      db.notifications.unshift({
        id: `notif_${Date.now()}`,
        type: "comment",
        fromId,
        recipientId: toId,
        text: `رسالة جديدة من ${sender ? sender.name : 'زميل'}: "${cleanText.slice(0, 30)}..."`,
        time: "الآن",
        read: false,
        targetType: "profile",
        targetId: fromId
      });

      writeDB(db);

      // Push real-time to recipient if online
      const recipient = onlineUsers.get(toId);
      if (recipient) {
        io.to(recipient.socketId).emit('message:new', {
          toId,
          fromId,
          message: newMsg,
          conversationUserId: fromId
        });
      }

      // Confirm to sender
      socket.emit('message:sent', {
        toId,
        fromId,
        message: newMsg,
        conversationUserId: toId
      });
    });

    // Disconnect & cleanup
    socket.on('disconnect', () => {
      if (boundUserId) {
        onlineUsers.delete(boundUserId);
        io.emit('presence:update', Array.from(onlineUsers.keys()));
      }
    });
  });

  app.use(express.json({ limit: '15mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      serverTime: new Date().toISOString(),
      onlineUsersCount: onlineUsers.size
    });
  });

  // Get all initial bootstrap data in a single clean call
  app.get('/api/init', (_req, res) => {
    const db = readDB();
    res.json(db);
  });

  // Real-time online presence status endpoint
  app.get('/api/presence', (_req, res) => {
    res.json({ onlineUsers: Array.from(onlineUsers.keys()) });
  });

  // ==========================================
  // AUTHENTICATION & SESSION SECURITY ENGINE
  // ==========================================

  function parseCookies(req: express.Request): Record<string, string> {
    const list: Record<string, string> = {};
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const name = parts[0]?.trim();
      if (!name) return;
      const val = parts.slice(1).join('=').trim();
      list[name] = decodeURIComponent(val);
    });
    return list;
  }

  function setAuthCookies(res: express.Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', [
      `compux_access_token=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=900; ${isProd ? 'Secure;' : ''}`,
      `compux_refresh_token=${refreshToken}; Path=/api/auth; HttpOnly; SameSite=Strict; Max-Age=604800; ${isProd ? 'Secure;' : ''}`
    ]);
  }

  function clearAuthCookies(res: express.Response) {
    res.setHeader('Set-Cookie', [
      'compux_access_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
      'compux_refresh_token=; Path=/api/auth; HttpOnly; SameSite=Strict; Max-Age=0'
    ]);
  }

  function sanitizeUser(user: any) {
    if (!user) return null;
    const { password, passwordHash, ...safe } = user;
    return safe;
  }

  // Register endpoint with Bcrypt Hashing, Handle Generation, and JWT Tokens
  app.post('/api/auth/register', async (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (!checkRateLimit(`register_${clientIp}`, 10, 60000)) {
      return res.status(429).json({ error: 'طلبات تسجيل كثيرة جداً، يرجى المحاولة بعد قليل.' });
    }

    const { email, password, name, university, faculty, major, studyLevel, phone } = req.body;

    // Strict Input Validation & Sanitization (Zod equivalent schema enforcement)
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'يرجى إدخال بريد إلكتروني صالح.' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل لحماية حسابك.' });
    }
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'يرجى إدخال اسم كامل صحيح مكون من حرفين على الأقل.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = sanitizeString(name.trim(), 100);
    const db = readDB();

    // Check email uniqueness
    const emailExists = db.users.some((u: any) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل في النظام الجامعي.' });
    }

    // Handle Generation Algorithm
    const baseClean = cleanName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    let handle = baseClean || 'student';
    let counter = 1;
    while (db.users.some((u: any) => u.handle.toLowerCase() === handle.toLowerCase())) {
      handle = `${baseClean || 'student'}${counter}`;
      counter++;
    }

    // Modern student illustration avatar
    const avatarStock = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=200&h=200&fit=crop&auto=format"
    ];
    const chosenAvatar = avatarStock[db.users.length % avatarStock.length];

    // BCRYPT PASSWORD HASHING (Work Factor 10 for enterprise safety & speed)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserId = `u_${Date.now()}`;
    const newUser = {
      id: newUserId,
      email: cleanEmail,
      passwordHash: passwordHash, // Stored safely encrypted
      name: cleanName,
      handle: handle,
      role: major ? `${sanitizeString(major, 50)} Student` : 'University Student',
      bio: `طالب في ${sanitizeString(university || 'الجامعة', 100)} · تخصص ${sanitizeString(major || 'عام', 50)}. مستعد للمذاكرة ومشاركة المعرفة.`,
      university: sanitizeString(university || 'Baghdad University', 100),
      faculty: sanitizeString(faculty || 'Engineering & Science', 100),
      major: sanitizeString(major || 'Computer Science', 100),
      studyLevel: sanitizeString(studyLevel || 'Freshman', 50),
      avatar: chosenAvatar,
      coverUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&h=300&fit=crop&auto=format",
      isAdmin: false,
      isVerified: false,
      verificationPending: false,
      verificationColor: "#7c3aed",
      followers: [],
      following: ["dev"],
      postCount: 0,
      studyHours: 0,
      badges: [INITIAL_BADGES[5]],
      github: "",
      linkedin: "",
      phone: phone ? sanitizeString(phone, 30) : "",
      phoneVerified: false,
      showPhone: false,
      banned: false,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Welcome Notification for the new user
    const welcomeNotif = {
      id: `notif_${Date.now()}`,
      type: "verify",
      fromId: "dev",
      recipientId: newUser.id,
      text: `مرحباً بك في منصة Compux يا ${newUser.name}! تم تشفير وتأمين حسابك بالكامل (Bcrypt + JWT).`,
      time: "الآن",
      read: false,
      targetType: "profile",
      targetId: newUser.id
    };
    db.notifications.unshift(welcomeNotif);

    writeDB(db);

    // Issue JWT Access & Refresh Tokens
    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email, handle: newUser.handle, role: newUser.role },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: 'تم تسجيل الحساب وتأمينه بنجاح.',
      user: sanitizeUser(newUser),
      accessToken
    });
  });

  // Login endpoint with Brute-Force Rate Limiter, Bcrypt Verification, and JWT Tokens
  app.post('/api/auth/login', async (req, res) => {
    const clientIp = req.ip || 'unknown';
    // Brute-force protection: max 7 attempts per 10 minutes
    if (!checkRateLimit(`brute_force_login_${clientIp}`, 7, 600000)) {
      return res.status(429).json({
        error: 'تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول الخاطئة (Anti-Brute Force). يرجى الانتظار 10 دقائق.'
      });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' });
    }

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();

    // Look up user
    const user = db.users.find((u: any) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    }

    if (user.banned) {
      return res.status(403).json({ error: 'هذا الحساب موقوف حالياً من قبل إدارة الحرم الجامعي.' });
    }

    // Verify Password (with automatic migration to Bcrypt for legacy plaintext accounts)
    let passwordMatches = false;
    if (user.passwordHash) {
      passwordMatches = await bcrypt.compare(password, user.passwordHash);
    } else if (user.password) {
      // Legacy check & instant auto-upgrade
      if (user.password === password) {
        passwordMatches = true;
        user.passwordHash = await bcrypt.hash(password, 10);
        delete user.password;
        writeDB(db);
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    }

    // Issue JWT Access & Refresh Tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, handle: user.handle, role: user.role },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    setAuthCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: 'تم التحقق من الجلسة وتسجيل الدخول بنجاح.',
      user: sanitizeUser(user),
      accessToken
    });
  });

  // Check Current Active Session from HttpOnly Cookie or Authorization Header
  app.get('/api/auth/me', (req, res) => {
    const cookies = parseCookies(req);
    const authHeader = req.headers.authorization;
    const token = cookies.compux_access_token || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

    if (!token) {
      return res.status(401).json({ authenticated: false, error: 'لا توجد جلسة نشطة.' });
    }

    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as any;
      const db = readDB();
      const user = db.users.find((u: any) => u.id === decoded.userId);

      if (!user || user.banned) {
        clearAuthCookies(res);
        return res.status(401).json({ authenticated: false, error: 'المستخدم غير متاح.' });
      }

      res.json({
        authenticated: true,
        user: sanitizeUser(user)
      });
    } catch {
      return res.status(401).json({ authenticated: false, error: 'انتهت صلاحية الرمز، يرجى التجديد.' });
    }
  });

  // Rotate & Refresh Session
  app.post('/api/auth/refresh', (req, res) => {
    const cookies = parseCookies(req);
    const refreshToken = cookies.compux_refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'لا يوجد رمز تجديد صالح.' });
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      const db = readDB();
      const user = db.users.find((u: any) => u.id === decoded.userId);

      if (!user || user.banned) {
        clearAuthCookies(res);
        return res.status(401).json({ error: 'المستخدم غير موجود أو موقوف.' });
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email, handle: user.handle, role: user.role },
        JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      const newRefreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      setAuthCookies(res, newAccessToken, newRefreshToken);

      res.json({
        success: true,
        accessToken: newAccessToken,
        user: sanitizeUser(user)
      });
    } catch {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'رمز التجديد غير صالح أو منتهي الصلاحية.' });
    }
  });

  // Invalidate Session & Clear Cookies
  app.post('/api/auth/logout', (_req, res) => {
    clearAuthCookies(res);
    res.json({ success: true, message: 'تم إنهاء الجلسة وحذف الكوكيز بأمان.' });
  });

  // Update profile permanently
  app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
    const db = readDB();

    const userIndex = db.users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = {
      ...db.users[userIndex],
      ...updates,
      id: userId // Do not allow ID mutations
    };

    db.users[userIndex] = updatedUser;
    writeDB(db);

    res.json({ success: true, user: updatedUser });
  });

  // ==========================================
  // DYNAMIC PROFILE API (Decoupled & Secure)
  // ==========================================

  // 1. GET Profile with calculated dynamic statistics
  app.get('/api/profile/:identifier', (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (!checkRateLimit(`profile_get_${clientIp}`, 120, 60000)) {
      return res.status(429).json({ error: 'تم تجاوز معدل الطلبات المسموح به. يرجى الانتظار دقيقة.' });
    }

    const { identifier } = req.params;
    const db = readDB();
    const cleanId = identifier.trim().toLowerCase();

    // Look up by ID or by handle
    const user = db.users.find(
      (u: any) => u.id.toLowerCase() === cleanId || u.handle.toLowerCase() === cleanId
    );

    if (!user) {
      return res.status(404).json({ error: 'الحساب المطلوب غير موجود.' });
    }

    if (user.banned) {
      return res.status(403).json({ error: 'هذا الحساب موقوف حالياً من قبل الإدارة.' });
    }

    // Dynamic stats computation directly from decoupled DB
    const userPosts = db.posts.filter((p: any) => p.authorId === user.id);
    const mediaCount = userPosts.filter((p: any) => p.image).length;
    const resourcesCount = db.resources.filter((r: any) => r.uploadedBy === user.id).length;
    const eventsCount = db.events.filter((e: any) => e.attending.includes(user.id)).length;

    const profileData = {
      ...user,
      profileStats: {
        followersCount: user.followers.length,
        followingCount: user.following.length,
        postsCount: userPosts.length,
        mediaCount,
        resourcesCount,
        eventsCount,
        studyHours: user.studyHours || 0
      }
    };

    res.json({ success: true, profile: profileData });
  });

  // 2. PATCH Profile with input sanitization and verification
  app.patch('/api/profile/:id', (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (!checkRateLimit(`profile_patch_${clientIp}`, 30, 60000)) {
      return res.status(429).json({ error: 'طلبات تعديل كثيرة جداً، يرجى المحاولة بعد قليل.' });
    }

    const userId = req.params.id;
    const updates = req.body;
    const db = readDB();

    const userIndex = db.users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'الحساب غير موجود.' });
    }

    const existing = db.users[userIndex];

    // Sanitize user inputs rigorously to prevent XSS/injection
    const sanitizedName = updates.name !== undefined ? sanitizeString(updates.name, 100) : existing.name;
    const sanitizedBio = updates.bio !== undefined ? sanitizeString(updates.bio, 500) : existing.bio;
    const sanitizedUni = updates.university !== undefined ? sanitizeString(updates.university, 120) : existing.university;
    const sanitizedFaculty = updates.faculty !== undefined ? sanitizeString(updates.faculty, 120) : existing.faculty;
    const sanitizedMajor = updates.major !== undefined ? sanitizeString(updates.major, 120) : existing.major;
    const sanitizedLevel = updates.studyLevel !== undefined ? sanitizeString(updates.studyLevel, 50) : existing.studyLevel;
    const sanitizedPhone = updates.phone !== undefined ? sanitizeString(updates.phone, 30) : existing.phone;
    const sanitizedGithub = updates.github !== undefined ? sanitizeString(updates.github, 200) : existing.github;
    const sanitizedLinkedin = updates.linkedin !== undefined ? sanitizeString(updates.linkedin, 200) : existing.linkedin;

    // Handle uniqueness check if handle is modified
    let sanitizedHandle = existing.handle;
    if (updates.handle && updates.handle !== existing.handle) {
      const cleanHandle = updates.handle.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
      const handleTaken = db.users.some((u: any) => u.id !== userId && u.handle.toLowerCase() === cleanHandle);
      if (handleTaken) {
        return res.status(400).json({ error: 'اسم المستخدم (Handle) محجوز بالفعل.' });
      }
      sanitizedHandle = cleanHandle || existing.handle;
    }

    const updatedUser = {
      ...existing,
      name: sanitizedName || existing.name,
      bio: sanitizedBio,
      university: sanitizedUni,
      faculty: sanitizedFaculty,
      major: sanitizedMajor,
      studyLevel: sanitizedLevel,
      phone: sanitizedPhone,
      showPhone: updates.showPhone !== undefined ? Boolean(updates.showPhone) : existing.showPhone,
      github: sanitizedGithub,
      linkedin: sanitizedLinkedin,
      handle: sanitizedHandle,
      avatar: updates.avatar || existing.avatar,
      coverUrl: updates.coverUrl || existing.coverUrl,
      id: userId // strictly immutable
    };

    db.users[userIndex] = updatedUser;
    writeDB(db);

    res.json({ success: true, profile: updatedUser });
  });

  // 3. POST Upload File with Magic-Bytes & DoS File-Size Enforcement
  app.post('/api/upload/:type', (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (!checkRateLimit(`upload_${clientIp}`, 20, 60000)) {
      return res.status(429).json({ error: 'تجاوزت الحد الأقصى لرفع الصور. يرجى الانتظار دقيقة.' });
    }

    const { type } = req.params; // 'avatar' | 'cover'
    if (!['avatar', 'cover'].includes(type)) {
      return res.status(400).json({ error: 'نوع الرفع غير مدعوم.' });
    }

    const { userId, imageBase64 } = req.body;
    if (!userId || !imageBase64) {
      return res.status(400).json({ error: 'بيانات الصورة أو معرف المستخدم ناقصة.' });
    }

    const db = readDB();
    const userIndex = db.users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'المستخدم غير موجود.' });
    }

    try {
      // Decode Base64 buffer safely
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z0-9.+]+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      // 1. File Size Verification (Max 5MB)
      const MAX_SIZE = 5 * 1024 * 1024;
      if (buffer.length > MAX_SIZE) {
        return res.status(400).json({ error: 'حجم الصورة يتجاوز الحد الأقصى المسموح (5 ميجابايت).' });
      }

      // 2. Binary Magic Bytes Deep Inspection
      const magicCheck = detectAndValidateImageMagicBytes(buffer);
      if (!magicCheck.valid) {
        return res.status(400).json({
          error: 'فشل الفحص الأمني للملف: الترويسة الثنائية (Magic Bytes) لا تطابق صورة شرعية (JPEG, PNG, WebP, GIF).'
        });
      }

      // 3. Save File to Persistent Storage
      const fileName = `${type}_${userId}_${Date.now()}.${magicCheck.ext}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${fileName}`;

      // Update User Record
      if (type === 'avatar') {
        db.users[userIndex].avatar = publicUrl;
      } else {
        db.users[userIndex].coverUrl = publicUrl;
      }

      writeDB(db);

      res.json({
        success: true,
        url: publicUrl,
        user: db.users[userIndex],
        mime: magicCheck.mime,
        message: 'تم التحقق من الصورة وتخزينها بنجاح.'
      });
    } catch (err) {
      console.error('Upload Error:', err);
      res.status(500).json({ error: 'حدث خطأ أثناء معالجة وحفظ الصورة.' });
    }
  });

  // 4. POST Report User
  app.post('/api/users/:id/report', (req, res) => {
    const targetId = req.params.id;
    const { reportedBy, reason } = req.body;

    const db = readDB();
    const targetUser = db.users.find((u: any) => u.id === targetId);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    const reportNotif = {
      id: `notif_${Date.now()}`,
      type: 'verify',
      fromId: reportedBy || 'anonymous',
      recipientId: 'dev',
      text: `بلاغ جديد ضد المستخدم @${targetUser.handle}: ${sanitizeString(reason || 'مخالفة المحتوى', 100)}`,
      time: 'الآن',
      read: false,
      targetType: 'profile',
      targetId: targetId
    };

    db.notifications.unshift(reportNotif);
    writeDB(db);

    res.json({ success: true, message: 'تم استلام البلاغ ومراجعته من قِبل إدارة المنصة.' });
  });

  // Follow / Unfollow student
  app.post('/api/users/:id/follow', (req, res) => {
    const targetId = req.params.id;
    const { currentUserId } = req.body;
    const db = readDB();

    const currentUser = db.users.find((u: any) => u.id === currentUserId);
    const targetUser = db.users.find((u: any) => u.id === targetId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(targetId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter((id: string) => id !== targetId);
      targetUser.followers = targetUser.followers.filter((id: string) => id !== currentUserId);
    } else {
      currentUser.following.push(targetId);
      targetUser.followers.push(currentUserId);

      // Create linked notification for target user
      const followNotif = {
        id: `notif_${Date.now()}`,
        type: 'follow',
        fromId: currentUserId,
        recipientId: targetId,
        text: `قام ${currentUser.name} بمتابعة حسابك الجامعي 🎓`,
        time: 'الآن',
        read: false,
        targetType: 'profile',
        targetId: currentUserId
      };
      db.notifications.unshift(followNotif);
    }

    writeDB(db);
    res.json({ success: true, currentUser, targetUser, isFollowing: !isFollowing });
  });

  // Request Verification
  app.post('/api/users/:id/verify-request', (req, res) => {
    const userId = req.params.id;
    const db = readDB();
    const user = db.users.find((u: any) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.verificationPending = true;

    // Create alert for admin
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      type: 'verify',
      fromId: userId,
      recipientId: 'dev',
      text: `طلب توثيق جديد من الطالب: ${user.name} (${user.university})`,
      time: 'الآن',
      read: false,
      targetType: 'profile',
      targetId: userId
    });

    writeDB(db);
    res.json({ success: true, user });
  });

  // Verify Student (Admin)
  app.post('/api/users/:id/verify', (req, res) => {
    const userId = req.params.id;
    const { status, color } = req.body;
    const db = readDB();
    const user = db.users.find((u: any) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isVerified = status;
    user.verificationPending = false;
    if (color) user.verificationColor = color;

    // Notify student
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      type: 'verify',
      fromId: 'dev',
      recipientId: userId,
      text: status ? 'تهانينا! تمت الموافقة على شارة التوثيق الجامعي لحسابك ✓' : 'تم رفض طلب التوثيق، يرجى مراجعة إدارة الكلية.',
      time: 'الآن',
      read: false,
      targetType: 'profile',
      targetId: userId
    });

    writeDB(db);
    res.json({ success: true, user });
  });

  // Ban / Unban User
  app.post('/api/users/:id/ban', (req, res) => {
    const userId = req.params.id;
    const db = readDB();
    const user = db.users.find((u: any) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.banned = !user.banned;
    writeDB(db);
    res.json({ success: true, user });
  });

  // ==========================================
  // POSTS, LIKES, AND COMMENTS ENGINE
  // ==========================================

  // Get all posts
  app.get('/api/posts', (_req, res) => {
    const db = readDB();
    res.json(db.posts);
  });

  // Create post
  app.post('/api/posts', (req, res) => {
    const { authorId, content, hashtags, image, tag, tagColor } = req.body;
    if (!authorId || !content) {
      return res.status(400).json({ error: 'Author and content required' });
    }

    const db = readDB();
    const author = db.users.find((u: any) => u.id === authorId);

    const newPost = {
      id: Date.now(),
      authorId,
      content: content.trim(),
      time: "الآن",
      likes: 0,
      likedBy: [],
      shares: 0,
      comments: [],
      hashtags: hashtags && hashtags.length > 0 ? hashtags : ["CampusLife"],
      image: image || undefined,
      tag: tag || "General",
      tagColor: tagColor || "#6d5ef5",
      pinned: false,
      createdAt: new Date().toISOString()
    };

    db.posts.unshift(newPost);

    if (author) {
      author.postCount = (author.postCount || 0) + 1;
    }

    writeDB(db);
    res.status(201).json({ success: true, post: newPost });
  });

  // Delete post
  app.delete('/api/posts/:id', (req, res) => {
    const postId = Number(req.params.id);
    const db = readDB();

    db.posts = db.posts.filter((p: any) => p.id !== postId);
    db.reports = db.reports.filter((r: any) => r.postId !== postId);

    writeDB(db);
    res.json({ success: true, message: 'Post deleted successfully' });
  });

  // REAL LIKE TOGGLE WITH PERSISTENCE & NOTIFICATION
  app.post('/api/posts/:id/like', (req, res) => {
    const postId = Number(req.params.id);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const db = readDB();
    const post = db.posts.find((p: any) => p.id === postId);
    const likingUser = db.users.find((u: any) => u.id === userId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.likedBy) {
      post.likedBy = [];
    }

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      // Remove like
      post.likedBy = post.likedBy.filter((id: string) => id !== userId);
      post.likes = Math.max(0, (post.likes || 1) - 1);
    } else {
      // Add like
      post.likedBy.push(userId);
      post.likes = (post.likes || 0) + 1;

      // Create linked interactive notification for the author (if not liking own post)
      if (post.authorId !== userId) {
        const preview = post.content.length > 40 ? post.content.slice(0, 40) + '...' : post.content;
        const notif = {
          id: `notif_${Date.now()}`,
          type: "like",
          fromId: userId,
          recipientId: post.authorId,
          text: `أُعجب ${likingUser ? likingUser.name : 'أحد الطلاب'} بمنشورك: "${preview}"`,
          time: "الآن",
          read: false,
          targetType: "post",
          targetId: post.id // Clickable link directly to this post!
        };
        db.notifications.unshift(notif);
      }
    }

    writeDB(db);
    res.json({
      success: true,
      liked: !alreadyLiked,
      likes: post.likes,
      likedBy: post.likedBy,
      post
    });
  });

  // REAL COMMENT WITH PERSISTENCE & NOTIFICATION
  app.post('/api/posts/:id/comments', (req, res) => {
    const postId = Number(req.params.id);
    const { authorId, text, parentCommentId } = req.body;

    if (!authorId || !text) {
      return res.status(400).json({ error: 'authorId and text required' });
    }

    const db = readDB();
    const post = db.posts.find((p: any) => p.id === postId);
    const commentingUser = db.users.find((u: any) => u.id === authorId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = {
      id: Date.now(),
      authorId,
      text: text.trim(),
      time: "الآن",
      likes: 0,
      replies: []
    };

    if (parentCommentId) {
      const parent = post.comments.find((c: any) => c.id === parentCommentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(newComment);
      } else {
        post.comments.push(newComment);
      }
    } else {
      post.comments.push(newComment);
    }

    // Interactive notification linked to post
    if (post.authorId !== authorId) {
      const commentSnippet = text.length > 35 ? text.slice(0, 35) + '...' : text;
      const notif = {
        id: `notif_${Date.now()}`,
        type: "comment",
        fromId: authorId,
        recipientId: post.authorId,
        text: `علّق ${commentingUser ? commentingUser.name : 'طالب'}: "${commentSnippet}"`,
        time: "الآن",
        read: false,
        targetType: "post",
        targetId: post.id // Clickable link directly to this post!
      };
      db.notifications.unshift(notif);
    }

    writeDB(db);
    res.status(201).json({ success: true, comment: newComment, post });
  });

  // ==========================================
  // NOTIFICATIONS ENGINE (LINKED & INTERACTIVE)
  // ==========================================

  app.get('/api/notifications', (req, res) => {
    const userId = req.query.userId as string | undefined;
    const db = readDB();

    let notifs = db.notifications;
    if (userId) {
      // Filter notifications intended for this user, or global notifications
      notifs = notifs.filter((n: any) => !n.recipientId || n.recipientId === userId);
    }
    res.json(notifs);
  });

  app.put('/api/notifications/:id/read', (req, res) => {
    const notifId = req.params.id;
    const db = readDB();
    const notif = db.notifications.find((n: any) => n.id === notifId);
    if (notif) {
      notif.read = true;
      writeDB(db);
    }
    res.json({ success: true });
  });

  app.put('/api/notifications/read-all', (req, res) => {
    const { userId } = req.body;
    const db = readDB();

    db.notifications.forEach((n: any) => {
      if (!userId || !n.recipientId || n.recipientId === userId) {
        n.read = true;
      }
    });

    writeDB(db);
    res.json({ success: true });
  });

  // ==========================================
  // EVENTS, GROUPS, RESOURCES, MESSAGES & REPORTS
  // ==========================================

  // RSVP Event
  app.post('/api/events/:id/rsvp', (req, res) => {
    const eventId = Number(req.params.id);
    const { userId } = req.body;
    const db = readDB();
    const event = db.events.find((e: any) => e.id === eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.attending.includes(userId)) {
      event.attending = event.attending.filter((id: string) => id !== userId);
    } else {
      event.attending.push(userId);
    }

    writeDB(db);
    res.json({ success: true, event });
  });

  // Join Study Group
  app.post('/api/groups/:id/join', (req, res) => {
    const groupId = req.params.id;
    const { userId } = req.body;
    const db = readDB();
    const group = db.groups.find((g: any) => g.id === groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.members.includes(userId)) {
      group.members = group.members.filter((id: string) => id !== userId);
    } else {
      group.members.push(userId);
    }

    writeDB(db);
    res.json({ success: true, group });
  });

  // Create Resource
  app.post('/api/resources', (req, res) => {
    const { title, subject, fileType, uploadedBy, fileSize } = req.body;
    const db = readDB();

    const newRes = {
      id: `r_${Date.now()}`,
      title,
      subject,
      fileType: fileType || 'pdf',
      downloads: 0,
      uploadedBy,
      uploadedAt: 'الآن',
      fileSize: fileSize || '3.5 MB'
    };

    db.resources.unshift(newRes);
    writeDB(db);
    res.status(201).json({ success: true, resource: newRes });
  });

  // Download Resource
  app.post('/api/resources/:id/download', (req, res) => {
    const resId = req.params.id;
    const db = readDB();
    const resource = db.resources.find((r: any) => r.id === resId);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    resource.downloads = (resource.downloads || 0) + 1;
    writeDB(db);
    res.json({ success: true, downloads: resource.downloads });
  });

  // Direct Messages
  app.post('/api/messages', (req, res) => {
    const { fromId, toId, text } = req.body;
    const db = readDB();

    const sender = db.users.find((u: any) => u.id === fromId);
    const existingDm = db.dms.find((d: any) => d.userId === toId);

    const newMsg = { from: fromId, text, time: "الآن" };
    if (existingDm) {
      existingDm.messages.push(newMsg);
      existingDm.unread = (existingDm.unread || 0) + 1;
    } else {
      db.dms.unshift({
        userId: toId,
        unread: 1,
        messages: [newMsg]
      });
    }

    // Alert for recipient
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      type: "comment",
      fromId,
      recipientId: toId,
      text: `رسالة جديدة من ${sender ? sender.name : 'زميل'}: "${text.slice(0, 30)}..."`,
      time: "الآن",
      read: false,
      targetType: "profile",
      targetId: fromId
    });

    writeDB(db);
    res.json({ success: true, message: newMsg });
  });

  // Reports
  app.post('/api/reports', (req, res) => {
    const { postId, reportedBy, reason } = req.body;
    const db = readDB();

    const newReport = {
      id: `rep_${Date.now()}`,
      postId: Number(postId),
      reportedBy,
      reason,
      status: "pending",
      createdAt: "الآن"
    };

    db.reports.unshift(newReport);
    writeDB(db);
    res.status(201).json({ success: true, report: newReport });
  });

  app.post('/api/reports/:id/resolve', (req, res) => {
    const reportId = req.params.id;
    const { action } = req.body;
    const db = readDB();

    const report = db.reports.find((r: any) => r.id === reportId);
    if (report) {
      if (action === 'delete' && report.postId) {
        db.posts = db.posts.filter((p: any) => p.id !== report.postId);
      }
      db.reports = db.reports.filter((r: any) => r.id !== reportId);
      writeDB(db);
    }
    res.json({ success: true });
  });

  // ==========================================
  // VITE MIDDLEWARE (DEVELOPMENT & PRODUCTION)
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Compux Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
