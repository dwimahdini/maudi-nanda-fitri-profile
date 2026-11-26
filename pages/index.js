import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  FaArrowDown,
  FaArrowRight,
  FaBars,
  FaBriefcase,
  FaCheck,
  FaDownload,
  FaEnvelope,
  FaGraduationCap,
  FaMoon,
  FaPhoneAlt,
  FaRegCalendarAlt,
  FaSun,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import profile from "../content/profile.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const hasPublications = profile.publications.length > 0;
const hasOrganizations = (profile.organizations || []).length > 0;
const numOrganisasi = hasPublications ? "04" : "03";
const numPendidikan = String(
  3 + (hasPublications ? 1 : 0) + (hasOrganizations ? 1 : 0)
).padStart(2, "0");
const numKeahlian = String(
  4 + (hasPublications ? 1 : 0) + (hasOrganizations ? 1 : 0)
).padStart(2, "0");
const numKontak = String(
  5 + (hasPublications ? 1 : 0) + (hasOrganizations ? 1 : 0)
).padStart(2, "0");

const navigation = [
  { label: "Tentang", href: "#tentang" },
  { label: "Pengalaman", href: "#pengalaman" },
  ...(hasPublications ? [{ label: "Publikasi", href: "#publikasi" }] : []),
  ...(hasOrganizations ? [{ label: "Organisasi", href: "#organisasi" }] : []),
  { label: "Pendidikan", href: "#pendidikan" },
  { label: "Keahlian", href: "#keahlian" },
  { label: "Kontak", href: "#kontak" },
];

