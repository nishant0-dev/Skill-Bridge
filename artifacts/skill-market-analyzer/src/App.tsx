import { useState } from 'react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  Cloud,
  Code2,
  Download,
  FileText,
  Gauge,
  GitCompare,
  Layers3,
  LifeBuoy,
  Loader2,
  Menu,
  Minus,
  PanelLeftClose,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';
import { Router as WouterRouter, Route, Switch, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';

type Tab = 'market' | 'curriculum' | 'assessment';
type Toast = { id: number; tone: 'success' | 'info' | 'warning'; title: string; message: string };

const districts = {
  pune: {
    name: 'Pune',
    state: 'Maharashtra',
    vacancies: 14820,
    sync: '8 min ago',
    velocity: '+19.4%',
    feeds: ['NCS National Portal', 'Naukri.com', 'LinkedIn', 'Indeed'],
    skills: [
      ['Docker & Kubernetes', 'DevOps & Cloud', 96, '+34.2%'],
      ['FastAPI & Python Async', 'Backend', 91, '+28.7%'],
      ['React 18 / Next.js', 'Frontend', 89, '+24.5%'],
      ['Cloud Native AWS / GCP', 'Infrastructure', 85, '+22.1%'],
      ['PostgreSQL & Vector DBs', 'Data & AI', 82, '+19.8%'],
    ],
    obsolete: [
      ['PHP 5.6 / Legacy LAMP', 'FastAPI / Node.js Microservices', '-48.2%', 'Critical'],
      ['Adobe Flash / Silverlight', 'HTML5 Canvas / Modern Web UI', '-94.0%', 'Critical'],
      ['Monolithic Manual FTP / CPanel', 'Docker CI/CD & GitHub Actions', '-56.1%', 'High'],
      ['SOAP / XML-RPC Web Services', 'RESTful OpenAPI 3.0 & GraphQL', '-38.4%', 'High'],
    ],
    deficits: [
      ['Full-Stack Web Engineering', 5200, 2400, 53.8],
      ['Cloud & DevOps Automation', 4100, 1350, 67.1],
      ['AI & Data Engineering', 3100, 1100, 64.5],
      ['Cybersecurity & API Security', 1800, 650, 63.9],
      ['Embedded Systems & IoT', 1620, 890, 45.1],
    ],
  },
  bengaluru: {
    name: 'Bengaluru',
    state: 'Karnataka',
    vacancies: 38450,
    sync: '4 min ago',
    velocity: '+26.8%',
    feeds: ['NCS National Portal', 'LinkedIn Tech Hub', 'Instahyre', 'Naukri'],
    skills: [
      ['LLM Ops & GenAI RAG', 'AI Systems', 99, '+68.4%'],
      ['Kubernetes & Distributed Systems', 'Cloud', 95, '+41.2%'],
      ['Next.js & TypeScript', 'Full-Stack', 92, '+33.9%'],
      ['FastAPI / Go Microservices', 'Backend', 90, '+31.5%'],
      ['Kafka & Event Streaming', 'Data Architecture', 86, '+27.4%'],
    ],
    obsolete: [
      ['Monolithic J2EE Struts 1.x', 'Spring Boot 3 / FastAPI', '-52.3%', 'Critical'],
      ['PHP 5.4 / Procedural MySQL', 'Next.js + Prisma', '-65.0%', 'Critical'],
      ['On-prem Bare Metal Admin', 'Terraform IaC', '-44.6%', 'High'],
      ['jQuery DOM-heavy spaghetti', 'Modern Reactive UI (React)', '-39.2%', 'High'],
    ],
    deficits: [
      ['Generative AI & LLM Systems', 11200, 3200, 71.4],
      ['Cloud & Distributed Systems', 9800, 3900, 60.2],
      ['Full-Stack Modern Web', 8900, 4600, 48.3],
      ['Data Engineering & Pipelines', 5400, 2100, 61.1],
      ['DevSecOps & Platform Eng', 3150, 1050, 66.7],
    ],
  },
  jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    vacancies: 8920,
    sync: '16 min ago',
    velocity: '+14.2%',
    feeds: ['NCS National Portal', 'Naukri.com', 'Indeed', 'Rajasthan Rozgar'],
    skills: [
      ['React.js & Next.js Basics', 'Frontend', 92, '+29.4%'],
      ['Python & FastAPI REST APIs', 'Backend', 88, '+26.8%'],
      ['Docker Container Deployment', 'Cloud DevOps', 83, '+23.1%'],
      ['MySQL 8 / PostgreSQL', 'Databases', 79, '+17.5%'],
      ['Git & GitHub Collaboration', 'Dev Tools', 76, '+15.2%'],
    ],
    obsolete: [
      ['PHP 5.6 Procedural Coding', 'Python / Node.js Backends', '-54.5%', 'Critical'],
      ['Adobe Flash / Macromedia Tools', 'Figma & Modern Web Canvas', '-98.0%', 'Critical'],
      ['Manual Windows IIS Server setup', 'Docker & Cloud PaaS', '-49.2%', 'High'],
      ['Visual Basic 6.0 Form Apps', 'Modern Web Dashboards', '-72.0%', 'Critical'],
    ],
    deficits: [
      ['Full-Stack Web Engineering', 3200, 1250, 60.9],
      ['Cloud & Container DevOps', 2300, 720, 68.7],
      ['Data Analytics & Python', 1850, 810, 56.2],
      ['API Integration & Middleware', 1200, 490, 59.2],
      ['Cyber Hygiene & Security', 750, 280, 62.7],
    ],
  },
} as const;

