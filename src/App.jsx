import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Clock3,
  Scale,
  HeartHandshake,
  Building2,
  BriefcaseBusiness,
  Landmark,
  ScrollText,
  Plus,
  Check,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { contact, services, faqs, legalNotice } from "./content.js";

const navigation = [
  ["ana-sayfa", "Ana Sayfa"],
  ["hakkimda", "Hakkımda"],
  ["calisma-alanlari", "Çalışma Alanları"],
  ["iletisim", "İletişim"],
];
const serviceIcons = [
  Scale,
  HeartHandshake,
  Building2,
  BriefcaseBusiness,
  Landmark,
  ScrollText,
];

function Brand({ light = false, onClick }) {
  return (
    <a
      className={`brand ${light ? "brand-light" : ""}`}
      href="#ana-sayfa"
      onClick={onClick}
      aria-label="Ayşegül Çetinkaya, ana sayfa"
    >
      <span className="brand-monogram" aria-hidden="true">
        a<span>ç</span>
        <i />
      </span>
      <span className="brand-text">
        <span>Ayşegül Çetinkaya</span>
        <small>AVUKATLIK & HUKUKİ DANIŞMANLIK</small>
      </span>
    </a>
  );
}

function Dialog({ children, title, onClose, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const dialog = ref.current;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog
      className={`dialog ${wide ? "dialog-wide" : ""}`}
      ref={ref}
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <button
          className="icon-button close-dialog"
          aria-label="Pencereyi kapat"
          onClick={onClose}
        >
          <X size={23} />
        </button>
        <h2 id="dialog-title">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

function Appointment({ onClose, initialTopic }) {
  const [topic, setTopic] = useState(
    initialTopic || "Genel hukuki danışmanlık",
  );
  const [note, setNote] = useState("");
  const message = `Merhaba, ${topic.toLocaleLowerCase("tr-TR")} konusunda görüşme için randevu almak istiyorum.${note.trim() ? `\n\n${note.trim()}` : ""}`;
  return (
    <Dialog
      title={
        <>
          Bir görüşmeyle
          <br />
          <em>başlayalım.</em>
        </>
      }
      onClose={onClose}
    >
      <p className="dialog-intro">
        Hukuki ihtiyacınızı birlikte değerlendirmek için bize ulaşın.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          window.open(
            `${contact.whatsappUrl}?text=${encodeURIComponent(message)}`,
            "_blank",
            "noopener,noreferrer",
          );
        }}
      >
        <label className="form-label" htmlFor="appointment-topic">
          Hangi konuda görüşmek istersiniz?
        </label>
        <div className="select-wrap">
          <select
            id="appointment-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option>Genel hukuki danışmanlık</option>
            {services.map((s) => (
              <option key={s.id}>{s.title}</option>
            ))}
          </select>
          <ChevronDown size={17} aria-hidden="true" />
        </div>
        <label className="form-label" htmlFor="appointment-note">
          Kısa bir not <span>(isteğe bağlı)</span>
        </label>
        <textarea
          id="appointment-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="3"
          maxLength="500"
          placeholder="Görüşmek istediğiniz konuyu kısaca belirtebilirsiniz."
        />
        <p className="form-note">
          Lütfen bu alanda kimlik, dosya veya hassas kişisel bilgilerinizi
          paylaşmayın. Mesajınız WhatsApp’ta açılır; göndermeden önce
          düzenleyebilirsiniz.
        </p>
        <button className="button button-dark button-full" type="submit">
          <MessageCircle size={18} /> WhatsApp ile randevu isteyin{" "}
          <ArrowUpRight size={18} />
        </button>
      </form>
      <a className="appointment-phone" href={contact.phoneHref}>
        <Phone size={16} /> Ya da bizi arayın: {contact.phoneDisplay}
      </a>
      <div className="appointment-hours">
        <Clock3 size={15} /> {contact.hours}
      </div>
      <p className="form-note centered">
        Randevu, büromuzun teyidiyle kesinleşir.
      </p>
    </Dialog>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("ana-sayfa");
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null);
  const menuButton = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
    );
    navigation.forEach(([id]) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.querySelector("#mobile-nav a")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const focusable = [
          ...document.querySelectorAll(".header a, .header button"),
        ].filter((el) => el.getClientRects().length);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth > 960) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const book = (topic) => {
    setMenuOpen(false);
    setModal({ type: "appointment", topic });
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        İçeriğe geç
      </a>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>Haklarınızın farkında, her adımda yanınızda.</span>
          <a href={contact.phoneHref}>
            <Phone size={12} /> {contact.phoneDisplay}
          </a>
          <span className="topbar-location">
            <MapPin size={12} /> İzmit, Kocaeli
          </span>
        </div>
      </div>
      <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container header-inner">
          <Brand onClick={() => setMenuOpen(false)} />
          <nav className="desktop-nav" aria-label="Ana gezinme">
            {navigation.map(([id, label]) => (
              <a
                key={id}
                className={activeSection === id ? "active" : ""}
                href={`#${id}`}
                aria-current={activeSection === id ? "location" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <button
            className="button button-outline header-appointment"
            onClick={() => book()}
          >
            Randevu Alın <ArrowUpRight size={16} />
          </button>
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobil gezinme"
          >
            {navigation.map(([id, label], i) => (
              <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
                <span>0{i + 1}</span>
                {label}
                <ArrowUpRight size={24} />
              </a>
            ))}
            <button className="button button-dark" onClick={() => book()}>
              Randevu Alın <ArrowUpRight size={18} />
            </button>
            <p>İzmit, Kocaeli · {contact.phoneDisplay}</p>
          </nav>
        )}
      </header>

      <main id="main-content">
        <section
          className="hero container"
          id="ana-sayfa"
          aria-labelledby="hero-title"
        >
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" /> KOCAELİ · AVUKATLIK &
              DANIŞMANLIK
            </div>
            <h1 id="hero-title">
              Haklarınız için
              <br />
              kararlı bir duruş.
              <br />
              <em>Size özel bir yaklaşım.</em>
            </h1>
            <p className="hero-description">
              Her hukuki mesele, kendine özgü bir hikâye taşır. Sizi dinliyor,
              haklarınızı gözetiyor ve sürecin her adımında yanınızda yer
              alıyoruz.
            </p>
            <div className="hero-actions">
              <button className="button button-dark" onClick={() => book()}>
                Bir görüşmeyle başlayalım <ArrowUpRight size={19} />
              </button>
              <a className="text-link" href="#calisma-alanlari">
                Çalışma alanlarımız <ArrowDown size={15} />
              </a>
            </div>
            <div className="hero-assurance">
              <span>
                <span className="assurance-dot" /> Güven ve gizlilik
              </span>
              <span className="assurance-divider" />
              <span>Şeffaf iletişim</span>
              <span className="assurance-divider" />
              <span>Özenli takip</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <img
                className="hero-image"
                src="/images/justice.webp"
                alt="Klasik mimari içinde adaletin simgesi Themis heykeli"
                width="1536"
                height="1024"
                fetchPriority="high"
              />
            </div>
            <div className="hero-image-caption">
              <span className="caption-symbol" aria-hidden="true">
                <Scale size={25} strokeWidth={1.2} />
              </span>
              <p>
                Hukukun rehberliğinde,
                <br />
                <span>güvenle ileriye.</span>
              </p>
              <span className="caption-line" />
            </div>
            <span className="image-side-label">
              AYŞEGÜL ÇETİNKAYA HUKUK BÜROSU
            </span>
            <div className="hero-corner" aria-hidden="true">
              aç<span>HUKUK & GÜVEN</span>
            </div>
          </div>
        </section>

        <div className="principles-strip">
          <div className="container principles-inner">
            <p>
              Hukuki süreçlerinizde
              <br />
              <strong>sağlam bir yol arkadaşı.</strong>
            </p>
            <div>
              <span>01</span> Önce sizi dinliyoruz.
            </div>
            <div>
              <span>02</span> Birlikte değerlendiriyoruz.
            </div>
            <div>
              <span>03</span> Haklarınızı gözetiyoruz.
            </div>
          </div>
        </div>

        <section
          className="section services-section"
          id="calisma-alanlari"
          aria-labelledby="services-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-line" /> ÇALIŞMA ALANLARIMIZ
                </div>
                <h2 id="services-title">
                  Hayatın her alanında,
                  <br />
                  <em>hukukun yanınızda.</em>
                </h2>
              </div>
              <p>
                Bireysel ve kurumsal hukuki ihtiyaçlarınıza,
                <br className="desktop-break" /> titiz ve bütüncül bir bakış
                açısıyla yaklaşıyoruz.
              </p>
            </div>
            <div className="services-grid">
              {services.map((service, index) => {
                const Icon = serviceIcons[index];
                return (
                  <button
                    className="service-card"
                    key={service.id}
                    onClick={() => setModal({ type: "service", service })}
                    aria-label={`${service.title} hakkında bilgi alın`}
                  >
                    <div className="service-top">
                      <Icon size={31} strokeWidth={1.25} />
                      <span>{service.number}</span>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>
                    <div className="service-bottom">
                      <span>Detaylı bilgi</span>
                      <ArrowUpRight size={21} strokeWidth={1.4} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="services-footnote">
              <span>Hukuki ihtiyacınızdan emin değil misiniz?</span>
              <button className="text-link" onClick={() => book()}>
                Birlikte değerlendirelim <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section
          className="about-section"
          id="hakkimda"
          aria-labelledby="about-title"
        >
          <div className="container about-grid">
            <div className="about-art">
              <div
                className="about-art-image"
                role="img"
                aria-label="Adalet heykelinin mimari bir detayı"
              />
              <div className="about-art-quote">
                <span className="quote-mark">“</span>
                <p>
                  Her dosyanın ardında
                  <br />
                  bir hayat olduğunu
                  <br />
                  <em>unutmadan.</em>
                </p>
                <span className="quote-rule" />
                <small>İNSAN ODAKLI HUKUK YAKLAŞIMI</small>
              </div>
              <span className="about-art-index">01 / İLKEMİZ</span>
            </div>
            <div className="about-content">
              <div className="eyebrow">
                <span className="eyebrow-line" /> HAKKIMDA
              </div>
              <h2 id="about-title">
                Hukuki bilgi.
                <br />
                İnsani anlayış.
                <br />
                <em>Ortak bir güven.</em>
              </h2>
              <p className="about-lead">Avukat Ayşegül Çetinkaya</p>
              <p>
                Kocaeli’de faaliyet gösteren hukuk büromuzda, müvekkillerimizin
                ihtiyaçlarını merkeze alan avukatlık ve hukuki danışmanlık
                hizmetleri sunuyoruz.
              </p>
              <p>
                Ceza, aile ve ticaret hukuku başta olmak üzere çalışma
                alanlarımızda, her konuyu kendi koşulları içinde
                değerlendiriyor; güncel hukuki gelişmeleri takip ederek
                haklarınızın korunması için özenle çalışıyoruz.
              </p>
              <div className="about-signature">
                <span>Ayşegül Çetinkaya</span>
                <small>AVUKAT</small>
                <span className="signature-line" />
              </div>
              <a href="#iletisim" className="text-link">
                Büromuzla tanışın <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section
          className="section approach-section"
          aria-labelledby="approach-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-line" /> NASIL ÇALIŞIYORUZ?
                </div>
                <h2 id="approach-title">
                  Belirsizlikten,
                  <br />
                  <em>net bir yol haritasına.</em>
                </h2>
              </div>
              <p>
                Açık iletişim, özenli değerlendirme
                <br />
                ve sürecin her aşamasında bilgilendirme.
              </p>
            </div>
            <div className="approach-grid">
              {[
                [
                  "01",
                  "Sizi dinliyoruz.",
                  "İlk görüşmede ihtiyaçlarınızı, beklentilerinizi ve hukuki meselenizin ayrıntılarını birlikte ele alıyoruz.",
                ],
                [
                  "02",
                  "Yol haritasını çiziyoruz.",
                  "Belgelerinizi inceleyerek hukuki seçenekleri, olası riskleri ve izlenebilecek adımları açıklıyoruz.",
                ],
                [
                  "03",
                  "Süreci takip ediyoruz.",
                  "Belirlenen hukuki adımları özenle takip ediyor, gelişmeler hakkında sizi bilgilendiriyoruz.",
                ],
              ].map(([number, title, text]) => (
                <div className="approach-step" key={number}>
                  <div className="step-number">
                    <span>{number}</span>
                    <ArrowRight size={19} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> MERAK ETTİKLERİNİZ
              </div>
              <h2 id="faq-title">
                İlk adımdan önce,
                <br />
                <em>birkaç yanıt.</em>
              </h2>
              <p>
                Diğer sorularınız için bizimle
                <br />
                doğrudan iletişime geçebilirsiniz.
              </p>
              <a className="text-link" href={contact.phoneHref}>
                Bize ulaşın <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <details key={faq.question} name="faq">
                  <summary>
                    <span className="faq-index">0{i + 1}</span>
                    <span>{faq.question}</span>
                    <Plus size={20} strokeWidth={1.4} />
                  </summary>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="contact-section"
          id="iletisim"
          aria-labelledby="contact-title"
        >
          <div className="container">
            <div className="contact-top">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-line" /> İLETİŞİM
                </div>
                <h2 id="contact-title">
                  Sizi dinlemeye
                  <br />
                  <em>hazırız.</em>
                </h2>
                <p>Hukuki sürecinizin ilk adımını birlikte atalım.</p>
              </div>
              <button className="button button-cream" onClick={() => book()}>
                Görüşme planlayın <ArrowUpRight size={21} />
              </button>
            </div>
            <div className="contact-grid">
              <a className="contact-item" href={contact.phoneHref}>
                <Phone size={20} strokeWidth={1.3} />
                <span className="contact-item-label">TELEFON</span>
                <strong>{contact.phoneDisplay}</strong>
                <span className="contact-item-action">
                  Bizi arayın <ArrowUpRight size={15} />
                </span>
              </a>
              <a className="contact-item" href={`mailto:${contact.email}`}>
                <Mail size={20} strokeWidth={1.3} />
                <span className="contact-item-label">E-POSTA</span>
                <strong className="contact-email">{contact.email}</strong>
                <span className="contact-item-action">
                  E-posta gönderin <ArrowUpRight size={15} />
                </span>
              </a>
              <a
                className="contact-item contact-address"
                href={contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={20} strokeWidth={1.3} />
                <span className="contact-item-label">BÜROMUZ</span>
                <strong>{contact.address}</strong>
                <span className="contact-item-action">
                  Yol tarifi alın <ArrowUpRight size={15} />
                </span>
              </a>
              <div className="contact-item">
                <Clock3 size={20} strokeWidth={1.3} />
                <span className="contact-item-label">ÇALIŞMA SAATLERİ</span>
                <strong>
                  Pazartesi – Cuma
                  <br />
                  10.00 – 18.00
                </strong>
                <span className="contact-item-action">Randevu ile görüşme</span>
              </div>
            </div>
            <div className="contact-bottom">
              <span className="availability-dot" />
              <span>İzmit, Kocaeli’de yüz yüze hukuki danışmanlık.</span>
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={17} /> WhatsApp’tan yazın{" "}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <Brand />
            <div className="footer-navigation">
              {navigation.slice(1).map(([id, label]) => (
                <a key={id} href={`#${id}`}>
                  {label}
                </a>
              ))}
            </div>
            <a
              className="back-to-top"
              href="#ana-sayfa"
              aria-label="Sayfanın başına dön"
            >
              <ArrowUpRight size={20} />
            </a>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} Avukat Ayşegül Çetinkaya. Tüm hakları
              saklıdır.
            </p>
            <div>
              <button onClick={() => setModal({ type: "privacy" })}>
                Gizlilik
              </button>
              <span>·</span>
              <button onClick={() => setModal({ type: "legal" })}>
                Yasal bilgilendirme
              </button>
            </div>
          </div>
        </div>
      </footer>
      <a
        className="floating-contact"
        href={contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp üzerinden iletişime geçin"
      >
        <MessageCircle size={24} strokeWidth={1.5} />
        <span>Size nasıl yardımcı olabiliriz?</span>
      </a>

      {modal?.type === "appointment" && (
        <Appointment
          onClose={() => setModal(null)}
          initialTopic={modal.topic}
        />
      )}
      {modal?.type === "service" && (
        <Dialog title={modal.service.title} onClose={() => setModal(null)}>
          <div className="eyebrow modal-eyebrow">
            ÇALIŞMA ALANLARIMIZ / {modal.service.number}
          </div>
          <p className="dialog-intro">{modal.service.description}</p>
          <ul className="service-topics">
            {modal.service.topics.map((topic) => (
              <li key={topic}>
                <Check size={16} />
                {topic}
              </li>
            ))}
          </ul>
          <p className="form-note">
            Her hukuki mesele kendi koşulları içinde değerlendirilir. Konunuza
            ilişkin ayrıntıları görüşmek için randevu alabilirsiniz.
          </p>
          <button
            className="button button-dark button-full"
            onClick={() =>
              setModal({ type: "appointment", topic: modal.service.title })
            }
          >
            Bu konuda görüşmek istiyorum <ArrowUpRight size={18} />
          </button>
        </Dialog>
      )}
      {modal?.type === "legal" && (
        <Dialog title="Yasal bilgilendirme" onClose={() => setModal(null)}>
          <p className="dialog-intro">{legalNotice}</p>
        </Dialog>
      )}
      {modal?.type === "privacy" && (
        <Dialog title="Gizliliğiniz önemli." onClose={() => setModal(null)}>
          <div className="privacy-copy">
            <p>
              Bu web sitesinde reklam veya analitik çerezleri kullanılmaz.
              Randevu alanına yazdığınız notlar sitemizin sunucusuna gönderilmez
              ve tarayıcıda kalıcı olarak saklanmaz.
            </p>
            <p>
              WhatsApp ile iletişim seçeneğinde, seçtiğiniz konu ve yazdığınız
              not WhatsApp bağlantısına aktarılır. Mesaj, siz WhatsApp üzerinden
              göndermeden büromuza iletilmez. Telefon ve e-posta bağlantıları
              cihazınızın ilgili uygulamasını açar.
            </p>
            <p>
              WhatsApp ve Google Maps gibi dış bağlantıları açtığınızda ilgili
              hizmet sağlayıcının gizlilik koşulları geçerlidir. Barındırma
              hizmetinin teknik erişim kayıtları, kullandığınız sunucunun
              yapılandırmasına bağlıdır.
            </p>
            <p>
              İletişimde yalnızca gerekli bilgileri paylaşmanızı; hassas
              belgelerin iletimi için öncelikle büromuzla görüşmenizi öneririz.
            </p>
          </div>
        </Dialog>
      )}
    </>
  );
}
