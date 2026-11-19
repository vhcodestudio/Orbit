'use client';

import Link from 'next/link';
import { LangSwitch, useLang, type Lang } from './i18n';

type Doc = { back: string; title: string; updated: string; sections: [string, string][] };
const DOCS: Record<'privacy' | 'terms', Record<Lang, Doc>> = {
  privacy: {
    en: { back: '← Back to Orbit', title: 'Privacy policy', updated: 'Last updated: September 3, 2026', sections: [
      ['Information we use', 'When you choose Google sign-in, Orbit receives your name, email address, and profile image from Google solely to create and display your session.'],
      ['How information is handled', 'This portfolio demo uses an encrypted, short-lived authentication session. It does not sell personal information or use it for advertising. Demo issue data remains local to your browser.'],
      ['Your choices', 'You can explore Orbit without an account and sign out at any time. Contact vhcodestudio@gmail.com with privacy questions.'],
    ] },
    pt: { back: '← Voltar ao Orbit', title: 'Política de privacidade', updated: 'Última atualização: 3 de setembro de 2026', sections: [
      ['Informações que usamos', 'Quando você escolhe entrar com Google, o Orbit recebe seu nome, e-mail e foto de perfil do Google apenas para criar e mostrar sua sessão.'],
      ['Como as informações são tratadas', 'Esta demo de portfólio usa uma sessão de autenticação criptografada e de curta duração. Não vende dados pessoais nem os usa para publicidade. Os dados das tarefas de demonstração ficam no seu navegador.'],
      ['Suas escolhas', 'Você pode explorar o Orbit sem conta e sair a qualquer momento. Dúvidas sobre privacidade: vhcodestudio@gmail.com.'],
    ] },
    es: { back: '← Volver a Orbit', title: 'Política de privacidad', updated: 'Última actualización: 3 de septiembre de 2026', sections: [
      ['Información que usamos', 'Cuando eliges entrar con Google, Orbit recibe tu nombre, correo y foto de perfil de Google solo para crear y mostrar tu sesión.'],
      ['Cómo se trata la información', 'Esta demo de portafolio usa una sesión de autenticación cifrada y de corta duración. No vende datos personales ni los usa para publicidad. Los datos de las tareas de demostración quedan en tu navegador.'],
      ['Tus opciones', 'Puedes explorar Orbit sin cuenta y cerrar sesión cuando quieras. Preguntas sobre privacidad: vhcodestudio@gmail.com.'],
    ] },
  },
  terms: {
    en: { back: '← Back to Orbit', title: 'Terms of service', updated: 'Last updated: September 3, 2026', sections: [
      ['Portfolio demonstration', 'Orbit is a portfolio project that demonstrates project-management interactions. Its workspace content is sample data and is not intended for production project storage.'],
      ['Account access', 'Google sign-in is optional. You are responsible for access to your Google account and may end the Orbit session at any time.'],
      ['Availability', 'The demo is provided as-is and may change as the portfolio evolves. Contact vhcodestudio@gmail.com with questions.'],
    ] },
    pt: { back: '← Voltar ao Orbit', title: 'Termos de uso', updated: 'Última atualização: 3 de setembro de 2026', sections: [
      ['Demonstração de portfólio', 'O Orbit é um projeto de portfólio que demonstra interações de gestão de projetos. O conteúdo do workspace é de exemplo e não serve para guardar projetos reais.'],
      ['Acesso à conta', 'Entrar com Google é opcional. Você é responsável pelo acesso à sua conta Google e pode encerrar a sessão do Orbit a qualquer momento.'],
      ['Disponibilidade', 'A demo é oferecida como está e pode mudar conforme o portfólio evolui. Dúvidas: vhcodestudio@gmail.com.'],
    ] },
    es: { back: '← Volver a Orbit', title: 'Términos de uso', updated: 'Última actualización: 3 de septiembre de 2026', sections: [
      ['Demostración de portafolio', 'Orbit es un proyecto de portafolio que muestra interacciones de gestión de proyectos. El contenido del workspace es de ejemplo y no sirve para guardar proyectos reales.'],
      ['Acceso a la cuenta', 'Entrar con Google es opcional. Eres responsable del acceso a tu cuenta de Google y puedes cerrar la sesión de Orbit cuando quieras.'],
      ['Disponibilidad', 'La demo se ofrece tal cual y puede cambiar a medida que evoluciona el portafolio. Preguntas: vhcodestudio@gmail.com.'],
    ] },
  },
};

export function LegalPage({ doc }: { doc: 'privacy' | 'terms' }) {
  const { lang } = useLang();
  const d = DOCS[doc][lang];
  return (
    <main className="legal-page">
      <Link href="/">{d.back}</Link>
      <LangSwitch />
      <div className="auth-orbit-mark">O</div>
      <h1>{d.title}</h1>
      <p>{d.updated}</p>
      {d.sections.map(([h, p]) => (
        <section key={h}>
          <h2>{h}</h2>
          <p>{p}</p>
        </section>
      ))}
    </main>
  );
}

const LOST: Record<Lang, [string, string, string, string]> = {
  en: ['404 · Lost in orbit', 'This workspace is out of range.', 'The page may have moved, but your project is still on course.', 'Return to workspace'],
  pt: ['404 · Perdido em órbita', 'Este workspace está fora de alcance.', 'A página pode ter mudado de lugar, mas o seu projeto continua no rumo.', 'Voltar ao workspace'],
  es: ['404 · Perdido en órbita', 'Este workspace está fuera de alcance.', 'La página puede haberse movido, pero tu proyecto sigue en curso.', 'Volver al workspace'],
};

export function Lost() {
  const [eyebrow, title, text, back] = LOST[useLang().lang];
  return (
    <main className="not-found">
      <div className="logo-mark">O</div>
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <span>{text}</span>
      <Link href="/">{back}</Link>
    </main>
  );
}
