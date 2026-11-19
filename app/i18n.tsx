'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export const LANGS = ['en', 'pt', 'es'] as const;
export type Lang = (typeof LANGS)[number];
export const langLabel: Record<Lang, string> = { en: 'English', pt: 'Português', es: 'Español' };
const HTML_LANG: Record<Lang, string> = { en: 'en', pt: 'pt-BR', es: 'es' };
const KEY = 'orbit:lang';
const isLang = (v: unknown): v is Lang => typeof v === 'string' && (LANGS as readonly string[]).includes(v);

/** ?lang= wins, then the saved choice, then the browser language. Runs after mount (SSR renders English). */
function detect(): Lang {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (isLang(q)) return q;
    const saved = localStorage.getItem(KEY);
    if (isLang(saved)) return saved;
  } catch { /* storage blocked */ }
  const nav = navigator.language.toLowerCase();
  return nav.startsWith('pt') ? 'pt' : nav.startsWith('es') ? 'es' : 'en';
}

const en = {
  language: 'Language',
  status: { Backlog: 'Backlog', Todo: 'Todo', 'In Progress': 'In Progress', Review: 'Review', Done: 'Done' } as Record<string, string>,
  priority: { Low: 'Low', Medium: 'Medium', High: 'High', Urgent: 'Urgent' } as Record<string, string>,
  priorityLabel: (p: string) => `${p} priority`,
  all: 'All',
  nav: { Inbox: 'Inbox', 'My issues': 'My issues', Projects: 'Projects', Views: 'Views', Roadmap: 'Roadmap', Teams: 'Teams' } as Record<string, string>,
  projects: { Accessibility: 'Accessibility', 'Core experience': 'Core experience', Velocity: 'Velocity', Collaboration: 'Collaboration', Analytics: 'Analytics', Mobile: 'Mobile', 'Realtime collaboration': 'Realtime collaboration', 'Mobile orbit': 'Mobile orbit', 'Analytics foundation': 'Analytics foundation' } as Record<string, string>,
  labels: { A11y: 'A11y', Product: 'Product', Frontend: 'Frontend', Realtime: 'Realtime', Motion: 'Motion', Backend: 'Backend', Data: 'Data', Design: 'Design', New: 'New' } as Record<string, string>,
  issues: {
    'ORB-118': 'Map keyboard navigation across board', 'ORB-121': 'Define notification grouping rules', 'ORB-124': 'Ship contextual command menu',
    'ORB-129': 'Realtime presence in issue details', 'ORB-132': 'Polish workspace switcher motion', 'ORB-136': 'Optimistic issue status updates',
    'ORB-139': 'Release cycle health indicators', 'ORB-141': 'Responsive board density pass',
  } as Record<string, string>,
  ago: (u: string) => (u === 'now' ? 'just now' : `${u} ago`),
  column: { add: (s: string) => `Add issue to ${s}`, first: 'Add the first issue' },
  toast: {
    updated: 'Issue updated', moved: (id: string, s: string) => `${id} moved to ${s}.`,
    created: 'Issue created', ready: (id: string) => `${id} is ready in Todo.`,
    duplicated: 'Issue duplicated', editable: (id: string) => `${id} is ready to edit.`,
    deleted: 'Issue deleted', removed: (id: string) => `${id} was removed from this demo.`,
    preview: (f: string) => `${f} preview`, local: 'This portfolio demo keeps the experience local and reversible.',
    googleFail: 'Could not start Google sign-in', googleFailText: 'Please try again or continue exploring the demo.',
    signedOut: 'Signed out', signedOutText: 'You can keep exploring Orbit in demo mode.',
  },
  features: { switcher: 'Workspace switcher', settings: 'Settings', activity: 'Activity', board: 'Board options', status: 'Status picker', priority: 'Priority picker', assignee: 'Assignee picker' },
  copy: (t: string) => `${t} (copy)`,
  member: 'Orbit member',
  headings: { board: 'Build the next orbit', list: 'All issues', roadmap: 'Roadmap', projects: 'Projects', inbox: 'Inbox' } as Record<string, string>,
  skip: 'Skip to workspace',
  sidebar: { workspaceSub: 'Product workspace · Demo', navLabel: 'Workspace navigation', favorites: 'Favorites', light: 'Light mode', dark: 'Dark mode', settings: 'Settings', collapse: 'Collapse sidebar', close: 'Close sidebar' },
  top: { menu: 'Open menu', search: 'Search or jump to…', activity: 'Open activity', notifications: 'Open notifications', account: (i: string, n: string) => `${i} Account: ${n}`, signIn: 'VK Sign in' },
  content: 'Workspace content',
  notice: 'Portfolio demo. Tasks and changes stay in this browser session.',
  eyebrow: 'Velocity · Engineering',
  boardLead: 'A focused cycle for the interactions that make teams feel fast.',
  otherLead: 'Everything your team needs, in one calm workspace.',
  searchBtn: 'Search', newIssue: 'New issue',
  cycle: { label: 'Cycle completion', name: 'Cycle 08', momentum: 'Momentum', sample: (d: number, n: number) => `Sample cycle · ${d} of ${n} complete`, points: 'points', inProgress: 'in progress' },
  viewBoard: 'Board', viewList: 'List', filter: 'Filter', assignee: 'Assignee', filters: 'Issue filters', statusField: 'Status', clear: 'Clear filters',
  cmd: { title: 'Orbit command menu', ph: 'Search issues, projects, people…', empty: 'No results found.', navigate: 'Navigate', actions: 'Actions', create: 'Create issue', theme: 'Toggle theme', searchAll: 'Search all issues', recent: 'Recent issues' },
  create: { title: 'Create issue', desc: 'Capture the work now. Add details when the team is ready.', ph: 'Issue title', cancel: 'Cancel', submit: 'Create issue' },
  auth: { welcome: (n: string) => `Welcome, ${n}`, join: 'Join your team in Orbit', desc: 'Create your account or sign in securely with Google. You can also keep exploring this portfolio demo.', signOut: 'Sign out', opening: 'Opening Google…', google: 'Continue with Google', note: 'Portfolio demo · no account required to explore' },
  issue: {
    duplicate: 'Duplicate', del: 'Delete', close: 'Close issue', titleLabel: 'Issue title', updated: (p: string, u: string) => `${p} · updated ${u}`,
    body: 'Improve this surface so the team can move through work without losing context. Keep the interaction quick, resilient, and accessible.',
    subtasks: 'Subtasks', sub1: 'Define interaction states', sub2: 'Verify keyboard flow', activity: 'Activity', moved: 'moved this issue', automation: 'Orbit automation', added: 'added', comment: 'Leave a comment…',
    status: 'Status', priority: 'Priority', assignee: 'Assignee', project: 'Project', due: 'Due date', dueValue: 'Sep 12',
  },
  list: { filter: 'Filter issues…', sort: (s: string) => `Sort: ${s === 'updated' ? 'updated' : 'priority'}`, cols: ['Issue', 'Status', 'Priority', 'Assignee', 'Project', 'Updated'], none: 'No issues found', noneText: 'Try clearing your search or filters.' },
  roadmap: { months: ['SEP', 'OCT', 'NOV', 'DEC'], state: { active: 'active', planned: 'planned', completed: 'completed' } as Record<string, string> },
  projectCards: ['Interactions that make teams feel fast.', 'A calm, coherent workspace foundation.', 'Realtime presence and conversation.', 'A focused experience for small screens.'],
  issuesCount: (n: string) => `${n} issues`,
  inbox: {
    all: 'All', mentions: 'Mentions', assigned: 'Assigned', markRead: 'Mark all read',
    rows: [
      ['Nora assigned you to ORB-124', 'Ship contextual command menu'],
      ['Ana commented on ORB-129', '“The presence indicator is ready to review.”'],
      ['Leo changed the due date', 'Responsive board density pass · Sep 12'],
      ['Cycle 08 is 74% complete', '5 issues remain before Momentum closes.'],
    ],
  },
};
export type Dict = typeof en;

