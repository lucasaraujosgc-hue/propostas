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
        if (typeof updater === 'function') {
            return updater(prev);
        }
        return { ...prev, ...updater };
    });
  };

  const updateCategoryLabel = (index, newLabel) => {
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

  if (loading) return <div className="p-20 text-center text-primary font-bold">Iniciando Banco de Dados...</div>;

  if (showProposal && selectedPlan) {
    const displayPrice = selectedPlan.price || selectedPlan.planData?.price;
    const displayOpening = selectedPlan.openingFee;

    return (
      <div className="min-h-screen p-4 md:p-6 bg-background flex flex-col items-center overflow-y-auto print:block print:h-auto print:overflow-visible print:bg-white print:p-0">
        <div className="max-w-4xl w-full bg-card text-card-foreground shadow-sm p-7 md:p-10 border border-border proposal-container rounded-2xl relative print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none">
          
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-8 border-b-2 border-primary pb-3 page-break-avoid print:mb-6 print:pb-4">
            <div className="flex items-center gap-3">
              <div className="text-primary">
                <Calculator size={40} strokeWidth={2.5} className="print:w-12 print:h-12" />
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-primary font-serif print:text-4xl">
                  <span>Vírgula</span> <span>CONTÁBIL</span>
                </h1>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 print:text-xs">Inteligência Contábil & Estratégica</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.14em] print:text-xs print:text-gray-500">Proposta Preparada para</p>
              <h2 className="text-xl font-semibold text-primary leading-none mt-1 print:text-2xl print:text-black">{selectedPlan.clientName || clientName || 'Cliente Particular'}</h2>
            </div>
          </div>

          {/* Intro Editável */}
          <div className="mb-8 print:mb-8 page-break-avoid">
             <div className="text-[11px] font-bold text-foreground italic mb-2 print:text-sm print:text-black">Prezado(a) {selectedPlan.clientName || 'Cliente'},</div>
             
             <textarea
                value={personalizedIntro}
                onChange={(e) => setPersonalizedIntro(e.target.value)}
                className="w-full bg-transparent resize-none outline-none text-[17px] text-foreground/90 leading-relaxed italic h-auto overflow-hidden print:hidden"
                rows={4}
                style={{minHeight: '80px'}}
            />

            <div className="hidden print:block text-base text-black leading-relaxed italic text-justify whitespace-pre-wrap">
                {personalizedIntro}
            </div>
          </div>

          {/* Barra Verde - Ajustado para fontes maiores e layout idêntico à imagem */}
          <div className="flex mb-8 bg-primary text-primary-foreground rounded-xl overflow-hidden page-break-avoid print:mb-10 print:py-2">
              <div className="flex-1 p-5 border-r border-primary-foreground/20 print:p-4 print:pl-6 print:border-white/30">
                 <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-90 mb-1 print:text-xs print:text-white/90">Plano Selecionado</p>
                 <h3 className="text-3xl md:text-4xl font-bold font-serif leading-tight print:text-3xl print:text-white">{selectedPlan.planName || selectedPlan.name}</h3>
              </div>
              
              {displayOpening && (
                  <div className="w-40 p-5 border-r border-primary-foreground/20 text-center flex flex-col justify-center print:w-48 print:p-4 print:border-white/30">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-90 mb-1 print:text-xs print:text-white/90">Setup / Abertura</p>
                      <h3 className="text-xl font-bold print:text-2xl print:text-white">
                        {isNaN(displayOpening) ? displayOpening : `R$ ${parseFloat(displayOpening).toLocaleString('pt-BR')}`}
                      </h3>
                  </div>
              )}

              <div className="w-48 p-5 text-center flex flex-col justify-center print:w-56 print:p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-90 mb-1 print:text-xs print:text-white/90">Honorários Mensais</p>
                  <h3 className="text-3xl md:text-4xl font-bold font-serif print:text-5xl print:text-white">R$ {displayPrice.toLocaleString('pt-BR')}</h3>
              </div>
          </div>

            {/* Grid de Serviços - 3 Colunas na Impressão com fontes maiores */}
            <div className="grid grid-cols-3 gap-8 print-grid-3 print:gap-8">
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
                    <h4 className="text-sm font-bold text-primary font-serif border-b-2 border-primary/20 mb-3 pb-1 uppercase tracking-tighter print:text-sm print:text-black print:mb-4 print:border-gray-300">
                      {column.label}
                    </h4>
                    <ul className="space-y-1.5 print:space-y-2">
                      {items.length > 0 ? items.map((item, i) => (
                        <li key={i} className="text-sm text-foreground/90 leading-tight flex items-start gap-1.5 print:text-xs print:text-gray-800">
                          <span className="text-accent font-bold text-[10px] mt-0.5 print:text-primary print:text-xs">•</span> 
                          <span className="flex-1">{item}</span>
                        </li>
                      )) : (
                        <li className="text-sm text-muted-foreground italic print:text-xs">Itens padrão incluídos</li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>

          {/* Rodapé */}
          <div className="mt-12 pt-4 border-t border-border grid grid-cols-2 gap-8 page-break-avoid print:mt-12 print:pt-6 print:border-gray-300">
             <div className="text-xs text-muted-foreground leading-relaxed italic print:text-[10px] print:text-gray-600">
                * Valores não contemplam taxas públicas, alvarás ou certificados digitais.<br/>
                * Reajuste anual pelo IGPM/FGV acumulado dos últimos 12 meses.
             </div>
             <div className="text-right text-xs text-muted-foreground font-semibold uppercase tracking-widest print:text-xs print:text-black">
                Validade: 10 dias | {selectedPlan.date || new Date().toLocaleDateString()}
             </div>
          </div>

          <div className="mt-6 flex justify-between items-end page-break-avoid print:mt-6">
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.14em] mb-1 print:text-[10px] print:text-gray-500">Responsável Técnico</p>
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-10 bg-primary print:h-12 print:bg-primary"></div>
                 <div>
                    <p className="font-bold text-sm text-foreground leading-none uppercase print:text-lg print:text-black">{data.accountant}</p>
                    <p className="text-xs text-primary font-bold mt-1 print:text-sm print:text-primary">{data.crc}</p>
                 </div>
              </div>
            </div>
            <div className="no-print flex gap-2">
              <button onClick={() => setShowProposal(false)} className="px-4 py-2 bg-secondary text-secondary-foreground text-xs font-bold rounded uppercase hover:bg-secondary/80 transition-colors">Voltar</button>
              <button onClick={() => window.print()} className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded shadow-sm hover:opacity-90 transition-all transform hover:scale-105 active:scale-95">Imprimir Proposta</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = data.categories.find(c => c.id === activeTab);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/85 backdrop-blur py-4 mb-8">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-card border border-border rounded-2xl flex items-center justify-center shadow-sm">
               <Calculator className="text-primary w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight leading-none text-primary font-serif">
                  Vírgula CONTÁBIL
              </h1>
              <p className="text-xs font-semibold text-accent tracking-[0.14em] uppercase mt-1">Sistema de Propostas</p>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className={`px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase transition-all flex items-center gap-2 ${editing ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
            {editing ? '💾 SALVAR ALTERAÇÕES' : '⚙️ CONFIGURAR PLANOS'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="bg-card border border-border rounded-2xl p-7 md:p-10 mb-8 flex flex-col items-end gap-4 shadow-sm">
          
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">Nome do Cliente Prospecto</label>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ex: Restaurante Porto Rico LTDA" className="w-full bg-background border border-border rounded-xl px-4 py-4 text-base focus:border-primary outline-none transition-all shadow-inner text-foreground" />
            </div>
            <div className="w-full md:w-64">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">Taxa de Abertura (Opcional)</label>
                <input type="text" value={openingFee} onChange={e => setOpeningFee(e.target.value)} placeholder="Ex: 1.500,00" className="w-full bg-background border border-border rounded-xl px-4 py-4 text-base focus:border-primary outline-none transition-all shadow-inner text-foreground" />
            </div>
          </div>
            
          {/* Configuração de Intro Padrão */}
          {editing && (
            <div className="w-full mt-4 border-t border-border pt-4">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block flex items-center gap-2">
                    <Edit3 size={12} /> Modelo de Texto da Proposta (Padrão)
                </label>
                {/* Correção do bug de crash aqui: usando callback no updateData */}
                <textarea 
                    value={data.introTemplate || DEFAULT_DATA.introTemplate}
                    onChange={(e) => updateData(prev => ({...prev, introTemplate: e.target.value}))}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary outline-none min-h-[80px]"
                    placeholder="Use {{PLANO}} para o nome do plano e {{EMPRESA}} para o nome da contabilidade."
                />
                <p className="text-[9px] text-muted-foreground mt-1 opacity-60">Variáveis disponíveis: {'{{PLANO}}'}, {'{{EMPRESA}}'}</p>
            </div>
          )}

          <div className="flex gap-3 w-full justify-end flex-wrap mt-4">
            {data.categories.map((cat, idx) => (
              editing ? (
                 <input 
                    key={idx}
                    value={cat.label}
                    onChange={(e) => updateCategoryLabel(idx, e.target.value)}
                    className="px-4 py-3 rounded-xl text-[11px] font-bold uppercase bg-secondary text-secondary-foreground border border-primary focus:outline-none w-32 text-center"
                 />
              ) : (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`px-6 py-4 rounded-xl text-[11px] font-bold uppercase transition-all ${activeTab === cat.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>{cat.label}</button>
              )
            ))}
            {!editing && (
                <button onClick={() => setActiveTab('Backup')} className={`px-6 py-4 rounded-xl text-[11px] font-bold uppercase transition-all ${activeTab === 'Backup' ? 'bg-accent text-accent-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>Histórico</button>
            )}
          </div>
        </div>

        {activeTab === 'Backup' ? (
          <div className="max-w-5xl mx-auto space-y-4">
            {data.history.length > 0 ? data.history.map(record => (
              <div key={record.id} className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between hover:border-primary/40 transition-all group shadow-sm">
                <div>
                  <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{record.clientName}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">
                    {record.date} • {record.planName} • R$ {record.price.toLocaleString('pt-BR')}
                    {record.openingFee && ` • Abertura: R$ ${record.openingFee}`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setSelectedPlan(record); setClientName(record.clientName); setOpeningFee(record.openingFee || ''); setShowProposal(true); }} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase hover:scale-105 active:scale-95 transition-all">Reabrir</button>
                  <button onClick={() => updateData(p => ({...p, history: p.history.filter(h => h.id !== record.id)}))} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all">Excluir</button>
                </div>
              </div>
            )) : <div className="text-center p-16 text-muted-foreground text-xs uppercase font-bold border border-dashed border-border rounded-2xl">Histórico vazio: Gere novas propostas para salvá-las aqui.</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {currentCategory?.plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-card border rounded-2xl p-7 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden group shadow-sm ${plan.isPopular ? 'border-primary ring-1 ring-primary/20 hover:shadow-primary/10' : 'border-border hover:border-primary/50'}`}
              >
                {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold px-3 py-1 rounded-bl-xl tracking-wider">POPULAR</div>
                )}
                
                <div className="mb-6">
                  {editing ? (
                    <div className="space-y-1">
                        <input 
                            value={plan.name} 
                            onChange={(e) => updatePlanField(activeTab, plan.id, 'name', e.target.value)} 
                            className="bg-transparent border-b border-border text-foreground font-bold text-2xl w-full outline-none focus:border-primary font-serif"
                            placeholder="Nome do Plano"
                        />
                        <input 
                            value={plan.subtitle} 
                            onChange={(e) => updatePlanField(activeTab, plan.id, 'subtitle', e.target.value)} 
                            className="bg-transparent border-b border-border text-muted-foreground text-xs uppercase tracking-[0.14em] font-semibold w-full outline-none focus:border-primary mt-2"
                            placeholder="Subtítulo"
                        />
                    </div>
                  ) : (
                    <>
                        <h3 className="text-3xl font-bold text-primary font-serif leading-tight">{plan.name}</h3>
                        <p className="text-muted-foreground text-xs uppercase tracking-[0.14em] font-semibold mt-2">{plan.subtitle}</p>
                    </>
                  )}
                </div>
                
                <div className="price-container mb-6 h-14 flex flex-col justify-center">
                  <span className="text-[10px] text-muted-foreground block">A partir de</span>
                  <div className="flex items-end gap-1">
                    {editing ? (
                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-primary">R$</span>
                            <input 
                                type="number" 
                                value={plan.price} 
                                onChange={(e) => updatePlanField(activeTab, plan.id, 'price', e.target.value)}
                                className="bg-secondary text-foreground font-bold text-xl w-24 px-2 py-1 rounded focus:bg-secondary/80 outline-none border border-primary"
                            />
                        </div>
                    ) : (
                        <div className="text-3xl font-bold text-foreground flex items-end gap-1 font-serif">
                            R$ {plan.price.toLocaleString('pt-BR')} <span className="text-xs font-sans font-normal text-muted-foreground mb-1">/mês</span>
                        </div>
                    )}
                  </div>
                </div>

                <ul className="feature-list mb-6 space-y-3">
                   {plan.features.map((f, i) => (
                     <li key={i} className="text-[13px] flex items-center gap-2 text-foreground/90">
                        {editing ? (
                            <>
                                <button onClick={() => updateFeature(activeTab, plan.id, i, 'included', !f.included)} className="cursor-pointer">
                                    {f.included ? <Check size={16} className="text-primary" /> : <X size={16} className="text-red-500" />}
                                </button>
                                <input 
                                    value={f.text} 
                                    onChange={(e) => updateFeature(activeTab, plan.id, i, 'text', e.target.value)}
                                    className="bg-transparent border-b border-border text-[13px] text-foreground flex-1 outline-none py-0.5 focus:border-primary"
                                />
                                <button onClick={() => removeFeature(activeTab, plan.id, i)} className="text-red-500 hover:text-red-400">
                                    <Trash2 size={14} />
                                </button>
                            </>
                        ) : (
                            <>
                                {f.included ? <Check size={16} className="text-primary" /> : <X size={16} className="text-muted-foreground/40" />}
                                <span className={f.included ? '' : 'text-muted-foreground/60'}>{f.text}</span>
                            </>
                        )}
                     </li>
                   ))}
                   {editing && (
                        <button onClick={() => addFeature(activeTab, plan.id)} className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold uppercase text-primary border border-dashed border-primary/30 rounded-lg py-2 hover:bg-primary/5 mt-2 transition-colors">
                            <Plus size={12} /> Adicionar Item
                        </button>
                   )}
                </ul>

                <button onClick={() => toggleDetails(plan.id)} className="text-xs font-semibold text-primary hover:text-primary/80 mb-6 text-left flex items-center gap-1 transition-colors">
                    {(expandedPlanId === plan.id || editing) ? 'Ocultar detalhes' : 'Ver lista completa de serviços'}
                    {(expandedPlanId === plan.id || editing) ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                
                {(expandedPlanId === plan.id || editing) && (
                    <div className="mb-6 p-4 bg-secondary/50 rounded-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        {plan.detailedServices.map((section, idx) => (
                            <div key={idx} className="relative group/section">
                                {editing ? (
                                    <input 
                                        value={section.category}
                                        onChange={(e) => updateDetailCategory(activeTab, plan.id, idx, e.target.value)}
                                        className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-2 border-b border-primary/50 pb-1 bg-transparent w-full outline-none"
                                    />
                                ) : (
                                    <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-2 border-b border-border pb-1">{section.category}</h4>
                                )}
                                
                                <ul className="space-y-1.5 mt-2">
                                    {section.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                                            <span className="text-accent text-[10px] mt-0.5">•</span> 
                                            {editing ? (
                                                <div className="flex gap-1 flex-1">
                                                    <input 
                                                        value={item}
                                                        onChange={(e) => updateDetailItem(activeTab, plan.id, idx, itemIdx, e.target.value)}
                                                        className="bg-transparent border-b border-border w-full outline-none text-[11px] text-foreground focus:border-primary"
                                                    />
                                                    <button onClick={() => removeDetailItem(activeTab, plan.id, idx, itemIdx)} className="text-red-500">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="leading-tight">{item}</span>
                                            )}
                                        </li>
                                    ))}
                                    {editing && (
                                        <button onClick={() => addDetailItem(activeTab, plan.id, idx)} className="text-[10px] font-semibold text-primary/70 hover:text-primary flex items-center gap-1 mt-2">
                                            <Plus size={10} /> Item
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
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-colors mt-auto tracking-[0.05em] uppercase
                    ${editing ? 'opacity-20 cursor-not-allowed bg-secondary text-secondary-foreground' : 
                      plan.isPopular 
                      ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm' 
                      : 'bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
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