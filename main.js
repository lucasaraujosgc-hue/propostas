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
        ]
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
    if(confirm("Deseja excluir este registro?")) {
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
            <textarea 
              value={personalizedIntro}
              onChange={(e) => setPersonalizedIntro(e.target.value)}
              rows={5}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-600 leading-relaxed italic focus:outline-none focus:ring-2 focus:ring-virgula-green/20 focus:bg-white transition-all resize-none no-print"
            />
            <div className="hidden print:block text-gray-600 leading-relaxed whitespace-pre-wrap italic mt-4">
              {renderRichText(personalizedIntro)}
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
              <button onClick={() => window.print()} className="px-6 py-2 rounded-lg bg-virgula-green text-white text-sm font-bold hover:bg-virgula-greenHover transition-colors shadow-lg">Imprimir / PDF</button>
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
            {editing ? <input value={officeName} onChange={e => setOfficeName(e.target.value)} className="bg-virgula-card border border-white/10 rounded px-2 w-full text-xl font-bold block" /> : <h1 className="text-2xl font-black uppercase tracking-tighter">{officeName}</h1>}
            <p className="text-xs text-virgula-muted font-bold tracking-widest uppercase">Assessoria Contábil</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-sm font-semibold">{accountant}</p>
           <p className="text-xs text-virgula-green font-bold">{crc}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-virgula-card border border-white/5 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
             <label className="text-[10px] uppercase font-bold text-virgula-muted mb-1 block">Nome do Prospecto</label>
             <input type="text" placeholder="Nome do Cliente" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-virgula-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-virgula-green outline-none" />
          </div>
          <button onClick={() => setEditing(!editing)} className={`px-6 py-3 rounded-xl font-bold text-sm ${editing ? 'bg-virgula-green text-virgula-dark' : 'bg-white/5 border border-white/10'}`}>
             {editing ? 'Salvar Alterações' : 'Configurar Planos'}
          </button>
        </div>

        <div className="flex justify-center mb-8 gap-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === cat.id ? 'bg-virgula-green text-virgula-dark' : 'bg-virgula-card text-virgula-muted'}`}>
              {cat.label}
            </button>
          ))}
          <button onClick={() => setActiveTab('Backup')} className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'Backup' ? 'bg-amber-500 text-virgula-dark' : 'bg-virgula-card text-virgula-muted'}`}>
            Histórico
          </button>
        </div>

        {activeTab === 'Backup' ? (
          <div className="space-y-4 max-w-4xl mx-auto">
             {history.map(record => (
               <div key={record.id} className="bg-virgula-card border border-white/5 p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-bold">{record.clientName}</p>
                    <p className="text-xs text-virgula-muted">{record.planName} • {record.date}</p>
                  </div>
                  <button onClick={() => deleteHistoryRecord(record.id)} className="text-red-500 text-xs font-bold px-4 py-2 hover:bg-red-500/10 rounded-lg">Excluir</button>
               </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentCategory?.plans.map((plan, planIdx) => (
              <div key={plan.id} className={`bg-virgula-card border rounded-2xl p-6 flex flex-col h-full relative ${plan.isPopular ? 'border-virgula-green shadow-lg shadow-virgula-green/5' : 'border-white/5'}`}>
                {plan.isPopular && <div className="absolute top-0 right-0 bg-virgula-green text-virgula-dark text-[10px] font-black px-3 py-1 rounded-bl-lg">POPULAR</div>}
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-virgula-muted text-xs font-bold uppercase">{plan.subtitle}</p>
                </div>
                <div className="mb-6">
                  {editing ? 
                    <input type="number" value={plan.price} onChange={e => updatePlanField(planIdx, 'price', Number(e.target.value))} className="w-full bg-virgula-dark border border-virgula-green/30 rounded px-2 py-1 text-xl font-bold" /> :
                    <div className="text-2xl font-black">R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-[10px] text-virgula-muted">/mês</span></div>
                  }
                </div>
                <ul className="space-y-2 mb-8 flex-grow">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`text-xs ${f.included ? '' : 'opacity-30 line-through'}`}>
                      <span className={f.included ? 'text-virgula-green' : 'text-red-500'}>{f.included ? '✔' : '✖'}</span> {f.text}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleContract(plan)} disabled={editing} className={`w-full py-3 rounded-xl font-black text-xs transition-all ${plan.isPopular ? 'bg-virgula-green text-virgula-dark' : 'border border-virgula-green text-virgula-green hover:bg-virgula-green hover:text-virgula-dark'}`}>GERAR PROPOSTA</button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center opacity-40">
        <p className="text-xs">© {new Date().getFullYear()} {officeName}</p>
        <p className="text-xs font-bold">Responsável: Lucas Araújo - CRC/BA 046968-O</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);