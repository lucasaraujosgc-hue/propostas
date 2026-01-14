import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const DEFAULT_DATA = {
  categories: [
    {
      id: 'Serviços',
      label: 'Serviços',
      plans: [
        {
          id: 's1',
          name: 'Plano Intermediário',
          subtitle: 'Simples Nacional',
          price: 250,
          features: [
            { text: 'Apuração Simples Nacional', included: true },
            { text: 'Pró-labore Sócios', included: true },
            { text: 'Contabilidade Completa', included: true }
          ],
          detailedServices: [
            { category: '1. FISCAIS / TRIBUTÁRIOS', items: ['Apuração mensal DAS', 'PGDAS-D', 'DEFIS anual', 'Monitoramento faturamento', 'Orientação NF-e'] },
            { category: '2. DEPARTAMENTO PESSOAL', items: ['Encargos pró-labore', 'Orientação trabalhista', 'eSocial básico'] },
            { category: '3. CONTÁBEIS', items: ['Escrituração mensal', 'Balanço Patrimonial', 'DRE anual', 'Balancetes'] }
          ]
        }
      ]
    }
  ],
  history: [],
  accountant: 'Lucas Araujo dos Santos',
  crc: 'CRC/BA - 046968-O',
  officeName: 'Virgula Contabilidade'
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState('Serviços');
  const [editing, setEditing] = useState(false);
  const [clientName, setClientName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showProposal, setShowProposal] = useState(false);
  const [personalizedIntro, setPersonalizedIntro] = useState('');

  // Carregar do SQLite na montagem
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(savedData => {
        if (savedData) setData(savedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Salvar no SQLite sempre que 'data' mudar
  useEffect(() => {
    if (!loading) {
      fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  }, [data]);

  const updateData = (updater) => {
    setData(prev => {
      const newData = typeof updater === 'function' ? updater(prev) : updater;
      return { ...newData };
    });
  };

  const handleContract = (plan) => {
    const intro = `Prezado(a) ${clientName || 'Cliente'},\n\nApresentamos nossa proposta técnica para o plano **${plan.name}**. Na **${data.officeName}**, garantimos conformidade legal e agilidade estratégica para seu negócio.`;
    
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString('pt-BR'),
      clientName: clientName || 'Cliente Particular',
      planName: plan.name,
      price: plan.price,
      planData: JSON.parse(JSON.stringify(plan))
    };
    
    updateData(prev => ({ ...prev, history: [newRecord, ...prev.history] }));
    setSelectedPlan(plan);
    setPersonalizedIntro(intro);
    setShowProposal(true);
  };

  if (loading) return <div className="p-20 text-center text-virgula-green font-bold">Iniciando Banco de Dados...</div>;

  if (showProposal && selectedPlan) {
    return (
      <div className="min-h-screen p-2 bg-gray-200 flex flex-col items-center font-sans">
        <div className="max-w-4xl w-full bg-white text-gray-900 shadow-2xl p-6 border border-gray-300 proposal-container rounded-sm">
          
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <div>
              <h1 className="text-xl font-black text-virgula-green uppercase leading-none">{data.officeName}</h1>
              <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">Inteligência Contábil & Consultiva</p>
            </div>
            <div className="text-right">
              <p className="text-[7px] font-bold text-gray-400 uppercase">Proposta Preparada para</p>
              <h2 className="text-xs font-bold leading-none">{clientName || 'Cliente Particular'}</h2>
            </div>
          </div>

          <div className="mb-4 bg-gray-50 p-2 rounded-sm border-l-2 border-virgula-green">
            <p className="text-[9px] text-gray-600 leading-tight italic whitespace-pre-wrap">
              {personalizedIntro.replace(/\*\*(.*?)\*\*/g, '$1')}
            </p>
          </div>

          <div className="flex flex-col mb-4">
            <div className="flex justify-between items-center bg-virgula-green text-white px-4 py-2 rounded-t-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest">Plano: {selectedPlan.name}</h3>
              <div className="text-right">
                <p className="text-[7px] font-bold opacity-80 uppercase leading-none">Honorários Mensais</p>
                <p className="text-lg font-black leading-none">R$ {selectedPlan.price.toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {/* Escopo em 3 Colunas Ultra Compacto */}
            <div className="grid grid-cols-3 gap-2 border-x border-b border-gray-100 p-3 bg-white">
              {['1. FISCAIS / TRIBUTÁRIOS', '2. DEPARTAMENTO PESSOAL', '3. CONTÁBEIS'].map((catName) => {
                const catData = selectedPlan.detailedServices?.find(s => s.category.includes(catName.split('.')[1].trim()));
                const items = catData ? catData.items : [];
                return (
                  <div key={catName} className="page-break-inside-avoid">
                    <h4 className="text-[8px] font-black text-gray-900 border-b border-virgula-green/30 mb-1 pb-0.5 uppercase">{catName}</h4>
                    <ul className="space-y-0.5">
                      {items.length > 0 ? items.map((item, i) => (
                        <li key={i} className="text-[7px] text-gray-500 leading-none flex items-start gap-1">
                          <span className="text-virgula-green font-bold">•</span> {item}
                        </li>
                      )) : <li className="text-[7px] text-gray-300 italic">Não incluso</li>}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-end">
            <div>
              <p className="text-[6px] text-gray-400 uppercase font-black tracking-widest">Responsabilidade Técnica</p>
              <p className="font-black text-[10px] text-gray-900 leading-none">{data.accountant}</p>
              <p className="text-[8px] text-virgula-green font-bold">{data.crc}</p>
            </div>
            <div className="no-print flex gap-2">
              <button onClick={() => setShowProposal(false)} className="px-3 py-1 bg-gray-100 text-[8px] font-black rounded uppercase">Voltar</button>
              <button onClick={() => window.print()} className="px-4 py-1.5 bg-virgula-green text-white text-[9px] font-black rounded shadow-lg">Imprimir / Salvar PDF</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = data.categories.find(c => c.id === activeTab);

  return (
    <div className="min-h-screen bg-virgula-dark text-white p-4 md:p-6 font-inter">
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-virgula-green rounded-lg flex items-center justify-center font-black text-virgula-dark text-xl">V</div>
          <div>
            <h1 className="text-xl font-black uppercase">{data.officeName}</h1>
            <p className="text-[9px] text-virgula-muted font-bold tracking-widest uppercase">Gerador de Propostas SQLite</p>
          </div>
        </div>
        <button onClick={() => setEditing(!editing)} className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition-all ${editing ? 'bg-virgula-green text-virgula-dark' : 'bg-white/5 border border-white/10'}`}>
          {editing ? '💾 SALVAR TUDO' : '⚙️ EDITAR PLANOS'}
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-virgula-card border border-virgula-border rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-[9px] uppercase font-black text-virgula-muted mb-1 block">Prospecto</label>
            <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nome da Empresa..." className="w-full bg-virgula-dark border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-virgula-green outline-none" />
          </div>
          <div className="flex gap-2">
            {data.categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === cat.id ? 'bg-virgula-green text-virgula-dark' : 'bg-white/5 text-virgula-muted'}`}>{cat.label}</button>
            ))}
            <button onClick={() => setActiveTab('Backup')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'Backup' ? 'bg-amber-500 text-virgula-dark' : 'bg-white/5 text-virgula-muted'}`}>Histórico</button>
          </div>
        </div>

        {activeTab === 'Backup' ? (
          <div className="max-w-4xl mx-auto space-y-3">
            {data.history.map(record => (
              <div key={record.id} className="bg-virgula-card border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-black text-white">{record.clientName}</p>
                  <p className="text-[9px] text-virgula-muted uppercase">{record.date} • {record.planName} • R$ {record.price}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedPlan(record.planData); setClientName(record.clientName); setShowProposal(true); }} className="px-3 py-1.5 bg-virgula-green text-virgula-dark rounded text-[9px] font-black uppercase">Reabrir</button>
                  <button onClick={() => updateData(p => ({...p, history: p.history.filter(h => h.id !== record.id)}))} className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded text-[9px] font-black uppercase">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentCategory?.plans.map((plan, pIdx) => (
              <div key={plan.id} className="bg-virgula-card border border-virgula-border rounded-2xl p-5 flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-black uppercase">{plan.name}</h3>
                  <div className="text-xl font-black text-virgula-green">R$ {plan.price}</div>
                </div>
                <button onClick={() => handleContract(plan)} disabled={editing} className="w-full py-3 rounded-xl font-black text-[10px] uppercase bg-virgula-green text-virgula-dark shadow-xl shadow-virgula-green/20">Gerar Proposta</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);