import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Calculator, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_DATA = {
  categories: [
    {
      id: 'Serviços',
      label: 'Serviços',
      plans: [
        {
          id: 's1',
          name: 'Básico',
          subtitle: 'Ideal para MEI',
          price: 50,
          isPopular: false,
          features: [
            { text: 'Declarações MEI', included: true },
            { text: 'Guia DAS automática', included: true },
            { text: 'Notas ilimitadas', included: true },
            { text: 'Suporte fiscal', included: true }
          ],
          detailedServices: [
            { category: 'FISCAIS / TRIBUTÁRIOS', items: ['Guia DAS-MEI mensal', 'DASN-SIMEI anual', 'Controle de faturamento', 'Orientação emissão NF-e'] },
            { category: 'DEPARTAMENTO PESSOAL', items: ['Orientação previdenciária', 'Auxílio em benefícios'] },
            { category: 'CONTÁBEIS', items: ['Livro caixa básico', 'Relatório mensal de receitas'] }
          ]
        },
        {
          id: 's2',
          name: 'Intermediário',
          subtitle: 'Simples Nacional (Sem Func.)',
          price: 250,
          isPopular: false,
          features: [
            { text: 'Apuração Simples Nacional', included: true },
            { text: 'Pró-labore Sócios', included: true },
            { text: 'Folha Funcionários', included: false },
            { text: 'Lucro Presumido', included: false }
          ],
          detailedServices: [
            { category: 'FISCAIS / TRIBUTÁRIOS', items: ['Apuração mensal Simples (DAS)', 'Envio do PGDAS-D', 'Entrega da DEFIS anual', 'Classificação fiscal', 'Monitoramento faturamento', 'Orientação Notas Fiscais', 'Regularização pendências', 'Parcelamentos'] },
            { category: 'DEPARTAMENTO PESSOAL', items: ['Encargos pró-labore', 'Orientação trabalhista'] },
            { category: 'CONTÁBEIS', items: ['Escrituração contábil mensal', 'Balanço Patrimonial', 'DRE', 'Balancetes mensais', 'Livro Diário e Razão', 'Encerramento anual'] }
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
            { category: 'FISCAIS / TRIBUTÁRIOS', items: ['Todos itens do Intermediário', 'Apuração mensal DAS', 'PGDAS-D', 'Consultoria tributária'] },
            { category: 'DEPARTAMENTO PESSOAL', items: ['Registro/admissão empregados', 'Elaboração folha pagamento', 'Cálculo pró-labore', 'Encargos Trabalhistas', 'Rescisões', 'Férias e 13º', 'eSocial, Reinf, DCTFWeb'] },
            { category: 'CONTÁBEIS', items: ['Todos itens do Intermediário', 'Análise de indicadores'] }
          ]
        },
        {
          id: 's4',
          name: 'Profissional',
          subtitle: 'Lucro Presumido',
          price: 649,
          isPopular: false,
          features: [
            { text: 'Lucro Presumido', included: true },
            { text: 'DP p/ até 5 Funcionários', included: true },
            { text: 'Apuração ICMS e ISS', included: true },
            { text: 'Contabilidade Completa', included: true }
          ],
          detailedServices: [
            { category: 'FISCAIS / TRIBUTÁRIOS', items: ['IRPJ (trimestral)', 'CSLL (trimestral)', 'PIS/COFINS (mensal)', 'Emissão DARF', 'Controle prazos', 'Apuração ICMS/DIFAL', 'Apuração ISS', 'Retenções na fonte'] },
            { category: 'DEPARTAMENTO PESSOAL', items: ['Mesmos itens Intermediário 2', 'Gestão de benefícios', 'Auditoria trabalhista'] },
            { category: 'CONTÁBEIS', items: ['Mesmos itens Intermediário 2', 'ECD / ECF Anual', 'Consolidação de contas'] }
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
          isPopular: false,
          features: [
            { text: 'Declarações MEI', included: true },
            { text: 'Guia DAS automática', included: true },
            { text: 'Notas ilimitadas', included: true },
            { text: 'Suporte fiscal', included: true }
          ],
          detailedServices: [
            { category: 'FISCAIS / TRIBUTÁRIOS', items: ['Guia DAS-MEI mensal', 'DASN-SIMEI anual', 'Controle de faturamento', 'Orientação emissão NF-e'] },
            { category: 'DEPARTAMENTO PESSOAL', items: ['Orientação previdenciária', 'Auxílio em benefícios'] },
            { category: 'CONTÁBEIS', items: ['Livro caixa básico', 'Relatório mensal de receitas'] }
          ]
        },
        {
          id: 'c2',
          name: 'Intermediário',
          subtitle: 'Simples Nacional (Sem Func.)',
          price: 289,
          isPopular: false,
          features: [
            { text: 'Apuração Simples Nacional', included: true },
            { text: 'Pró-labore Sócios', included: true },
            { text: 'Folha Funcionários', included: false },
            { text: 'Lucro Presumido', included: false }
          ],
          detailedServices: [
            { category: 'FISCAIS / TRIBUTÁRIOS', items: ['Apuração mensal Simples (DAS)', 'Envio do PGDAS-D', 'Entrega da DEFIS anual', 'Classificação fiscal', 'Monitoramento faturamento', 'Orientação Notas Fiscais', 'Regularização pendências', 'Parcelamentos'] },
            { category: 'DEPARTAMENTO PESSOAL', items: ['Encargos pró-labore', 'Orientação trabalhista'] },
            { category: 'CONTÁBEIS', items: ['Escrituração contábil mensal', 'Balanço Patrimonial', 'DRE', 'Balancetes mensais', 'Livro Diário e Razão', 'Encerramento anual'] }
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
            { category: 'FISCAIS / TRIBUTÁRIOS', items: ['Todos itens do Intermediário', 'Apuração mensal DAS', 'PGDAS-D', 'Consultoria tributária'] },
            { category: 'DEPARTAMENTO PESSOAL', items: ['Registro/admissão empregados', 'Elaboração folha pagamento', 'Cálculo pró-labore', 'Encargos Trabalhistas', 'Rescisões', 'Férias e 13º', 'eSocial, Reinf, DCTFWeb'] },
            { category: 'CONTÁBEIS', items: ['Todos itens do Intermediário', 'Análise de indicadores'] }
          ]
        },
        {
          id: 'c4',
          name: 'Profissional',
          subtitle: 'Lucro Presumido',
          price: 750,
          isPopular: false,
          features: [
            { text: 'Lucro Presumido', included: true },
            { text: 'DP p/ até 5 Funcionários', included: true },
            { text: 'Apuração ICMS e ISS', included: true },
            { text: 'Contabilidade Completa', included: true }
          ],
          detailedServices: [
            { category: 'FISCAIS / TRIBUTÁRIOS', items: ['IRPJ (trimestral)', 'CSLL (trimestral)', 'PIS/COFINS (mensal)', 'Emissão DARF', 'Controle prazos', 'Apuração ICMS/DIFAL', 'Apuração ISS', 'Retenções na fonte'] },
            { category: 'DEPARTAMENTO PESSOAL', items: ['Mesmos itens Intermediário 2', 'Gestão de benefícios', 'Auditoria trabalhista'] },
            { category: 'CONTÁBEIS', items: ['Mesmos itens Intermediário 2', 'ECD / ECF Anual', 'Consolidação de contas'] }
          ]
        }
      ]
    }
  ],
  history: [],
  accountant: 'Lucas Araujo dos Santos',
  crc: 'CRC/BA - 046968-O',
  officeName: 'Vírgula Contábil'
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState('Serviços');
  const [editing, setEditing] = useState(false);
  const [clientName, setClientName] = useState('');
  const [openingFee, setOpeningFee] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showProposal, setShowProposal] = useState(false);
  const [personalizedIntro, setPersonalizedIntro] = useState('');
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(savedData => {
        if (savedData) setData(savedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
    setData(prev => ({ ... (typeof updater === 'function' ? updater(prev) : updater) }));
  };

  const updatePrice = (categoryId, planId, newPrice) => {
    const newData = {...data};
    const catIndex = newData.categories.findIndex(c => c.id === categoryId);
    if (catIndex > -1) {
        const planIndex = newData.categories[catIndex].plans.findIndex(p => p.id === planId);
        if (planIndex > -1) {
            newData.categories[catIndex].plans[planIndex].price = parseFloat(newPrice);
            setData(newData);
        }
    }
  };

  const handleContract = (plan) => {
    const intro = `Prezado(a) ${clientName || 'Cliente'},\n\nApresentamos nossa proposta técnica para o plano **${plan.name}**. Na **${data.officeName}**, garantimos conformidade legal absoluta e agilidade estratégica para impulsionar seu negócio.`;
    
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString('pt-BR'),
      clientName: clientName || 'Cliente Particular',
      planName: plan.name,
      price: plan.price,
      openingFee: openingFee,
      planData: JSON.parse(JSON.stringify(plan))
    };
    
    updateData(prev => ({ ...prev, history: [newRecord, ...prev.history] }));
    setSelectedPlan(newRecord);
    setPersonalizedIntro(intro);
    setShowProposal(true);
  };

  const toggleDetails = (planId) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  if (loading) return <div className="p-20 text-center text-virgula-green font-bold">Iniciando Banco de Dados...</div>;

  if (showProposal && selectedPlan) {
    const displayPrice = selectedPlan.price || selectedPlan.planData?.price;
    const displayOpening = selectedPlan.openingFee;

    return (
      <div className="min-h-screen p-4 md:p-6 bg-gray-200 flex flex-col items-center font-sans overflow-y-auto">
        <div className="max-w-4xl w-full bg-white text-gray-900 shadow-2xl p-8 border border-gray-300 proposal-container rounded-sm page-break-avoid relative">
          
          <div className="flex justify-between items-center mb-6 border-b-2 border-virgula-green pb-2">
            <div className="flex items-center gap-2">
              <div className="text-virgula-green">
                <Calculator size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight leading-none text-gray-900">
                  <span>Vírgula</span> <span className="text-virgula-green">CONTÁBIL</span>
                </h1>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Inteligência Contábil & Estratégica</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-bold text-gray-400 uppercase">Proposta Preparada para</p>
              <h2 className="text-sm font-bold leading-none">{selectedPlan.clientName || clientName || 'Cliente Particular'}</h2>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded-sm border-l-4 border-virgula-green">
            <p className="text-[10px] text-gray-600 leading-relaxed italic whitespace-pre-wrap">
              {personalizedIntro.replace(/\*\*(.*?)\*\*/g, '$1')}
            </p>
          </div>

          <div className="flex flex-col mb-6">
            <div className={`flex items-center bg-virgula-green text-white rounded-t-sm shadow-md overflow-hidden`}>
              <div className="flex-1 px-4 py-3 border-r border-white/20">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Plano Selecionado</p>
                <h3 className="text-lg font-black uppercase leading-none">{selectedPlan.planName || selectedPlan.name}</h3>
              </div>

              {displayOpening && (
                <div className="px-5 py-3 border-r border-white/20 text-right bg-white/10 min-w-[140px]">
                  <p className="text-[7px] font-bold opacity-90 uppercase leading-none mb-1">Setup / Abertura</p>
                  <p className="text-xl font-black leading-none">
                    {isNaN(displayOpening) ? displayOpening : `R$ ${parseFloat(displayOpening).toLocaleString('pt-BR')}`}
                  </p>
                </div>
              )}

              <div className="px-5 py-3 text-right min-w-[140px]">
                <p className="text-[7px] font-bold opacity-80 uppercase leading-none mb-1">Honorários Mensais</p>
                <p className="text-2xl font-black leading-none">R$ {displayPrice.toLocaleString('pt-BR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-x border-b border-gray-100 p-4 bg-white print-grid-3">
              {[
                { label: '1. FISCAIS / TRIBUTÁRIOS', key: 'FISCAIS' },
                { label: '2. DEPARTAMENTO PESSOAL', key: 'DEPARTAMENTO' },
                { label: '3. CONTÁBEIS', key: 'CONTÁBEIS' }
              ].map((column) => {
                const planDetails = selectedPlan.planData || selectedPlan;
                const catData = planDetails.detailedServices?.find(s => 
                  s.category.toUpperCase().includes(column.key)
                );
                const items = catData ? catData.items : [];
                
                return (
                  <div key={column.key} className="page-break-avoid">
                    <h4 className="text-[10px] font-black text-gray-900 border-b-2 border-virgula-green/20 mb-2 pb-1 uppercase tracking-tighter">
                      {column.label}
                    </h4>
                    <ul className="space-y-1">
                      {items.length > 0 ? items.map((item, i) => (
                        <li key={i} className="text-[9px] text-gray-600 leading-tight flex items-start gap-1">
                          <span className="text-virgula-green font-bold">•</span> 
                          <span className="flex-1">{item}</span>
                        </li>
                      )) : (
                        <li className="text-[9px] text-gray-300 italic">Itens padrão incluídos</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 border-t border-gray-100 pt-4 page-break-avoid">
             <div className="text-[8px] text-gray-400 uppercase leading-relaxed italic">
                * Valores não contemplam taxas públicas, alvarás ou certificados digitais.<br/>
                * Reajuste anual pelo IGPM/FGV acumulado dos últimos 12 meses.
             </div>
             <div className="text-right text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                Validade: 10 dias | {selectedPlan.date || new Date().toLocaleDateString()}
             </div>
          </div>

          <div className="flex justify-between items-end page-break-avoid">
            <div className="flex flex-col">
              <p className="text-[6px] text-gray-400 uppercase font-black tracking-widest mb-1">Responsável Técnico</p>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-8 bg-virgula-green"></div>
                 <div>
                    <p className="font-black text-xs text-gray-900 leading-none uppercase">{data.accountant}</p>
                    <p className="text-[9px] text-virgula-green font-bold tracking-tight">{data.crc}</p>
                 </div>
              </div>
            </div>
            <div className="no-print flex gap-2">
              <button onClick={() => setShowProposal(false)} className="px-4 py-2 bg-gray-100 text-[10px] font-black rounded uppercase hover:bg-gray-200 transition-colors">Voltar</button>
              <button onClick={() => window.print()} className="px-6 py-2.5 bg-virgula-green text-white text-[10px] font-black rounded shadow-lg hover:bg-virgula-greenHover transition-all transform hover:scale-105 active:scale-95">Imprimir Proposta</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = data.categories.find(c => c.id === activeTab);

  return (
    <div className="min-h-screen bg-virgula-dark text-white p-4 md:p-6 font-inter">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-virgula-card border border-white/10 rounded-2xl flex items-center justify-center shadow-lg shadow-black/50">
             <Calculator className="text-virgula-green w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none">
                <span className="text-white">Vírgula</span> <span className="text-virgula-green">CONTÁBIL</span>
            </h1>
            <p className="text-[10px] text-virgula-muted font-bold tracking-widest uppercase mt-1">Sistema de Propostas</p>
          </div>
        </div>
        <button onClick={() => setEditing(!editing)} className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase transition-all flex items-center gap-2 ${editing ? 'bg-virgula-green text-virgula-dark' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
          {editing ? '💾 SALVAR VALORES' : '⚙️ CONFIGURAR PLANOS'}
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-virgula-card border border-virgula-border rounded-2xl p-6 mb-8 flex flex-col items-end gap-4">
          
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1">
                <label className="text-[10px] uppercase font-black text-virgula-muted mb-2 block">Nome do Cliente Prospecto</label>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ex: Restaurante Porto Rico LTDA" className="w-full bg-virgula-dark border border-white/5 rounded-xl px-4 py-4 text-base focus:border-virgula-green outline-none transition-all shadow-inner text-white" />
            </div>
            <div className="w-full md:w-64">
                <label className="text-[10px] uppercase font-black text-virgula-muted mb-2 block">Taxa de Abertura (Opcional)</label>
                <input type="text" value={openingFee} onChange={e => setOpeningFee(e.target.value)} placeholder="Ex: 1.500,00" className="w-full bg-virgula-dark border border-white/5 rounded-xl px-4 py-4 text-base focus:border-virgula-green outline-none transition-all shadow-inner text-white" />
            </div>
          </div>

          <div className="flex gap-3 w-full justify-end flex-wrap">
            {data.categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`px-6 py-4 rounded-xl text-[11px] font-black uppercase transition-all ${activeTab === cat.id ? 'bg-virgula-green text-virgula-dark shadow-xl shadow-virgula-green/30' : 'bg-white/5 text-virgula-muted hover:bg-white/10'}`}>{cat.label}</button>
            ))}
            <button onClick={() => setActiveTab('Backup')} className={`px-6 py-4 rounded-xl text-[11px] font-black uppercase transition-all ${activeTab === 'Backup' ? 'bg-amber-500 text-virgula-dark shadow-xl shadow-amber-500/30' : 'bg-white/5 text-virgula-muted hover:bg-white/10'}`}>Histórico</button>
          </div>
        </div>

        {activeTab === 'Backup' ? (
          <div className="max-w-5xl mx-auto space-y-4">
            {data.history.length > 0 ? data.history.map(record => (
              <div key={record.id} className="bg-virgula-card border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-virgula-green/40 transition-all group shadow-lg">
                <div>
                  <p className="text-lg font-black text-white group-hover:text-virgula-green transition-colors">{record.clientName}</p>
                  <p className="text-[10px] text-virgula-muted uppercase font-bold tracking-widest">
                    {record.date} • {record.planName} • R$ {record.price.toLocaleString('pt-BR')}
                    {record.openingFee && ` • Abertura: R$ ${record.openingFee}`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setSelectedPlan(record); setClientName(record.clientName); setOpeningFee(record.openingFee || ''); setShowProposal(true); }} className="px-5 py-2.5 bg-virgula-green text-virgula-dark rounded-xl text-[10px] font-black uppercase hover:scale-105 active:scale-95 transition-all">Reabrir</button>
                  <button onClick={() => updateData(p => ({...p, history: p.history.filter(h => h.id !== record.id)}))} className="px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Excluir</button>
                </div>
              </div>
            )) : <div className="text-center p-16 text-virgula-muted text-xs uppercase font-black border border-dashed border-white/10 rounded-3xl">Histórico vazio: Gere novas propostas para salvá-las aqui.</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {currentCategory?.plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-virgula-card border rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden group ${plan.isPopular ? 'border-virgula-green hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-white/5 hover:border-virgula-green/50'}`}
              >
                {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-virgula-green text-virgula-dark text-[9px] font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-virgula-muted text-xs uppercase tracking-wider font-semibold mt-1 opacity-70">{plan.subtitle}</p>
                </div>
                
                <div className="price-container mb-4 h-14 flex flex-col justify-center">
                  <span className="text-[10px] text-virgula-muted block">A partir de</span>
                  <div className="flex items-end gap-1">
                    {editing ? (
                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-virgula-green">R$</span>
                            <input 
                                type="number" 
                                value={plan.price} 
                                onChange={(e) => updatePrice(activeTab, plan.id, e.target.value)}
                                className="bg-white/10 text-white font-bold text-xl w-24 px-2 rounded focus:bg-white/20 outline-none border border-virgula-green"
                            />
                        </div>
                    ) : (
                        <div className="text-2xl font-bold text-white flex items-end gap-1">
                            R$ {plan.price.toLocaleString('pt-BR')} <span className="text-xs font-normal text-virgula-muted mb-1">/mês</span>
                        </div>
                    )}
                  </div>
                </div>

                <ul className="feature-list mb-4 space-y-2">
                   {plan.features.map((f, i) => (
                     <li key={i} className="text-[12px] flex items-center gap-3 text-virgula-muted">
                        {f.included ? <Check size={14} className="text-virgula-green" /> : <X size={14} className="text-red-500" />}
                        <span className={f.included ? '' : 'text-virgula-muted/50'}>{f.text}</span>
                     </li>
                   ))}
                </ul>

                <button onClick={() => toggleDetails(plan.id)} className="text-xs text-virgula-green hover:text-white underline mb-6 text-left flex items-center gap-1">
                    {expandedPlanId === plan.id ? 'Ocultar detalhes' : 'Ver lista completa de serviços'}
                    {expandedPlanId === plan.id ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </button>
                
                {expandedPlanId === plan.id && (
                    <div className="mb-6 p-3 bg-black/20 rounded-lg space-y-3 animate-in fade-in zoom-in-95 duration-200">
                        {plan.detailedServices.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="text-[10px] font-bold text-white uppercase mb-1 border-b border-white/10 pb-1">{section.category}</h4>
                                <ul className="space-y-1">
                                    {section.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="text-[10px] text-virgula-muted flex items-start gap-1">
                                            <span className="text-virgula-green text-[8px] mt-0.5">●</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                <button 
                  onClick={() => handleContract(plan)} 
                  disabled={editing} 
                  className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors mt-auto uppercase tracking-wide
                    ${editing ? 'opacity-20 cursor-not-allowed bg-white/5' : 
                      plan.isPopular 
                      ? 'bg-virgula-green text-virgula-dark hover:bg-virgula-greenHover shadow-lg shadow-virgula-green/10' 
                      : 'bg-virgula-card border border-virgula-green text-virgula-green hover:bg-virgula-green hover:text-virgula-dark'
                    }`}
                >
                  Contratar
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