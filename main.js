import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Calculator, Check, X, ChevronDown, ChevronUp, Plus, Trash2, Edit3 } from 'lucide-react';

const DEFAULT_DATA = {
  introTemplate: "Apresentamos nossa proposta técnica para o plano **{{PLANO}}**. Na **{{EMPRESA}}**, garantimos conformidade legal absoluta e agilidade estratégica para impulsionar seu negócio.",
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
    setData(prev => {
        // Correção para garantir merge correto do estado
        if (typeof updater === 'function') {
            return updater(prev);
        }
        return { ...prev, ...updater };
    });
  };

  const updateCategoryLabel = (index, newLabel) => {
    // Clone profundo para evitar mutação direta
    const newData = JSON.parse(JSON.stringify(data));
    newData.categories[index].label = newLabel;
    newData.categories[index].id = newLabel;
    if (activeTab === data.categories[index].id) {
        setActiveTab(newLabel);
    }
    setData(newData);
  };

  const modifyPlan = (categoryId, planId, modifier) => {
    const newData = {...data};
    const catIndex = newData.categories.findIndex(c => c.id === categoryId);
    if (catIndex > -1) {
        const planIndex = newData.categories[catIndex].plans.findIndex(p => p.id === planId);
        if (planIndex > -1) {
            const plan = newData.categories[catIndex].plans[planIndex];
            modifier(plan);
            setData(newData);
        }
    }
  };

  const updatePlanField = (categoryId, planId, field, value) => {
    modifyPlan(categoryId, planId, (plan) => {
        plan[field] = value;
    });
  };

  const updateFeature = (categoryId, planId, featureIndex, field, value) => {
    modifyPlan(categoryId, planId, (plan) => {
        plan.features[featureIndex][field] = value;
    });
  };

  const removeFeature = (categoryId, planId, featureIndex) => {
    modifyPlan(categoryId, planId, (plan) => {
        plan.features.splice(featureIndex, 1);
    });
  };

  const addFeature = (categoryId, planId) => {
    modifyPlan(categoryId, planId, (plan) => {
        plan.features.push({ text: 'Novo Item', included: true });
    });
  };

  const updateDetailCategory = (categoryId, planId, detailIndex, newVal) => {
    modifyPlan(categoryId, planId, (plan) => {
        plan.detailedServices[detailIndex].category = newVal;
    });
  };
  
  const updateDetailItem = (categoryId, planId, detailIndex, itemIndex, newVal) => {
    modifyPlan(categoryId, planId, (plan) => {
        plan.detailedServices[detailIndex].items[itemIndex] = newVal;
    });
  };

  const removeDetailItem = (categoryId, planId, detailIndex, itemIndex) => {
    modifyPlan(categoryId, planId, (plan) => {
        plan.detailedServices[detailIndex].items.splice(itemIndex, 1);
    });
  };

  const addDetailItem = (categoryId, planId, detailIndex) => {
    modifyPlan(categoryId, planId, (plan) => {
        plan.detailedServices[detailIndex].items.push('Novo Serviço');
    });
  };

  const handleContract = (plan) => {
    const template = data.introTemplate || DEFAULT_DATA.introTemplate;
    const intro = template
        .replace('{{PLANO}}', plan.name)
        .replace('{{EMPRESA}}', data.officeName);
    
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
        <div className="max-w-4xl w-full bg-white text-gray-900 shadow-2xl p-8 border border-gray-300 proposal-container rounded-sm relative print:p-0 print:border-none print:shadow-none print:w-full">
          
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-8 border-b-2 border-virgula-green pb-3 page-break-avoid print:mb-6 print:pb-2">
            <div className="flex items-center gap-3">
              <div className="text-virgula-green">
                <Calculator size={40} strokeWidth={2.5} className="print:w-10 print:h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none text-gray-900 print:text-2xl">
                  <span>Vírgula</span> <span className="text-virgula-green">CONTÁBIL</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 print:text-[9px]">Inteligência Contábil & Estratégica</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase print:text-[9px] print:text-gray-500">Proposta Preparada para</p>
              <h2 className="text-lg font-bold leading-none print:text-lg print:text-black">{selectedPlan.clientName || clientName || 'Cliente Particular'}</h2>
            </div>
          </div>

          {/* Intro Editável - Exibida como texto na impressão para não cortar */}
          <div className="mb-8 print:mb-6 page-break-avoid">
             <div className="text-[11px] font-bold text-gray-800 italic mb-2 print:text-[10px] print:text-black">Prezado(a) {selectedPlan.clientName || 'Cliente'},</div>
             
             {/* Textarea para edição na tela */}
             <textarea
                value={personalizedIntro}
                onChange={(e) => setPersonalizedIntro(e.target.value)}
                className="w-full bg-transparent resize-none outline-none text-sm text-gray-600 leading-relaxed italic h-auto overflow-hidden print:hidden"
                rows={4}
                style={{minHeight: '80px'}}
            />

            {/* Div para impressão (garante que todo o texto seja impresso) */}
            <div className="hidden print:block text-sm text-black leading-relaxed italic text-justify whitespace-pre-wrap">
                {personalizedIntro}
            </div>
          </div>

          {/* Barra Verde - Layout idêntico ao PDF */}
          <div className="flex mb-8 bg-virgula-green text-white page-break-avoid print:mb-4 print:text-sm">
              {/* Coluna 1: Nome do Plano (Larga) */}
              <div className="flex-1 p-4 pl-5 border-r border-white/20 print:p-3 print:pl-4 print:border-white/30">
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-1 print:text-[9px] print:text-white/90">Plano Selecionado</p>
                 <h3 className="text-2xl font-black uppercase leading-tight print:text-lg print:text-white">{selectedPlan.planName || selectedPlan.name}</h3>
              </div>
              
              {/* Coluna 2: Setup (Se existir) */}
              {displayOpening && (
                  <div className="w-40 p-4 border-r border-white/20 text-center flex flex-col justify-center print:w-36 print:p-3 print:border-white/30">
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-90 mb-1 print:text-[8px] print:text-white/90">Setup / Abertura</p>
                      <h3 className="text-xl font-black print:text-xl print:text-white">
                        {isNaN(displayOpening) ? displayOpening : `R$ ${parseFloat(displayOpening).toLocaleString('pt-BR')}`}
                      </h3>
                  </div>
              )}

              {/* Coluna 3: Honorários */}
              <div className="w-48 p-4 text-center flex flex-col justify-center print:w-44 print:p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-90 mb-1 print:text-[8px] print:text-white/90">Honorários Mensais</p>
                  <h3 className="text-3xl font-black print:text-2xl print:text-white">R$ {displayPrice.toLocaleString('pt-BR')}</h3>
              </div>
          </div>

            {/* Grid de Serviços */}
            <div className="grid grid-cols-3 gap-8 print-grid-3 print:gap-6">
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
                    <h4 className="text-xs font-black text-gray-900 border-b-2 border-virgula-green/20 mb-3 pb-1 uppercase tracking-tighter print:text-xs print:text-black print:mb-2 print:border-gray-300">
                      {column.label}
                    </h4>
                    <ul className="space-y-1.5 print:space-y-1">
                      {items.length > 0 ? items.map((item, i) => (
                        <li key={i} className="text-[11px] text-gray-600 leading-tight flex items-start gap-1.5 print:text-[10px] print:text-gray-800">
                          <span className="text-virgula-green font-bold text-[10px] mt-0.5 print:text-virgula-green">•</span> 
                          <span className="flex-1">{item}</span>
                        </li>
                      )) : (
                        <li className="text-[10px] text-gray-400 italic print:text-[9px]">Itens padrão incluídos</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>

          {/* Rodapé - Espaçamento Flexível para empurrar para baixo se necessário */}
          <div className="mt-12 pt-4 border-t border-gray-200 grid grid-cols-2 gap-8 page-break-avoid print:mt-8 print:pt-4 print:border-gray-300">
             <div className="text-[9px] text-gray-500 uppercase leading-relaxed italic print:text-[8px] print:text-gray-600">
                * Valores não contemplam taxas públicas, alvarás ou certificados digitais.<br/>
                * Reajuste anual pelo IGPM/FGV acumulado dos últimos 12 meses.
             </div>
             <div className="text-right text-[10px] text-gray-600 font-bold uppercase tracking-widest print:text-[9px] print:text-black">
                Validade: 10 dias | {selectedPlan.date || new Date().toLocaleDateString()}
             </div>
          </div>

          <div className="mt-6 flex justify-between items-end page-break-avoid print:mt-4">
            <div className="flex flex-col">
              <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest mb-1 print:text-[7px] print:text-gray-500">Responsável Técnico</p>
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-10 bg-virgula-green print:h-8 print:bg-virgula-green"></div>
                 <div>
                    <p className="font-black text-sm text-gray-900 leading-none uppercase print:text-sm print:text-black">{data.accountant}</p>
                    <p className="text-[10px] text-virgula-green font-bold tracking-tight print:text-[9px] print:text-virgula-green">{data.crc}</p>
                 </div>
              </div>
            </div>
            <div className="no-print flex gap-2">
              <button onClick={() => setShowProposal(false)} className="px-4 py-2 bg-gray-100 text-xs font-black rounded uppercase hover:bg-gray-200 transition-colors">Voltar</button>
              <button onClick={() => window.print()} className="px-6 py-2.5 bg-virgula-green text-white text-xs font-black rounded shadow-lg hover:bg-virgula-greenHover transition-all transform hover:scale-105 active:scale-95">Imprimir Proposta</button>
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
          {editing ? '💾 SALVAR ALTERAÇÕES' : '⚙️ CONFIGURAR PLANOS'}
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
            
          {/* Configuração de Intro Padrão */}
          {editing && (
            <div className="w-full mt-4 border-t border-white/5 pt-4">
                <label className="text-[10px] uppercase font-black text-virgula-muted mb-2 block flex items-center gap-2">
                    <Edit3 size={12} /> Modelo de Texto da Proposta (Padrão)
                </label>
                {/* Correção do bug de crash aqui: usando callback no updateData */}
                <textarea 
                    value={data.introTemplate || DEFAULT_DATA.introTemplate}
                    onChange={(e) => updateData(prev => ({...prev, introTemplate: e.target.value}))}
                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-virgula-green outline-none min-h-[80px]"
                    placeholder="Use {{PLANO}} para o nome do plano e {{EMPRESA}} para o nome da contabilidade."
                />
                <p className="text-[9px] text-virgula-muted mt-1 opacity-60">Variáveis disponíveis: {'{{PLANO}}'}, {'{{EMPRESA}}'}</p>
            </div>
          )}

          <div className="flex gap-3 w-full justify-end flex-wrap mt-4">
            {data.categories.map((cat, idx) => (
              editing ? (
                 <input 
                    key={idx}
                    value={cat.label}
                    onChange={(e) => updateCategoryLabel(idx, e.target.value)}
                    className="px-4 py-3 rounded-xl text-[11px] font-black uppercase bg-black/30 text-white border border-virgula-green focus:outline-none w-32 text-center"
                 />
              ) : (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`px-6 py-4 rounded-xl text-[11px] font-black uppercase transition-all ${activeTab === cat.id ? 'bg-virgula-green text-virgula-dark shadow-xl shadow-virgula-green/30' : 'bg-white/5 text-virgula-muted hover:bg-white/10'}`}>{cat.label}</button>
              )
            ))}
            {!editing && (
                <button onClick={() => setActiveTab('Backup')} className={`px-6 py-4 rounded-xl text-[11px] font-black uppercase transition-all ${activeTab === 'Backup' ? 'bg-amber-500 text-virgula-dark shadow-xl shadow-amber-500/30' : 'bg-white/5 text-virgula-muted hover:bg-white/10'}`}>Histórico</button>
            )}
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
                  {editing ? (
                    <div className="space-y-1">
                        <input 
                            value={plan.name} 
                            onChange={(e) => updatePlanField(activeTab, plan.id, 'name', e.target.value)} 
                            className="bg-transparent border-b border-white/20 text-white font-bold text-lg w-full outline-none focus:border-virgula-green"
                            placeholder="Nome do Plano"
                        />
                        <input 
                            value={plan.subtitle} 
                            onChange={(e) => updatePlanField(activeTab, plan.id, 'subtitle', e.target.value)} 
                            className="bg-transparent border-b border-white/20 text-virgula-muted text-xs uppercase tracking-wider font-semibold w-full outline-none focus:border-virgula-green"
                            placeholder="Subtítulo"
                        />
                    </div>
                  ) : (
                    <>
                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                        <p className="text-virgula-muted text-xs uppercase tracking-wider font-semibold mt-1 opacity-70">{plan.subtitle}</p>
                    </>
                  )}
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
                                onChange={(e) => updatePlanField(activeTab, plan.id, 'price', e.target.value)}
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
                     <li key={i} className="text-[12px] flex items-center gap-2 text-virgula-muted">
                        {editing ? (
                            <>
                                <button onClick={() => updateFeature(activeTab, plan.id, i, 'included', !f.included)} className="cursor-pointer">
                                    {f.included ? <Check size={14} className="text-virgula-green" /> : <X size={14} className="text-red-500" />}
                                </button>
                                <input 
                                    value={f.text} 
                                    onChange={(e) => updateFeature(activeTab, plan.id, i, 'text', e.target.value)}
                                    className="bg-transparent border-b border-white/10 text-[11px] text-white flex-1 outline-none py-0.5"
                                />
                                <button onClick={() => removeFeature(activeTab, plan.id, i)} className="text-red-500 hover:text-red-400">
                                    <Trash2 size={12} />
                                </button>
                            </>
                        ) : (
                            <>
                                {f.included ? <Check size={14} className="text-virgula-green" /> : <X size={14} className="text-red-500" />}
                                <span className={f.included ? '' : 'text-virgula-muted/50'}>{f.text}</span>
                            </>
                        )}
                     </li>
                   ))}
                   {editing && (
                        <button onClick={() => addFeature(activeTab, plan.id)} className="w-full flex items-center justify-center gap-1 text-[10px] text-virgula-green border border-dashed border-virgula-green/30 rounded py-1 hover:bg-virgula-green/10">
                            <Plus size={10} /> Adicionar Item
                        </button>
                   )}
                </ul>

                <button onClick={() => toggleDetails(plan.id)} className="text-xs text-virgula-green hover:text-white underline mb-6 text-left flex items-center gap-1">
                    {(expandedPlanId === plan.id || editing) ? 'Ocultar detalhes' : 'Ver lista completa de serviços'}
                    {(expandedPlanId === plan.id || editing) ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </button>
                
                {(expandedPlanId === plan.id || editing) && (
                    <div className="mb-6 p-3 bg-black/20 rounded-lg space-y-3 animate-in fade-in zoom-in-95 duration-200">
                        {plan.detailedServices.map((section, idx) => (
                            <div key={idx} className="relative group/section">
                                {editing ? (
                                    <input 
                                        value={section.category}
                                        onChange={(e) => updateDetailCategory(activeTab, plan.id, idx, e.target.value)}
                                        className="text-[10px] font-bold text-white uppercase mb-1 border-b border-virgula-green/50 pb-1 bg-transparent w-full outline-none"
                                    />
                                ) : (
                                    <h4 className="text-[10px] font-bold text-white uppercase mb-1 border-b border-white/10 pb-1">{section.category}</h4>
                                )}
                                
                                <ul className="space-y-1 mt-2">
                                    {section.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="text-[10px] text-virgula-muted flex items-start gap-1">
                                            <span className="text-virgula-green text-[8px] mt-0.5">●</span> 
                                            {editing ? (
                                                <div className="flex gap-1 flex-1">
                                                    <input 
                                                        value={item}
                                                        onChange={(e) => updateDetailItem(activeTab, plan.id, idx, itemIdx, e.target.value)}
                                                        className="bg-transparent border-b border-white/5 w-full outline-none text-[10px]"
                                                    />
                                                    <button onClick={() => removeDetailItem(activeTab, plan.id, idx, itemIdx)} className="text-red-500">
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ) : (
                                                item
                                            )}
                                        </li>
                                    ))}
                                    {editing && (
                                        <button onClick={() => addDetailItem(activeTab, plan.id, idx)} className="text-[9px] text-virgula-green/70 hover:text-virgula-green flex items-center gap-1 mt-1">
                                            <Plus size={8} /> Item
                                        </button>
                                    )}
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