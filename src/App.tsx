import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  Newspaper, 
  ArrowRight, 
  Menu, 
  X, 
  MapPin, 
  Mail, 
  Phone,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Download,
  FileText
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { db } from './firebase';
import Admin from './Admin';

const TEAM = [
  {
    name: "RAYANE PIO",
    role: "Directrice de la Conception Spatiale",
    desc: "(Responsable de la conception et des opérations soit : de la conception et de la réalisation des travaux)",
    image: "/RAYANE.png"
  },
  {
    name: "TAGNON ADAMBADJI",
    role: "Designer / Responsable de Projet & Stratégie (Business Lead)",
    desc: "(Assistant de conception et Responsable de la viabilité économique et de la relation avec les investisseurs.)",
    image: "/VIANNEY.png"
  },
  {
    name: "ELICIA MISSIHOUN",
    role: "Designer d'espace spécialisé en design d'expérience & sensoriel",
    desc: "Responsable de l'ambiance et du ressenti émotionnel à l'intérieur de l'espace (expérience utilisateur).",
    image: "/ELICIA.png"
  }
];

const EVENTS = [
  {
    date: "15 Mai 2026",
    title: "Atelier Créatif Solidaire",
    location: "Espace VI WE, Paris",
    desc: "Une journée d'expression artistique pour les enfants, encadrée par nos designers."
  },
  {
    date: "02 Juin 2026",
    title: "Conférence : L'espace comme outil de guérison",
    location: "En ligne & KOLA STUDIO",
    desc: "Discussion sur l'impact du design sensoriel sur le bien-être psychologique des enfants."
  },
  {
    date: "20 Juin 2026",
    title: "Grande Collecte Annuelle",
    location: "Parvis de l'Hôtel de Ville",
    desc: "Rejoignez-nous pour soutenir le déploiement de nouvelles cabines VI WE."
  }
];

