import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const html = htm.bind(React.createElement);

const basePath = new URL('../', import.meta.url).pathname;
const assetUrl = (file) => new URL(`../assets/${file}`, import.meta.url).pathname;
const pageUrl = (targetPath) => `${basePath}${targetPath.replace(/^\//, '')}`;
const localPath = (pathname) => {
  let value = pathname.startsWith(basePath) ? pathname.slice(basePath.length - 1) : pathname;
  if (!value || value === '/index.html') return '/';
  if (value.endsWith('/index.html')) value = value.replace('index.html', '');
  return value.endsWith('/') ? value : `${value}/`;
};

const assets = {
  entrance: assetUrl('museum-entrance.jpg'),
  blue: assetUrl('mineral-blue.jpg'),
  crystal: assetUrl('mineral-crystal.jpg'),
  archive: assetUrl('archive.jpg'),
  logo: assetUrl('logo-tm3.png'),
  logoSmall: assetUrl('logo-tm3-small.png'),
};

const navItems = [
  ['Home', '/'],
  ['Mineral Displays', '/mineral-displays/'],
  ['Donate', '/donate/'],
  ['Contact', '/contact/'],
];

const collection = [
  {
    key: 'minerals',
    title: 'Mineral Displays',
    metric: '300+',
    label: 'rare specimens',
    image: assets.blue,
    copy: 'TM³ boasts an extensive collection of minerals from Tsumeb, including rare and exotic specimens.',
  },
  {
    key: 'archive',
    title: 'Vast Archives',
    metric: '1,000+',
    label: 'historical documents',
    image: assets.archive,
    copy: 'Explore rare photographs, letters, diaries, official records, and historical material connected to Namibia’s mining industry.',
  },
  {
    key: 'demos',
    title: 'Equipment Demos',
    metric: 'Live',
    label: 'mining equipment',
    image: assets.crystal,
    copy: 'See mining equipment brought to life through demonstrations that show how machines were used in mining operations.',
  },
];

const path = localPath(window.location.pathname);

