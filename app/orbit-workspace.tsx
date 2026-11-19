/* oxlint-disable react/react-compiler, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  Activity,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronsLeft,
  CircleDot,
  Filter,
  Gauge,
  Inbox,
  Layers3,
  List,
  Menu,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Plus,
  Rocket,
  Search,
  Settings,
  Sun,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { toast, Toaster } from '@/components/ui/toast';
import { signIn, signOut, useSession } from 'next-auth/react';
import { dicts, LangSwitch, useLang } from './i18n';

type Status = 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';
type Issue = {
  id: string;
  title: string;
  status: Status;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignee: string;
  project: string;
  labels: string[];
  estimate: number;
  updated: string;
};
type View = 'board' | 'list' | 'roadmap' | 'projects' | 'inbox';
const columns: Status[] = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'];
const colors: Record<string, string> = {
  AM: '#ad4b27',
  VK: '#505ab8',
  LS: '#247458',
  NR: '#91479e',
};
const seed: Issue[] = [
  {
    id: 'ORB-118',
    title: 'Map keyboard navigation across board',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'LS',
    project: 'Accessibility',
    labels: ['A11y'],
    estimate: 3,
    updated: '12m',
  },
  {
    id: 'ORB-121',
    title: 'Define notification grouping rules',
    status: 'Todo',
    priority: 'High',
    assignee: 'NR',
    project: 'Core experience',
    labels: ['Product'],
    estimate: 5,
    updated: '24m',
  },
  {
    id: 'ORB-124',
    title: 'Ship contextual command menu',
    status: 'Todo',
    priority: 'Urgent',
    assignee: 'VK',
    project: 'Velocity',
    labels: ['Frontend'],
    estimate: 5,
    updated: '1h',
  },
  {
    id: 'ORB-129',
    title: 'Realtime presence in issue details',
    status: 'In Progress',
    priority: 'High',
    assignee: 'AM',
    project: 'Collaboration',
    labels: ['Realtime'],
    estimate: 8,
    updated: '8m',
  },
  {
    id: 'ORB-132',
    title: 'Polish workspace switcher motion',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'VK',
    project: 'Core experience',
    labels: ['Motion'],
    estimate: 3,
    updated: '36m',
  },
  {
    id: 'ORB-136',
    title: 'Optimistic issue status updates',
    status: 'Review',
    priority: 'High',
    assignee: 'LS',
    project: 'Velocity',
    labels: ['Backend'],
    estimate: 5,
    updated: '5m',
  },
  {
    id: 'ORB-139',
    title: 'Release cycle health indicators',
    status: 'Done',
    priority: 'Medium',
    assignee: 'NR',
    project: 'Analytics',
    labels: ['Data'],
    estimate: 3,
    updated: '2h',
  },
  {
    id: 'ORB-141',
    title: 'Responsive board density pass',
    status: 'Done',
    priority: 'Low',
    assignee: 'AM',
    project: 'Mobile',
    labels: ['Design'],
    estimate: 2,
    updated: '3h',
  },
];
const nav: {
  label: string;
  icon: typeof Inbox;
  view?: View;
  badge?: string;
}[] = [
  { label: 'Inbox', icon: Inbox, view: 'inbox', badge: '4' },
  { label: 'My issues', icon: CircleDot, view: 'list' },
  { label: 'Projects', icon: Boxes, view: 'projects' },
  { label: 'Views', icon: Layers3, view: 'board' },
  { label: 'Roadmap', icon: Gauge, view: 'roadmap' },
  { label: 'Teams', icon: Users },
];

function Avatar({
  initials,
  small = false,
}: {
  initials: string;
  small?: boolean;
}) {
  return (
    <span
      className={`${small ? 'size-5 text-[8px]' : 'size-7 text-[10px]'} avatar`}
      style={{ background: colors[initials] }}
    >
      {initials}
    </span>
  );
}
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.4Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.7-2.4L15.4 17c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.7A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.9A6 6 0 0 1 6.1 12c0-.7.1-1.3.3-1.9V7.4H3A10 10 0 0 0 3 16.6l3.4-2.7Z"
      />
      <path
        fill="#EA4335"
        d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.8A9.8 9.8 0 0 0 12 2a10 10 0 0 0-9 5.4l3.4 2.7C7.2 7.8 9.4 6 12 6Z"
      />
    </svg>
  );
}
function Priority({ value }: { value: Issue['priority'] }) {
  const { t } = useLang();
  const bars = { Low: 1, Medium: 2, High: 3, Urgent: 4 }[value];
  return (
    <span
      className={`priority priority-${value.toLowerCase()}`}
      aria-label={t.priorityLabel(t.priority[value])}
    >
      {[1, 2, 3, 4].map((n) => (
        <i key={n} className={n <= bars ? 'on' : ''} />
      ))}
    </span>
  );
}
function IssueCard({
  issue,
  onOpen,
}: {
  issue: Issue;
  onOpen: (i: Issue) => void;
}) {
  const d = useDraggable({ id: issue.id, data: { issue } });
  const { t } = useLang();
  return (
    <article
      ref={d.setNodeRef}
      style={{
        transform: d.transform
          ? `translate3d(${d.transform.x}px,${d.transform.y}px,0)`
          : undefined,
      }}
      className={`issue-card ${d.isDragging ? 'dragging' : ''}`}
      onClick={() => !d.isDragging && onOpen(issue)}
      {...d.listeners}
      {...d.attributes}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !d.isDragging) {
          event.preventDefault();
          onOpen(issue);
        } else {
          d.listeners?.onKeyDown?.(event);
        }
      }}
    >
      <div className="issue-meta">
        <span>{issue.id}</span>
        <MoreHorizontal />
      </div>
      <h3>{issue.title}</h3>
      <div className="labels">
        {issue.labels.map((x) => (
          <span key={x}>{t.labels[x] ?? x}</span>
        ))}
      </div>
      <div className="issue-footer">
        <div>
          <Priority value={issue.priority} />
          <span className="estimate">{issue.estimate}</span>
        </div>
        <Avatar initials={issue.assignee} small />
      </div>
    </article>
  );
}

function IssueCardPreview({ issue }: { issue: Issue }) {
  const { t } = useLang();
  return (
    <article className="issue-card drag-preview" aria-hidden="true">
      <div className="issue-meta">
        <span>{issue.id}</span>
        <MoreHorizontal />
      </div>
      <h3>{issue.title}</h3>
      <div className="labels">
        {issue.labels.map((label) => (
          <span key={label}>{t.labels[label] ?? label}</span>
        ))}
      </div>
      <div className="issue-footer">
        <div>
          <Priority value={issue.priority} />
          <span className="estimate">{issue.estimate}</span>
        </div>
        <Avatar initials={issue.assignee} small />
      </div>
    </article>
  );
}
function BoardColumn({
  status,
  issues,
  onOpen,
  onAdd,
}: {
  status: Status;
  issues: Issue[];
  onOpen: (i: Issue) => void;
  onAdd: () => void;
}) {
  const d = useDroppable({ id: status });
  const { t } = useLang();
  return (
    <section
      ref={d.setNodeRef}
      className={`board-column ${d.isOver ? 'is-over' : ''}`}
    >
      <header>
        <div>
          <i
            className={`status-dot status-${status.replace(' ', '-').toLowerCase()}`}
          />
          <h2>{t.status[status]}</h2>
          <span>{issues.length}</span>
        </div>
        <button onClick={onAdd} aria-label={t.column.add(t.status[status])}>
          <Plus />
        </button>
      </header>
      <div className="cards">
        {issues.map((i) => (
          <IssueCard key={i.id} issue={i} onOpen={onOpen} />
        ))}
        {issues.length === 0 && (
          <button className="empty-column" onClick={onAdd}>
            <Plus />
            {t.column.first}
          </button>
        )}
      </div>
    </section>
  );
}

export function OrbitWorkspace() {
  const [issues, setIssues] = useState(seed),
    [view, setView] = useState<View>('board'),
    [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false),
    [dark, setDark] = useState(true),
    [commands, setCommands] = useState(false),
    [create, setCreate] = useState(false),
    [selected, setSelected] = useState<Issue | null>(null),
    [query, setQuery] = useState(''),
    [title, setTitle] = useState(''),
    [filterOpen, setFilterOpen] = useState(false),
    [statusFilter, setStatusFilter] = useState<Status | 'All'>('All'),
    [assigneeFilter, setAssigneeFilter] = useState('All'),
    [authOpen, setAuthOpen] = useState(false),
    [authLoading, setAuthLoading] = useState(false);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const { t } = useLang();
  // Sample issue titles follow the chosen language (titles the user edited stay as typed).
  useEffect(() => {
    setIssues((items) => items.map((i) => {
      const known = Object.values(dicts).map((d) => d.issues[i.id]);
      return t.issues[i.id] && known.includes(i.title) ? { ...i, title: t.issues[i.id] } : i;
    }));
  }, [t]);
  const { data: session } = useSession();
  const account = session?.user
    ? {
        name:
          session.user.name ??
          session.user.email?.split('@')[0] ??
          t.member,
        email: session.user.email ?? '',
      }
    : null;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommands((v) => !v);
      }
      if (
        e.key.toLowerCase() === 'c' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setCreate(true);
      }
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [dark]);
  const filtered = useMemo(
    () =>
      issues.filter((i) => {
        const matchesQuery =
          `${i.id} ${i.title} ${i.project} ${i.labels.join(' ')}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return (
          matchesQuery &&
          (statusFilter === 'All' || i.status === statusFilter) &&
          (assigneeFilter === 'All' || i.assignee === assigneeFilter)
        );
      }),
    [issues, query, statusFilter, assigneeFilter],
  );
  const done = issues.filter((i) => i.status === 'Done').length,
    progress = Math.round((done / issues.length) * 100),
    points = issues.reduce((sum, issue) => sum + issue.estimate, 0),
    activeFilters =
      Number(statusFilter !== 'All') + Number(assigneeFilter !== 'All');
  const move = (e: DragEndEvent) => {
    const status = e.over?.id as Status | undefined,
      id = e.active.id as string;
    setActiveIssue(null);
    if (!status || !columns.includes(status)) return;
    setIssues((x) =>
      x.map((i) => (i.id === id ? { ...i, status, updated: 'now' } : i)),
    );
    toast.add({
      title: t.toast.updated,
      description: t.toast.moved(id, t.status[status]),
      type: 'success',
    });
  };
  const make = () => {
    if (!title.trim()) return;
    const issue: Issue = {
      id: `ORB-${150 + issues.length}`,
      title: title.trim(),
      status: 'Todo',
      priority: 'Medium',
      assignee: 'VK',
      project: 'Core experience',
      labels: ['New'],
      estimate: 3,
      updated: 'now',
    };
    setIssues((x) => [issue, ...x]);
    setTitle('');
    setCreate(false);
    toast.add({
      title: t.toast.created,
      description: t.toast.ready(issue.id),
      type: 'success',
    });
  };
  const choose = (v: View) => {
    setView(v);
    setMobile(false);
  };
  const updateSelected = (change: Partial<Issue>) => {
    if (!selected) return;
    const next = { ...selected, ...change, updated: 'now' };
    setIssues((items) =>
      items.map((item) => (item.id === selected.id ? next : item)),
    );
    setSelected(next);
  };
  const duplicateSelected = () => {
    if (!selected) return;
    const copy = {
      ...selected,
      id: `ORB-${150 + issues.length}`,
      title: t.copy(selected.title),
      updated: 'now',
    };
    setIssues((items) => [copy, ...items]);
    setSelected(copy);
    toast.add({
      title: t.toast.duplicated,
      description: t.toast.editable(copy.id),
      type: 'success',
    });
  };
  const deleteSelected = () => {
    if (!selected) return;
    setIssues((items) => items.filter((item) => item.id !== selected.id));
    toast.add({
      title: t.toast.deleted,
      description: t.toast.removed(selected.id),
      type: 'success',
    });
    setSelected(null);
  };
  const demoNotice = (feature: string) =>
    toast.add({
      title: t.toast.preview(feature),
      description: t.toast.local,
      type: 'success',
    });
  const signInWithGoogle = async () => {
    setAuthLoading(true);
    try {
      await signIn('google', { redirectTo: '/' });
    } catch {
      setAuthLoading(false);
      toast.add({
        title: t.toast.googleFail,
        description: t.toast.googleFailText,
        type: 'error',
      });
    }
  };
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setAuthOpen(false);
    toast.add({
      title: t.toast.signedOut,
      description: t.toast.signedOutText,
      type: 'success',
    });
  };
  const heading = t.headings[view];
  return (
    <Toaster>
      <a className="orbit-skip" href="#orbit-content">
        {t.skip}
      </a>
      <div className="app-shell">
        <aside
          className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobile ? 'mobile-open' : ''}`}
        >
          <button
            className="workspace"
            onClick={() => demoNotice(t.features.switcher)}
          >
            <div className="orbit-mark">
              <i />
              <i />
              <span>O</span>
            </div>
            {!collapsed && (
              <div>
                <strong>Orbit Labs</strong>
                <span>{t.sidebar.workspaceSub}</span>
              </div>
            )}
            <ChevronDown className="chevron" />
          </button>
          <nav aria-label={t.sidebar.navLabel}>
            {nav.map((n) => (
              <button
                key={n.label}
                className={n.view === view ? 'active' : ''}
                aria-current={n.view === view ? 'page' : undefined}
                onClick={() => (n.view ? choose(n.view) : demoNotice(t.nav[n.label]))}
              >
                <n.icon />
                <span>{t.nav[n.label]}</span>
                {n.badge && <b>{n.badge}</b>}
              </button>
            ))}
          </nav>
          <div className="nav-group">
            <p>{t.sidebar.favorites}</p>
            <button onClick={() => choose('board')}>
              <span className="project-glyph violet">V</span>
              <span>Velocity</span>
            </button>
            <button onClick={() => choose('projects')}>
              <span className="project-glyph coral">C</span>
              <span>{t.projects['Core experience']}</span>
            </button>
          </div>
          <div className="sidebar-foot">
            <button onClick={() => setDark((v) => !v)}>
              {dark ? <Sun /> : <Moon />}
              <span>{dark ? t.sidebar.light : t.sidebar.dark}</span>
            </button>
            <button onClick={() => demoNotice(t.features.settings)}>
              <Settings />
              <span>{t.sidebar.settings}</span>
            </button>
          </div>
          <button
            className="sidebar-collapse"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={t.sidebar.collapse}
          >
            <ChevronsLeft />
          </button>
        </aside>
        {mobile && (
          <button
            className="mobile-scrim"
            onClick={() => setMobile(false)}
            aria-label={t.sidebar.close}
          />
        )}
        <main className="main-shell">
          <header className="topbar">
            <button
              className="mobile-menu"
              onClick={() => setMobile(true)}
              aria-label={t.top.menu}
            >
              <Menu />
            </button>
            <div className="breadcrumbs">
              <span>Orbit Labs</span>
              <i>/</i>
              <strong>{view === 'board' ? 'Velocity' : heading}</strong>
            </div>
            <button
              className="search-trigger"
              aria-label={`${t.top.search} ⌘ K`}
              onClick={() => setCommands(true)}
            >
              <Search />
              <span>{t.top.search}</span>
              <kbd>⌘ K</kbd>
            </button>
            <div className="top-actions">
              <LangSwitch />
              <button
                onClick={() => demoNotice(t.features.activity)}
                aria-label={t.top.activity}
              >
                <Activity />
              </button>
              <button
                className="notification"
                onClick={() => choose('inbox')}
                aria-label={t.top.notifications}
              >
                <Bell />
                <i />
              </button>
              <button
                className="account-trigger"
                onClick={() => setAuthOpen(true)}
                aria-label={
                  account
                    ? t.top.account(account.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase(), account.name)
                    : t.top.signIn
                }
              >
                <span aria-hidden="true">
                  <Avatar
                    initials={
                      account
                        ? account.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()
                        : 'VK'
                    }
                  />
                </span>
              </button>
            </div>
          </header>
          <section
            className="content"
            id="orbit-content"
            tabIndex={-1}
            aria-label={t.content}
          >
            <div className="workspace-notice">
              <CircleDot aria-hidden="true" size={14} />
              <span>
                {t.notice}
              </span>
            </div>
            <div className="page-heading">
              <div>
                <div className="eyebrow">
                  <span className="project-glyph violet">V</span>{t.eyebrow}
                </div>
                <h1>{heading}</h1>
                <p>
                  {view === 'board'
                    ? t.boardLead
                    : t.otherLead}
                </p>
              </div>
              <div className="heading-actions">
                <Button variant="outline" onClick={() => setCommands(true)}>
                  <Search />
                  {t.searchBtn}
                </Button>
                <Button onClick={() => setCreate(true)}>
                  <Plus />
                  {t.newIssue}
                </Button>
              </div>
            </div>
            {view === 'board' && (
              <>
                <div className="cycle-strip">
                  <div className="cycle-orbit">
                    <progress
                      className="sr-only"
                      aria-label={t.cycle.label}
                      max={100}
                      value={progress}
                    />
                    <span>{progress}%</span>
                  </div>
                  <div>
                    <span>{t.cycle.name}</span>
                    <strong>{t.cycle.momentum}</strong>
                    <small>
                      {t.cycle.sample(done, issues.length)}
                    </small>
                  </div>
                  <div className="cycle-metrics">
                    <div>
                      <b>{points}</b>
                      <span>{t.cycle.points}</span>
                    </div>
                    <div>
                      <b>
                        {
                          issues.filter(
                            (issue) => issue.status === 'In Progress',
                          ).length
                        }
                      </b>
                      <span>{t.cycle.inProgress}</span>
                    </div>
                    <div className="members">
                      <Avatar initials="VK" small />
                      <Avatar initials="AM" small />
                      <Avatar initials="LS" small />
                      <Avatar initials="NR" small />
                    </div>
                  </div>
                </div>
                <div className="viewbar">
                  <div className="view-tabs">
                    <button className="active">
                      <Layers3 />
                      {t.viewBoard}
                    </button>
                    <button onClick={() => setView('list')}>
                      <List />
                      {t.viewList}
                    </button>
                  </div>
                  <div className="view-tools">
                    <button
                      onClick={() => setFilterOpen((value) => !value)}
                      aria-expanded={filterOpen}
                    >
                      <Filter />
                      {t.filter} {activeFilters > 0 && <b>{activeFilters}</b>}
                    </button>
                    <button
                      className={assigneeFilter !== 'All' ? 'is-active' : ''}
                      onClick={() => setFilterOpen(true)}
                    >
                      <Users />
                      {t.assignee}
                    </button>
                    <button
                      onClick={() => demoNotice(t.features.board)}
                      aria-label={t.features.board}
                    >
                      <MoreHorizontal />
                    </button>
                  </div>
                </div>
                {filterOpen && (
                  <div className="filter-panel" aria-label={t.filters}>
                    <label>
                      {t.statusField}
                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(e.target.value as Status | 'All')
                        }
                      >
                        <option value="All">{t.all}</option>
                        {columns.map((status) => (
                          <option key={status} value={status}>{t.status[status]}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t.assignee}
                      <select
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                      >
                        <option value="All">{t.all}</option>
                        {Object.keys(colors).map((person) => (
                          <option key={person}>{person}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      onClick={() => {
                        setStatusFilter('All');
                        setAssigneeFilter('All');
                      }}
                    >
                      {t.clear}
                    </button>
                  </div>
                )}
                <DndContext
                  id="orbit-board"
                  sensors={sensors}
                  onDragStart={(event) =>
                    setActiveIssue(event.active.data.current?.issue ?? null)
                  }
                  onDragCancel={() => setActiveIssue(null)}
                  onDragEnd={move}
                >
                  <div className="board">
                    {columns.map((s) => (
                      <BoardColumn
                        key={s}
                        status={s}
                        issues={filtered.filter((i) => i.status === s)}
                        onOpen={setSelected}
                        onAdd={() => setCreate(true)}
                      />
                    ))}
                  </div>
                  <DragOverlay
                    dropAnimation={{
                      duration: 180,
                      easing: 'cubic-bezier(.2,.8,.2,1)',
                    }}
                  >
                    {activeIssue ? (
                      <IssueCardPreview issue={activeIssue} />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </>
            )}
            {view === 'list' && (
              <ListView
                issues={filtered}
                query={query}
                setQuery={setQuery}
                onOpen={setSelected}
                onBoard={() => setView('board')}
              />
            )}{' '}
            {view === 'roadmap' && <Roadmap />}
            {view === 'projects' && <Projects />}
            {view === 'inbox' && <InboxView />}
          </section>
        </main>
        <CommandDialog
          open={commands}
          onOpenChange={setCommands}
          title={t.cmd.title}
        >
          <Command>
            <CommandInput placeholder={t.cmd.ph} />
            <CommandList>
              <CommandEmpty>{t.cmd.empty}</CommandEmpty>
              <CommandGroup heading={t.cmd.navigate}>
                {nav
                  .filter((n) => n.view)
                  .map((n) => (
                    <CommandItem
                      key={n.label}
                      onSelect={() => {
                        choose(n.view!);
                        setCommands(false);
                      }}
                    >
                      <n.icon />
                      {t.nav[n.label]}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading={t.cmd.actions}>
                <CommandItem
                  onSelect={() => {
                    setCommands(false);
                    setCreate(true);
                  }}
                >
                  <Plus />
                  {t.cmd.create}<CommandShortcut>C</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => setDark((v) => !v)}>
                  {dark ? <Sun /> : <Moon />}{t.cmd.theme}
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setCommands(false);
                    setView('list');
                  }}
                >
                  <Search />
                  {t.cmd.searchAll}
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading={t.cmd.recent}>
                {issues.slice(0, 5).map((issue) => (
                  <CommandItem
                    key={issue.id}
                    value={`${issue.id} ${issue.title}`}
                    onSelect={() => {
                      setCommands(false);
                      setSelected(issue);
                    }}
                  >
                    <CircleDot />
                    <span className="command-issue">
                      <strong>{issue.title}</strong>
                      <small>
                        {issue.id} · {t.status[issue.status]}
                      </small>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
        <Dialog open={create} onOpenChange={setCreate}>
          <DialogContent className="create-dialog">
            <DialogHeader>
              <DialogTitle>{t.create.title}</DialogTitle>
              <DialogDescription>
                {t.create.desc}
              </DialogDescription>
            </DialogHeader>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && make()}
              placeholder={t.create.ph}
            />
            <div className="quick-fields">
              <button onClick={() => demoNotice(t.features.status)}>
                <CircleDot />
                {t.status.Todo}
                <ChevronDown />
              </button>
              <button onClick={() => demoNotice(t.features.priority)}>
                <Zap />
                {t.priority.Medium}
                <ChevronDown />
              </button>
              <button onClick={() => demoNotice(t.features.assignee)}>
                <Avatar initials="VK" small />
                Victor
                <ChevronDown />
              </button>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreate(false)}>
                {t.create.cancel}
              </Button>
              <Button onClick={make} disabled={!title.trim()}>
                {t.create.submit} <kbd>↵</kbd>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={authOpen} onOpenChange={setAuthOpen}>
          <DialogContent className="auth-dialog">
            <div className="auth-orbit-mark">O</div>
            <DialogHeader>
              <DialogTitle>
                {account
                  ? t.auth.welcome(account.name)
                  : t.auth.join}
              </DialogTitle>
              <DialogDescription>
                {account
                  ? account.email
                  : t.auth.desc}
              </DialogDescription>
            </DialogHeader>
            {account ? (
              <Button variant="outline" onClick={handleSignOut}>
                {t.auth.signOut}
              </Button>
            ) : (
              <button
                className="google-auth-button"
                onClick={signInWithGoogle}
                disabled={authLoading}
              >
                <GoogleMark />
                {authLoading ? t.auth.opening : t.auth.google}
              </button>
            )}
            <p className="auth-demo-note">
              {t.auth.note}
            </p>
          </DialogContent>
        </Dialog>
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="issue-dialog" showCloseButton={false}>
            {selected && (
              <>
                <div className="issue-dialog-top">
                  <div className="issue-identity">
                    <span>{selected.id}</span>
                    <i
                      className={`status-dot status-${selected.status.replace(' ', '-').toLowerCase()}`}
                    />
                    <strong>{t.status[selected.status]}</strong>
                  </div>
                  <div>
                    <button onClick={duplicateSelected}>{t.issue.duplicate}</button>
                    <button className="danger-action" onClick={deleteSelected}>
                      {t.issue.del}
                    </button>
                    <button
                      onClick={() => setSelected(null)}
                      aria-label={t.issue.close}
                    >
                      <X />
                    </button>
                  </div>
                </div>
                <DialogHeader>
                  <DialogTitle>
                    <input
                      className="issue-title-input"
                      value={selected.title}
                      onChange={(e) =>
                        updateSelected({ title: e.target.value })
                      }
                      aria-label={t.issue.titleLabel}
                    />
                  </DialogTitle>
                  <DialogDescription>
                    {t.issue.updated(t.projects[selected.project] ?? selected.project, t.ago(selected.updated))}
                  </DialogDescription>
                </DialogHeader>
                <div className="issue-detail-grid">
                  <div className="issue-description">
                    <p>
                      {t.issue.body}
                    </p>
                    <h4>{t.issue.subtasks}</h4>
                    <label>
                      <input type="checkbox" defaultChecked /> {t.issue.sub1}
                    </label>
                    <label>
                      <input type="checkbox" /> {t.issue.sub2}
                    </label>
                    <h4>{t.issue.activity}</h4>
                    <div className="activity-row">
                      <Avatar initials="VK" small />
                      <p>
                        <strong>Victor</strong> {t.issue.moved}
                        <br />
                        <span>{t.status.Todo} → {t.status[selected.status]}</span>
                      </p>
                      <small>12m</small>
                    </div>
                    <div className="activity-row muted-event">
                      <span className="timeline-dot" />
                      <p>
                        <strong>{t.issue.automation}</strong> {t.issue.added}{' '}
                        <span>{t.labels[selected.labels[0]] ?? selected.labels[0]}</span>
                      </p>
                      <small>18m</small>
                    </div>
                    <div className="comment-box">
                      <MessageSquare />
                      <input placeholder={t.issue.comment} />
                    </div>
                  </div>
                  <aside>
                    <Property
                      icon={CircleDot}
                      label={t.issue.status}
                      value={t.status[selected.status]}
                      onClick={() =>
                        updateSelected({
                          status:
                            columns[
                              (columns.indexOf(selected.status) + 1) %
                                columns.length
                            ],
                        })
                      }
                    />
                    <Property
                      icon={Zap}
                      label={t.issue.priority}
                      value={t.priority[selected.priority]}
                      onClick={() => {
                        const values: Issue['priority'][] = [
                          'Low',
                          'Medium',
                          'High',
                          'Urgent',
                        ];
                        updateSelected({
                          priority:
                            values[
                              (values.indexOf(selected.priority) + 1) %
                                values.length
                            ],
                        });
                      }}
                    />
                    <Property
                      icon={Users}
                      label={t.issue.assignee}
                      value={selected.assignee}
                      onClick={() => {
                        const values = Object.keys(colors);
                        updateSelected({
                          assignee:
                            values[
                              (values.indexOf(selected.assignee) + 1) %
                                values.length
                            ],
                        });
                      }}
                    />
                    <Property
                      icon={Rocket}
                      label={t.issue.project}
                      value={t.projects[selected.project] ?? selected.project}
                    />
                    <Property
                      icon={CalendarDays}
                      label={t.issue.due}
                      value={t.issue.dueValue}
                    />
                  </aside>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Toaster>
  );
}
function Property({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof CircleDot;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <button className="property" onClick={onClick}>
      <span>
        <Icon />
        {label}
      </span>
      <strong>{value}</strong>
    </button>
  );
}
function ListView({
  issues,
  query,
  setQuery,
  onOpen,
  onBoard,
}: {
  issues: Issue[];
  query: string;
  setQuery: (v: string) => void;
  onOpen: (i: Issue) => void;
  onBoard: () => void;
}) {
  const [sort, setSort] = useState<'updated' | 'priority'>('updated');
  const { t } = useLang();
  const priorities: Record<Issue['priority'], number> = {
    Low: 1,
    Medium: 2,
    High: 3,
    Urgent: 4,
  };
  const rows = [...issues].sort((a, b) =>
    sort === 'priority'
      ? priorities[b.priority] - priorities[a.priority]
      : a.updated.localeCompare(b.updated),
  );
  return (
    <div className="list-panel">
      <div className="list-toolbar">
        <div className="view-tabs">
          <button onClick={onBoard}>
            <Layers3 />
            {t.viewBoard}
          </button>
          <button className="active">
            <List />
            {t.viewList}
          </button>
        </div>
        <div className="input-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.list.filter}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSort(sort === 'updated' ? 'priority' : 'updated')}
        >
          <Filter />
          {t.list.sort(sort)}
        </Button>
      </div>
      <div className="issue-table">
        <div className="table-row table-head">
          {t.list.cols.map((c) => <span key={c}>{c}</span>)}
        </div>
        {rows.map((i) => (
          <button key={i.id} className="table-row" onClick={() => onOpen(i)}>
            <span>
              <input type="checkbox" onClick={(e) => e.stopPropagation()} />
              <em>{i.id}</em>
              <strong>{i.title}</strong>
            </span>
            <span>
              <i
                className={`status-dot status-${i.status.replace(' ', '-').toLowerCase()}`}
              />
              {t.status[i.status]}
            </span>
            <span>
              <Priority value={i.priority} />
              {t.priority[i.priority]}
            </span>
            <span>
              <Avatar initials={i.assignee} small />
              {i.assignee}
            </span>
            <span>{t.projects[i.project] ?? i.project}</span>
            <span>{t.ago(i.updated)}</span>
          </button>
        ))}
        {rows.length === 0 && (
          <div className="empty-list">
            <Search />
            <strong>{t.list.none}</strong>
            <span>{t.list.noneText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
function Roadmap() {
  const { t } = useLang();
  const ps = [
    ['Core experience', 'active', '74'],
    ['Realtime collaboration', 'active', '46'],
    ['Mobile orbit', 'planned', '12'],
    ['Analytics foundation', 'completed', '100'],
  ];
  return (
    <div className="roadmap">
      <div className="roadmap-scale">
        {t.roadmap.months.map((m) => <span key={m}>{m}</span>)}
      </div>
      {ps.map((p, n) => (
        <div className="roadmap-row" key={p[0]}>
          <div>
            <span className={`project-glyph ${n % 2 ? 'coral' : 'violet'}`}>
              {(t.projects[p[0]] ?? p[0])[0]}
            </span>
            <strong>{t.projects[p[0]] ?? p[0]}</strong>
            <small>{t.roadmap.state[p[1]]}</small>
          </div>
          <div className="timeline">
            <i className={`bar bar-${n}`}>
              <span>{p[2]}%</span>
            </i>
          </div>
        </div>
      ))}
    </div>
  );
}
function Projects() {
  const { t } = useLang();
  return (
    <div className="project-grid">
      {[
        ['Velocity', 'Interactions that make teams feel fast.', '74', '12'],
        [
          'Core experience',
          'A calm, coherent workspace foundation.',
          '61',
          '18',
        ],
        ['Collaboration', 'Realtime presence and conversation.', '46', '9'],
        ['Mobile orbit', 'A focused experience for small screens.', '12', '7'],
      ].map((p, n) => (
        <article key={p[0]}>
          <div className="project-card-top">
            <span className={`project-glyph ${n % 2 ? 'coral' : 'violet'}`}>
              {p[0][0]}
            </span>
            <MoreHorizontal />
          </div>
          <h3>{t.projects[p[0]] ?? p[0]}</h3>
          <p>{t.projectCards[n]}</p>
          <div className="project-progress">
            <span>
              <i style={{ width: `${p[2]}%` }} />
            </span>
            <b>{p[2]}%</b>
          </div>
          <footer>
            <span>
              <CircleDot />
              {t.issuesCount(p[3])}
            </span>
            <div>
              <Avatar initials="VK" small />
              <Avatar initials="AM" small />
            </div>
          </footer>
        </article>
      ))}
    </div>
  );
}
function InboxView() {
  const { t } = useLang();
  return (
    <div className="inbox-panel">
      <div className="inbox-tabs">
        <button className="active">
          {t.inbox.all} <b>4</b>
        </button>
        <button>{t.inbox.mentions}</button>
        <button>{t.inbox.assigned}</button>
        <Button variant="ghost">
          <Check />
          {t.inbox.markRead}
        </Button>
      </div>
      {[
        [
          'NR',
          'Nora assigned you to ORB-124',
          'Ship contextual command menu',
          '2m',
        ],
        [
          'AM',
          'Ana commented on ORB-129',
          '“The presence indicator is ready to review.”',
          '18m',
        ],
        [
          'LS',
          'Leo changed the due date',
          'Responsive board density pass · Sep 12',
          '1h',
        ],
        [
          'VK',
          'Cycle 08 is 74% complete',
          '5 issues remain before Momentum closes.',
          '3h',
        ],
      ].map((n, i) => (
        <button
          className={`notification-row ${i < 2 ? 'unread' : ''}`}
          key={n[1]}
        >
          <Avatar initials={n[0]} />
          <span>
            <strong>{t.inbox.rows[i][0]}</strong>
            <p>{t.inbox.rows[i][1]}</p>
          </span>
          <time>{n[3]}</time>
        </button>
      ))}
    </div>
  );
}
