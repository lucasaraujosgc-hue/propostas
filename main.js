import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const DEFAULT_DATA = [
  {
    id: 'Serviços',
    label: 'Serviços',
    plans: [
      {
        id: 's1',
        name: 'Básico',
        subtitle: 'Ideal para MEI',
        price: 50,
        features: [
          { text: 'Declarações MEI', included: true },
          { text: 'Guia DAS automática', included: true },
          { text: 'Notas ilimitadas', included: true },
          { text: 'Suporte fiscal', included: true }
        ],
        detailedServices: [
          { category: 'Serviços MEI', items: ['DAS Mensal', 'DAS-SIMEI Anual', 'Emissão de Notas'] }
        ]
      },
      {
        id: 's2',
        name: 'Intermediário',
        subtitle: 'Simples Nacional (Sem Func.)',
        price: 250,
        features: [
          { text: 'Apuração Simples Nacional', included: true },
          { text: 'Pró-labore Sócios', included: true },
          { text: 'Folha Funcionários', included: false },
          { text: 'Lucro Presumido', included: false }
        ],
        detailedServices: [
          { category: '1. Fiscais / Tributários', items: ['Apuração mensal Simples (DAS)', 'PGDAS-D', 'DEFIS anual', 'Monitoramento faturamento'] },
          { category: '2. Departamento Pessoal', items: ['Encargos do pró-labore', 'Orientação trabalhista'] },
          { category: '3. Contábeis', items: ['Escrituração mensal', 'Balanço Patrimonial', 'DRE'] }
        ]
      }
    ]
  }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('Serviços');
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('virgula_categories');
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('virgula_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [accountant, setAccountant] = useState(() => localStorage.getItem('virgula_accountant') || 'Lucas Araujo dos Santos');
  const [crc, setCrc] = useState(() => localStorage.getItem('virgula_crc') || 'CRC/BA - 046968-O');
  const [officeName, setOfficeName] = useState(() => localStorage.getItem('virgula_office') || 'Virgula Contabilidade');
  
  const [editing, setEditing] = useState(false);
  const [clientName, setClientName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showProposal, setShowProposal] = useState(false);
  const [personalizedIntro, setPersonalizedIntro] = useState('');

  // Salvar sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('virgula_categories', JSON.stringify(categories));
    localStorage.setItem('virgula_history', JSON.stringify(history));
    localStorage.setItem('virgula_accountant', accountant);
    localStorage.setItem('virgula_crc', crc);
    localStorage.setItem('virgula_office', officeName);
  }, [categories, history, accountant, crc, officeName]);

  const handleContract = (plan) => {
    const defaultText = `Prezado(a) ${clientName || 'Cliente'},\n\nApresentamos nossa proposta técnica para o plano **${plan.name}**. Na **${officeName}**, focamos em **agilidade** e **segurança jurídica**. Estamos prontos para assumir sua gestão contábil.`;
    
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString('pt-BR'),
      clientName: clientName || 'Cliente Particular',
      planName: plan.name,
      categoryLabel: activeTab,
      price: plan.price,
      planData: JSON.parse(JSON.stringify(plan)) // Deep copy
    };
    
    const newHistory = [newRecord, ...history].slice(0, 50); // Limitar a 50 registros
    setHistory(newHistory);
    setSelectedPlan(plan);
    setPersonalizedIntro(defaultText);
    setShowProposal(true);
  };

  const deleteHistoryRecord = (id) => {
    if(confirm("Excluir este backup permanentemente?")) {
      setHistory(history.filter(r => r.id !== id));
    }
  };

  const updatePlanField = (planIdx, field, value) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx][field] = value;
      setCategories(newCats);
    }
  };

  // Funções para gerenciar FEATURES (Resumo)
  const updateFeature = (planIdx, featureIdx, text) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx].features[featureIdx].text = text;
      setCategories(newCats);
    }
  };

  const toggleFeature = (planIdx, featureIdx) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx].features[featureIdx].included = !cat.plans[planIdx].features[featureIdx].included;
      setCategories(newCats);
    }
  };

  const addFeature = (planIdx) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx].features.push({ text: 'Novo Item', included: true });
      setCategories(newCats);
    }
  };

  const removeFeature = (planIdx, fIdx) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx].features.splice(fIdx, 1);
      setCategories(newCats);
    }
  };

  // Funções para gerenciar ESCOPO DETALHADO
  const addDetailedCategory = (planIdx) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      if (!cat.plans[planIdx].detailedServices) cat.plans[planIdx].detailedServices = [];
      cat.plans[planIdx].detailedServices.push({ category: 'Nova Categoria', items: ['Novo Serviço'] });
      setCategories(newCats);
    }
  };

  const updateDetailedCategoryName = (planIdx, catIdx, name) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx].detailedServices[catIdx].category = name;
      setCategories(newCats);
    }
  };

  const addDetailedItem = (planIdx, catIdx) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx].detailedServices[catIdx].items.push('Novo Serviço');
      setCategories(newCats);
    }
  };

  const updateDetailedItemValue = (planIdx, catIdx, itemIdx, val) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx].detailedServices[catIdx].items[itemIdx] = val;
      setCategories(newCats);
    }
  };

  const removeDetailedCategory = (pIdx, cIdx) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[pIdx].detailedServices.splice(cIdx, 1);
      setCategories(newCats);
    }
  };

  const removeDetailedItem = (pIdx, cIdx, iIdx) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[pIdx].detailedServices[cIdx].items.splice(iIdx, 1);
      setCategories(newCats);
    }
  };

  const addPlan = () => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans.push({
        id: Math.random().toString(36),
        name: 'Novo Plano',
        subtitle: 'Subtítulo',
        price: 0,
        features: [],
        detailedServices: []
      });
      setCategories(newCats);
    }
  };

  const removePlan = (idx) => {
    if (confirm("Excluir este plano permanentemente?")) {
      const newCats = [...categories];
      const cat = newCats.find(c => c.id === activeTab);
      cat.plans.splice(idx, 1);
      setCategories(newCats);
    }
  };

  const renderRichText = (text) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) => 
      part.startsWith('**') && part.endsWith('**') ? 
      <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong> : part
    );
  };

  const currentCategory = categories.find(c => c.id === activeTab);

  if (showProposal && selectedPlan) {
    return (
      <div className="min-h-screen p-2 md:p-6 bg-gray-100 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white text-gray-900 shadow-xl p-6 md:p-10 border border-gray-200 proposal-container rounded-sm">
          {/* Cabeçalho Compacto */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h1 className="text-2xl font-black text-virgula-green uppercase leading-none">{officeName}</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Assessoria Contábil Inteligente</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase font-bold text-gray-400">Proposta para</p>
              <h2 className="text-lg font-bold leading-none">{clientName || 'Cliente Particular'}</h2>
            </div>
          </div>

          {/* Intro Compacta */}
          <div className="mb-6">
            <div className="print:hidden mb-2">
                 <p className="text-[9px] text-virgula-green font-bold uppercase opacity-60">✎ Texto da Apresentação</p>
                 <textarea value={personalizedIntro} onChange={e => setPersonalizedIntro(e.target.value)} rows={3} className="w-full bg-gray-50 border border-gray-100 rounded p-2 text-xs italic resize-none outline-none focus:ring-1 focus:ring-virgula-green/30" />
            </div>
            <div className="hidden print:block text-[11px] text-gray-600 leading-snug whitespace-pre-wrap italic bg-gray-50 p-3 rounded-sm border-l-2 border-virgula-green">
              {renderRichText(personalizedIntro)}
            </div>
          </div>

          {/* Resumo do Plano Amontoado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-y py-4 border-gray-100">
            <div className="md:col-span-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Itens Inclusos no Plano: <span className="text-gray-900">{selectedPlan.name}</span></h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {selectedPlan.features.filter(f => f.included).map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-700">
                    <span className="text-virgula-green text-xs">✓</span> {f.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-sm flex flex-col justify-center items-center border border-gray-100">
              <p className="text-[9px] text-gray-400 uppercase font-black mb-1">Honorários Mensais</p>
              <h4 className="text-2xl font-black text-gray-900 leading-none">R$ {selectedPlan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
              <p className="text-[8px] text-gray-400 mt-1">Valores fixos mensais</p>
            </div>
          </div>

          {/* Escopo Técnico Compacto */}
          {selectedPlan.detailedServices?.length > 0 && (
            <div className="mb-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Escopo Técnico Detalhado</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {selectedPlan.detailedServices.map((ds, idx) => (
                   <div key={idx} className="page-break-inside-avoid">
                     <h4 className="text-[10px] font-bold text-gray-900 uppercase border-b border-virgula-green/30 pb-1 mb-2">{ds.category}</h4>
                     <ul className="space-y-0.5">
                       {ds.items.map((item, i) => (
                         <li key={i} className="text-[9px] text-gray-600 flex items-start gap-1">
                           <span className="text-virgula-green mt-0.5">•</span> {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Rodapé da Proposta */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
            <div>
              <p className="text-[8px] text-gray-400 uppercase font-black mb-1 tracking-widest">Responsável</p>
              <p className="font-black text-sm text-gray-900">{accountant}</p>
              <p className="text-[10px] text-virgula-green font-bold">{crc}</p>
            </div>
            <div className="no-print flex gap-2">
              <button onClick={() => setShowProposal(false)} className="px-4 py-2 bg-gray-100 text-xs font-bold rounded hover:bg-gray-200 transition-all">Voltar</button>
              <button onClick={() => window.print()} className="px-4 py-2 bg-virgula-green text-white text-xs font-bold rounded shadow-lg shadow-virgula-green/20 hover:bg-virgula-greenHover transition-all">Exportar PDF / Imprimir</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-virgula-dark text-white p-4 md:p-8 font-inter">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-virgula-green rounded-lg flex items-center justify-center font-black text-virgula-dark text-xl">V</div>
          <div>
            {editing ? (
              <input value={officeName} onChange={e => setOfficeName(e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xl font-black block outline-none focus:border-virgula-green" />
            ) : (
              <h1 className="text-2xl font-black tracking-tighter uppercase">{officeName}</h1>
            )}
            <p className="text-[10px] text-virgula-muted font-bold tracking-[0.2em] uppercase">Gestão Contábil de Excelência</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          {editing ? (
            <div className="space-y-1">
              <input value={accountant} onChange={e => setAccountant(e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs block outline-none" placeholder="Contador" />
              <input value={crc} onChange={e => setCrc(e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] text-virgula-green block outline-none" placeholder="Registro" />
            </div>
          ) : (
            <>
              <p className="text-sm font-bold">{accountant}</p>
              <p className="text-[10px] text-virgula-green font-black uppercase tracking-widest">{crc}</p>
            </>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Painel de Controle */}
        <div className="bg-virgula-card border border-virgula-border rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="text-[10px] uppercase font-black text-virgula-muted mb-2 block tracking-widest opacity-50">Empresa / Cliente do Orçamento</label>
            <input type="text" placeholder="Ex: Panificadora Central LTDA" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-virgula-dark border border-white/10 rounded-xl px-5 py-3.5 text-sm focus:border-virgula-green transition-all outline-none" />
          </div>
          <button onClick={() => setEditing(!editing)} className={`px-8 py-3.5 rounded-xl font-black text-sm transition-all whitespace-nowrap ${editing ? 'bg-virgula-green text-virgula-dark shadow-xl shadow-virgula-green/20' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
            {editing ? '💾 SALVAR ALTERAÇÕES' : '⚙️ GERENCIAR PLANOS'}
          </button>
        </div>

        {/* Abas e Navegação */}
        <div className="flex flex-wrap justify-center mb-10 gap-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === cat.id ? 'bg-virgula-green text-virgula-dark shadow-lg shadow-virgula-green/20' : 'bg-virgula-card border border-white/5 text-virgula-muted hover:text-white'}`}>
              {cat.label}
            </button>
          ))}
          <button onClick={() => setActiveTab('Backup')} className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Backup' ? 'bg-amber-500 text-virgula-dark shadow-lg shadow-amber-500/20' : 'bg-virgula-card border border-white/5 text-virgula-muted hover:text-amber-500'}`}>
            📦 HISTÓRICO / BACKUP
          </button>
        </div>

        {activeTab === 'Backup' ? (
          <div className="max-w-4xl mx-auto space-y-4">
             {history.length === 0 ? (
               <div className="text-center py-24 bg-virgula-card border border-white/5 rounded-2xl text-virgula-muted italic">Nenhum registro no histórico.</div>
             ) : (
               history.map(record => (
                 <div key={record.id} className="bg-virgula-card border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-virgula-green/30 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="bg-virgula-dark w-12 h-12 flex flex-col items-center justify-center rounded-xl border border-white/10">
                         <span className="text-[9px] font-black text-virgula-green uppercase tracking-tighter">{record.date.split('/')[1]}</span>
                         <span className="text-lg font-black leading-none">{record.date.split('/')[0]}</span>
                      </div>
                      <div>
                        <p className="font-black text-lg text-white group-hover:text-virgula-green transition-colors">{record.clientName}</p>
                        <p className="text-[10px] text-virgula-muted uppercase font-black tracking-widest mt-1">{record.categoryLabel} • {record.planName} • R$ {record.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedPlan(record.planData); setClientName(record.clientName); setPersonalizedIntro(`Proposta recuperada do histórico.\n\nPrezado(a) ${record.clientName}...`); setShowProposal(true); }} className="px-4 py-2 bg-virgula-green/10 text-virgula-green text-[10px] font-black uppercase rounded-lg border border-virgula-green/20 hover:bg-virgula-green hover:text-virgula-dark transition-all">Visualizar</button>
                      <button onClick={() => deleteHistoryRecord(record.id)} className="p-2 bg-white/5 text-virgula-muted rounded-lg hover:text-red-500 hover:bg-red-500/10 transition-all">🗑️</button>
                    </div>
                 </div>
               ))
             )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCategory?.plans.map((plan, pIdx) => (
              <div key={plan.id} className="bg-virgula-card border border-virgula-border rounded-3xl p-6 flex flex-col h-full hover:scale-[1.02] transition-all">
                {editing && <button onClick={() => removePlan(pIdx)} className="absolute -top-2 -right-2 bg-red-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">✕</button>}
                
                <div className="mb-6">
                  {editing ? (
                    <input value={plan.name} onChange={e => updatePlanField(pIdx, 'name', e.target.value)} className="bg-virgula-dark border border-white/10 rounded w-full p-2 text-lg font-black outline-none focus:border-virgula-green" />
                  ) : (
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                  )}
                  <input value={plan.subtitle} disabled={!editing} onChange={e => updatePlanField(pIdx, 'subtitle', e.target.value)} className="bg-transparent text-[10px] text-virgula-muted font-bold uppercase tracking-widest mt-1 w-full outline-none" />
                </div>

                <div className="mb-8">
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-virgula-muted">R$</span>
                      <input type="number" value={plan.price} onChange={e => updatePlanField(pIdx, 'price', Number(e.target.value))} className="bg-virgula-dark border border-white/10 rounded w-full p-2 text-xl font-black outline-none" />
                    </div>
                  ) : (
                    <div className="text-3xl font-black text-white">R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<span className="text-xs font-normal text-virgula-muted ml-2">/mês</span></div>
                  )}
                </div>

                {/* Seção de Features (Resumo) */}
                <div className="mb-6 flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-virgula-muted">Resumo do Plano</p>
                    {editing && <button onClick={() => addFeature(pIdx)} className="text-virgula-green text-[9px] font-black uppercase">+ Adicionar</button>}
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((f, fIdx) => (
                      <li key={fIdx} className={`text-xs flex items-center gap-2 ${f.included ? 'text-white' : 'text-virgula-muted line-through opacity-30'}`}>
                        {editing ? (
                          <div className="flex-1 flex items-center gap-2">
                            <button onClick={() => toggleFeature(pIdx, fIdx)} className={`w-4 h-4 rounded text-[8px] flex items-center justify-center shrink-0 ${f.included ? 'bg-virgula-green text-virgula-dark' : 'bg-red-500'}`}>{f.included ? '✔' : '✕'}</button>
                            <input value={f.text} onChange={e => updateFeature(pIdx, fIdx, e.target.value)} className="bg-transparent border-b border-white/5 w-full outline-none text-[11px]" />
                            <button onClick={() => removeFeature(pIdx, fIdx)} className="text-red-500 text-[8px]">🗑️</button>
                          </div>
                        ) : (
                          <><span className={f.included ? 'text-virgula-green' : 'text-red-500'}>{f.included ? '✔' : '✕'}</span> {f.text}</>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Seção de Escopo Detalhado (Apenas Edição) */}
                {editing && (
                  <div className="mt-4 pt-4 border-t border-white/5 max-h-48 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-virgula-green">Escopo Técnico</p>
                      <button onClick={() => addDetailedCategory(pIdx)} className="bg-white/5 p-1 rounded text-[8px]">+</button>
                    </div>
                    {plan.detailedServices?.map((ds, dsIdx) => (
                      <div key={dsIdx} className="mb-4 bg-white/5 p-2 rounded">
                        <div className="flex gap-1 mb-1">
                          <input value={ds.category} onChange={e => updateDetailedCategoryName(pIdx, dsIdx, e.target.value)} className="bg-transparent font-bold text-[10px] w-full outline-none border-b border-white/10" />
                          <button onClick={() => removeDetailedCategory(pIdx, dsIdx)} className="text-red-500 text-[10px]">✕</button>
                        </div>
                        {ds.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex gap-1 mb-0.5">
                            <input value={item} onChange={e => updateDetailedItemValue(pIdx, dsIdx, iIdx, e.target.value)} className="bg-transparent text-[9px] w-full outline-none" />
                            <button onClick={() => removeDetailedItem(pIdx, dsIdx, iIdx)} className="text-red-400 text-[8px]">×</button>
                          </div>
                        ))}
                        <button onClick={() => addDetailedItem(pIdx, dsIdx)} className="text-[8px] text-virgula-green mt-1 opacity-50">+ Item</button>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => handleContract(plan)} disabled={editing} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all mt-6 ${editing ? 'opacity-20' : 'bg-virgula-green text-virgula-dark shadow-lg shadow-virgula-green/20 active:scale-95 hover:bg-white hover:text-virgula-dark'}`}>GERAR PROPOSTA</button>
              </div>
            ))}
            
            {editing && (
              <button onClick={addPlan} className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:bg-white/10 transition-all group">
                <div className="w-16 h-16 rounded-full bg-virgula-green/10 flex items-center justify-center text-virgula-green text-4xl mb-4 group-hover:bg-virgula-green group-hover:text-virgula-dark transition-all">+</div>
                <p className="text-sm font-black uppercase tracking-widest">Novo Plano</p>
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
        <p className="text-xs uppercase font-black tracking-widest">© {new Date().getFullYear()} {officeName}</p>
        <div className="flex gap-6">
           <span className="text-[10px] font-bold uppercase">Excelência Técnica</span>
           <span className="text-[10px] font-bold uppercase">Segurança Jurídica</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .page-break-inside-avoid { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);