const NEWS = [
  {
    title: "Inauguration de la première cabine VI WE",
    category: "Actualité",
    image: "https://picsum.photos/seed/inauguration/600/400",
    excerpt: "Découvrez les images de notre toute première unité d'aide, un espace pensé pour rassurer et écouter."
  },
  {
    title: "Le design sensoriel au service de l'enfance",
    category: "Article",
    image: "https://picsum.photos/seed/sensory/600/400",
    excerpt: "Comment les choix de matériaux, de lumières et de couleurs influencent le sentiment de sécurité."
  },
  {
    title: "Nouveau partenariat avec l'UNICEF",
    category: "Partenariat",
    image: "https://picsum.photos/seed/partnership/600/400",
    excerpt: "KOLA STUDIO s'associe à des acteurs majeurs pour étendre la portée du projet VI WE."
  }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubSettings();
    };
  }, []);

  const links = [
    { name: "L'Agence", href: "#agence" },
    { name: "Projet VI WE", href: "#projet" },
    { name: "Médias", href: "#medias" },
    { name: "Événements", href: "#evenements" },
    { name: "Actualités", href: "#actualites" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-kola-bg/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center group">
          <img src={settings?.logo1 || "/LOGO1.png"} alt="KOLA Studio" className="h-16 md:h-20 w-auto object-contain transition-all duration-300" referrerPolicy="no-referrer" />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {links.map(link => (
              <a key={link.name} href={link.href} className={`text-sm font-medium hover:text-kola-accent transition-colors ${scrolled ? 'text-kola-text' : 'text-white/90'}`}>
                {link.name}
              </a>
            ))}
          </div>
          <a href="#soutenir" className="bg-kola-accent hover:bg-kola-accent/90 text-white px-6 py-2.5 rounded-none font-display tracking-wider text-sm transition-all shadow-md flex items-center gap-2">
            <Heart size={16} />
            SOUTENIR
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden ${scrolled ? 'text-kola-text' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-kola-bg border-t border-kola-light overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {links.map(link => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-kola-text font-medium py-2 border-b border-kola-light/50 font-display tracking-wide"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#soutenir" 
                onClick={() => setIsOpen(false)}
                className="bg-kola-accent text-white px-6 py-3 font-display tracking-wider text-center mt-2 flex items-center justify-center gap-2"
              >
                <Heart size={18} />
                SOUTENIR LE PROJET
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const Hero = () => {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    return () => unsubSettings();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <img src={settings?.heroBg || "https://picsum.photos/seed/childrencare/1920/1080?blur=2"} alt="Enfants" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-kola-dark/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-kola-dark/40 via-transparent to-kola-bg"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-12 bg-kola-accent"></div>
            <span className="text-kola-accent font-display tracking-widest text-sm">
              UNE INITIATIVE KOLA STUDIO
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-none font-display tracking-tight">
            PROJET <span className="text-kola-accent">VI WE</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-2xl">
            Une cabine et unité d'aide dédiée au soutien et à l'épanouissement des enfants de tous genres.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#soutenir" className="bg-kola-accent hover:bg-kola-accent/90 text-white px-8 py-4 font-display tracking-wider transition-all flex items-center justify-center gap-2">
              <Heart size={20} />
              SOUTENIR LE PROJET
            </a>
            <a href="#projet" className="bg-transparent hover:bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 font-display tracking-wider transition-all flex items-center justify-center gap-2">
              DÉCOUVRIR
              <ArrowRight size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const About = () => {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    return () => unsubSettings();
  }, []);

  const teamWithImages = [
    { ...TEAM[0], image: settings?.teamRayane || TEAM[0].image },
    { ...TEAM[1], image: settings?.teamVianney || TEAM[1].image },
    { ...TEAM[2], image: settings?.teamElicia || TEAM[2].image }
  ];

  return (
    <section id="agence" className="py-24 bg-kola-bg relative">
      <div className="container mx-auto px-6">
        
        {/* Title matching the image */}
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-5xl md:text-6xl font-display font-bold text-kola-accent tracking-wide">À PROPOS</h2>
          <div className="h-3 md:h-4 bg-kola-accent flex-1 max-w-lg mt-2"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side: Text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-lg text-kola-text leading-relaxed"
          >
            <p>
              Kola Studio est une agence de design et de création qui développe des solutions concrètes pour résoudre des problèmes sociaux. Nous collaborons avec des partenaires internationaux, qui sont souvent à la fois clients et investisseurs.
            </p>
            <p>
              Notre mission : transformer la société par des réalisations concrètes, tout en évoluant avec les innovations et en restant résilients. Dans notre ADN, on ne lâche jamais.
            </p>
          </motion.div>

          {/* Right side: Dark Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-kola-dark rounded-xl p-8 md:p-10 shadow-2xl"
          >
            <div className="flex flex-col gap-8">
              {teamWithImages.map((member, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-md overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl sm:text-2xl font-display font-bold text-kola-accent mb-1 tracking-wide">{member.name}</h4>
                    <p className="text-white font-bold text-xs sm:text-sm mb-2">{member.role}</p>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{member.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const Project = () => {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    return () => unsubSettings();
  }, []);

  return (
    <section id="projet" className="py-24 bg-kola-light/30 border-y border-kola-light">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-kola-dark tracking-wide">LE PROJET VI WE</h2>
              <div className="h-2 bg-kola-dark flex-1 max-w-xs mt-2"></div>
            </div>
            
            <div className="space-y-6 text-lg text-kola-text/80">
              <p>
                <strong>VI WE</strong> est bien plus qu'un simple projet architectural. C'est une cabine et une unité d'aide conçue spécifiquement pour offrir un espace sécurisant aux enfants de tous genres en situation de vulnérabilité.
              </p>
              <p>
                Pensé comme un point focal pour les organisations d'aide sociale et les conseils pour enfants, cet espace utilise le design sensoriel pour apaiser, encourager la parole et faciliter l'accompagnement psychologique.
              </p>
              <ul className="space-y-4 mt-8">
                {[
                  "Un environnement chaleureux et non-intimidant.",
                  "Des matériaux et couleurs choisis pour leur impact apaisant.",
                  "Un outil concret pour les travailleurs sociaux et psychologues."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-kola-accent/20 p-1 rounded-sm text-kola-accent">
                      <ShieldCheck size={16} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-none overflow-hidden border-8 border-white shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
              <img src={settings?.projectConcept || "/ENFANT.jpg"} alt="Concept Cabine VI WE" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-kola-dark p-6 shadow-xl max-w-xs border-l-4 border-kola-accent">
              <div className="flex items-center gap-4 mb-2">
                <div className="text-kola-accent">
                  <Heart size={24} />
                </div>
                <h4 className="font-display font-bold text-white tracking-wider">IMPACT DIRECT</h4>
              </div>
              <p className="text-sm text-gray-300">Chaque cabine installée permet d'accompagner des centaines d'enfants dans un cadre digne et adapté.</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-24">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-[1px] bg-kola-dark/20 flex-1 max-w-[100px]"></div>
            <h3 className="text-2xl font-display font-bold text-kola-dark tracking-widest uppercase">Vues du Projet</h3>
            <div className="h-[1px] bg-kola-dark/20 flex-1 max-w-[100px]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="overflow-hidden shadow-lg border-4 border-white">
              <img src={settings?.projectVue1 || "/Gemini_Generated_Image_is1842is1842is18.png"} alt="Vue Projet VI WE 1" className="w-full h-80 object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="overflow-hidden shadow-lg border-4 border-white">
              <img src={settings?.projectVue2 || "/Gemini_Generated_Image_v4vxyxv4vxyxv4vx.png"} alt="Vue Projet VI WE 2" className="w-full h-80 object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="overflow-hidden shadow-lg border-4 border-white">
              <img src={settings?.projectVue3 || "/Gemini_Generated_Image_h3rylth3rylth3ry.png"} alt="Vue Projet VI WE 3" className="w-full h-80 object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const MediaGallery = () => {
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    const qMedia = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qMedia, (snapshot) => {
      setMedia(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  if (media.length === 0) return null;

  const photos = media.filter(m => m.type === 'photo');
  const pdfs = media.filter(m => m.type === 'pdf');

  return (
    <section id="medias" className="py-24 bg-white border-y border-kola-light">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-kola-dark tracking-wide">MÉDIAS & DOCUMENTS</h2>
          <div className="h-2 bg-kola-accent flex-1 max-w-xs mt-2"></div>
        </div>

        {photos.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-display font-bold mb-6 text-kola-dark">Galerie Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="aspect-square overflow-hidden bg-gray-100 group relative">
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-display font-bold text-center px-4">{photo.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pdfs.length > 0 && (
          <div>
            <h3 className="text-2xl font-display font-bold mb-6 text-kola-dark">Documents (PDF)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfs.map(pdf => (
                <a key={pdf.id} href={pdf.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-6 border border-kola-light hover:border-kola-accent transition-colors group">
                  <div className="bg-kola-bg p-4 text-kola-accent group-hover:bg-kola-accent group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-kola-dark group-hover:text-kola-accent transition-colors">{pdf.title}</h4>
                    <span className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Download size={14} /> Télécharger</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const EventsNews = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const qEvents = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qNews = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubEvents();
      unsubNews();
    };
  }, []);

  return (
    <section className="py-24 bg-kola-bg">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Events */}
          <div id="evenements">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-4xl font-display font-bold text-kola-dark">ÉVÉNEMENTS</h3>
              <div className="h-1 bg-kola-dark flex-1 max-w-[100px] mt-2"></div>
            </div>
            <div className="space-y-6">
              {events.length === 0 ? (
                <p className="text-gray-500 italic">Aucun événement à venir.</p>
              ) : events.map((ev, i) => (
                <motion.div 
                  key={ev.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-kola-accent flex gap-6"
                >
                  <div className="flex-shrink-0 text-center border-r border-kola-light pr-6">
                    <div className="text-sm font-bold text-kola-accent uppercase">{ev.date.split(' ')[1] || 'Date'}</div>
                    <div className="text-4xl font-display font-bold text-kola-dark">{ev.date.split(' ')[0] || '-'}</div>
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold text-kola-text mb-2">{ev.title}</h4>
                    <p className="text-sm text-kola-text/60 mb-3 flex items-center gap-1">
                      <MapPin size={14} /> {ev.location}
                    </p>
                    <p className="text-kola-text/80 text-sm">{ev.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* News */}
          <div id="actualites">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-4xl font-display font-bold text-kola-dark">ACTUALITÉS</h3>
              <div className="h-1 bg-kola-dark flex-1 max-w-[100px] mt-2"></div>
            </div>
            <div className="space-y-8">
              {news.length === 0 ? (
                <p className="text-gray-500 italic">Aucune actualité pour le moment.</p>
              ) : news.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer flex gap-6 items-center bg-white p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-28 h-28 overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-kola-accent uppercase tracking-wider mb-2 block">{item.category}</span>
                    <h4 className="text-lg font-display font-bold text-kola-text mb-2 group-hover:text-kola-accent transition-colors">{item.title}</h4>
                    <p className="text-sm text-kola-text/70 line-clamp-2">{item.excerpt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

const Support = () => {
  const [amount, setAmount] = useState<number | string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !firstName || !lastName || !email) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Placeholder pour l'intégration future de Feexpay
      // const feexpayResponse = await initFeexpayPayment({ amount, email, ... });
      
      await addDoc(collection(db, 'donations'), {
        amount: Number(amount),
        firstName,
        lastName,
        email,
        status: 'completed', // Simulation d'un paiement réussi
        createdAt: serverTimestamp()
      });
      
      setSuccess(true);
      setAmount("");
      setFirstName("");
      setLastName("");
      setEmail("");
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Erreur lors du don:", error);
      alert("Une erreur est survenue lors du traitement de votre don.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="soutenir" className="py-24 bg-kola-dark text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-kola-accent/5 blur-3xl transform translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-[#1A1A1A] border border-white/10 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-kola-accent mb-4">SOUTENEZ LE PROJET VI WE</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Votre don permet de financer la construction de nouvelles cabines et d'offrir un espace sécurisant à plus d'enfants. Chaque contribution compte.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-display tracking-wider mb-6">INDIQUEZ UN MONTANT</h3>
              <div className="relative mb-8">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">FCFA</span>
                <input 
                  type="number" 
                  placeholder="Montant libre"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-4 pr-16 py-4 bg-transparent border border-white/20 focus:border-kola-accent focus:ring-0 outline-none font-display text-xl transition-colors text-white placeholder-gray-600"
                />
              </div>

              <div className="bg-white/5 p-6 border-l-2 border-kola-accent">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-kola-accent" />
                  Paiement 100% sécurisé
                </h4>
                <p className="text-sm text-gray-400 mb-4">Vos données sont cryptées et protégées.</p>
                <div className="flex gap-3 text-gray-500">
                  <CreditCard size={32} />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              {success ? (
                <div className="bg-kola-accent/20 border border-kola-accent p-8 text-center">
                  <Heart size={48} className="text-kola-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Merci pour votre don !</h3>
                  <p className="text-gray-300">Votre soutien est précieux pour le projet VI WE.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleDonation}>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Prénom" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-kola-accent outline-none text-white placeholder-gray-500" 
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Nom" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-kola-accent outline-none text-white placeholder-gray-500" 
                      required
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Adresse e-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-kola-accent outline-none text-white placeholder-gray-500" 
                    required
                  />
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-kola-accent hover:bg-kola-accent/90 text-kola-dark font-display font-bold tracking-wider text-xl py-4 transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Heart size={20} />
                    {isSubmitting ? 'TRAITEMENT...' : `FAIRE UN DON ${amount ? `DE ${amount} FCFA` : ''}`}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    En cliquant sur ce bouton, vous acceptez nos conditions générales d'utilisation.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Supporters = () => {
  const [supporters, setSupporters] = useState<any[]>([]);

  useEffect(() => {
    const qSupporters = query(collection(db, 'supporters'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qSupporters, (snapshot) => {
      setSupporters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  if (supporters.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-kola-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-display font-bold text-kola-dark tracking-wide">ILS SOUTIENNENT LE PROJET</h3>
          <div className="h-1 w-16 bg-kola-accent mx-auto mt-4"></div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {supporters.map((supporter) => (
            <div key={supporter.id} className="w-32 md:w-40 hover:scale-105 transition-transform cursor-pointer">
              <img src={supporter.logo} alt={supporter.name} className="w-full h-auto object-contain" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Footer = () => {
  const [settings, setSettings] = useState({ email: 'contact@kolastudio.com', phone: '+33 1 23 45 67 89' });

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as any);
      }
    });
    return () => unsubSettings();
  }, []);

  return (
    <footer className="bg-[#111111] text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-start mb-6">
              <img src={settings?.logo2 || "/LOGO2.png"} alt="KOLA Studio" className="h-20 md:h-24 w-auto object-contain" referrerPolicy="no-referrer" />
            </div>
            <p className="text-gray-400 max-w-md mb-8">
              Agence de design d'espace dédiée à la création d'environnements qui soignent, soutiennent et inspirent. Porteurs du projet VI WE.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-kola-accent hover:text-kola-dark hover:border-kola-accent transition-colors cursor-pointer">
                <span className="font-bold font-display">IN</span>
              </div>
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-kola-accent hover:text-kola-dark hover:border-kola-accent transition-colors cursor-pointer">
                <span className="font-bold font-display">IG</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-xl mb-6 text-kola-accent tracking-wider">NAVIGATION</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#agence" className="hover:text-kola-accent transition-colors">L'Agence</a></li>
              <li><a href="#projet" className="hover:text-kola-accent transition-colors">Projet VI WE</a></li>
              <li><a href="#medias" className="hover:text-kola-accent transition-colors">Médias</a></li>
              <li><a href="#evenements" className="hover:text-kola-accent transition-colors">Événements</a></li>
              <li><a href="#actualites" className="hover:text-kola-accent transition-colors">Actualités</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-6 text-kola-accent tracking-wider">CONTACT</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-kola-accent flex-shrink-0" />
                <span>Cotonou, Bénin</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-kola-accent flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-kola-accent transition-colors">{settings.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-kola-accent flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-kola-accent transition-colors">{settings.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} KOLA STUDIO. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/admin" className="hover:text-white transition-colors">A</Link>
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const MainApp = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Project />
      <MediaGallery />
      <EventsNews />
      <Support />
      <Supporters />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
