import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, addDoc, orderBy, serverTimestamp, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MessageSquare, Send, LogOut, PlusCircle, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { playMessageSound, playTypingSound } from '../../utils/sounds'; // Importar sonidos

const ClientDashboard = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [adminTyping, setAdminTyping] = useState(false); // Estado para ver si el admin escribe
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 1. Cargar Pedidos
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'orders'), where('clientId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // 2. Cargar Chat y Sonidos
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'chats', currentUser.uid, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
      
      // Reproducir sonido si el último mensaje no es mío y es reciente
      if (snapshot.docChanges().some(change => change.type === 'added')) {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg && lastMsg.sender !== 'client' && !snapshot.metadata.hasPendingWrites) {
          playMessageSound();
        }
      }
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Escuchar si el Admin está escribiendo
  useEffect(() => {
    if (!currentUser) return;
    // Escuchamos el documento principal del chat para ver el estado 'adminTyping'
    const chatDocRef = doc(db, 'chats', currentUser.uid);
    const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.adminTyping) {
          if (!adminTyping) playTypingSound(); // Sonido solo al empezar
          setAdminTyping(true);
        } else {
          setAdminTyping(false);
        }
      }
    }, (error) => {
        // Ignorar si el documento aún no existe
    });
    return () => unsubscribe();
  }, [currentUser, adminTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Manejar Input y estado de "Escribiendo..."
  const handleInputChange = async (e) => {
    setNewMessage(e.target.value);

    if (!currentUser) return;

    // Actualizar estado en Firebase: "Cliente está escribiendo"
    const chatDocRef = doc(db, 'chats', currentUser.uid);
    
    // Nos aseguramos que el documento exista, si no, setDoc lo crea, si sí, updateDoc
    // Para simplificar, usamos setDoc con merge
    await setDoc(chatDocRef, { clientTyping: true }, { merge: true });

    // Limpiar timeout anterior
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Después de 2 segundos de no escribir, poner en false
    typingTimeoutRef.current = setTimeout(async () => {
      await setDoc(chatDocRef, { clientTyping: false }, { merge: true });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Resetear typing inmediatamente al enviar
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    const chatDocRef = doc(db, 'chats', currentUser.uid);
    await setDoc(chatDocRef, { clientTyping: false }, { merge: true });

    await addDoc(collection(db, 'chats', currentUser.uid, 'messages'), {
      text: newMessage,
      sender: 'client',
      createdAt: serverTimestamp(),
    });
    setNewMessage('');
  };

  const createTestOrder = async () => {
    try {
      await addDoc(collection(db, 'orders'), {
        clientId: currentUser.uid,
        title: t('client_dashboard.project_default_title'),
        status: "in_progress",
        progress: 15,
        startDate: new Date().toISOString().split('T')[0],
        deadline: "TBD",
        createdAt: serverTimestamp()
      });
    } catch (error) { console.error(error); }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      review: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    const statusLabel = t(`client_dashboard.status.${status}`) || status;
    return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending} uppercase tracking-wider`}>{statusLabel}</span>;
  };

  return (
    <div className="min-h-screen bg-nova-bg text-white pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold">{t('client_dashboard.hello')}, {currentUser?.email?.split('@')[0]}</h1>
            <p className="text-gray-400">{t('client_dashboard.welcome_msg')}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-white/10">
            <LogOut size={18} />
            <span className="hidden sm:inline">{t('client_dashboard.logout')}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PEDIDOS */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-nova-cyan"><Package size={20} /> {t('client_dashboard.my_projects')}</h2>
            {orders.length === 0 ? (
              <div className="p-10 rounded-3xl bg-nova-card border border-white/5 text-center flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-6">{t('client_dashboard.no_projects')}</p>
                <button onClick={createTestOrder} className="flex items-center gap-2 px-6 py-3 bg-nova-primary/20 text-nova-primary border border-nova-primary/50 rounded-xl hover:bg-nova-primary hover:text-white transition-all">
                  <PlusCircle size={20} /> {t('client_dashboard.generate_test')}
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-nova-card border border-white/5 hover:border-nova-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div><h3 className="text-lg font-bold text-white">{order.title}</h3><p className="text-sm text-gray-400">ID: {order.id}</p></div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-nova-cyan to-nova-primary" style={{ width: order.progress ? `${order.progress}%` : '5%' }} /></div>
                  <div className="flex justify-between text-xs text-gray-500 font-mono"><span>{t('client_dashboard.start_date')}: {order.startDate}</span><span>{t('client_dashboard.deadline')}: {order.deadline}</span></div>
                </motion.div>
              ))
            )}
          </div>

          {/* CHAT */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 h-[600px] flex flex-col bg-nova-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
                <MessageSquare size={18} className="text-nova-primary" />
                <span className="font-bold text-sm">{t('client_dashboard.support_title')}</span>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-md ${msg.sender === 'client' ? 'bg-nova-primary text-white rounded-br-none' : 'bg-white/10 text-gray-300 rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {/* Indicador de "Escribiendo..." animado */}
                <AnimatePresence>
                  {adminTyping && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                        <span className="text-xs text-gray-400 mr-2">Admin escribiendo</span>
                        <motion.span className="w-1.5 h-1.5 bg-nova-cyan rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                        <motion.span className="w-1.5 h-1.5 bg-nova-cyan rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                        <motion.span className="w-1.5 h-1.5 bg-nova-cyan rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
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
                    onChange={handleInputChange} // Usamos el nuevo handler
                    placeholder={t('client_dashboard.type_message')}
                    className="w-full bg-nova-bg border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-nova-cyan transition-all"
                  />
                  <button type="submit" className="absolute right-2 top-2 p-1.5 bg-nova-cyan rounded-lg text-nova-bg hover:bg-white transition-colors">
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;