const pt: Dict = {
  language: 'Idioma',
  status: { Backlog: 'Backlog', Todo: 'A fazer', 'In Progress': 'Em andamento', Review: 'Revisão', Done: 'Concluído' },
  priority: { Low: 'Baixa', Medium: 'Média', High: 'Alta', Urgent: 'Urgente' },
  priorityLabel: (p) => `Prioridade ${p.toLowerCase()}`,
  all: 'Todos',
  nav: { Inbox: 'Caixa de entrada', 'My issues': 'Minhas tarefas', Projects: 'Projetos', Views: 'Visualizações', Roadmap: 'Roadmap', Teams: 'Times' },
  projects: { Accessibility: 'Acessibilidade', 'Core experience': 'Experiência central', Velocity: 'Velocity', Collaboration: 'Colaboração', Analytics: 'Analytics', Mobile: 'Mobile', 'Realtime collaboration': 'Colaboração em tempo real', 'Mobile orbit': 'Orbit mobile', 'Analytics foundation': 'Base de analytics' },
  labels: { A11y: 'A11y', Product: 'Produto', Frontend: 'Frontend', Realtime: 'Tempo real', Motion: 'Animação', Backend: 'Backend', Data: 'Dados', Design: 'Design', New: 'Nova' },
  issues: {
    'ORB-118': 'Mapear a navegação por teclado no quadro', 'ORB-121': 'Definir regras de agrupamento de notificações', 'ORB-124': 'Lançar o menu de comandos contextual',
    'ORB-129': 'Presença em tempo real nos detalhes da tarefa', 'ORB-132': 'Refinar a animação da troca de workspace', 'ORB-136': 'Atualização otimista do status das tarefas',
    'ORB-139': 'Indicadores de saúde do ciclo de entrega', 'ORB-141': 'Ajuste de densidade responsiva do quadro',
  },
  ago: (u) => (u === 'now' ? 'agora' : `há ${u}`),
  column: { add: (s) => `Adicionar tarefa em ${s}`, first: 'Adicionar a primeira tarefa' },
  toast: {
    updated: 'Tarefa atualizada', moved: (id, s) => `${id} foi para ${s}.`,
    created: 'Tarefa criada', ready: (id) => `${id} está pronta em A fazer.`,
    duplicated: 'Tarefa duplicada', editable: (id) => `${id} está pronta para editar.`,
    deleted: 'Tarefa excluída', removed: (id) => `${id} foi removida desta demo.`,
    preview: (f) => `Prévia: ${f}`, local: 'Esta demo de portfólio mantém tudo local e reversível.',
    googleFail: 'Não foi possível iniciar o login com Google', googleFailText: 'Tente de novo ou continue explorando a demo.',
    signedOut: 'Você saiu', signedOutText: 'Você pode continuar explorando o Orbit no modo demo.',
  },
  features: { switcher: 'Troca de workspace', settings: 'Configurações', activity: 'Atividade', board: 'Opções do quadro', status: 'Seletor de status', priority: 'Seletor de prioridade', assignee: 'Seletor de responsável' },
  copy: (t) => `${t} (cópia)`,
  member: 'Membro do Orbit',
  headings: { board: 'Construa a próxima órbita', list: 'Todas as tarefas', roadmap: 'Roadmap', projects: 'Projetos', inbox: 'Caixa de entrada' },
  skip: 'Pular para o workspace',
  sidebar: { workspaceSub: 'Workspace de produto · Demo', navLabel: 'Navegação do workspace', favorites: 'Favoritos', light: 'Modo claro', dark: 'Modo escuro', settings: 'Configurações', collapse: 'Recolher barra lateral', close: 'Fechar barra lateral' },
  top: { menu: 'Abrir menu', search: 'Buscar ou ir para…', activity: 'Abrir atividade', notifications: 'Abrir notificações', account: (i, n) => `${i} Conta: ${n}`, signIn: 'VK Entrar' },
  content: 'Conteúdo do workspace',
  notice: 'Demo de portfólio. Tarefas e mudanças ficam nesta sessão do navegador.',
  eyebrow: 'Velocity · Engenharia',
  boardLead: 'Um ciclo focado nas interações que fazem o time se sentir rápido.',
  otherLead: 'Tudo o que o seu time precisa, num workspace calmo.',
  searchBtn: 'Buscar', newIssue: 'Nova tarefa',
  cycle: { label: 'Conclusão do ciclo', name: 'Ciclo 08', momentum: 'Embalo', sample: (d, n) => `Ciclo de exemplo · ${d} de ${n} concluídas`, points: 'pontos', inProgress: 'em andamento' },
  viewBoard: 'Quadro', viewList: 'Lista', filter: 'Filtrar', assignee: 'Responsável', filters: 'Filtros de tarefas', statusField: 'Status', clear: 'Limpar filtros',
  cmd: { title: 'Menu de comandos do Orbit', ph: 'Buscar tarefas, projetos, pessoas…', empty: 'Nenhum resultado.', navigate: 'Navegar', actions: 'Ações', create: 'Criar tarefa', theme: 'Alternar tema', searchAll: 'Buscar todas as tarefas', recent: 'Tarefas recentes' },
  create: { title: 'Criar tarefa', desc: 'Registre o trabalho agora. Adicione detalhes quando o time estiver pronto.', ph: 'Título da tarefa', cancel: 'Cancelar', submit: 'Criar tarefa' },
  auth: { welcome: (n) => `Boas-vindas, ${n}`, join: 'Junte-se ao seu time no Orbit', desc: 'Crie sua conta ou entre com segurança pelo Google. Você também pode continuar explorando esta demo de portfólio.', signOut: 'Sair', opening: 'Abrindo o Google…', google: 'Continuar com Google', note: 'Demo de portfólio · não precisa de conta para explorar' },
  issue: {
    duplicate: 'Duplicar', del: 'Excluir', close: 'Fechar tarefa', titleLabel: 'Título da tarefa', updated: (p, u) => `${p} · atualizada ${u}`,
    body: 'Melhore esta área para o time avançar no trabalho sem perder o contexto. Mantenha a interação rápida, resistente e acessível.',
    subtasks: 'Subtarefas', sub1: 'Definir os estados da interação', sub2: 'Verificar o fluxo por teclado', activity: 'Atividade', moved: 'moveu esta tarefa', automation: 'Automação do Orbit', added: 'adicionou', comment: 'Deixe um comentário…',
    status: 'Status', priority: 'Prioridade', assignee: 'Responsável', project: 'Projeto', due: 'Prazo', dueValue: '12 set',
  },
  list: { filter: 'Filtrar tarefas…', sort: (s) => `Ordenar: ${s === 'updated' ? 'atualização' : 'prioridade'}`, cols: ['Tarefa', 'Status', 'Prioridade', 'Responsável', 'Projeto', 'Atualizada'], none: 'Nenhuma tarefa encontrada', noneText: 'Tente limpar a busca ou os filtros.' },
  roadmap: { months: ['SET', 'OUT', 'NOV', 'DEZ'], state: { active: 'ativo', planned: 'planejado', completed: 'concluído' } },
  projectCards: ['Interações que fazem o time se sentir rápido.', 'Uma base de workspace calma e coerente.', 'Presença e conversa em tempo real.', 'Uma experiência focada para telas pequenas.'],
  issuesCount: (n) => `${n} tarefas`,
  inbox: {
    all: 'Todas', mentions: 'Menções', assigned: 'Atribuídas', markRead: 'Marcar todas como lidas',
    rows: [
      ['Nora atribuiu ORB-124 a você', 'Lançar o menu de comandos contextual'],
      ['Ana comentou em ORB-129', '“O indicador de presença está pronto para revisão.”'],
      ['Leo mudou o prazo', 'Ajuste de densidade responsiva do quadro · 12 set'],
      ['O Ciclo 08 está 74% concluído', 'Faltam 5 tarefas para fechar o Embalo.'],
    ],
  },
};