const schemes = {
  diploma: {
    title: 'Diploma in Web Technologies',
    regulation: 'State Board of Technical Education · 2022 Scheme',
    current: 46,
    projected: 91,
    reclaimed: 48,
    outdated: [
      ['WT-301', 'PHP 5.6 Basics & Procedural MySQL', 'Deprecated globally; creates SQL injection risk and lacks async support.', 16, 'Critical'],
      ['WT-304', 'Adobe Flash & ActionScript 3.0', 'End-of-life and disabled across modern browsers. Zero current demand.', 10, 'Critical'],
      ['WT-402', 'Apache Bare-Metal & FileZilla FTP', 'Replaced by containerized infrastructure and automated CI/CD.', 12, 'High'],
      ['WT-405', 'XML-RPC & SOAP Envelope Services', 'Heavy payload overhead and nearly absent from modern SaaS.', 6, 'High'],
    ],
    modules: [
      ['MOD-101', 'RESTful APIs & Microservices via FastAPI', 94, 16, 'Backend Engineer · API Developer'],
      ['MOD-102', 'Docker Containers & Orchestration', 92, 12, 'DevOps Engineer · Cloud Associate'],
      ['MOD-103', 'Next.js App Router, SSR & Tailwind', 89, 12, 'Full-Stack Developer · Frontend Engineer'],
      ['MOD-104', 'CI/CD Pipelines with GitHub Actions', 86, 8, 'Release Engineer · QA Automation'],
    ],
  },
  btech: {
    title: 'B.Tech Computer Science & Engineering',
    regulation: 'AICTE Autonomous Regulation · 2021',
    current: 54,
    projected: 94,
    reclaimed: 52,
    outdated: [
      ['CS-503', 'J2EE Servlet Monoliths & Struts 1.x', 'Monoliths have been replaced by service-oriented cloud architectures.', 18, 'Critical'],
      ['CS-602', 'On-Premise Server Provisioning & BIOS', 'Replaced by cloud virtual networks and Infrastructure as Code.', 14, 'High'],
      ['CS-408', 'Manual Testing with Excel Matrices', 'Enterprise teams require automated test pipelines and E2E frameworks.', 12, 'High'],
      ['CS-305', 'CORBA & DCOM Distributed Objects', 'Superseded by gRPC Protocol Buffers and RESTful services.', 8, 'Critical'],
    ],
    modules: [
      ['MOD-201', 'Cloud-Native Distributed Systems & Microservices', 96, 18, 'Systems Engineer · Cloud Architect'],
      ['MOD-202', 'Kubernetes Cluster Management & Production DevOps', 93, 14, 'Platform Engineer · SRE'],
      ['MOD-203', 'Modern Full-Stack with Next.js & Prisma', 90, 12, 'Full-Stack Engineer · Product Engineer'],
      ['MOD-204', 'LLM Apps & Vector Search (RAG Pipelines)', 95, 8, 'AI Engineer · ML Solutions Architect'],
    ],
  },
} as const;

type Question = {
  id: string;
  difficulty: string;
  domain: string;
  prompt: string;
  code?: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
};

const questions: Record<string, Question> = {
  easy: {
    id: 'q1-easy',
    difficulty: 'Easy',
    domain: 'REST API & Web Architecture',
    prompt: 'In a modern RESTful API, what is the standard HTTP status code returned when a client successfully creates a new resource?',
    code: "POST /api/v1/students\nContent-Type: application/json\n\n{ name: 'Aarav Sharma', district: 'Pune' }",
    options: [
      { id: 'a', text: '200 OK — generic successful request', correct: false, explanation: '200 OK is common for GET and PUT, but REST recommends 201 Created for resource generation.' },
      { id: 'b', text: '201 Created — resource instantiated with URI', correct: true, explanation: 'Correct. RFC 7231 specifies 201 Created when a request results in a new resource.' },
      { id: 'c', text: '204 No Content — action completed without body', correct: false, explanation: '204 signals completion without a response body, common in DELETE operations.' },
      { id: 'd', text: '304 Not Modified — cached resource is valid', correct: false, explanation: '304 is a conditional cache response, not a resource creation status.' },
    ],
  },
  medium: {
    id: 'q2-medium',
    difficulty: 'Medium',
    domain: 'Containerization & Docker',
    prompt: 'When crafting a production Dockerfile for a microservice, which practice minimizes image size and prevents secret leakage?',
    code: 'FROM node:20-alpine AS builder\nRUN npm ci && npm run build\n\nFROM node:20-alpine AS runner\n# What is copied here?',
    options: [
      { id: 'a', text: 'Multi-stage build; copy only compiled artifacts to runner', correct: true, explanation: 'Correct. Multi-stage builds isolate tooling and dependencies, producing leaner, safer production containers.' },
      { id: 'b', text: 'Copy node_modules directly from the host workstation', correct: false, explanation: 'Host dependencies can contain incompatible native binaries and inflate the image.' },
      { id: 'c', text: 'Embed .env.production secrets in Dockerfile ARG', correct: false, explanation: 'ARG values are retained in image layer metadata and can expose secrets.' },
      { id: 'd', text: 'Run the application as root for full system access', correct: false, explanation: 'Production containers should run with a non-root user profile.' },
    ],
  },
  remedial: {
    id: 'q2-remedial',
    difficulty: 'Easy',
    domain: 'Client–Server Communication',
    prompt: 'Which format is the industry standard for data interchange between frontend applications and backend services?',
    options: [
      { id: 'a', text: 'JSON (JavaScript Object Notation)', correct: true, explanation: 'Correct. JSON is lightweight, readable, and supported across modern web and mobile APIs.' },
      { id: 'b', text: 'SOAP XML envelopes with WSDL schemas', correct: false, explanation: 'SOAP is a heavyweight legacy protocol with higher parsing overhead.' },
      { id: 'c', text: 'Raw delimited CSV text files', correct: false, explanation: 'CSV is a poor fit for nested object hierarchies and real-time state sync.' },
      { id: 'd', text: 'Compiled Java serialized objects', correct: false, explanation: 'Java serialization is platform-dependent and can create deserialization vulnerabilities.' },
    ],
  },
  hard: {
    id: 'q3-hard',
    difficulty: 'Hard',
    domain: 'Full-Stack Performance & SSR',
    prompt: 'What is the key architectural advantage of React Server Components compared with traditional client-side SPA rendering?',
    code: "export default async function DashboardPage() {\n  const vacancies = await db.vacancies.findMany();\n  return <VacanciesTable data={vacancies} />;\n}",
    options: [
      { id: 'a', text: 'No client-side JS for dependencies and direct server access without exposing credentials', correct: true, explanation: 'Correct. Server Components execute on the server and avoid shipping database drivers to the browser.' },
      { id: 'b', text: 'Automatic conversion of SQL queries into client IndexedDB', correct: false, explanation: 'Server Components do not replicate backend databases to the client.' },
      { id: 'c', text: 'Elimination of all CSS stylesheets', correct: false, explanation: 'Server Components still output semantic HTML and CSS.' },
      { id: 'd', text: 'Client browsers become peer-to-peer proxy nodes', correct: false, explanation: 'Server Components execute on your server, not as client proxies.' },
    ],
  },
  fallback: {
    id: 'q3-fallback',
    difficulty: 'Medium',
    domain: 'Asynchronous Python & FastAPI',
    prompt: 'Why has industry increasingly adopted FastAPI over traditional Flask for microservice architectures?',
    code: '@app.get("/api/v1/skills/{district_id}")\nasync def get_market_skills(district_id: str):\n    return await db.fetch_live_vacancies(district_id)',
    options: [
      { id: 'a', text: 'Native async concurrency, OpenAPI docs, and Pydantic validation', correct: true, explanation: 'Correct. FastAPI pairs high-concurrency async I/O with automatic docs and strict type safety.' },
      { id: 'b', text: 'FastAPI runs without any Python runtime on the server', correct: false, explanation: 'FastAPI still requires Python and an ASGI server such as Uvicorn.' },
      { id: 'c', text: 'It eliminates the need for a database', correct: false, explanation: 'FastAPI is a web framework, not a database.' },
      { id: 'd', text: 'It compiles Python directly to x86 assembly', correct: false, explanation: 'FastAPI uses standard Python execution via an ASGI event loop.' },
    ],
  },
};