function App() {
  const shellRef = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.from('.nav-shell', { y: -14, opacity: 0, duration: 0.7, ease: 'power3.out' });
    gsap.from('.hero-line', { yPercent: 105, duration: 1, stagger: 0.07, ease: 'power4.out', delay: 0.1 });
    gsap.from('.hero-meta > *', { y: 14, opacity: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out', delay: 0.48 });

    gsap.to('.hero-visual img', {
      scale: 1.08,
      yPercent: 5,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.utils.toArray('.reveal').forEach((element) => {
      gsap.from(element, {
        y: 26,
        opacity: 0,
        duration: 0.72,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 84%' },
      });
    });

    gsap.to('.orbit-ring', { rotate: 360, duration: 28, ease: 'none', repeat: -1 });
  }, { scope: shellRef, dependencies: [path] });

  return html`
    <div className="site-shell" ref=${shellRef}>
      <${Navigation} current=${path} />
      <main>
        ${path === '/mineral-displays/' ? html`<${MineralDisplaysPage} />` : null}
        ${path === '/donate/' ? html`<${DonatePage} />` : null}
        ${path === '/contact/' ? html`<${ContactPage} />` : null}
        ${path === '/' ? html`<${HomePage} />` : null}
      </main>
      <${Footer} />
    </div>
  `;
}

function Navigation({ current }) {
  return html`
    <header className="nav-shell">
      <a className="brand" href=${pageUrl('/')} aria-label="TM3 home">
        <span className="brand-glyph"><img src=${assets.logoSmall} alt="" /></span>
        <span>Tsumeb Mineralogic & Mining Museum</span>
      </a>
      <nav aria-label="Primary">
        ${navItems.map(([label, href]) => html`
          <a key=${href} href=${pageUrl(href)} aria-current=${current === href ? 'page' : undefined}>${label}</a>
        `)}
      </nav>
      <a className="nav-action" href=${pageUrl('/contact/')}>Plan visit</a>
    </header>
  `;
}

function HomePage() {
  return html`
    <${Hero}
      eyebrow="Tsumeb, Namibia"
      title=${['Tsumeb Mineralogic', '& Mining Museum']}
      copy="Uncover the rich history of mining and minerals in Namibia through rare specimens, mining equipment, artefacts, archives, and guided museum experiences."
      image=${assets.entrance}
      action=${['Explore the collection', pageUrl('/mineral-displays/')]}
    />
    <section className="intro-section">
      <div className="intro-copy reveal">
        <p className="micro">Welcome to TM³</p>
        <h2>A museum for Namibia’s geological and mining heritage.</h2>
        <p>Located in Tsumeb, a town renowned for its mineral deposits for more than a century, TM³ showcases an extensive collection of minerals, mining equipment, and artefacts that offer visitors a glimpse into the region’s geologic and economic significance.</p>
      </div>
      <div className="feature-grid">
        <${FeatureCard} title="Mineral Displays" image=${assets.blue} href=${pageUrl('/mineral-displays/')} copy="Rare and exotic minerals from Tsumeb, including interactive displays for a closer encounter with the collection." />
        <${FeatureCard} title="Guided Tours" image=${assets.entrance} href=${pageUrl('/contact/')} copy="Knowledgeable guides take visitors through the exhibits and share insight into Tsumeb and Namibia’s geology and mining history." />
        <${FeatureCard} title="Equipment Demos" image=${assets.crystal} href=${pageUrl('/contact/')} copy="Mining equipment demonstrations show how machines were used in mining operations." />
      </div>
    </section>
    <${VisitBand} />
  `;
}

function MineralDisplaysPage() {
  return html`
    <${Hero}
      eyebrow="Mineral displays"
      title=${['Browse over', '300 stunning minerals']}
      copy="Whether you are a seasoned collector or simply curious about the natural wonders of the earth, TM³’s mineral displays offer an unforgettable experience in the heart of Tsumeb."
      image=${assets.blue}
      action=${['View price list', '#pricing']}
    />
    <${CollectionVault} />
    <section className="archive-band reveal">
      <div>
        <p className="micro">Archives</p>
        <h2>Explore more than 1,000 historical documents.</h2>
        <p>Unlock the secrets of Tsumeb’s rich history through rare photographs, letters, diaries, official records, and archives that reveal the people and events that helped shape Namibia’s mining industry.</p>
      </div>
      <img src=${assets.archive} alt="Historical Tsumeb mining archive photograph" />
    </section>
    <${Pricing} />
  `;
}

function DonatePage() {
  return html`
    <${SubHero}
      eyebrow="Donate minerals"
      title="Help preserve Tsumeb’s mineralogical heritage."
      copy="TM³ welcomes donations from individuals and organizations who wish to contribute to the preservation and exhibition of Tsumeb’s mineralogical heritage."
    />
    <section className="form-section">
      <div className="form-copy reveal">
        <p className="micro">Donation form</p>
        <h2>Share the magic of Tsumeb’s minerals with the world.</h2>
        <p>Are you a collector of rare and exotic minerals? Do you have a piece that you believe would make a great addition to the museum’s collection? With state-of-the-art security services, your donation will be kept safe and secure.</p>
      </div>
      <form className="museum-form reveal" action="mailto:info@tm3.com.na" method="post" encType="text/plain">
        <label>Name<input name="Name" required /></label>
        <label>Email<input name="Email" type="email" required /></label>
        <label>Phone<input name="Phone" required /></label>
        <label>Mineral details<textarea name="Mineral details" required /></label>
        <button type="submit">Send donation enquiry</button>
      </form>
    </section>
  `;
}

function ContactPage() {
  return html`
    <${SubHero}
      eyebrow="Contact us"
      title="Plan a visit, book a tour, or speak to the museum."
      copy="For visits, guided tours, equipment demonstrations, archive enquiries, and mineral donation questions, contact TM³ directly."
    />
    <section className="contact-grid">
      <article className="info-panel reveal">
        <p className="micro">Business hours</p>
        <h2>Open weekday mornings.</h2>
        <ul className="detail-list">
          <li><span>Monday - Friday</span><strong>08:00 AM - 13:00 PM</strong></li>
          <li><span>Saturday</span><strong>Closed</strong></li>
          <li><span>Sunday</span><strong>Closed</strong></li>
          <li><span>Public Holidays</span><strong>Closed</strong></li>
          <li><span>Or on request</span><strong>info@tm3.com.na</strong></li>
        </ul>
      </article>
      <article className="info-panel dark reveal">
        <p className="micro">Reach out</p>
        <h2>TM³ contacts.</h2>
        <ul className="detail-list">
          <li><span>Email</span><strong><a href="mailto:info@tm3.com.na">info@tm3.com.na</a></strong></li>
          <li><span>Phone</span><strong><a href="tel:+26467220392">+264 67 220 392</a></strong></li>
          <li><span>Chairperson of Tsumeb Museums</span><strong>Jens Frautschy</strong></li>
          <li><span>Office Administrator</span><strong>Ms. Shekupe Hango</strong></li>
        </ul>
      </article>
    </section>
    <section className="form-section contact-form-section">
      <div className="form-copy reveal">
        <p className="micro">Let’s talk</p>
        <h2>Do you have any questions?</h2>
        <p>We would love to hear from you. Send an email or use the form to start a conversation with the museum team.</p>
        <a className="secondary contact-direct" href="mailto:info@tm3.com.na">Email info@tm3.com.na</a>
      </div>
      <form className="museum-form reveal" action="mailto:info@tm3.com.na" method="post" encType="text/plain">
        <label>First name<input name="First name" required /></label>
        <label>Email<input name="Email" type="email" required /></label>
        <label>Message<textarea name="Message" required /></label>
        <button type="submit">Send message</button>
      </form>
    </section>
  `;
}

function Hero({ eyebrow, title, copy, image, action }) {
  return html`
    <section className="hero">
      <div className="hero-visual" aria-hidden="true">
        <img src=${image} alt="" />
        <div className="hero-grade" />
      </div>
      <div className="hero-content">
        <div className="hero-copy">
          <p className="micro">${eyebrow}</p>
          <h1>${title.map((line) => html`<span key=${line}><span className="hero-line">${line}</span></span>`)}</h1>
          <div className="hero-meta">
            <p>${copy}</p>
            <a className="text-link" href=${action[1]}>${action[0]}</a>
          </div>
        </div>
        <aside className="hero-instrument" aria-label="Museum highlights">
          <div className="instrument-glass">
            <div className="orbit"><div className="orbit-ring" /><span><img src=${assets.logoSmall} alt="" /></span></div>
            <dl>
              <div><dt>Collection</dt><dd>300+ specimens</dd></div>
              <div><dt>Archive</dt><dd>1,000+ records</dd></div>
              <div><dt>Entry</dt><dd>N$20 - N$50</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function SubHero({ eyebrow, title, copy }) {
  return html`
    <section className="sub-hero">
      <div className="sub-hero-media" aria-hidden="true"><img src=${assets.entrance} alt="" /></div>
      <div className="sub-hero-copy">
        <p className="micro">${eyebrow}</p>
        <h1><span><span className="hero-line">${title}</span></span></h1>
        <p className="hero-meta solo">${copy}</p>
      </div>
    </section>
  `;
}

function FeatureCard({ title, image, href, copy }) {
  return html`
    <a className="feature-card reveal" href=${href}>
      <img src=${image} alt="" />
      <div><h3>${title}</h3><p>${copy}</p></div>
    </a>
  `;
}

function CollectionVault() {
  const [active, setActive] = useState(collection[0]);
  const activeIndex = useMemo(() => collection.findIndex((item) => item.key === active.key), [active]);

  return html`
    <section className="vault" id="collection">
      <div className="section-intro reveal">
        <p className="micro">Collection</p>
        <h2>Rare minerals, archives, and mining equipment in one museum.</h2>
        <p>TM³ brings together mineral displays, historical archives, and equipment demonstrations for visitors, collectors, students, and researchers.</p>
      </div>
      <div className="vault-grid">
        <div className="vault-stage reveal">
          <img key=${active.key} src=${active.image} alt="" />
          <div className="specimen-readout">
            <span>${String(activeIndex + 1).padStart(2, '0')}</span>
            <strong>${active.title}</strong>
            <p>${active.copy}</p>
          </div>
        </div>
        <div className="vault-controls reveal">
          ${collection.map((item) => html`
            <button
              key=${item.key}
              type="button"
              className=${item.key === active.key ? 'vault-tab active' : 'vault-tab'}
              onClick=${() => setActive(item)}
            >
              <span>${item.metric}</span>
              <strong>${item.title}</strong>
              <small>${item.label}</small>
            </button>
          `)}
        </div>
      </div>
    </section>
  `;
}

function Pricing() {
  return html`
    <section className="visit" id="pricing">
      <div className="visit-copy reveal">
        <p className="micro">Price list</p>
        <h2>Simple entry prices for museum visitors.</h2>
        <p>Plan your visit to the Tsumeb Mineralogic & Mining Museum.</p>
      </div>
      <div className="pricing reveal" aria-label="Ticket pricing">
        <div><span>Visitors</span><strong>N$50</strong></div>
        <div><span>Namibian citizens</span><strong>N$40</strong></div>
        <div><span>Children under 12 years</span><strong>N$20</strong></div>
      </div>
    </section>
  `;
}

function VisitBand() {
  return html`
    <section className="visit-band reveal">
      <div>
        <p className="micro">Visit TM³</p>
        <h2>Minerals, guided tours, archives, and equipment demonstrations.</h2>
      </div>
      <div className="action-row">
        <a className="primary" href=${pageUrl('/contact/')}>Contact the museum</a>
        <a className="secondary" href=${pageUrl('/mineral-displays/')}>See mineral displays</a>
      </div>
    </section>
  `;
}

function Footer() {
  return html`
    <footer className="footer">
      <div>
        <img src=${assets.logoSmall} alt="TM3 logo" />
        <span>Tsumeb Mineralogic & Mining Museum</span>
      </div>
      <nav aria-label="Footer">
        ${navItems.map(([label, href]) => html`<a key=${href} href=${pageUrl(href)}>${label}</a>`)}
      </nav>
      <span>© 2026 Tsumeb Mineralogic & Mining Museum.</span>
    </footer>
  `;
}

createRoot(document.getElementById('root')).render(html`<${App} />`);
