import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db, storage, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Trash2, Plus, LogOut, FileText, Image as ImageIcon, Calendar, Newspaper, Users, Heart, Home, Settings } from 'lucide-react';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');

  // Data states
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [supporters, setSupporters] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [settings, setSettings] = useState({ email: 'contact@kolastudio.com', phone: '+33 1 23 45 67 89' });

  // Form states
  const [eventForm, setEventForm] = useState({ title: '', date: '', location: '', desc: '' });
  const [newsForm, setNewsForm] = useState({ title: '', category: '', excerpt: '' });
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const [supporterForm, setSupporterForm] = useState({ name: '' });
  const [supporterFile, setSupporterFile] = useState<File | null>(null);
  const [mediaForm, setMediaForm] = useState({ title: '', type: 'photo' });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || user.email !== 'vianneyadambadji@gmail.com') return;

    const qEvents = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qNews = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qSupporters = query(collection(db, 'supporters'), orderBy('createdAt', 'desc'));
    const unsubSupporters = onSnapshot(qSupporters, (snapshot) => {
      setSupporters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qMedia = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubMedia = onSnapshot(qMedia, (snapshot) => {
      setMedia(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qDonations = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
    const unsubDonations = onSnapshot(qDonations, (snapshot) => {
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as any);
      }
    });

    return () => {
      unsubEvents();
      unsubNews();
      unsubSupporters();
      unsubMedia();
      unsubDonations();
      unsubSettings();
    };
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-kola-bg">Chargement...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-kola-bg p-6">
        <h1 className="text-4xl font-display font-bold text-kola-dark mb-8">Administration KOLA</h1>
        <button onClick={loginWithGoogle} className="bg-kola-accent text-white px-8 py-4 font-display tracking-wider flex items-center gap-2">
          Se connecter avec Google
        </button>
      </div>
    );
  }

  if (user.email !== 'vianneyadambadji@gmail.com') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-kola-bg p-6">
        <h1 className="text-2xl font-display font-bold text-red-600 mb-4">Accès refusé</h1>
        <p className="mb-8">Vous n'avez pas les droits d'administration.</p>
        <button onClick={logout} className="bg-kola-dark text-white px-6 py-3 font-display tracking-wider">
          Se déconnecter
        </button>
      </div>
    );
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'events'), { ...eventForm, createdAt: serverTimestamp() });
      setEventForm({ title: '', date: '', location: '', desc: '' });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout");
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsFile) return alert("Veuillez sélectionner une image");
    setIsUploading(true);
    try {
      const fileRef = ref(storage, `news/${Date.now()}_${newsFile.name}`);
      await uploadBytes(fileRef, newsFile);
      const imageUrl = await getDownloadURL(fileRef);
      
      await addDoc(collection(db, 'news'), { ...newsForm, image: imageUrl, createdAt: serverTimestamp() });
      setNewsForm({ title: '', category: '', excerpt: '' });
      setNewsFile(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSupporter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supporterFile) return alert("Veuillez sélectionner un logo");
    setIsUploading(true);
    try {
      const fileRef = ref(storage, `supporters/${Date.now()}_${supporterFile.name}`);
      await uploadBytes(fileRef, supporterFile);
      const logoUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'supporters'), { ...supporterForm, logo: logoUrl, createdAt: serverTimestamp() });
      setSupporterForm({ name: '' });
      setSupporterFile(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) return alert("Veuillez sélectionner un fichier");
    setIsUploading(true);
    try {
      const fileRef = ref(storage, `media/${Date.now()}_${mediaFile.name}`);
      await uploadBytes(fileRef, mediaFile);
      const fileUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'media'), { ...mediaForm, url: fileUrl, createdAt: serverTimestamp() });
      setMediaForm({ title: '', type: 'photo' });
      setMediaFile(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'main'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      alert('Paramètres mis à jour avec succès');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour des paramètres');
    }
  };

  return (
    <div className="min-h-screen bg-kola-bg flex">
      {/* Sidebar */}
      <div className="w-64 bg-kola-dark text-white p-6 flex flex-col">
        <h2 className="text-2xl font-display font-bold text-kola-accent mb-10">KOLA ADMIN</h2>
        
        <nav className="flex-1 space-y-4">
          <button onClick={() => setActiveTab('events')} className={`flex items-center gap-3 w-full text-left p-3 transition-colors ${activeTab === 'events' ? 'bg-kola-accent text-kola-dark' : 'hover:bg-white/10'}`}>
            <Calendar size={20} /> Événements
          </button>
          <button onClick={() => setActiveTab('news')} className={`flex items-center gap-3 w-full text-left p-3 transition-colors ${activeTab === 'news' ? 'bg-kola-accent text-kola-dark' : 'hover:bg-white/10'}`}>
            <Newspaper size={20} /> Actualités
          </button>
          <button onClick={() => setActiveTab('supporters')} className={`flex items-center gap-3 w-full text-left p-3 transition-colors ${activeTab === 'supporters' ? 'bg-kola-accent text-kola-dark' : 'hover:bg-white/10'}`}>
            <Users size={20} /> Soutiens
          </button>
          <button onClick={() => setActiveTab('media')} className={`flex items-center gap-3 w-full text-left p-3 transition-colors ${activeTab === 'media' ? 'bg-kola-accent text-kola-dark' : 'hover:bg-white/10'}`}>
            <ImageIcon size={20} /> Médias (Photos/PDF)
          </button>
          <button onClick={() => setActiveTab('donations')} className={`flex items-center gap-3 w-full text-left p-3 transition-colors ${activeTab === 'donations' ? 'bg-kola-accent text-kola-dark' : 'hover:bg-white/10'}`}>
            <Heart size={20} /> Liste des Dons
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 w-full text-left p-3 transition-colors ${activeTab === 'settings' ? 'bg-kola-accent text-kola-dark' : 'hover:bg-white/10'}`}>
            <Settings size={20} /> Paramètres
          </button>
        </nav>

        <div className="mt-auto space-y-2">
          <Link to="/" className="flex items-center gap-3 text-gray-400 hover:text-white p-3 w-full transition-colors">
            <Home size={20} /> Retour au site
          </Link>
          <button onClick={logout} className="flex items-center gap-3 text-gray-400 hover:text-white p-3 w-full transition-colors">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        
        {activeTab === 'events' && (
          <div>
            <h3 className="text-3xl font-display font-bold mb-8">Gérer les Événements</h3>
            <form onSubmit={handleAddEvent} className="bg-white p-6 shadow-sm mb-10 grid gap-4">
              <input type="text" placeholder="Titre (ex: Atelier Créatif)" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="border p-3" required />
              <input type="text" placeholder="Date (ex: 15 Mai 2026)" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="border p-3" required />
              <input type="text" placeholder="Lieu (ex: Paris)" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="border p-3" required />
              <textarea placeholder="Description" value={eventForm.desc} onChange={e => setEventForm({...eventForm, desc: e.target.value})} className="border p-3" required />
              <button type="submit" className="bg-kola-accent text-white p-3 font-bold flex items-center justify-center gap-2"><Plus size={20}/> Ajouter</button>
            </form>

            <div className="space-y-4">
              {events.map(ev => (
                <div key={ev.id} className="bg-white p-4 shadow-sm flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{ev.title}</h4>
                    <p className="text-sm text-gray-500">{ev.date} - {ev.location}</p>
                  </div>
                  <button onClick={() => handleDelete('events', ev.id)} className="text-red-500 hover:bg-red-50 p-2"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            <h3 className="text-3xl font-display font-bold mb-8">Gérer les Actualités</h3>
            <form onSubmit={handleAddNews} className="bg-white p-6 shadow-sm mb-10 grid gap-4">
              <input type="text" placeholder="Titre" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} className="border p-3" required />
              <input type="text" placeholder="Catégorie (ex: Article, Actualité)" value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})} className="border p-3" required />
              <input type="file" accept="image/*" onChange={e => setNewsFile(e.target.files?.[0] || null)} className="border p-3" required />
              <textarea placeholder="Extrait (courte description)" value={newsForm.excerpt} onChange={e => setNewsForm({...newsForm, excerpt: e.target.value})} className="border p-3" required />
              <button type="submit" disabled={isUploading} className="bg-kola-accent text-white p-3 font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                <Plus size={20}/> {isUploading ? 'Chargement...' : 'Ajouter'}
              </button>
            </form>

            <div className="space-y-4">
              {news.map(n => (
                <div key={n.id} className="bg-white p-4 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={n.image} alt={n.title} className="w-16 h-16 object-cover" />
                    <div>
                      <h4 className="font-bold">{n.title}</h4>
                      <p className="text-sm text-gray-500">{n.category}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete('news', n.id)} className="text-red-500 hover:bg-red-50 p-2"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'supporters' && (
          <div>
            <h3 className="text-3xl font-display font-bold mb-8">Gérer les Soutiens</h3>
            <form onSubmit={handleAddSupporter} className="bg-white p-6 shadow-sm mb-10 grid gap-4">
              <input type="text" placeholder="Nom du partenaire" value={supporterForm.name} onChange={e => setSupporterForm({...supporterForm, name: e.target.value})} className="border p-3" required />
              <input type="file" accept="image/*" onChange={e => setSupporterFile(e.target.files?.[0] || null)} className="border p-3" required />
              <button type="submit" disabled={isUploading} className="bg-kola-accent text-white p-3 font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                <Plus size={20}/> {isUploading ? 'Chargement...' : 'Ajouter'}
              </button>
            </form>

            <div className="space-y-4">
              {supporters.map(s => (
                <div key={s.id} className="bg-white p-4 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={s.logo} alt={s.name} className="w-16 h-16 object-contain bg-gray-100" />
                    <h4 className="font-bold">{s.name}</h4>
                  </div>
                  <button onClick={() => handleDelete('supporters', s.id)} className="text-red-500 hover:bg-red-50 p-2"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            <h3 className="text-3xl font-display font-bold mb-8">Gérer les Médias</h3>
            <form onSubmit={handleAddMedia} className="bg-white p-6 shadow-sm mb-10 grid gap-4">
              <input type="text" placeholder="Titre du média" value={mediaForm.title} onChange={e => setMediaForm({...mediaForm, title: e.target.value})} className="border p-3" required />
              <select value={mediaForm.type} onChange={e => setMediaForm({...mediaForm, type: e.target.value})} className="border p-3">
                <option value="photo">Photo</option>
                <option value="pdf">Document PDF</option>
              </select>
              <input type="file" accept={mediaForm.type === 'photo' ? 'image/*' : 'application/pdf'} onChange={e => setMediaFile(e.target.files?.[0] || null)} className="border p-3" required />
              <button type="submit" disabled={isUploading} className="bg-kola-accent text-white p-3 font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                <Plus size={20}/> {isUploading ? 'Chargement...' : 'Ajouter'}
              </button>
            </form>

            <div className="space-y-4">
              {media.map(m => (
                <div key={m.id} className="bg-white p-4 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {m.type === 'photo' ? <ImageIcon className="text-kola-accent" /> : <FileText className="text-kola-accent" />}
                    <div>
                      <h4 className="font-bold">{m.title}</h4>
                      <a href={m.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">Voir le fichier</a>
                    </div>
                  </div>
                  <button onClick={() => handleDelete('media', m.id)} className="text-red-500 hover:bg-red-50 p-2"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div>
            <h3 className="text-3xl font-display font-bold mb-8">Liste des Dons</h3>
            <div className="bg-white p-6 shadow-sm mb-10">
              <p className="text-gray-600 mb-4">
                Cette section affiche la liste des dons reçus. L'intégration avec l'API Feexpay sera ajoutée prochainement.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="p-3 font-bold">Date</th>
                      <th className="p-3 font-bold">Nom</th>
                      <th className="p-3 font-bold">Email</th>
                      <th className="p-3 font-bold">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500">Aucun don enregistré pour le moment.</td>
                      </tr>
                    ) : (
                      donations.map(d => (
                        <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3">{d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                          <td className="p-3">{d.firstName} {d.lastName}</td>
                          <td className="p-3">{d.email}</td>
                          <td className="p-3 font-bold text-kola-accent">{d.amount} FCFA</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 className="text-3xl font-display font-bold mb-8">Paramètres de Contact</h3>
            <div className="bg-white p-6 shadow-sm mb-10">
              <form onSubmit={handleUpdateSettings} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-bold mb-1">Email de contact</label>
                  <input 
                    type="email" 
                    value={settings.email || ''} 
                    onChange={e => setSettings({...settings, email: e.target.value})} 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Téléphone de contact</label>
                  <input 
                    type="text" 
                    value={settings.phone || ''} 
                    onChange={e => setSettings({...settings, phone: e.target.value})} 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <button type="submit" className="bg-kola-accent text-kola-dark px-4 py-2 font-bold rounded hover:bg-kola-accent/90 transition-colors">
                  Enregistrer les modifications
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