const es: Dict = {
  language: 'Idioma',
  status: { Backlog: 'Backlog', Todo: 'Por hacer', 'In Progress': 'En curso', Review: 'Revisión', Done: 'Hecho' },
  priority: { Low: 'Baja', Medium: 'Media', High: 'Alta', Urgent: 'Urgente' },
  priorityLabel: (p) => `Prioridad ${p.toLowerCase()}`,
  all: 'Todos',
  nav: { Inbox: 'Bandeja', 'My issues': 'Mis tareas', Projects: 'Proyectos', Views: 'Vistas', Roadmap: 'Roadmap', Teams: 'Equipos' },
  projects: { Accessibility: 'Accesibilidad', 'Core experience': 'Experiencia central', Velocity: 'Velocity', Collaboration: 'Colaboración', Analytics: 'Analytics', Mobile: 'Móvil', 'Realtime collaboration': 'Colaboración en tiempo real', 'Mobile orbit': 'Orbit móvil', 'Analytics foundation': 'Base de analytics' },
  labels: { A11y: 'A11y', Product: 'Producto', Frontend: 'Frontend', Realtime: 'Tiempo real', Motion: 'Animación', Backend: 'Backend', Data: 'Datos', Design: 'Diseño', New: 'Nueva' },
  issues: {
    'ORB-118': 'Mapear la navegación con teclado en el tablero', 'ORB-121': 'Definir reglas para agrupar notificaciones', 'ORB-124': 'Lanzar el menú de comandos contextual',
    'ORB-129': 'Presencia en tiempo real en el detalle de la tarea', 'ORB-132': 'Pulir la animación del cambio de workspace', 'ORB-136': 'Actualización optimista del estado de las tareas',
    'ORB-139': 'Indicadores de salud del ciclo de entrega', 'ORB-141': 'Ajuste de densidad responsiva del tablero',
  },
  ago: (u) => (u === 'now' ? 'ahora' : `hace ${u}`),
  column: { add: (s) => `Añadir tarea a ${s}`, first: 'Añadir la primera tarea' },
  toast: {
    updated: 'Tarea actualizada', moved: (id, s) => `${id} pasó a ${s}.`,
    created: 'Tarea creada', ready: (id) => `${id} está lista en Por hacer.`,
    duplicated: 'Tarea duplicada', editable: (id) => `${id} está lista para editar.`,
    deleted: 'Tarea eliminada', removed: (id) => `${id} se quitó de esta demo.`,
    preview: (f) => `Vista previa: ${f}`, local: 'Esta demo de portafolio mantiene todo local y reversible.',
    googleFail: 'No se pudo iniciar sesión con Google', googleFailText: 'Inténtalo de nuevo o sigue explorando la demo.',
    signedOut: 'Sesión cerrada', signedOutText: 'Puedes seguir explorando Orbit en modo demo.',
  },
  features: { switcher: 'Cambio de workspace', settings: 'Configuración', activity: 'Actividad', board: 'Opciones del tablero', status: 'Selector de estado', priority: 'Selector de prioridad', assignee: 'Selector de responsable' },
  copy: (t) => `${t} (copia)`,
  member: 'Miembro de Orbit',
  headings: { board: 'Construye la próxima órbita', list: 'Todas las tareas', roadmap: 'Roadmap', projects: 'Proyectos', inbox: 'Bandeja' },
  skip: 'Saltar al workspace',
  sidebar: { workspaceSub: 'Workspace de producto · Demo', navLabel: 'Navegación del workspace', favorites: 'Favoritos', light: 'Modo claro', dark: 'Modo oscuro', settings: 'Configuración', collapse: 'Contraer barra lateral', close: 'Cerrar barra lateral' },
  top: { menu: 'Abrir menú', search: 'Buscar o ir a…', activity: 'Abrir actividad', notifications: 'Abrir notificaciones', account: (i, n) => `${i} Cuenta: ${n}`, signIn: 'VK Entrar' },
  content: 'Contenido del workspace',
  notice: 'Demo de portafolio. Las tareas y los cambios quedan en esta sesión del navegador.',
  eyebrow: 'Velocity · Ingeniería',
  boardLead: 'Un ciclo enfocado en las interacciones que hacen que el equipo se sienta rápido.',
  otherLead: 'Todo lo que tu equipo necesita, en un workspace tranquilo.',
  searchBtn: 'Buscar', newIssue: 'Nueva tarea',
  cycle: { label: 'Avance del ciclo', name: 'Ciclo 08', momentum: 'Impulso', sample: (d, n) => `Ciclo de ejemplo · ${d} de ${n} hechas`, points: 'puntos', inProgress: 'en curso' },
  viewBoard: 'Tablero', viewList: 'Lista', filter: 'Filtrar', assignee: 'Responsable', filters: 'Filtros de tareas', statusField: 'Estado', clear: 'Limpiar filtros',
  cmd: { title: 'Menú de comandos de Orbit', ph: 'Buscar tareas, proyectos, personas…', empty: 'Sin resultados.', navigate: 'Navegar', actions: 'Acciones', create: 'Crear tarea', theme: 'Cambiar tema', searchAll: 'Buscar todas las tareas', recent: 'Tareas recientes' },
  create: { title: 'Crear tarea', desc: 'Registra el trabajo ahora. Añade detalles cuando el equipo esté listo.', ph: 'Título de la tarea', cancel: 'Cancelar', submit: 'Crear tarea' },
  auth: { welcome: (n) => `Hola, ${n}`, join: 'Únete a tu equipo en Orbit', desc: 'Crea tu cuenta o entra de forma segura con Google. También puedes seguir explorando esta demo de portafolio.', signOut: 'Cerrar sesión', opening: 'Abriendo Google…', google: 'Continuar con Google', note: 'Demo de portafolio · no necesitas cuenta para explorar' },
  issue: {
    duplicate: 'Duplicar', del: 'Eliminar', close: 'Cerrar tarea', titleLabel: 'Título de la tarea', updated: (p, u) => `${p} · actualizada ${u}`,
    body: 'Mejora esta área para que el equipo avance sin perder el contexto. Mantén la interacción rápida, resistente y accesible.',
    subtasks: 'Subtareas', sub1: 'Definir los estados de la interacción', sub2: 'Verificar el flujo con teclado', activity: 'Actividad', moved: 'movió esta tarea', automation: 'Automatización de Orbit', added: 'añadió', comment: 'Deja un comentario…',
    status: 'Estado', priority: 'Prioridad', assignee: 'Responsable', project: 'Proyecto', due: 'Fecha límite', dueValue: '12 sep',
  },
  list: { filter: 'Filtrar tareas…', sort: (s) => `Ordenar: ${s === 'updated' ? 'actualización' : 'prioridad'}`, cols: ['Tarea', 'Estado', 'Prioridad', 'Responsable', 'Proyecto', 'Actualizada'], none: 'No se encontraron tareas', noneText: 'Prueba a limpiar la búsqueda o los filtros.' },
  roadmap: { months: ['SEP', 'OCT', 'NOV', 'DIC'], state: { active: 'activo', planned: 'planificado', completed: 'completado' } },
  projectCards: ['Interacciones que hacen que el equipo se sienta rápido.', 'Una base de workspace tranquila y coherente.', 'Presencia y conversación en tiempo real.', 'Una experiencia enfocada para pantallas pequeñas.'],
  issuesCount: (n) => `${n} tareas`,
  inbox: {
    all: 'Todas', mentions: 'Menciones', assigned: 'Asignadas', markRead: 'Marcar todo como leído',
    rows: [
      ['Nora te asignó ORB-124', 'Lanzar el menú de comandos contextual'],
      ['Ana comentó en ORB-129', '“El indicador de presencia está listo para revisar.”'],
      ['Leo cambió la fecha límite', 'Ajuste de densidad responsiva del tablero · 12 sep'],
      ['El Ciclo 08 va en 74%', 'Quedan 5 tareas para cerrar Impulso.'],
    ],
  },
};

export const dicts: Record<Lang, Dict> = { en, pt, es };

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({ lang: 'en', t: en, setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  useEffect(() => setLang(detect()), []);
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    try { localStorage.setItem(KEY, lang); } catch { /* storage blocked */ }
  }, [lang]);
  return <Ctx.Provider value={{ lang, t: dicts[lang], setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

export function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <fieldset className="lang-switch">
      <legend className="sr-only">{t.language}</legend>
      {LANGS.map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={l === lang} title={langLabel[l]} lang={HTML_LANG[l]}>
          <span aria-hidden="true">{l.toUpperCase()}</span>
          <span className="sr-only">{langLabel[l]}</span>
        </button>
      ))}
    </fieldset>
  );
}