const money = (value: number) => value.toLocaleString('en-IN');

function IconButton({ label, children, onClick, testId }: { label: string; children: ReactNode; onClick?: () => void; testId: string }) {
  return <button aria-label={label} title={label} data-testid={testId} onClick={onClick} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] transition-all hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]">{children}</button>;
}

function MetricCard({ label, value, note, accent = false, icon }: { label: string; value: string; note: string; accent?: boolean; icon: ReactNode }) {
  return (
    <div className={`rounded-2xl border p-5 transition-transform duration-300 hover:-translate-y-0.5 ${accent ? 'border-[hsl(var(--primary)/.25)] bg-[hsl(var(--primary)/.07)]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'}`}>
      <div className="flex items-start justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--primary))]'}`}>{icon}</span>
        <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Live</span>
      </div>
      <p className="mt-5 font-display text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">{note}</p>
    </div>
  );
}

function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('market');
  const [district, setDistrict] = useState<keyof typeof districts>('pune');
  const [schemeId, setSchemeId] = useState<keyof typeof schemes>('diploma');
  const [mobileNav, setMobileNav] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [exportOpen, setExportOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [chartMode, setChartMode] = useState<'bars' | 'table'>('bars');
  const [quizStep, setQuizStep] = useState(0);
  const [questionKey, setQuestionKey] = useState('easy');
  const [picked, setPicked] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; difficulty: string }[]>([]);
  const [completed, setCompleted] = useState(false);

  const selectedDistrict = districts[district];
  const selectedScheme = schemes[schemeId];
  const question = questions[questionKey];

  const notify = (tone: Toast['tone'], title: string, message: string) => {
    const id = Date.now();
    setToasts((items) => [...items, { id, tone, title, message }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4200);
  };
  const changeTab = (tab: Tab) => { setActiveTab(tab); setMobileNav(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const refresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    window.setTimeout(() => {
      setIsRefreshing(false);
      notify('info', 'Market feeds synchronized', `Ingested 1,240 new postings for the ${selectedDistrict.name} cluster.`);
    }, 900);
  };
  const approve = () => {
    setApproved((items) => ({ ...items, [schemeId]: true }));
    notify('success', 'Curriculum delta approved', `${selectedScheme.reclaimed} lecture hours are ready to export as lab credits.`);
  };
  const resetQuiz = () => { setQuizStep(0); setQuestionKey('easy'); setPicked(null); setSubmitted(false); setAnswers([]); setCompleted(false); };
  const submitAnswer = () => {
    if (!picked || submitted) return;
    const chosen = question.options.find((option) => option.id === picked);
    if (!chosen) return;
    setSubmitted(true);
    setAnswers((items) => [...items, { correct: chosen.correct, difficulty: question.difficulty }]);
  };
  const nextQuestion = () => {
    const latest = answers[answers.length - 1];
    if (quizStep === 0) setQuestionKey(latest?.correct ? 'medium' : 'remedial');
    else if (quizStep === 1) setQuestionKey(latest?.correct && latest.difficulty === 'Medium' ? 'hard' : 'fallback');
    else {
      setCompleted(true);
      notify('success', 'Assessment completed', 'Readiness profile calculated from the adaptive response path.');
      return;
    }
    setQuizStep((step) => step + 1); setPicked(null); setSubmitted(false);
  };

  return (
    <div className="noise min-h-[100dvh] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] transition-transform duration-300 lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center border-b border-[hsl(var(--sidebar-border))] px-6">
          <button onClick={() => changeTab('market')} data-testid="button-brand" className="flex items-center gap-3 text-left">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><Layers3 size={19} strokeWidth={2.5} /></span>
            <span><span className="block font-display text-[15px] font-semibold tracking-tight">skill<span className="text-[hsl(var(--accent))]">/</span>market</span><span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[.18em] opacity-60">intelligence OS</span></span>
          </button>
          <IconButton label="Close navigation" testId="button-close-nav" onClick={() => setMobileNav(false)}><PanelLeftClose size={17} /></IconButton>
        </div>
        <div className="px-4 pt-7">
          <p className="px-3 font-mono text-[10px] uppercase tracking-[.18em] opacity-45">Workspace</p>
          <nav className="mt-3 space-y-1" aria-label="Primary navigation">
            {[
              { id: 'market' as Tab, label: 'Market intelligence', hint: 'District signals', icon: BarChart3 },
              { id: 'curriculum' as Tab, label: 'Curriculum delta', hint: 'Review & sanction', icon: GitCompare },
              { id: 'assessment' as Tab, label: 'Adaptive assessment', hint: 'Readiness paths', icon: ClipboardCheck },
            ].map(({ id, label, hint, icon: NavIcon }) => (
              <button key={id} onClick={() => changeTab(id)} data-testid={`nav-${id}`} aria-current={activeTab === id ? 'page' : undefined} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${activeTab === id ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))] shadow-[inset_3px_0_0_hsl(var(--accent))]' : 'opacity-70 hover:bg-[hsl(var(--sidebar-accent)/.55)] hover:opacity-100'}`}>
                <NavIcon size={18} strokeWidth={activeTab === id ? 2.5 : 1.8} />
                <span><span className="block text-[13px] font-semibold">{label}</span><span className="mt-0.5 block text-[10px] opacity-55">{hint}</span></span>
                {activeTab === id && <ArrowRight size={14} className="ml-auto text-[hsl(var(--accent))]" />}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t border-[hsl(var(--sidebar-border))] p-5">
          <div className="rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.32)] p-4">
            <div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.14em] opacity-60">Data pulse</span><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--accent))] opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--accent))]" /></span></div>
            <p className="mt-3 font-display text-xl font-semibold">71,240</p><p className="mt-1 text-[11px] opacity-60">postings indexed this cycle</p>
          </div>
          <button onClick={() => notify('info', 'Support channel opened', 'A market analyst will respond in this workspace.')} data-testid="button-support" className="mt-4 flex w-full items-center gap-2 px-2 text-xs opacity-60 transition-opacity hover:opacity-100"><LifeBuoy size={14} /> Analyst support <ArrowUpRight size={13} className="ml-auto" /></button>
        </div>
      </aside>
      {mobileNav && <button aria-label="Close navigation overlay" data-testid="button-nav-overlay" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.35)] lg:hidden" />}
      <main className="min-h-[100dvh] lg:ml-[264px]">
        <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.9)] px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <IconButton label="Open navigation" testId="button-open-nav" onClick={() => setMobileNav(true)}><Menu size={21} /></IconButton>
            <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Workforce intelligence / 04</p><h1 className="mt-1 font-display text-lg font-semibold tracking-tight">{activeTab === 'market' ? 'District market pulse' : activeTab === 'curriculum' ? 'Curriculum delta review' : 'Adaptive skill readiness'}</h1></div>
          </div>
          <div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs text-[hsl(var(--muted-foreground))] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" /> Data current · 08:42 IST</div><div className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--primary))] font-display text-xs font-bold text-[hsl(var(--primary-foreground))]">AK</div></div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
          {activeTab === 'market' && <MarketView district={district} setDistrict={setDistrict} data={selectedDistrict} isRefreshing={isRefreshing} onRefresh={refresh} chartMode={chartMode} setChartMode={setChartMode} />}
          {activeTab === 'curriculum' && <CurriculumView schemeId={schemeId} setSchemeId={setSchemeId} data={selectedScheme} isApproved={!!approved[schemeId]} onApprove={approve} exportOpen={exportOpen} setExportOpen={setExportOpen} onNotify={notify} />}
          {activeTab === 'assessment' && <AssessmentView question={question} step={quizStep} picked={picked} setPicked={setPicked} submitted={submitted} completed={completed} answers={answers} onSubmit={submitAnswer} onNext={nextQuestion} onReset={resetQuiz} />}
        </div>
      </main>
      <div className="fixed bottom-5 right-5 z-50 flex w-[min(390px,calc(100vw-2rem))] flex-col gap-3" aria-live="polite">
        {toasts.map((toast) => <div key={toast.id} data-testid={`toast-${toast.id}`} className="animate-rise-in rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_14px_40px_hsl(var(--foreground)/.16)]"><div className="flex gap-3"><span className={`mt-0.5 ${toast.tone === 'success' ? 'text-[hsl(var(--primary))]' : toast.tone === 'warning' ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{toast.tone === 'success' ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{toast.title}</p><p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{toast.message}</p></div><button aria-label="Dismiss notification" data-testid={`button-dismiss-toast-${toast.id}`} onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))}><X size={15} className="text-[hsl(var(--muted-foreground))]" /></button></div></div>)}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">{eyebrow}</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{description}</p></div>{action}</div>;
}

function MarketView({ district, setDistrict, data, isRefreshing, onRefresh, chartMode, setChartMode }: { district: keyof typeof districts; setDistrict: (value: keyof typeof districts) => void; data: (typeof districts)[keyof typeof districts]; isRefreshing: boolean; onRefresh: () => void; chartMode: 'bars' | 'table'; setChartMode: (mode: 'bars' | 'table') => void }) {
  return <div className="animate-rise-in">
    <SectionHeading eyebrow="01 · signal layer" title="Where the market is pulling." description="Translate live hiring demand into a clear curriculum response. Start with a district, then follow the signal from vacancy volume to skill deficit." action={<div className="flex items-center gap-2"><label className="sr-only" htmlFor="district-select">Select district</label><div className="relative"><select id="district-select" value={district} onChange={(event) => setDistrict(event.target.value as keyof typeof districts)} data-testid="select-district" className="h-10 appearance-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2 pl-3 pr-9 text-sm font-semibold shadow-sm"><option value="pune">Pune · Maharashtra</option><option value="bengaluru">Bengaluru · Karnataka</option><option value="jaipur">Jaipur · Rajasthan</option></select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-[hsl(var(--muted-foreground))]" /></div><button onClick={onRefresh} disabled={isRefreshing} data-testid="button-refresh-market" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-70">{isRefreshing ? <Loader2 size={15} className="animate-spin-soft" /> : <RefreshCw size={15} />}<span className="hidden sm:inline">{isRefreshing ? 'Syncing…' : 'Sync feeds'}</span></button></div>} />
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Active vacancies" value={money(data.vacancies)} note={`Across ${data.name} hiring cluster`} accent icon={<BriefcaseBusiness size={18} />} />
      <MetricCard label="Hiring velocity" value={data.velocity} note="Month-on-month movement" icon={<TrendingUp size={18} />} />
      <MetricCard label="Top skill demand" value={`${data.skills[0][2]}/100`} note={data.skills[0][0]} icon={<Target size={18} />} />
      <MetricCard label="Last feed sync" value={data.sync} note={`${data.feeds.length} sources responding`} icon={<RefreshCw size={18} />} />
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Demand index</p><h3 className="mt-1 font-display text-xl font-semibold">Skills gaining ground</h3></div><div className="flex rounded-lg border border-[hsl(var(--border))] p-1"><button onClick={() => setChartMode('bars')} data-testid="button-chart-bars" aria-pressed={chartMode === 'bars'} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${chartMode === 'bars' ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'text-[hsl(var(--muted-foreground))]'}`}>Bars</button><button onClick={() => setChartMode('table')} data-testid="button-chart-table" aria-pressed={chartMode === 'table'} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${chartMode === 'table' ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'text-[hsl(var(--muted-foreground))]'}`}>Table</button></div></div>
        <div className="mt-7 space-y-5">{chartMode === 'bars' ? data.skills.map(([name, category, score, growth], index) => <div key={name} data-testid={`skill-row-${index}`} className="group"><div className="mb-2 flex items-end justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{name}</p><p className="mt-0.5 text-[11px] text-[hsl(var(--muted-foreground))]">{category}</p></div><span className="shrink-0 font-mono text-xs text-[hsl(var(--primary))]">{growth}</span></div><div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className="h-full rounded-full bg-[hsl(var(--primary))] transition-all duration-700 group-hover:bg-[hsl(var(--accent))]" style={{ width: `${score}%` }} /></div><div className="mt-1 text-right font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{score} index</div></div>) : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-[hsl(var(--border))] text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]"><tr><th className="pb-3">Skill</th><th className="pb-3">Domain</th><th className="pb-3 text-right">Index</th></tr></thead><tbody>{data.skills.map(([name, category, score], index) => <tr key={name} data-testid={`skill-table-row-${index}`} className="border-b border-[hsl(var(--border)/.55)] last:border-0"><td className="py-3 font-semibold">{name}</td><td className="py-3 text-[hsl(var(--muted-foreground))]">{category}</td><td className="py-3 text-right font-mono text-[hsl(var(--primary))]">{score}</td></tr>)}</tbody></table></div>}</div>
      </div>
      <div className="grid-paper rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--accent)/.22)] text-[hsl(var(--accent-foreground))]"><Gauge size={18} /></span><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Signal brief</p><h3 className="mt-1 font-display text-xl font-semibold">{data.name} readout</h3></div></div><p className="mt-8 text-4xl font-display font-semibold tracking-tight">2.1<span className="text-xl text-[hsl(var(--muted-foreground))]">×</span></p><p className="mt-1 text-sm font-semibold">more demand than supply</p><p className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]">The sharpest intervention window is <strong className="text-[hsl(var(--foreground))]">{data.deficits[0][0]}</strong>. New curriculum time should favor applied labs over legacy theory.</p><div className="mt-7 border-t border-[hsl(var(--border))] pt-4"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Source coverage</p><div className="mt-3 flex flex-wrap gap-2">{data.feeds.map((feed) => <span key={feed} className="rounded-md bg-[hsl(var(--muted))] px-2 py-1 text-[10px] font-medium">{feed}</span>)}</div></div></div>
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Deprecation watch</p><h3 className="mt-1 font-display text-xl font-semibold">Skills losing demand</h3></div><TrendingDown size={20} className="text-[hsl(var(--destructive))]" /></div><div className="mt-5 space-y-2">{data.obsolete.map(([oldSkill, replacement, rate, risk], index) => <div key={oldSkill} data-testid={`obsolete-row-${index}`} className="rounded-xl border border-[hsl(var(--border)/.7)] p-3 transition-colors hover:bg-[hsl(var(--muted)/.55)]"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{oldSkill}</p><p className="mt-1 flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))]"><ArrowRight size={12} className="text-[hsl(var(--primary))]" /> {replacement}</p></div><span className={`shrink-0 rounded-md px-2 py-1 font-mono text-[10px] ${risk === 'Critical' ? 'bg-[hsl(var(--destructive)/.1)] text-[hsl(var(--destructive))]' : 'bg-[hsl(var(--accent)/.18)] text-[hsl(var(--accent-foreground))]'}`}>{rate}</span></div></div>)}</div></div>
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Supply gap</p><h3 className="mt-1 font-display text-xl font-semibold">Domain deficits</h3></div><span className="rounded-full bg-[hsl(var(--destructive)/.1)] px-2 py-1 font-mono text-[10px] text-[hsl(var(--destructive))]">Priority map</span></div><div className="mt-6 space-y-4">{data.deficits.map(([domain, demand, supply, deficit], index) => <div key={domain} data-testid={`deficit-row-${index}`}><div className="mb-2 flex items-center justify-between gap-3"><span className="text-sm font-semibold">{domain}</span><span className="font-mono text-xs text-[hsl(var(--destructive))]">{deficit}% gap</span></div><div className="flex h-2 gap-1 overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className="rounded-l-full bg-[hsl(var(--primary))]" style={{ width: `${(supply / demand) * 100}%` }} /><div className="rounded-r-full bg-[hsl(var(--destructive)/.7)]" style={{ width: `${(1 - supply / demand) * 100}%` }} /></div><div className="mt-1 flex justify-between font-mono text-[10px] text-[hsl(var(--muted-foreground))]"><span>Supply {money(supply)}</span><span>Demand {money(demand)}</span></div></div>)}</div></div>
    </div>
  </div>;
}

function CurriculumView({ schemeId, setSchemeId, data, isApproved, onApprove, exportOpen, setExportOpen, onNotify }: { schemeId: keyof typeof schemes; setSchemeId: (value: keyof typeof schemes) => void; data: (typeof schemes)[keyof typeof schemes]; isApproved: boolean; onApprove: () => void; exportOpen: boolean; setExportOpen: (value: boolean) => void; onNotify: (tone: Toast['tone'], title: string, message: string) => void }) {
  const download = () => { const content = `${data.title}\nApproved curriculum delta\nReclaimed hours: ${data.reclaimed}\n\nRecommended modules:\n${data.modules.map((module) => `- ${module[1]} (${module[3]} lab hours)`).join('\n')}`; const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' })); const link = document.createElement('a'); link.href = url; link.download = `${data.title.toLowerCase().replaceAll(' ', '-')}-delta.txt`; link.click(); URL.revokeObjectURL(url); setExportOpen(false); onNotify('success', 'Delta package downloaded', 'The approved review is ready to circulate to the academic committee.'); };
  return <div className="animate-rise-in">
    <SectionHeading eyebrow="02 · intervention layer" title="Move from signal to syllabus." description="Review what should leave the scheme, what needs to enter it, and the evidence behind every hour reclaimed." action={<div className="relative"><label className="sr-only" htmlFor="scheme-select">Select curriculum scheme</label><select id="scheme-select" value={schemeId} onChange={(event) => setSchemeId(event.target.value as keyof typeof schemes)} data-testid="select-scheme" className="h-10 max-w-[280px] appearance-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-2 pl-3 pr-9 text-sm font-semibold"><option value="diploma">Diploma · Web Technologies</option><option value="btech">B.Tech · Computer Science</option></select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-[hsl(var(--muted-foreground))]" /></div>} />
    <div className="mt-8 grid gap-4 md:grid-cols-3"><MetricCard label="Current alignment" value={`${data.current}%`} note="Existing scheme vs market" icon={<BookOpen size={18} />} /><MetricCard label="Projected alignment" value={`${data.projected}%`} note="After proposed delta" accent icon={<TrendingUp size={18} />} /><MetricCard label="Hours reclaimed" value={`${data.reclaimed}h`} note="Reassigned to applied labs" icon={<RotateCcw size={18} />} /></div>
    <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-start gap-3"><span className={`mt-0.5 grid h-9 w-9 place-items-center rounded-xl ${isApproved ? 'bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]' : 'bg-[hsl(var(--accent)/.22)] text-[hsl(var(--accent-foreground))]'}`}>{isApproved ? <CheckCircle2 size={19} /> : <CircleAlert size={19} />}</span><div><p className="text-sm font-semibold">{isApproved ? 'Delta sanctioned for export' : 'Review ready for academic sign-off'}</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{isApproved ? 'Approval state is saved locally for this workspace.' : 'Confirm this intervention after checking each proposed change.'}</p></div></div><div className="flex flex-wrap gap-2">{isApproved && <button onClick={() => setExportOpen(true)} data-testid="button-open-export" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[hsl(var(--border))] px-3 text-sm font-semibold transition-colors hover:bg-[hsl(var(--muted))]"><Download size={15} /> Export delta</button>}<button onClick={onApprove} disabled={isApproved} data-testid="button-approve-delta" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:-translate-y-0.5 disabled:cursor-default disabled:bg-[hsl(var(--muted))] disabled:text-[hsl(var(--muted-foreground))]">{isApproved ? <Check size={15} /> : <ShieldCheck size={15} />}{isApproved ? 'Approved' : 'Approve delta'}</button></div></div>
    <div className="mt-4 grid gap-4 xl:grid-cols-2"><div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--destructive))]">Remove / retire</p><h3 className="mt-1 font-display text-xl font-semibold">Outdated topics</h3></div><ArrowDownRight size={19} className="text-[hsl(var(--destructive))]" /></div><div className="mt-5 space-y-3">{data.outdated.map(([code, title, reason, hours, severity]) => <details key={code} data-testid={`topic-${code}`} className="group rounded-xl border border-[hsl(var(--border)/.75)] p-4 open:bg-[hsl(var(--muted)/.4)]"><summary className="flex cursor-pointer list-none items-start gap-3"><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{code}</span><span className="min-w-0 flex-1 text-sm font-semibold">{title}</span><span className={`rounded-md px-2 py-1 font-mono text-[9px] ${severity === 'Critical' ? 'bg-[hsl(var(--destructive)/.1)] text-[hsl(var(--destructive))]' : 'bg-[hsl(var(--accent)/.2)] text-[hsl(var(--accent-foreground))]'}`}>{severity}</span><ChevronDown size={15} className="mt-0.5 shrink-0 transition-transform group-open:rotate-180" /></summary><p className="ml-[52px] mt-3 text-xs leading-5 text-[hsl(var(--muted-foreground))]">{reason}</p><p className="ml-[52px] mt-3 font-mono text-[10px] text-[hsl(var(--primary))]">↳ free {hours} lecture hours</p></details>)}</div></div>
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--primary))]">Add / activate</p><h3 className="mt-1 font-display text-xl font-semibold">Demanded modules</h3></div><ArrowUpRight size={19} className="text-[hsl(var(--primary))]" /></div><div className="mt-5 space-y-3">{data.modules.map(([code, title, demand, hours, roles], index) => <div key={code} data-testid={`module-${code}`} className="rounded-xl border border-[hsl(var(--border)/.75)] p-4 transition-colors hover:border-[hsl(var(--primary)/.45)] hover:bg-[hsl(var(--primary)/.035)]"><div className="flex items-start gap-3"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary)/.1)] font-mono text-[9px] text-[hsl(var(--primary))]">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold">{title}</p><span className="font-mono text-xs text-[hsl(var(--primary))]">{demand}/100</span></div><p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">{roles}</p><div className="mt-3 flex items-center gap-3"><div className="h-1.5 flex-1 rounded-full bg-[hsl(var(--muted))]"><div className="h-full rounded-full bg-[hsl(var(--primary))]" style={{ width: `${demand}%` }} /></div><span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{hours} lab hrs</span></div></div></div></div>)}</div></div></div>
    {exportOpen && <div role="dialog" aria-modal="true" aria-labelledby="export-title" className="fixed inset-0 z-50 grid place-items-center bg-[hsl(var(--foreground)/.35)] p-5"><div className="w-full max-w-md animate-rise-in rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]"><FileText size={19} /></span><h3 id="export-title" className="mt-5 font-display text-2xl font-semibold">Export review package</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Download a plain-text handoff for the {data.title} committee review.</p></div><IconButton label="Close export dialog" testId="button-close-export" onClick={() => setExportOpen(false)}><X size={18} /></IconButton></div><div className="mt-6 rounded-xl bg-[hsl(var(--muted)/.6)] p-4 text-sm"><div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Status</span><span className="font-semibold text-[hsl(var(--primary))]">Approved</span></div><div className="mt-3 flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Proposed modules</span><span className="font-semibold">{data.modules.length}</span></div></div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setExportOpen(false)} data-testid="button-cancel-export" className="h-10 rounded-lg px-3 text-sm font-semibold text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]">Cancel</button><button onClick={download} data-testid="button-download-export" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 text-sm font-semibold text-[hsl(var(--primary-foreground))]"><Download size={15} /> Download .txt</button></div></div></div>}
  </div>;
}

function AssessmentView({ question, step, picked, setPicked, submitted, completed, answers, onSubmit, onNext, onReset }: { question: Question; step: number; picked: string | null; setPicked: (id: string) => void; submitted: boolean; completed: boolean; answers: { correct: boolean; difficulty: string }[]; onSubmit: () => void; onNext: () => void; onReset: () => void }) {
  const score = answers.length ? Math.round((answers.filter((answer) => answer.correct).length / answers.length) * 100) : 0;
  return <div className="animate-rise-in">
    <SectionHeading eyebrow="03 · readiness layer" title="Assess for the next job, not the last one." description="A three-step adaptive path changes difficulty based on each answer. See not only whether a learner is right, but why the response matters in production." action={<button onClick={onReset} data-testid="button-reset-assessment" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-sm font-semibold transition-colors hover:bg-[hsl(var(--muted))]"><RotateCcw size={15} /> Reset path</button>} />
    <div className="mt-8 grid gap-4 xl:grid-cols-[.3fr_.7fr]">
      <aside className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6"><div className="flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Path map</p><span className="font-mono text-xs text-[hsl(var(--primary))]">{completed ? 'Done' : `${step + 1} / 3`}</span></div><div className="mt-6 space-y-3">{['Foundation signal', 'Applied practice', 'Production judgment'].map((label, index) => <div key={label} className="flex items-center gap-3"><span className={`grid h-8 w-8 place-items-center rounded-full border font-mono text-xs ${index < step || completed ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : index === step && !completed ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.2)] text-[hsl(var(--accent-foreground))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'}`}>{index < step || completed ? <Check size={14} /> : `0${index + 1}`}</span><div><p className={`text-sm font-semibold ${index > step && !completed ? 'text-[hsl(var(--muted-foreground))]' : ''}`}>{label}</p><p className="text-[10px] text-[hsl(var(--muted-foreground))]">{index === 0 ? 'Start here' : index === 1 ? 'Branches on signal' : 'Final calibration'}</p></div></div>)}</div><div className="mt-8 border-t border-[hsl(var(--border))] pt-5"><div className="flex items-center justify-between text-xs"><span className="text-[hsl(var(--muted-foreground))]">Readiness index</span><span className="font-mono font-semibold text-[hsl(var(--primary))]">{completed ? '82 / 100' : '—'}</span></div><div className="mt-3 h-2 rounded-full bg-[hsl(var(--muted))]"><div className="h-full rounded-full bg-[hsl(var(--primary))] transition-all duration-700" style={{ width: completed ? '82%' : `${(step / 3) * 100}%` }} /></div></div></aside>
      <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-8">
        {completed ? <div className="flex min-h-[440px] flex-col items-center justify-center text-center"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--primary)/.12)] text-[hsl(var(--primary))]"><Award size={32} /></span><p className="mt-6 font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Assessment complete</p><h3 className="mt-2 font-display text-3xl font-semibold">A useful signal, not a score.</h3><p className="mt-3 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">This response path maps to a strong NSQF Level 5 foundation. Use the remediation route below to close the final production-readiness gaps.</p><div className="mt-7 grid w-full max-w-sm grid-cols-2 gap-3"><div className="rounded-xl bg-[hsl(var(--muted)/.7)] p-4"><p className="font-display text-2xl font-semibold">{score}%</p><p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">answer accuracy</p></div><div className="rounded-xl bg-[hsl(var(--primary)/.08)] p-4"><p className="font-display text-2xl font-semibold text-[hsl(var(--primary))]">82</p><p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">readiness index</p></div></div><button onClick={onReset} data-testid="button-restart-assessment" className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 text-sm font-semibold text-[hsl(var(--primary-foreground))]"><RotateCcw size={15} /> Run another path</button></div> : <><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className="rounded-md bg-[hsl(var(--accent)/.2)] px-2 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-[hsl(var(--accent-foreground))]">{question.difficulty}</span><span className="font-mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">{question.domain}</span></div><h3 data-testid="text-assessment-question" className="mt-5 max-w-3xl font-display text-2xl font-semibold leading-tight tracking-[-.025em] sm:text-3xl">{question.prompt}</h3></div><span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">Q0{step + 1}</span></div>{question.code && <pre data-testid="code-assessment-snippet" className="mt-6 overflow-x-auto rounded-xl bg-[hsl(var(--sidebar))] p-4 font-mono text-xs leading-6 text-[hsl(var(--sidebar-foreground))]"><code>{question.code}</code></pre>}<div className="mt-6 space-y-2">{question.options.map((option) => { const state = submitted ? option.correct ? 'correct' : picked === option.id ? 'wrong' : 'idle' : picked === option.id ? 'selected' : 'idle'; return <button key={option.id} onClick={() => !submitted && setPicked(option.id)} disabled={submitted} data-testid={`option-${option.id}`} aria-pressed={picked === option.id} className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${state === 'correct' ? 'border-[hsl(var(--primary)/.55)] bg-[hsl(var(--primary)/.08)]' : state === 'wrong' ? 'border-[hsl(var(--destructive)/.5)] bg-[hsl(var(--destructive)/.07)]' : state === 'selected' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.1)]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/.45)] hover:bg-[hsl(var(--muted)/.45)]'}`}><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] ${state === 'correct' ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : state === 'wrong' ? 'border-[hsl(var(--destructive))] text-[hsl(var(--destructive))]' : state === 'selected' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'}`}>{state === 'correct' ? <Check size={13} /> : state === 'wrong' ? <X size={13} /> : option.id.toUpperCase()}</span><span className="text-sm leading-6">{option.text}</span></button>; })}</div>{submitted && <div className={`mt-5 rounded-xl border p-4 ${question.options.find((option) => option.id === picked)?.correct ? 'border-[hsl(var(--primary)/.3)] bg-[hsl(var(--primary)/.07)]' : 'border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--destructive)/.06)]'}`}><div className="flex gap-3"><span className="mt-0.5">{question.options.find((option) => option.id === picked)?.correct ? <CheckCircle2 size={18} className="text-[hsl(var(--primary))]" /> : <XCircle size={18} className="text-[hsl(var(--destructive))]" />}</span><div><p className="text-sm font-semibold">{question.options.find((option) => option.id === picked)?.correct ? 'Strong signal.' : 'A useful correction.'}</p><p data-testid="text-answer-explanation" className="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{question.options.find((option) => option.id === picked)?.explanation}</p></div></div></div>}<div className="mt-7 flex justify-end">{!submitted ? <button onClick={onSubmit} disabled={!picked} data-testid="button-submit-answer" className="inline-flex h-11 items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40">Lock response <Send size={15} /></button> : <button onClick={onNext} data-testid="button-next-question" className="inline-flex h-11 items-center gap-2 rounded-lg bg-[hsl(var(--foreground))] px-5 text-sm font-semibold text-[hsl(var(--background))] transition-all hover:-translate-y-0.5">Continue path <ArrowRight size={15} /></button>}</div></>}
      </section>
    </div>
    <div className="mt-4 flex flex-wrap items-start gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.4)] p-5"><Sparkles size={18} className="mt-0.5 text-[hsl(var(--accent-foreground))]" /><p className="max-w-3xl text-xs leading-5 text-[hsl(var(--muted-foreground))]"><strong className="text-[hsl(var(--foreground))]">Why adaptive?</strong> A wrong answer routes to a foundation check; a correct answer raises the bar. The result is a more useful readiness conversation than a fixed quiz can provide.</p></div>
  </div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={AppShell} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

const queryClient = new QueryClient();

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;