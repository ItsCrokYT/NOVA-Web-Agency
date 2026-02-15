import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, firebaseConfig } from '../../services/firebase'; 
import { initializeApp, getApp, deleteApp } from 'firebase/app'; 
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  collection, query, where, onSnapshot, doc, updateDoc, setDoc,
  orderBy, addDoc, serverTimestamp, deleteDoc 
} from 'firebase/firestore';
import { 
  LayoutDashboard, ShoppingCart, MessageSquare, Users, 
  Settings, LogOut, Search, Bell, CheckCircle, XCircle, 
  Clock, Send, Code, ExternalLink, ChevronRight, UserPlus, Trash2, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playMessageSound, playTypingSound } from '../../utils/sounds'; // Importar sonidos

// === SUB-COMPONENTE: CHAT ADMIN ===
const AdminChat = ({ filterRole }) => {
  const { currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [clientTyping, setClientTyping] = useState(false); // Estado para ver si el cliente escribe
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 1. Cargar lista de usuarios
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', filterRole));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs
        .map(doc => ({ uid: doc.id, ...doc.data() }))
        .filter(u => u.uid !== currentUser.uid);
      setUsersList(users);
    });
    return () => unsubscribe();
  }, [currentUser, filterRole]);

  // 2. Cargar mensajes y estado de escritura
  useEffect(() => {
    if (!selectedUser) return;

    // Escuchar mensajes
    const q = query(
      collection(db, 'chats', selectedUser.uid, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribeMsgs = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
      
      // Sonido al recibir mensaje (si no es del admin)
      if (snapshot.docChanges().some(change => change.type === 'added')) {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg && lastMsg.sender !== 'admin' && !snapshot.metadata.hasPendingWrites) {
          playMessageSound();
        }
      }
      scrollToBottom();
    });

    // Escuchar estado "Escribiendo" del cliente (o dev)
    const chatDocRef = doc(db, 'chats', selectedUser.uid);
    const unsubscribeTyping = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const isTyping = filterRole === 'dev' ? data.devTyping : data.clientTyping;
        
        if (isTyping) {
          if (!clientTyping) playTypingSound();
          setClientTyping(true);
        } else {
          setClientTyping(false);
        }
      }
    });

    return () => {
      unsubscribeMsgs();
      unsubscribeTyping();
    };
  }, [selectedUser, filterRole]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleInputChange = async (e) => {
    setNewMessage(e.target.value);
    if (!selectedUser) return;

    // Actualizar "adminTyping" en el documento del chat
    const chatDocRef = doc(db, 'chats', selectedUser.uid);
    await setDoc(chatDocRef, { adminTyping: true }, { merge: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(async () => {
      await setDoc(chatDocRef, { adminTyping: false }, { merge: true });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    // Resetear typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    const chatDocRef = doc(db, 'chats', selectedUser.uid);
    await setDoc(chatDocRef, { adminTyping: false }, { merge: true });

    await addDoc(collection(db, 'chats', selectedUser.uid, 'messages'), {
      text: newMessage,
      sender: 'admin',
      createdAt: serverTimestamp(),
    });
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-nova-card border border-white/10 rounded-2xl overflow-hidden">
      {/* Lista */}
      <div className="w-1/3 border-r border-white/10 overflow-y-auto custom-scrollbar">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="font-bold text-white capitalize">{filterRole === 'client' ? 'Clientes' : 'Desarrolladores'}</h3>
        </div>
        {usersList.length === 0 && <p className="p-4 text-sm text-gray-500 text-center">Sin usuarios.</p>}
        {usersList.map(user => (
          <div 
            key={user.uid}
            onClick={() => setSelectedUser(user)}
            className={`p-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 flex items-center gap-3 ${
              selectedUser?.uid === user.uid ? 'bg-nova-primary/10 border-l-4 border-l-nova-primary' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              user.role === 'dev' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {user.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-white font-medium truncate">{user.email}</p>
              <span className="text-xs text-gray-500 uppercase font-mono">{user.role}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="w-2/3 flex flex-col bg-nova-bg/50">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <span className="font-bold text-white flex items-center gap-2">
                Chat con {selectedUser.email} 
                <span className="text-xs font-normal text-gray-400">({selectedUser.role})</span>
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'admin' 
                      ? 'bg-nova-primary text-white rounded-br-none' 
                      : 'bg-white/10 text-gray-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Animación "Escribiendo..." del usuario remoto */}
              <AnimatePresence>
                {clientTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                      <span className="text-xs text-gray-400 mr-2">Escribiendo</span>
                      <motion.span className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.span className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.span className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={handleInputChange} // Usamos handler con typing logic
                  placeholder="Escribe como Admin..."
                  className="w-full bg-nova-bg border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-nova-cyan"
                />
                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-nova-cyan rounded-lg text-nova-bg hover:bg-white transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Selecciona un usuario.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// === SUB-COMPONENTE: GESTIÓN DE EQUIPO ===
const TeamManager = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'dev'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDevelopers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCreateDev = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    let secondaryApp;
    try {
      const appName = 'SecondaryApp';
      try {
        secondaryApp = getApp(appName);
      } catch (e) {
        secondaryApp = initializeApp(firebaseConfig, appName);
      }
      
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'dev',
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
      });

      await signOut(secondaryAuth);
      setSuccess(`Desarrollador ${email} creado correctamente.`);
      setEmail('');
      setPassword('');

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado.');
      } else {
        setError('Error al crear cuenta: ' + err.message);
      }
    } finally {
      if (secondaryApp) {
        try { deleteApp(secondaryApp); } catch(e) { console.log("App cleanup handled"); }
      }
      setLoading(false);
    }
  };

  const handleDeleteDev = async (uid) => {
    if(!confirm("¿Estás seguro?")) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (err) {
      alert("Error al borrar: " + err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-nova-card border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <UserPlus size={20} className="text-nova-cyan" />
          Registrar Nuevo Desarrollador
        </h3>
        <form onSubmit={handleCreateDev} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-mono uppercase">Correo Electrónico</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-nova-cyan mt-1" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-mono uppercase">Contraseña Temporal</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-nova-cyan mt-1" />
          </div>
          {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
          {success && <p className="text-green-400 text-sm bg-green-500/10 p-2 rounded">{success}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-nova-primary hover:bg-nova-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-nova-primary/20">{loading ? 'Creando...' : 'Crear Cuenta Dev'}</button>
        </form>
      </div>
      <div className="bg-nova-card border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users size={20} className="text-nova-magenta" /> Equipo Actual ({developers.length})</h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {developers.map(dev => (
            <div key={dev.uid} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">{dev.email[0].toUpperCase()}</div>
                <div><p className="text-sm text-white font-medium">{dev.email}</p></div>
              </div>
              <button onClick={() => handleDeleteDev(dev.uid)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// === SUB-COMPONENTE: GESTOR DE PEDIDOS ===
const OrdersManager = ({ developers }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAssignDev = async (orderId, devId) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { devId: devId, status: 'in_progress' });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['pending', 'in_progress', 'review', 'completed'].map(status => (
          <div key={status} className="bg-nova-card border border-white/5 p-4 rounded-xl">
            <h4 className="text-gray-400 text-xs uppercase font-mono mb-1">{status.replace('_', ' ')}</h4>
            <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === status).length}</p>
          </div>
        ))}
      </div>
      <div className="bg-nova-card border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs text-gray-400 uppercase font-mono">
              <th className="p-4">Proyecto / Cliente</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Desarrollador</th>
              <th className="p-4">Entrega</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map(order => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4"><p className="font-bold text-white">{order.title}</p><p className="text-xs text-gray-500">{order.id}</p></td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : order.status === 'review' ? 'bg-purple-500/20 text-purple-400' : order.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{order.status?.replace('_', ' ')}</span></td>
                <td className="p-4">
                  <select value={order.devId || ""} onChange={(e) => handleAssignDev(order.id, e.target.value)} className="bg-nova-bg border border-white/20 rounded px-2 py-1 text-white text-xs focus:border-nova-cyan outline-none">
                    <option value="">Sin asignar</option>
                    {developers.map(dev => (<option key={dev.uid} value={dev.uid}>{dev.email}</option>))}
                  </select>
                </td>
                <td className="p-4 text-gray-400">{order.repoUrl ? (<a href={order.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-nova-cyan hover:underline"><ExternalLink size={12} /> Ver Repo</a>) : "Pendiente"}</td>
                <td className="p-4 text-right space-x-2">
                  {order.status === 'review' && (
                    <>
                      <button onClick={() => handleUpdateStatus(order.id, 'in_progress')} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40" title="Rechazar"><XCircle size={16} /></button>
                      <button onClick={() => handleUpdateStatus(order.id, 'completed')} className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/40" title="Aprobar"><CheckCircle size={16} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'dev'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDevelopers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { key: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { key: 'chat_clients', label: 'Chat Clientes', icon: MessageSquare },
    { key: 'chat_devs', label: 'Chat Devs', icon: MessageCircle },
    { key: 'team', label: 'Equipo Dev', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-nova-bg text-white overflow-hidden">
      <aside className="w-64 bg-nova-card border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-nova-cyan to-nova-primary">NOVA Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Centro de Comando</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button key={item.key} onClick={() => setActiveTab(item.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.key ? 'bg-nova-primary/20 text-nova-cyan border border-nova-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <item.icon size={20} /><span className="font-medium">{item.label}</span>{activeTab === item.key && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"><LogOut size={20} /><span>Cerrar Sesión</span></button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-nova-bg/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white capitalize">{activeTab.replace('_', ' ').replace('chat', 'Chat')}</h2>
          <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-gradient-to-tr from-nova-cyan to-nova-primary flex items-center justify-center font-bold text-xs">AD</div></div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full">
              {activeTab === 'orders' && <OrdersManager developers={developers} />}
              {activeTab === 'chat_clients' && <AdminChat filterRole="client" />}
              {activeTab === 'chat_devs' && <AdminChat filterRole="dev" />}
              {activeTab === 'team' && <TeamManager />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;