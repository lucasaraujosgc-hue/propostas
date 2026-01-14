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
            { category: 'FISCAIS / TRIBUTÁRIOS', items: ['Apuração mensal DAS', 'PGDAS-D', 'DEFIS anual', 'Monitoramento faturamento', 'Orientação NF-e', 'Conciliação de Impostos'] },
            { category: 'DEPARTAMENTO PESSOAL', items: ['Encargos pró-labore', 'Orientação trabalhista', 'eSocial básico', 'Folha de pagamento mensal', 'Gestão de férias/13º'] },
            { category: 'CONTÁBEIS', items: ['Escrituração mensal', 'Balanço Patrimonial', 'DRE anual', 'Balancetes', 'Notas explicativas'] }
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

  // Sincronização com SQLite /backup/database.db
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(savedData => {
        if (savedData) setData(savedData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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
    const intro = `Prezado(a) ${clientName || 'Cliente'},\n\nApresentamos nossa proposta técnica para o plano **${plan.name}**. Na **${data.officeName}**, garantimos conformidade legal absoluta e agilidade estratégica para impulsionar seu negócio.`;
    
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
      <div className="min-h-screen p-1 md:p-4 bg-gray-200 flex flex-col items-center font-sans">
        <div className="max-w-4xl w-full bg-white text-gray-900 shadow-2xl p-6 border border-gray-300 proposal-container rounded-sm page-break-avoid">
          
          {/* Header Compacto */}
          <div className="flex justify-between items-center mb-4 border-b pb-1">
            <div>
              <h1 className="text-lg font-black text-virgula-green uppercase leading-none">{data.officeName}</h1>
              <p className="text-[6px] text-gray-400 font-bold uppercase tracking-tighter">Soluções Contábeis & Planejamento Estratégico</p>
            </div>
            <div className="text-right">
              <p className="text-[6px] font-bold text-gray-400 uppercase">Proposta de Serviços para</p>
              <h2 className="text-xs font-bold leading-none">{clientName || 'Cliente Particular'}</h2>
            </div>
          </div>

          {/* Intro Pequena */}
          <div className="mb-3 bg-gray-50 p-1.5 rounded-sm border-l-2 border-virgula-green">
            <p className="text-[8px] text-gray-600 leading-tight italic whitespace-pre-wrap">
              {personalizedIntro.replace(/\*\*(.*?)\*\*/g, '$1')}
            </p>
          </div>

          {/* Seção Principal: Preço e Resumo */}
          <div className="flex flex-col mb-3">
            <div className="flex justify-between items-center bg-virgula-green text-white px-3 py-1.5 rounded-t-sm shadow-sm">
              <div className="flex flex-col">
                <p className="text-[6px] font-black uppercase tracking-widest opacity-80 leading-none mb-0.5">Plano Contratado</p>
                <h3 className="text-[11px] font-black uppercase leading-none">{selectedPlan.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-[6px] font-bold opacity-80 uppercase leading-none">Honorários Mensais</p>
                <p className="text-lg font-black leading-none">R$ {selectedPlan.price.toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {/* Escopo em 3 Colunas Ultra Compacto - PERSISTE NA IMPRESSÃO */}
            <div className="grid grid-cols-3 gap-3 border-x border-b border-gray-100 p-3 bg-white print-grid-3">
              {[
                { label: '1. FISCAIS / TRIBUTÁRIOS', key: 'FISCAIS' },
                { label: '2. DEPARTAMENTO PESSOAL', key: 'DEPARTAMENTO' },
                { label: '3. CONTÁBEIS', key: 'CONTÁBEIS' }
              ].map((column) => {
                // Tenta encontrar a categoria correspondente nos dados do plano
                const catData = selectedPlan.detailedServices?.find(s => 
                  s.category.toUpperCase().includes(column.key)
                );
                const items = catData ? catData.items : [];
                
                return (
                  <div key={column.key} className="page-break-avoid">
                    <h4 className="text-[7px] font-black text-gray-900 border-b border-virgula-green/30 mb-1 pb-0.5 uppercase tracking-tighter">
                      {column.label}
                    </h4>
                    <ul className="space-y-0.5">
                      {items.length > 0 ? items.map((item, i) => (
                        <li key={i} className="text-[6.5px] text-gray-500 leading-none flex items-start gap-1">
                          <span className="text-virgula-green font-bold leading-none">•</span> 
                          <span className="flex-1">{item}</span>
                        </li>
                      )) : (
                        <li className="text-[6.5px] text-gray-300 italic">Itens padrão incluídos</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cláusulas Adicionais Rápidas */}
          <div className="grid grid-cols-2 gap-4 mb-4">
             <div className="text-[6px] text-gray-400 uppercase italic">
                * Os valores acima não incluem taxas governamentais ou impostos diretos da empresa.<br/>
                * Reajuste anual pelo IGPM/FGV ou IPCA.
             </div>
             <div className="text-right text-[7px] text-gray-500 font-bold uppercase tracking-widest">
                Validade da Proposta: 10 dias corridos
             </div>
          </div>

          {/* Assinaturas / Rodapé */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-end">
            <div className="flex flex-col">
              <p className="text-[5px] text-gray-400 uppercase font-black tracking-widest mb-1">Responsável Técnico</p>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-virgula-green"></div>
                 <div>
                    <p className="font-black text-[9px] text-gray-900 leading-none uppercase">{data.accountant}</p>
                    <p className="text-[7px] text-virgula-green font-bold tracking-tight">{data.crc}</p>
                 </div>
              </div>
            </div>
            <div className="no-print flex gap-2">
              <button onClick={() => setShowProposal(false)} className="px-3 py-1 bg-gray-100 text-[8px] font-black rounded uppercase hover:bg-gray-200 transition-colors">Voltar</button>
              <button onClick={() => window.print()} className="px-4 py-1.5 bg-virgula-green text-white text-[9px] font-black rounded shadow-lg hover:bg-virgula-greenHover transition-all transform hover:scale-105 active:scale-95">Imprimir / Salvar PDF</button>
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
          <div className="w-10 h-10 bg-virgula-green rounded-lg flex items-center justify-center font-black text-virgula-dark text-xl shadow-lg shadow-virgula-green/20">V</div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">{data.officeName}</h1>
            <p className="text-[9px] text-virgula-muted font-bold tracking-widest uppercase">Sistema de Orçamentos SQLite</p>
          </div>
        </div>
        <button onClick={() => setEditing(!editing)} className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition-all flex items-center gap-2 ${editing ? 'bg-virgula-green text-virgula-dark' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
          {editing ? '💾 FINALIZAR EDIÇÃO' : '⚙️ CONFIGURAR PLANOS'}
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-virgula-card border border-virgula-border rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-[9px] uppercase font-black text-virgula-muted mb-1 block">Prospecto (Cliente)</label>
            <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nome da Empresa ou Pessoa..." className="w-full bg-virgula-dark border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-virgula-green outline-none transition-all" />
          </div>
          <div className="flex gap-2">
            {data.categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === cat.id ? 'bg-virgula-green text-virgula-dark shadow-lg shadow-virgula-green/20' : 'bg-white/5 text-virgula-muted hover:bg-white/10'}`}>{cat.label}</button>
            ))}
            <button onClick={() => setActiveTab('Backup')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'Backup' ? 'bg-amber-500 text-virgula-dark shadow-lg shadow-amber-500/20' : 'bg-white/5 text-virgula-muted hover:bg-white/10'}`}>Histórico</button>
          </div>
        </div>

        {activeTab === 'Backup' ? (
          <div className="max-w-4xl mx-auto space-y-3">
            {data.history.length > 0 ? data.history.map(record => (
              <div key={record.id} className="bg-virgula-card border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-virgula-green/30 transition-all group">
                <div>
                  <p className="font-black text-white group-hover:text-virgula-green transition-colors">{record.clientName}</p>
                  <p className="text-[9px] text-virgula-muted uppercase">{record.date} • {record.planName} • R$ {record.price.toLocaleString('pt-BR')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedPlan(record.planData); setClientName(record.clientName); setShowProposal(true); }} className="px-3 py-1.5 bg-virgula-green text-virgula-dark rounded text-[9px] font-black uppercase hover:scale-105 active:scale-95 transition-all">Reabrir</button>
                  <button onClick={() => updateData(p => ({...p, history: p.history.filter(h => h.id !== record.id)}))} className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Excluir</button>
                </div>
              </div>
            )) : <div className="text-center p-10 text-virgula-muted text-xs uppercase font-bold border border-dashed border-white/5 rounded-2xl">Nenhum orçamento salvo no histórico</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentCategory?.plans.map((plan, pIdx) => (
              <div key={plan.id} className="bg-virgula-card border border-virgula-border rounded-2xl p-6 flex flex-col h-full hover:border-virgula-green/30 transition-all shadow-xl">
                <div className="mb-4">
                  <h3 className="text-lg font-black uppercase leading-tight">{plan.name}</h3>
                  <div className="text-2xl font-black text-virgula-green">R$ {plan.price.toLocaleString('pt-BR')}</div>
                  <p className="text-[8px] text-virgula-muted uppercase font-bold tracking-widest">Valor Mensal</p>
                </div>
                
                <div className="flex-1 mb-6">
                   <ul className="space-y-1.5">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="text-[9px] flex items-center gap-2 text-virgula-muted">
                           <span className="text-virgula-green font-bold">✓</span> {f.text}
                        </li>
                      ))}
                   </ul>
                </div>

                <button 
                  onClick={() => handleContract(plan)} 
                  disabled={editing} 
                  className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${editing ? 'opacity-20 cursor-not-allowed' : 'bg-virgula-green text-virgula-dark shadow-xl shadow-virgula-green/20 hover:scale-105 active:scale-95'}`}
                >
                  Gerar Proposta
                </button>
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