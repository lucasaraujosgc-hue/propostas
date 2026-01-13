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
        detailedServices: []
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
          { category: '1. Fiscais / Tributários', items: ['Apuração mensal Simples (DAS)', 'Envio do PGDAS-D', 'Entrega da DEFIS anual', 'Classificação fiscal de receitas', 'Orientação anexos Simples', 'Monitoramento faturamento', 'Orientação Notas Fiscais', 'Retenções na fonte', 'Regularização pendências', 'Parcelamentos'] },
          { category: '2. Departamento Pessoal', items: ['Encargos do pró-labore', 'Orientação trabalhista'] },
          { category: '3. Contábeis', items: ['Escrituração contábil mensal', 'Elaboração Balanço Patrimonial', 'DRE', 'Balancetes mensais', 'Livro Diário e Razão', 'Encerramento anual', 'Atendimento fiscalizações'] }
        ]
      },
      {
        id: 's3',
        name: 'Intermediário 2',
        subtitle: 'Simples + 5 Func.',
        price: 519,
        isPopular: true,
        features: [
          { text: 'Tudo do Intermediário', included: true },
          { text: 'DP p/ até 5 Funcionários', included: true },
          { text: 'Folha, Férias e 13º', included: true },
          { text: 'Lucro Presumido', included: false }
        ],
        detailedServices: [
          { category: '1. Fiscais / Tributários', items: ['Todos itens do Intermediário'] },
          { category: '2. Departamento Pessoal', items: ['Registro/admissão empregados', 'Elaboração folha pagamento', 'Cálculo pró-labore', 'Encargos Trabalhistas', 'Rescisões contratuais', 'Férias e 13º salário', 'Entrega eSocial, Reinf, DCTFWeb', 'Orientação trabalhista'] },
          { category: '3. Contábeis', items: ['Todos itens do Intermediário'] }
        ]
      },
      {
        id: 's4',
        name: 'Profissional',
        subtitle: 'Lucro Presumido',
        price: 649,
        features: [
          { text: 'Lucro Presumido', included: true },
          { text: 'DP p/ até 5 Funcionários', included: true },
          { text: 'Apuração ICMS e ISS', included: true },
          { text: 'Contabilidade Completa', included: true }
        ],
        detailedServices: [
          { category: '1. Fiscais / Tributários', items: ['IRPJ (trimestral)', 'CSLL (trimestral)', 'PIS/COFINS (mensal)', 'Emissão DARF', 'Controle prazos', 'Apuração ICMS/DIFAL', 'Apuração ISS', 'Retenções na fonte'] },
          { category: '2. Departamento Pessoal', items: ['Mesmos itens Intermediário 2'] },
          { category: '3. Contábeis', items: ['Mesmos itens Intermediário 2'] }
        ]
      }
    ]
  },
  {
    id: 'Comércio',
    label: 'Comércio',
    plans: [
      {
        id: 'c1',
        name: 'Básico',
        subtitle: 'MEI Comércio',
        price: 100,
        features: [
          { text: 'Declarações MEI', included: true },
          { text: 'Guia DAS automática', included: true },
          { text: 'Notas ilimitadas', included: true },
          { text: 'Suporte fiscal', included: true }
        ],
        detailedServices: []
      },
      {
        id: 'c2',
        name: 'Intermediário',
        subtitle: 'Simples Nacional (Sem Func.)',
        price: 289,
        features: [
          { text: 'Apuração Simples Nacional', included: true },
          { text: 'Pró-labore Sócios', included: true },
          { text: 'Folha Funcionários', included: false },
          { text: 'Lucro Presumido', included: false }
        ],
        detailedServices: [
          { category: '1. Fiscais / Tributários', items: ['Apuração mensal Simples (DAS)', 'Envio do PGDAS-D', 'Entrega da DEFIS anual', 'Classificação fiscal de receitas', 'Orientação anexos Simples', 'Monitoramento faturamento', 'Orientação Notas Fiscais', 'Retenções na fonte', 'Regularização pendências', 'Parcelamentos'] },
          { category: '2. Departamento Pessoal', items: ['Encargos do pró-labore', 'Orientação trabalhista'] },
          { category: '3. Contábeis', items: ['Escrituração contábil mensal', 'Elaboração Balanço Patrimonial', 'DRE', 'Balancetes mensais', 'Livro Diário e Razão', 'Encerramento anual', 'Atendimento fiscalizações'] }
        ]
      },
      {
        id: 'c3',
        name: 'Intermediário 2',
        subtitle: 'Simples + 5 Func.',
        price: 630,
        isPopular: true,
        features: [
          { text: 'Tudo do Intermediário', included: true },
          { text: 'DP p/ até 5 Funcionários', included: true },
          { text: 'Folha, Férias e 13º', included: true },
          { text: 'Lucro Presumido', included: false }
        ],
        detailedServices: [
          { category: '1. Fiscais / Tributários', items: ['Todos itens do Intermediário'] },
          { category: '2. Departamento Pessoal', items: ['Registro/admissão empregados', 'Elaboração folha pagamento', 'Cálculo pró-labore', 'Encargos Trabalhistas', 'Rescisões contratuais', 'Férias e 13º salário', 'Entrega eSocial, Reinf, DCTFWeb', 'Orientação trabalhista'] },
          { category: '3. Contábeis', items: ['Todos itens do Intermediário'] }
        ]
      },
      {
        id: 'c4',
        name: 'Profissional',
        subtitle: 'Lucro Presumido',
        price: 750,
        features: [
          { text: 'Lucro Presumido', included: true },
          { text: 'DP p/ até 5 Funcionários', included: true },
          { text: 'Apuração ICMS e ISS', included: true },
          { text: 'Contabilidade Completa', included: true }
        ],
        detailedServices: [
          { category: '1. Fiscais / Tributários', items: ['IRPJ (trimestral)', 'CSLL (trimestral)', 'PIS/COFINS (mensal)', 'Emissão DARF', 'Controle prazos', 'Apuração ICMS/DIFAL', 'Apuração ISS', 'Retenções na fonte'] },
          { category: '2. Departamento Pessoal', items: ['Mesmos itens Intermediário 2'] },
          { category: '3. Contábeis', items: ['Mesmos itens Intermediário 2'] }
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

  useEffect(() => {
    localStorage.setItem('virgula_categories', JSON.stringify(categories));
    localStorage.setItem('virgula_history', JSON.stringify(history));
    localStorage.setItem('virgula_accountant', accountant);
    localStorage.setItem('virgula_crc', crc);
    localStorage.setItem('virgula_office', officeName);
  }, [categories, history, accountant, crc, officeName]);

  const handleContract = (plan) => {
    const defaultText = `Prezado(a) ${clientName || 'Cliente'},\n\nApresentamos nossa proposta técnica para o plano **${plan.name}**. Na **${officeName}**, focamos em **agilidade** e **segurança jurídica** para sua empresa. Estamos prontos para assumir sua gestão contábil com máxima eficiência.`;
    
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString('pt-BR'),
      clientName: clientName || 'Cliente Particular',
      planName: plan.name,
      categoryLabel: activeTab,
      price: plan.price,
      planData: { ...plan }
    };
    
    setHistory([newRecord, ...history]);
    setSelectedPlan(plan);
    setPersonalizedIntro(defaultText);
    setShowProposal(true);
  };

  const deleteHistoryRecord = (id) => {
    if(confirm("Deseja excluir este registro de backup?")) {
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

  const updateFeatureText = (planIdx, featureIdx, text) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx].features[featureIdx].text = text;
      setCategories(newCats);
    }
  };

  const toggleFeatureInclusion = (planIdx, featureIdx) => {
    const newCats = [...categories];
    const cat = newCats.find(c => c.id === activeTab);
    if (cat) {
      cat.plans[planIdx].features[featureIdx].included = !cat.plans[planIdx].features[featureIdx].included;
      setCategories(newCats);
    }
  };

  const renderRichText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const currentCategory = categories.find(c => c.id === activeTab);

  if (showProposal && selectedPlan) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-gray-50">
        <div className="max-w-4xl w-full bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl p-8 md:p-12 border border-gray-100 proposal-container">
          <div className="flex justify-between items-start mb-12 border-b pb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-virgula-green uppercase tracking-tighter">{officeName}</h1>
              <p className="text-sm text-gray-500 font-medium">Contabilidade Inteligente & Consultiva</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-gray-400">Proposta Preparada Para</p>
              <h2 className="text-xl font-bold">{clientName || 'Cliente Especial'}</h2>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-virgula-green/10 flex items-center justify-center text-virgula-green">✦</span>
              Apresentação
            </h3>
            <div className="group relative">
              <div className="hidden print:block text-gray-600 leading-relaxed whitespace-pre-wrap italic">
                {renderRichText(personalizedIntro)}
              </div>
              <div className="print:hidden">
                 <p className="text-[10px] text-virgula-green font-bold uppercase mb-2 opacity-60">✎ Você pode editar o texto abaixo</p>
                 <textarea 
                  value={personalizedIntro}
                  onChange={(e) => setPersonalizedIntro(e.target.value)}
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-600 leading-relaxed italic focus:outline-none focus:ring-2 focus:ring-virgula-green/20 focus:bg-white transition-all resize-none"
                 />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-6 border-b pb-2">Plano Escolhido: {selectedPlan.name}</h3>
              <ul className="space-y-3">
                {selectedPlan.features.filter(f => f.included).map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-virgula-green font-bold">✓</span> {f.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl flex flex-col justify-center items-center text-center">
              <p className="text-sm text-gray-500 mb-2 font-medium">Investimento Mensal</p>
              <h4 className="text-5xl font-black text-gray-900">
                R$ {selectedPlan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h4>
              <p className="text-xs text-gray-400 mt-2">Pagamento via boleto bancário</p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-dashed grid md:grid-cols-2 gap-8 items-end">
            <div>
              <p className="text-xs text-gray-400 mb-1">Responsável Técnico</p>
              <p className="font-bold text-lg leading-tight">{accountant}</p>
              <p className="text-sm text-virgula-green font-semibold">{crc}</p>
            </div>
            <div className="text-right no-print space-x-4">
              <button onClick={() => setShowProposal(false)} className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-bold hover:bg-gray-50 transition-colors">Voltar</button>
              <button onClick={() => window.print()} className="px-6 py-2 rounded-lg bg-virgula-green text-white text-sm font-bold hover:bg-virgula-greenHover transition-colors shadow-lg shadow-virgula-green/20">Imprimir / Salvar PDF</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-virgula-dark text-white p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-virgula-green rounded-lg flex items-center justify-center font-black text-virgula-dark text-xl">V</div>
          <div>
            {editing ? (
              <input value={officeName} onChange={e => setOfficeName(e.target.value)} className="bg-virgula-card border border-white/10 rounded px-2 py-1 text-xl font-bold block outline-none" />
            ) : (
              <h1 className="text-2xl font-black tracking-tighter uppercase">{officeName}</h1>
            )}
            <p className="text-xs text-virgula-muted font-bold tracking-widest uppercase">Assessoria Contábil</p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end">
          {editing ? (
            <>
              <input value={accountant} onChange={e => setAccountant(e.target.value)} className="bg-virgula-card border border-white/10 rounded px-2 py-1 text-sm mb-1 outline-none" />
              <input value={crc} onChange={e => setCrc(e.target.value)} className="bg-virgula-card border border-white/10 rounded px-2 py-1 text-xs text-virgula-green outline-none" />
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">{accountant}</p>
              <p className="text-xs text-virgula-green font-bold">{crc}</p>
            </>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-virgula-card border border-virgula-border rounded-2xl p-6 mb-12 flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-2">Simulador de Orçamentos</h2>
            <p className="text-virgula-muted text-sm">Selecione o segmento e o plano para gerar a proposta.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
             <div className="flex-1">
               <label className="text-[10px] uppercase font-bold text-virgula-muted mb-1 block tracking-widest opacity-50">Nome do Prospecto</label>
               <input type="text" placeholder="Ex: Café Bela Vista LTDA" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-virgula-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-virgula-green outline-none" />
             </div>
             <div className="flex items-end">
               <button onClick={() => setEditing(!editing)} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${editing ? 'bg-virgula-green text-virgula-dark shadow-lg' : 'bg-white/5 border border-white/10 text-white'}`}>
                 {editing ? '💾 Salvar' : '🛠️ Editar Planos'}
               </button>
             </div>
          </div>
        </div>

        <div className="flex justify-center mb-8 gap-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === cat.id ? 'bg-virgula-green text-virgula-dark' : 'bg-virgula-card border border-white/5 text-virgula-muted'}`}>
              {cat.label}
            </button>
          ))}
          <button onClick={() => setActiveTab('Backup')} className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'Backup' ? 'bg-amber-500 text-virgula-dark' : 'bg-virgula-card border border-white/5 text-virgula-muted'}`}>
            📂 Backup
          </button>
        </div>

        {activeTab === 'Backup' ? (
          <div className="space-y-4 max-w-5xl mx-auto">
             {history.length === 0 ? (
               <div className="text-center py-20 bg-virgula-card border rounded-2xl">Nenhum registro encontrado.</div>
             ) : (
               history.map(record => (
                 <div key={record.id} className="bg-virgula-card border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-virgula-dark p-3 rounded-xl border border-white/5">
                         <span className="text-xs font-bold text-virgula-green block leading-tight">{record.date.split(',')[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{record.clientName}</p>
                        <p className="text-xs text-virgula-muted uppercase font-bold">{record.categoryLabel} • {record.planName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => deleteHistoryRecord(record.id)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs hover:text-red-500">🗑️ Excluir</button>
                    </div>
                 </div>
               ))
             )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {currentCategory?.plans.map((plan, planIdx) => (
              <div key={plan.id} className={`bg-virgula-card border rounded-2xl p-6 flex flex-col h-full relative ${plan.isPopular ? 'border-virgula-green' : 'border-virgula-border'}`}>
                {plan.isPopular && <div className="absolute top-0 right-0 bg-virgula-green text-virgula-dark text-[10px] font-black px-4 py-1.5 rounded-bl-xl">POPULAR</div>}
                <div className="mb-6">
                  {editing ? (
                    <input value={plan.name} onChange={e => updatePlanField(planIdx, 'name', e.target.value)} className="bg-virgula-dark border border-white/10 rounded px-2 py-1 text-lg font-bold text-white mb-1 w-full outline-none" />
                  ) : (
                    <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                  )}
                  <p className="text-virgula-muted text-xs font-semibold uppercase mt-1">{plan.subtitle}</p>
                </div>
                <div className="mb-8 min-h-[60px] flex flex-col justify-center">
                  {editing ? (
                    <input type="number" value={plan.price} onChange={e => updatePlanField(planIdx, 'price', Number(e.target.value))} className="w-full bg-virgula-dark border border-virgula-green/30 rounded px-2 py-1 text-2xl font-black text-white outline-none" />
                  ) : (
                    <div className="text-3xl font-black text-white flex items-end gap-1">R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-virgula-muted mb-1.5">/mês</span></div>
                  )}
                </div>
                <ul className="space-y-2 mb-6 flex-grow">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`text-sm ${f.included ? 'text-white' : 'text-virgula-muted line-through opacity-40'}`}>
                      {editing ? (
                        <div className="flex gap-2">
                          <button onClick={() => toggleFeatureInclusion(planIdx, i)} className={`w-4 h-4 rounded text-[8px] flex items-center justify-center ${f.included ? 'bg-virgula-green text-virgula-dark' : 'bg-red-500 text-white'}`}>{f.included ? '✔' : '✖'}</button>
                          <input value={f.text} onChange={e => updateFeatureText(planIdx, i, e.target.value)} className="bg-transparent border-b border-white/5 text-xs w-full outline-none" />
                        </div>
                      ) : (
                        <><span className={f.included ? 'text-virgula-green' : 'text-red-500'}>{f.included ? '✔' : '✖'}</span> {f.text}</>
                      )}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleContract(plan)} disabled={editing} className={`w-full py-3.5 rounded-xl font-black text-sm transition-all ${editing ? 'opacity-20 cursor-not-allowed' : plan.isPopular ? 'bg-virgula-green text-virgula-dark' : 'border border-virgula-green text-virgula-green hover:bg-virgula-green hover:text-virgula-dark'}`}>GERAR PROPOSTA</button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto mt-24 pt-12 border-t border-virgula-border flex justify-between items-center opacity-60">
        <p className="text-sm">© {new Date().getFullYear()} {officeName}</p>
        <p className="text-xs font-bold text-virgula-green uppercase">Lucas Araújo - CRC/BA 046968-O</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);