const skillCategories = [
  "Semua",
  ...new Set(profile.skills.map((skill) => skill.category)),
];

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillFilter, setSkillFilter] = useState("Semua");
  const [scrollProgress, setScrollProgress] = useState(0);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0
      );
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      revealObserver.observe(element);
    });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      revealObserver.disconnect();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const filteredSkills =
    skillFilter === "Semua"
      ? profile.skills
      : profile.skills.filter((skill) => skill.category === skillFilter);

  const aboutTitleLastLine = profile.about.titleLines[1] || "";
  const aboutTitleWords = aboutTitleLastLine.split(" ");
  const aboutTitleLastWord = aboutTitleWords.pop();
  const aboutTitleRest = aboutTitleWords.join(" ");

  return (
    <div className="portfolio-page">
      <Head>
        <title>{profile.pageTitle}</title>
        <meta name="description" content={profile.metaDescription} />
        <meta name="theme-color" content="#f5f4ef" />
        <link rel="icon" href={`${basePath}/images/favicon.png`} />
      </Head>

      <div
        className="reading-progress"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      <header className="site-header">
        <a
          className="brand"
          href="#beranda"
          aria-label={`${profile.hero.firstName}, kembali ke beranda`}
        >
          <span className="brand-mark">{profile.brand.mark}</span>
          <span className="brand-name">{profile.brand.name}</span>
        </a>

        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Navigasi utama">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="nav-cta" href="#kontak" onClick={closeMenu}>
            Mari terhubung <FaArrowRight aria-hidden="true" />
          </a>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Aktifkan tema ${isDark ? "terang" : "gelap"}`}
            title={`Aktifkan tema ${isDark ? "terang" : "gelap"}`}
          >
            {isDark ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
          </button>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
          >
            {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section" id="beranda">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="status-dot" /> {profile.hero.eyebrow}
              </p>
              <h1>
                Halo, saya
                <br />
                {profile.hero.nameLines.map((line, index) => {
                  const words = line.split(" ");
                  const firstWord = words.shift();
                  const rest = words.join(" ");
                  return (
                    <span key={line}>
                      {index === 0 ? (
                        <>
                          <span>{firstWord}</span>
                          {rest ? ` ${rest}` : ""}
                        </>
                      ) : (
                        line
                      )}
                      {index < profile.hero.nameLines.length - 1 && <br />}
                    </span>
                  );
                })}
              </h1>
              <p className="hero-description">{profile.hero.description}</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#pengalaman">
                  {profile.hero.ctaLabel} <FaArrowDown aria-hidden="true" />
                </a>
                {profile.cvFile ? (
                  <a
                    className="text-link"
                    href={`${basePath}${profile.cvFile}`}
                    download
                  >
                    Unduh CV <FaDownload aria-hidden="true" />
                  </a>
                ) : null}
              </div>
              <div className="hero-note">
                <span className="note-line" />
                <span>{profile.hero.locationNote}</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="portrait-frame">
                <Image
                  src={`${basePath}${profile.hero.portrait}`}
                  alt={profile.hero.portraitAlt}
                  className="portrait-image"
                  fill
                  priority
                  sizes="(max-width: 760px) 90vw, 410px"
                />
                <span className="portrait-index">{profile.hero.portraitIndex}</span>
              </div>
              <div className="hero-caption">
                <span>{profile.hero.captionLeft}</span>
                <span>{profile.hero.captionRight}</span>
              </div>
            </div>
          </div>
          <a href="#tentang" className="scroll-cue">
            GULIR UNTUK MENGENAL SAYA <FaArrowDown aria-hidden="true" />
          </a>
        </section>

        <div className="ticker" aria-label={profile.ticker.join(", ")}>
          <div className="ticker-track" aria-hidden="true">
            {[0, 1].map((item) => (
              <span className="ticker-group" key={item}>
                {profile.ticker.map((word) => (
                  <span key={word}>
                    {word} <i>✳</i>{" "}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <section className="content-section about-section" id="tentang">
          <div className="section-heading reveal">
            <span className="section-kicker">01 — TENTANG SAYA</span>
            <span className="section-aside">PROFIL SINGKAT</span>
          </div>
          <div className="about-grid">
            <h2 className="about-title reveal">
              {profile.about.titleLines[0]}
              <br />
              {aboutTitleRest} <span>{aboutTitleLastWord}</span>
            </h2>
            <div className="about-copy reveal">
              {profile.about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <a className="inline-link" href="#kontak">
                Kenali saya lebih jauh <FaArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="facts-row reveal">
            {profile.about.facts.map((fact, index) => (
              <div
                className={`fact${
                  index === profile.about.facts.length - 1
                    ? " fact-location"
                    : ""
                }`}
                key={fact.label}
              >
                <strong>
                  {fact.value}
                  {fact.suffix ? <span>{fact.suffix}</span> : null}
                </strong>
                <small>{fact.label}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="experience-section" id="pengalaman">
          <div className="content-section">
            <div className="section-heading reveal">
              <span className="section-kicker">02 — PENGALAMAN</span>
              <span className="section-aside">BELAJAR LEWAT PENGALAMAN</span>
            </div>
            {profile.experience.map((job) => (
              <div className="experience-card reveal" key={job.title}>
                <div className="experience-topline">
                  <span className="experience-icon">
                    {job.icon === "users" ? (
                      <FaUsers aria-hidden="true" />
                    ) : (
                      <FaBriefcase aria-hidden="true" />
                    )}
                  </span>
                  {job.date ? (
                    <span className="date-pill">
                      <FaRegCalendarAlt aria-hidden="true" /> {job.date}
                    </span>
                  ) : null}
                </div>
                <div className="experience-main">
                  <div className="experience-title">
                    <p className="eyebrow">{job.eyebrow}</p>
                    <h2>{job.title}</h2>
                    <p className="company-line">{job.companyLine}</p>
                  </div>
                  <div className="experience-details">
                    <p className="list-intro">Kontribusi dan tanggung jawab</p>
                    <ul>
                      {job.bullets.map((item) => (
                        <li key={item}>
                          <FaCheck aria-hidden="true" /> <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {job.link ? (
                      <a
                        className="publication-link"
                        href={job.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {job.linkLabel} <FaArrowRight aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="experience-bottomline">
                  {job.bottomLeft ? <span>{job.bottomLeft}</span> : null}
                  {job.bottomRight ? <span>{job.bottomRight}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {hasPublications ? (
          <section className="publications-section" id="publikasi">
            <div className="content-section">
              <div className="section-heading reveal">
                <span className="section-kicker">03 — PUBLIKASI &amp; PENULISAN</span>
                <span className="section-aside">KARYA YANG TERPUBLIKASI</span>
              </div>
              <div className="publications-intro reveal">
                <h2>
                  Menulis, meneliti, <span>dan membagikannya.</span>
                </h2>
              </div>
              <div className="publication-list">
                {profile.publications.map((item, index) => (
                  <article className="publication-card reveal" key={item.url}>
                    <span className="publication-number">0{index + 1}</span>
                    <div className="publication-content">
                      <div className="publication-meta">
                        <span>{item.kind}</span>
                        <span>{item.date}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p className="publication-source">{item.source}</p>
                      <p className="publication-detail">{item.detail}</p>
                      <p className="publication-role">{item.role}</p>
                      <a
                        className="publication-link"
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Baca selengkapnya <FaArrowRight aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {hasOrganizations ? (
          <section className="publications-section" id="organisasi">
            <div className="content-section">
              <div className="section-heading reveal">
                <span className="section-kicker">
                  {numOrganisasi} — ORGANISASI
                </span>
                <span className="section-aside">PENGALAMAN BERORGANISASI</span>
              </div>
              <div className="publications-intro reveal">
                <h2>
                  Terlibat, berkontribusi, <span>dan bertumbuh.</span>
                </h2>
                <p>
                  {profile.organizations.length} peran organisasi yang dijalani{" "}
                  {profile.hero.firstName}.
                </p>
              </div>
              <div className="publication-list">
                {profile.organizations.map((item, index) => (
                  <article
                    className="publication-card reveal"
                    key={item.title}
                  >
                    <span className="publication-number">0{index + 1}</span>
                    <div className="publication-content">
                      <div className="publication-meta">
                        <span>{item.kind}</span>
                        {item.date ? <span>{item.date}</span> : null}
                      </div>
                      <h3>{item.title}</h3>
                      <p className="publication-source">{item.source}</p>
                      <p className="publication-detail">{item.detail}</p>
                      <p className="publication-role">{item.role}</p>
                      {item.url ? (
                        <a
                          className="publication-link"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Baca selengkapnya <FaArrowRight aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="content-section learning-section" id="pendidikan">
          <div className="section-heading reveal">
            <span className="section-kicker">
              {numPendidikan} — PENDIDIKAN &amp; PELATIHAN
            </span>
            <span className="section-aside">TERUS BERTUMBUH</span>
          </div>
          <div className="learning-grid">
            <article className="education-card reveal">
              <div className="card-overline">
                <span>
                  <FaGraduationCap aria-hidden="true" /> PENDIDIKAN
                </span>
                <span>{profile.education.years}</span>
              </div>
              <h2>{profile.education.university}</h2>
              <p className="degree-name">{profile.education.degree}</p>
              <div className="gpa-badge">
                <strong>{profile.education.gpa}</strong>
                <span>IPK / 4.00</span>
              </div>
              <span className="card-watermark" aria-hidden="true">
                {profile.education.watermark}
              </span>
            </article>
            {profile.trainings.length > 0 ? (
              <div className="training-column">
                <p className="training-heading reveal">PELATIHAN &amp; SERTIFIKASI</p>
                {profile.trainings.map((training, index) => (
                  <article
                    className="training-card reveal"
                    key={training.name}
                  >
                    <span className="training-number">
                      0{index + 1}
                    </span>
                    <div className="training-content">
                      <span className="training-date">{training.date}</span>
                      <h3>{training.name}</h3>
                      <p className="training-organizer">{training.organizer}</p>
                      <p className="training-description">
                        {training.description}
                      </p>
                    </div>
                    <FaArrowRight
                      className="training-arrow"
                      aria-hidden="true"
                    />
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="skills-section" id="keahlian">
          <div className="content-section">
            <div className="section-heading reveal">
              <span className="section-kicker">{numKeahlian} — KEAHLIAN</span>
              <span className="section-aside">HAL YANG BISA SAYA BAWA</span>
            </div>
            <div className="skills-intro reveal">
              <h2>
                Terorganisir, komunikatif, <span>dan bisa diandalkan.</span>
              </h2>
              <p>Pilih kategori untuk melihat keahlian yang relevan.</p>
            </div>
            <div
              className="skill-filters reveal"
              role="group"
              aria-label="Filter keahlian"
            >
              {skillCategories.map((filter) => (
                <button
                  className={skillFilter === filter ? "active" : ""}
                  type="button"
                  key={filter}
                  onClick={() => setSkillFilter(filter)}
                  aria-pressed={skillFilter === filter}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="skills-grid" aria-live="polite">
              {filteredSkills.map((skill, index) => (
                <article
                  className="skill-card reveal is-visible"
                  key={skill.name}
                >
                  <span className="skill-number">0{index + 1}</span>
                  <span className="skill-category">{skill.category}</span>
                  <h3>{skill.name}</h3>
                  <p>{skill.detail}</p>
                  <span className="skill-accent" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="kontak">
          <div className="content-section contact-inner reveal">
            <div className="contact-topline">
              <span className="section-kicker">{numKontak} — KONTAK</span>
              <span className="contact-sparkle" aria-hidden="true">✳</span>
            </div>
            <p className="eyebrow">ADA PELUANG MENARIK?</p>
            <h2>
              Mari mulai
              <br />
              percakapan <span>baik.</span>
            </h2>
            <p className="contact-description">
              {profile.contact.description}
            </p>
            <a
              className="button button-lime"
              href={`mailto:${profile.contact.email}`}
            >
              Hubungi saya <FaArrowRight aria-hidden="true" />
            </a>
            <div className="contact-links">
              <a href={`mailto:${profile.contact.email}`}>
                <FaEnvelope aria-hidden="true" /> {profile.contact.email}
              </a>
              <a href={profile.contact.phoneHref}>
                <FaPhoneAlt aria-hidden="true" /> {profile.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#beranda">
          {profile.brand.mark}
        </a>
        <span>{profile.footerNote}</span>
        <a href="#beranda" className="back-to-top">
          KEMBALI KE ATAS <FaArrowDown aria-hidden="true" />
        </a>
        <span className="footer-year">© 2026 {profile.brand.name}</span>
      </footer>
    </div>
  );
};

export default Home;
