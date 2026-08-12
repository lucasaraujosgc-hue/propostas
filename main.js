import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Calculator, Check, X, ChevronDown, ChevronUp, Plus, Trash2, Edit3, Send, Download, Copy, FileText, CheckCircle, Clock, Smartphone, Mail, Lock } from 'lucide-react';

const DEFAULT_DATA = {
  introTemplate: "Apresentamos nossa proposta técnica para o plano **{{PLANO}}**.\n\nNa **{{EMPRESA}}**, garantimos conformidade legal absoluta e agilidade estratégica para impulsionar seu negócio.\n\nNesses valores já estão inclusos as taxas (da JUCEB) de constituição da empresa.\n\nAs taxas da Junta Comercial já estão inclusas no valor da abertura do CNPJ.",
  categories: [
    {
      id: 'Serviços',
      label: 'Serviços',
      plans: [
        {
          id: 's1', name: 'Básico', subtitle: 'Ideal para MEI', price: 50, isPopular: false,
          features: [{ text: 'Declarações MEI', included: true }, { text: 'Guia DAS automática', included: true }, { text: 'Notas ilimitadas', included: true }, { text: 'Suporte fiscal', included: true }],
          detailedServices: [{ category: 'FISCAIS / TRIBUTÁRIOS', items: ['Guia DAS-MEI mensal', 'DASN-SIMEI anual', 'Controle de faturamento', 'Orientação emissão NF-e'] }, { category: 'DEPARTAMENTO PESSOAL', items: ['Orientação previdenciária', 'Auxílio em benefícios'] }, { category: 'CONTÁBEIS', items: ['Livro caixa básico', 'Relatório mensal de receitas'] }]
        },
        {
          id: 's2', name: 'Intermediário', subtitle: 'Simples Nacional (Sem Func.)', price: 250, isPopular: false,
          features: [{ text: 'Apuração Simples Nacional', included: true }, { text: 'Pró-labore Sócios', included: true }, { text: 'Folha Funcionários', included: false }, { text: 'Lucro Presumido', included: false }],
          detailedServices: [{ category: 'FISCAIS / TRIBUTÁRIOS', items: ['Apuração mensal Simples (DAS)', 'Envio do PGDAS-D', 'Entrega da DEFIS anual', 'Classificação fiscal', 'Monitoramento faturamento', 'Orientação Notas Fiscais', 'Regularização pendências', 'Parcelamentos'] }, { category: 'DEPARTAMENTO PESSOAL', items: ['Encargos pró-labore', 'Orientação trabalhista'] }, { category: 'CONTÁBEIS', items: ['Escrituração contábil mensal', 'Balanço Patrimonial', 'DRE', 'Balancetes mensais', 'Livro Diário e Razão', 'Encerramento anual'] }]
        },
        {
          id: 's3', name: 'Intermediário 2', subtitle: 'Simples + 5 Func.', price: 519, isPopular: true,
          features: [{ text: 'Tudo do Intermediário', included: true }, { text: 'DP p/ até 5 Funcionários', included: true }, { text: 'Folha, Férias e 13º', included: true }, { text: 'Lucro Presumido', included: false }],
          detailedServices: [{ category: 'FISCAIS / TRIBUTÁRIOS', items: ['Todos itens do Intermediário', 'Apuração mensal DAS', 'PGDAS-D', 'Consultoria tributária'] }, { category: 'DEPARTAMENTO PESSOAL', items: ['Registro/admissão empregados', 'Elaboração folha pagamento', 'Cálculo pró-labore', 'Encargos Trabalhistas', 'Rescisões', 'Férias e 13º', 'eSocial, Reinf, DCTFWeb'] }, { category: 'CONTÁBEIS', items: ['Todos itens do Intermediário', 'Análise de indicadores'] }]
        }
      ]
    }
  ],
  accountant: 'Lucas Araujo dos Santos',
  crc: 'CRC/BA - 046968-O',
  officeName: 'Vírgula Contábil',
  email: 'contato@virgulacontabil.com.br',
  phone: '(71) 99999-9999',
  website: 'www.virgulacontabil.com.br'
};

const Logo = () => (
  <a href="/" className="flex items-center gap-3 select-none cursor-pointer hover:opacity-80 transition-opacity" style={{textDecoration: 'none'}}>
    <div className="flex flex-col items-center">
      <div className="flex items-baseline">
        <span className="text-2xl md:text-[28px] font-serif font-bold text-primary tracking-tight">Vírgula</span>
        <span className="text-2xl md:text-[28px] font-serif font-bold text-accent leading-none">,</span>
      </div>
      <span className="font-sans text-[10px] md:text-[11px] font-normal text-muted-foreground tracking-[0.3em] uppercase leading-none mt-0.5 ml-[0.3em]">
        Contábil
      </span>
    </div>
  </a>
);

const downloadPDF = (elementId, filename) => {
    const originalTitle = document.title;
    document.title = filename.replace('.pdf', '');
    window.print();
    setTimeout(() => {
        document.title = originalTitle;
    }, 100);
};

const renderBoldText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const ProposalDocument = ({ proposal, officeData }) => {
    const data = proposal.data;
    const plans = data.plans ? data.plans : (data.plan ? [{ ...data.plan, openingFee: data.openingFee }] : []);
    const dateStr = new Date(proposal.createdAt).toLocaleDateString('pt-BR');
    const validUntilStr = new Date(proposal.expiresAt).toLocaleDateString('pt-BR');
    const isExpired = new Date() > new Date(proposal.expiresAt);

    return (
        <div id="proposal-document" className="bg-card text-card-foreground p-7 md:p-10 proposal-container rounded-2xl relative w-full h-full text-left">
          {isExpired && (
             <div className="mb-6 p-4 bg-accent/10 text-accent border border-accent/30 rounded-xl text-sm font-semibold flex items-center gap-2 no-print">
                <Clock size={18} /> Esta proposta expirou em {validUntilStr}. Entre em contato para uma nova cotação.
             </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-2 border-primary pb-4 page-break-avoid">
            <Logo />
            <div className="text-left md:text-right mt-4 md:mt-0">
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.14em]">Proposta Preparada para</p>
              <h2 className="text-xl font-semibold text-primary leading-none mt-1">{data.clientName}</h2>
            </div>
          </div>

          <div className="mb-8 page-break-avoid">
             <div className="text-[11px] font-bold text-foreground italic mb-2">Prezado(a) {data.clientName},</div>
             <div className="text-[17px] text-foreground/90 leading-relaxed italic whitespace-pre-wrap">
                {renderBoldText(data.intro)}
             </div>
          </div>

          <div className="flex flex-col gap-6 mb-10 page-break-avoid">
             {plans.map((p, idx) => (
                 <div key={idx} className="flex flex-col sm:flex-row bg-background border-2 border-primary/20 rounded-xl overflow-hidden shadow-sm">
                     <div className="flex-1 p-5 sm:p-6 border-b sm:border-b-0 sm:border-r border-primary/20 bg-primary/5">
                         {plans.length > 1 && <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary mb-1">Opção {idx + 1}</p>}
                         <h3 className="text-2xl sm:text-3xl font-bold font-serif text-primary leading-tight">{p.name}</h3>
                         <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{p.subtitle}</p>
                         
                         <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                             {p.features.filter(f => f.included).map((f, i) => (
                                 <li key={i} className="text-[12px] flex items-center gap-1.5 text-foreground/90">
                                     <Check size={14} className="text-primary flex-shrink-0" /> <span className="leading-tight">{f.text}</span>
                                 </li>
                             ))}
                         </ul>
                     </div>
                     
                     <div className="flex flex-col w-full sm:w-56">
                         {p.fees && p.fees.filter(fee => fee.value.trim() !== '').length > 0 ? (
                             <div className="flex flex-col border-b border-primary/20 bg-card relative">
                                 <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground text-center pt-3 pb-1">Taxas de Abertura</div>
                                 {p.fees.filter(fee => fee.value.trim() !== '').map((fee, feeIdx, arr) => (
                                     <React.Fragment key={feeIdx}>
                                         <div className="p-3 flex flex-col justify-center text-center">
                                             <p className="text-[10px] font-semibold text-foreground mb-0.5 leading-tight">{fee.label || 'Taxa'}</p>
                                             <h3 className="text-[17px] font-bold text-primary">
                                                 {isNaN(fee.value) ? fee.value : `R$ ${parseFloat(fee.value).toLocaleString('pt-BR')}`}
                                             </h3>
                                         </div>
                                         {feeIdx < arr.length - 1 && (
                                             <div className="flex items-center justify-center my-0.5">
                                                 <div className="h-px bg-border flex-1"></div>
                                                 <span className="text-[9px] font-bold text-muted-foreground px-2 bg-card">OU</span>
                                                 <div className="h-px bg-border flex-1"></div>
                                             </div>
                                         )}
                                     </React.Fragment>
                                 ))}
                             </div>
                         ) : p.openingFee ? (
                             <div className="p-4 border-b border-primary/20 flex flex-col justify-center text-center bg-card">
                                 <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">Setup / Abertura</p>
                                 <h3 className="text-lg font-bold text-foreground">
                                     {isNaN(p.openingFee) ? p.openingFee : `R$ ${parseFloat(p.openingFee).toLocaleString('pt-BR')}`}
                                 </h3>
                             </div>
                         ) : null}
                         <div className="p-5 flex-1 flex flex-col justify-center text-center bg-primary text-primary-foreground">
                             <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-80 mb-1">Honorários Mensais</p>
                             <h3 className="text-3xl font-bold font-serif whitespace-nowrap">R$ {p.price.toLocaleString('pt-BR')}</h3>
                         </div>
                     </div>
                 </div>
             ))}
          </div>

          {plans.map((p, idx) => (
              <div key={p.id || idx} className="mb-10 page-break-avoid">
                {plans.length > 1 && <h4 className="text-lg font-bold text-primary font-serif mb-4 pb-2 border-b-2 border-primary/20">Detalhamento: Opção {idx + 1} - {p.name}</h4>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print-grid-3">
                  {[
                    { label: '1. FISCAIS / TRIBUTÁRIOS', key: 'FISCAIS' },
                    { label: '2. DEPARTAMENTO PESSOAL', key: 'DEPARTAMENTO' },
                    { label: '3. CONTÁBEIS', key: 'CONTÁBEIS' }
                  ].map((column) => {
                    const catData = p.detailedServices ? p.detailedServices.find(s => s.category.toUpperCase().includes(column.key)) : null;
                    const items = catData ? catData.items : [];
                    return (
                      <div key={column.key} className="page-break-avoid">
                        <h4 className="text-sm font-bold text-primary font-serif border-b-2 border-primary/20 mb-3 pb-1 uppercase tracking-tighter">
                          {column.label}
                        </h4>
                        <ul className="space-y-1.5">
                          {items.length > 0 ? items.map((item, i) => (
                            <li key={i} className="text-[13px] text-foreground/90 leading-tight flex items-start gap-1.5">
                              <span className="text-accent font-bold text-[10px] mt-0.5">•</span> 
                              <span className="flex-1">{item}</span>
                            </li>
                          )) : (
                            <li className="text-[13px] text-muted-foreground italic">Itens padrão incluídos</li>
                          )}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
          ))}

          <div className="page-break-avoid mb-8">
              <h4 className="text-lg font-bold text-primary font-serif mb-2">Próximos Passos</h4>
              <p className="text-[15px] text-foreground/90 leading-relaxed mb-4">
                  Para formalizar esta proposta e iniciarmos nossa parceria, clique no botão "Aceitar Proposta" ao final da página ou entre em contato diretamente pelos nossos canais de atendimento.
              </p>
          </div>

          <div className="mt-8 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 page-break-avoid">
             <div className="text-xs text-muted-foreground leading-relaxed italic">
                * Valores não contemplam taxas públicas, alvarás ou certificados digitais.<br/>
                * Reajuste anual pelo IGPM/FGV acumulado dos últimos 12 meses.
             </div>
             <div className="text-left md:text-right text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                Data: {dateStr} | Válida até: {validUntilStr}
             </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end page-break-avoid gap-4">
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-accent uppercase tracking-[0.14em] mb-2">Responsável Técnico</p>
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-10 bg-primary"></div>
                 <div>
                    <p className="font-bold text-sm text-foreground leading-none uppercase">{officeData.accountant}</p>
                    <p className="text-xs text-primary font-bold mt-1">{officeData.crc}</p>
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col text-left sm:text-right text-xs text-muted-foreground">
                <p className="font-semibold text-primary">{officeData.officeName}</p>
                <p>{officeData.email}</p>
                <p>{officeData.phone}</p>
                <p>{officeData.website}</p>
            </div>
          </div>
          
          {proposal.status === 'Aceita' && proposal.acceptanceData && (
              <div className="mt-8 p-6 border-2 border-primary bg-secondary/50 rounded-xl page-break-avoid relative overflow-hidden">
                  <div className="absolute top-[-20px] right-[-20px] opacity-10">
                      <CheckCircle size={120} className="text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-2 flex items-center gap-2"><CheckCircle size={20}/> Proposta Aceita Digitalmente</h4>
                  <p className="text-sm text-foreground"><strong>Aceito por:</strong> {proposal.acceptanceData.name}</p>
                  <p className="text-sm text-foreground"><strong>Data/Hora:</strong> {new Date(proposal.acceptedAt).toLocaleString('pt-BR')}</p>
                  {plans.length > 1 && proposal.acceptanceData.selectedPlanId && (
                      <p className="text-sm text-foreground font-bold mt-1">
                          <strong>Plano Escolhido:</strong> {plans.find(p => p.id === proposal.acceptanceData.selectedPlanId)?.name}
                      </p>
                  )}
                  {proposal.acceptanceData.selectedFeeLabel && (
                      <p className="text-sm text-foreground font-bold mt-1">
                          <strong>Tipo de Abertura:</strong> {proposal.acceptanceData.selectedFeeLabel}
                      </p>
                  )}
                  <p className="text-xs text-primary mt-3">ID do Aceite: {proposal.id}</p>
              </div>
          )}
        </div>
    );
};

const PublicProposal = ({ id }) => {
    const [proposal, setProposal] = useState(null);
    const [officeData, setOfficeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [acceptMode, setAcceptMode] = useState(false);
    const [clientName, setClientName] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [selectedFeeIndex, setSelectedFeeIndex] = useState(null);
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        fetch('/api/data').then(r => r.json()).then(d => {
            if(d) setOfficeData(d);
            else setOfficeData(DEFAULT_DATA);
        });

        fetch(`/api/proposals/${id}`).then(r => {
            if(!r.ok) throw new Error('Not found');
            return r.json();
        }).then(p => {
            setProposal(p);
            setLoading(false);
            if (p.status === 'Enviada') {
                fetch(`/api/proposals/${id}/view`, { method: 'POST' });
            }
        }).catch(e => {
            setLoading(false);
        });
    }, [id]);

    const handleAccept = () => {
        if(!clientName.trim()) return alert("Por favor, preencha seu nome completo.");
        
        const plans = proposal.data.plans ? proposal.data.plans : (proposal.data.plan ? [proposal.data.plan] : []);
        const activePlanId = selectedPlanId || plans[0].id;
        const activePlan = plans.find(p => p.id === activePlanId) || plans[0];
        const validFees = activePlan.fees ? activePlan.fees.filter(f => f.value.trim() !== '') : [];

        if (plans.length > 1 && !selectedPlanId) return alert("Por favor, selecione qual opção de plano deseja contratar acima.");
        if (validFees.length > 1 && selectedFeeIndex === null) return alert("Por favor, selecione qual o tipo de abertura da sua empresa.");

        setAccepting(true);
        fetch(`/api/proposals/${id}/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: clientName, 
                selectedPlanId: activePlanId,
                selectedFeeIndex: selectedFeeIndex,
                selectedFeeLabel: selectedFeeIndex !== null ? validFees[selectedFeeIndex].label : null
            })
        }).then(r => r.json()).then(() => {
            window.location.href = "https://abertura.virgulacontabil.com.br/";
        });
    };

    if(loading) return <div className="h-screen flex items-center justify-center text-primary font-bold">Carregando Proposta...</div>;
    if(!proposal || !officeData) return <div className="h-screen flex items-center justify-center text-primary font-bold">Proposta não encontrada.</div>;

    const isExpired = new Date() > new Date(proposal.expiresAt);
    const plans = proposal.data.plans ? proposal.data.plans : (proposal.data.plan ? [proposal.data.plan] : []);

    return (
        <div className="min-h-screen bg-background text-foreground py-8 px-4">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-end gap-3 no-print">
                    <button onClick={() => downloadPDF('proposal-document', `Proposta-${proposal.data.clientName}.pdf`)} className="px-5 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-xl text-sm flex items-center gap-2 justify-center hover:bg-secondary/80 transition-colors">
                        <Download size={16} /> Baixar PDF
                    </button>
                    {!isExpired && proposal.status !== 'Aceita' && (
                        <button onClick={() => setAcceptMode(true)} className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm flex items-center gap-2 justify-center shadow-sm hover:opacity-90 transition-opacity">
                            <CheckCircle size={16} /> Aceitar Proposta
                        </button>
                    )}
                </div>

                {acceptMode && (
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm mb-4 animate-in fade-in slide-in-from-top-4 no-print">
                        <h3 className="text-xl font-bold text-primary mb-2 font-serif">Confirmar Aceite</h3>
                        <p className="text-sm text-foreground/80 mb-5">Ao aceitar, você concorda com os serviços descritos nesta proposta.</p>
                        
                        {plans.length > 1 && (
                            <div className="mb-5 bg-secondary/30 p-5 rounded-xl border border-border">
                                <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-primary"/> Qual opção você deseja contratar?</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {plans.map((p, idx) => (
                                        <div 
                                            key={p.id} 
                                            onClick={() => setSelectedPlanId(p.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-center text-center ${selectedPlanId === p.id ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-background hover:border-primary/50'}`}
                                        >
                                            <p className="font-bold text-sm text-primary mb-1">Opção {idx + 1}: {p.name}</p>
                                            <p className="text-xs text-foreground font-semibold">R$ {p.price.toLocaleString('pt-BR')}/mês</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(() => {
                            const activePlanId = selectedPlanId || plans[0].id;
                            const activePlan = plans.find(p => p.id === activePlanId) || plans[0];
                            const validFees = activePlan.fees ? activePlan.fees.filter(f => f.value.trim() !== '') : [];
                            
                            if (validFees.length > 1) {
                                return (
                                    <div className="mb-5 bg-secondary/30 p-5 rounded-xl border border-border">
                                        <label className="text-sm font-bold text-foreground mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-primary"/> Qual o tipo de abertura da sua empresa?</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {validFees.map((fee, idx) => {
                                                const isIndividual = fee.label.toLowerCase().includes('individual');
                                                const isSociedade = fee.label.toLowerCase().includes('sociedade');
                                                let desc = '';
                                                if (isIndividual) desc = 'Ideal para quem vai atuar sozinho, sem sócios.';
                                                else if (isSociedade) desc = 'Ideal para quem vai abrir o negócio com um ou mais sócios.';

                                                return (
                                                    <div 
                                                        key={idx} 
                                                        onClick={() => setSelectedFeeIndex(idx)}
                                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-center text-center ${selectedFeeIndex === idx ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-background hover:border-primary/50'}`}
                                                    >
                                                        <p className="font-bold text-[13px] text-primary mb-1 leading-tight">{fee.label}</p>
                                                        <h3 className="text-lg font-bold text-foreground mb-2">R$ {parseFloat(fee.value).toLocaleString('pt-BR')}</h3>
                                                        {desc && <p className="text-[11px] text-muted-foreground leading-tight px-2">{desc}</p>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="text" 
                                placeholder="Seu nome completo" 
                                value={clientName} 
                                onChange={e => setClientName(e.target.value)}
                                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                            />
                            <button onClick={handleAccept} disabled={accepting} className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                                {accepting ? 'Confirmando...' : 'Confirmar e Assinar'}
                            </button>
                            <button onClick={() => setAcceptMode(false)} className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors">
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <div className="shadow-lg rounded-2xl overflow-hidden print:shadow-none">
                    <ProposalDocument proposal={proposal} officeData={officeData} />
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = ({ token, setToken }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState('Serviços');
  const [editing, setEditing] = useState(false);
  
  // Multi-Plan Builder state
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderData, setBuilderData] = useState({ clientName: '', fees: {} });
  
  const [proposals, setProposals] = useState([]);
  const [previewProposal, setPreviewProposal] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(savedData => {
        if (savedData) setData({...DEFAULT_DATA, ...savedData});
        setLoading(false);
      })
      .catch(() => setLoading(false));
      
    fetchProposals();
  }, []);

  const fetchProposals = () => {
      fetch('/api/proposals', { headers: { 'Authorization': `Bearer ${token}` }})
      .then(r => {
          if (r.status === 401) { setToken(null); localStorage.removeItem('admin_token'); throw new Error('Unauthorized'); }
          return r.json();
      })
      .then(p => setProposals(p))
      .catch(e => console.error(e));
  };

  useEffect(() => {
    if (!loading && token) {
      fetch('/api/save', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
          body: JSON.stringify(data) 
      });
    }
  }, [data]);

  const updateData = (updater) => setData(prev => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater });
  
  const updateCategoryLabel = (index, newLabel) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData.categories[index].label = newLabel;
    newData.categories[index].id = newLabel;
    if (activeTab === data.categories[index].id) setActiveTab(newLabel);
    setData(newData);
  };

  const modifyPlan = (categoryId, planId, modifier) => {
    const newData = {...data};
    const catIndex = newData.categories.findIndex(c => c.id === categoryId);
    if (catIndex > -1) {
        const planIndex = newData.categories[catIndex].plans.findIndex(p => p.id === planId);
        if (planIndex > -1) {
            modifier(newData.categories[catIndex].plans[planIndex]);
            setData(newData);
        }
    }
  };

  const togglePlanSelection = (plan) => {
      if (selectedPlans.some(p => p.id === plan.id)) {
          setSelectedPlans(selectedPlans.filter(p => p.id !== plan.id));
      } else {
          if (selectedPlans.length >= 2) return alert("Você pode selecionar no máximo 2 opções para a mesma proposta.");
          setSelectedPlans([...selectedPlans, plan]);
      }
  };

  const handleContract = () => {
    if(!builderData.clientName.trim()) {
        alert("Preencha o nome do cliente/empresa.");
        return;
    }

    const template = data.introTemplate || DEFAULT_DATA.introTemplate;
    const intro = template
        .replace('{{PLANO}}', selectedPlans.map(p => p.name).join(' / '))
        .replace('{{EMPRESA}}', data.officeName);
    
    const plansPayload = selectedPlans.map(p => ({
        ...p,
        fees: builderData.fees[p.id] || [{ label: 'Taxa de Abertura', value: '' }]
    }));

    const proposalPayload = {
        clientName: builderData.clientName,
        plans: plansPayload,
        intro: intro
    };

    fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ data: proposalPayload })
    }).then(r => {
        if (r.status === 401) { setToken(null); localStorage.removeItem('admin_token'); throw new Error('Unauthorized'); }
        return r.json();
    }).then(res => {
        fetchProposals();
        setActiveTab('Propostas');
        setShowBuilder(false);
        setSelectedPlans([]);
        setBuilderData({ clientName: '', fees: {} });
        
        const newlyCreated = {
            id: res.id,
            status: 'Enviada',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            data: proposalPayload
        };
        setPreviewProposal(newlyCreated);
    }).catch(e => console.error(e));
  };

  if (loading) return <div className="p-20 text-center text-primary font-bold">Iniciando Sistema...</div>;

  const currentCategory = data.categories.find(c => c.id === activeTab);

  const getProposalLink = (id) => `${window.location.origin}/proposta/${id}`;
  
  const handleWhatsApp = (p) => {
      const link = getProposalLink(p.id);
      const planNames = p.data.plans ? p.data.plans.map(pl => pl.name).join(' e ') : p.data.plan?.name;
      const msg = `Olá! Preparamos a sua proposta comercial (${planNames}). Acesse o link para visualizar e dar o aceite digital: ${link}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };
  
  const handleEmail = (p) => {
      const link = getProposalLink(p.id);
      const subject = `Proposta Comercial - ${p.data.clientName}`;
      const planNames = p.data.plans ? p.data.plans.map(pl => pl.name).join(' e ') : p.data.plan?.name;
      const body = `Olá,\n\nSegue o link para a sua proposta comercial (${planNames}):\n${link}\n\nAtenciosamente,\n${data.officeName}`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const newWindow = window.open(mailtoLink, '_blank');
      if (!newWindow) window.location.href = mailtoLink;
  };

  if (previewProposal) {
      return (
          <div className="min-h-screen bg-background flex flex-col items-center">
              <div className="w-full bg-card border-b border-border sticky top-0 z-20 py-4 shadow-sm">
                  <div className="max-w-4xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4">
                      <button onClick={() => setPreviewProposal(null)} className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-xl text-sm flex items-center gap-2 hover:bg-secondary/80">
                          Voltar
                      </button>
                      <div className="flex gap-2 flex-wrap justify-center">
                          <button onClick={() => {navigator.clipboard.writeText(getProposalLink(previewProposal.id)); alert('Link copiado!');}} className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-xl text-sm flex items-center gap-2 hover:bg-secondary/80">
                              <Copy size={16} /> Link Único
                          </button>
                          <button onClick={() => handleWhatsApp(previewProposal)} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition-colors">
                              <Smartphone size={16} /> WhatsApp
                          </button>
                          <button onClick={() => handleEmail(previewProposal)} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-sm flex items-center gap-2 hover:opacity-90">
                              <Mail size={16} /> E-mail
                          </button>
                          <button onClick={() => downloadPDF('proposal-document', `Proposta-${previewProposal.data.clientName}.pdf`)} className="px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-xl text-sm flex items-center gap-2 hover:opacity-90">
                              <Download size={16} /> PDF
                          </button>
                      </div>
                  </div>
              </div>
              <div className="max-w-4xl w-full p-4 md:p-8">
                  <ProposalDocument proposal={previewProposal} officeData={data} />
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* Modal Construtor de Propostas Multi-planos */}
      {showBuilder && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                      <h3 className="text-xl font-bold text-primary font-serif">Configurar Nova Proposta</h3>
                      <button onClick={() => setShowBuilder(false)} className="text-muted-foreground hover:text-foreground"><X size={20}/></button>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                      <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">Nome do Cliente / Empresa</label>
                          <input 
                              value={builderData.clientName} 
                              onChange={e => setBuilderData({...builderData, clientName: e.target.value})} 
                              placeholder="Ex: Restaurante Porto Rico LTDA" 
                              className="w-full bg-background border border-border rounded-xl px-4 py-4 text-base focus:border-primary outline-none text-foreground" 
                          />
                      </div>
                      <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3 block">Planos Selecionados e Taxas de Abertura</label>
                          <div className="flex flex-col gap-3">
                              {selectedPlans.map((p, idx) => {
                                  const planFees = builderData.fees[p.id] || [{ label: 'Taxa de Abertura', value: '' }];
                                  return (
                                      <div key={p.id} className="flex flex-col gap-3 bg-background p-4 rounded-xl border border-border">
                                          <div className="flex items-center justify-between">
                                              <div>
                                                  <p className="font-bold text-sm text-foreground">Opção {idx + 1}: {p.name}</p>
                                                  <p className="text-xs text-muted-foreground">R$ {p.price.toLocaleString('pt-BR')}/mês</p>
                                              </div>
                                              <button onClick={() => {
                                                  const currentFees = builderData.fees[p.id] || [{ label: 'Taxa de Abertura', value: '' }];
                                                  setBuilderData({...builderData, fees: {...builderData.fees, [p.id]: [...currentFees, { label: '', value: '' }]}});
                                              }} className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 flex items-center gap-1">
                                                  <Plus size={12}/> Nova Taxa
                                              </button>
                                          </div>
                                          
                                          <div className="flex flex-col gap-2 mt-2 border-t border-border/50 pt-3">
                                              {planFees.map((fee, feeIdx) => (
                                                  <div key={feeIdx} className="flex items-center gap-2">
                                                      <input 
                                                          value={fee.label} 
                                                          onChange={e => {
                                                              const newFees = [...planFees];
                                                              newFees[feeIdx].label = e.target.value;
                                                              setBuilderData({...builderData, fees: {...builderData.fees, [p.id]: newFees}});
                                                          }}
                                                          placeholder="Nome da taxa (ex: Abertura individual)" 
                                                          className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-foreground" 
                                                      />
                                                      <input 
                                                          value={fee.value} 
                                                          onChange={e => {
                                                              const newFees = [...planFees];
                                                              newFees[feeIdx].value = e.target.value;
                                                              setBuilderData({...builderData, fees: {...builderData.fees, [p.id]: newFees}});
                                                          }}
                                                          placeholder="Valor" 
                                                          className="w-32 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-foreground" 
                                                      />
                                                      <button onClick={() => {
                                                          const newFees = planFees.filter((_, i) => i !== feeIdx);
                                                          setBuilderData({...builderData, fees: {...builderData.fees, [p.id]: newFees}});
                                                      }} className="text-accent hover:text-accent/80 p-2">
                                                          <Trash2 size={16} />
                                                      </button>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  </div>
                  <div className="p-6 border-t border-border bg-secondary/30 flex justify-end gap-3">
                      <button onClick={() => setShowBuilder(false)} className="px-6 py-2.5 bg-background border border-border text-foreground font-semibold rounded-xl hover:bg-secondary transition-colors">Cancelar</button>
                      <button onClick={handleContract} className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 flex items-center gap-2 transition-opacity">
                          <Send size={16}/> Gerar Link da Proposta
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Floating Action Bar */}
      {selectedPlans.length > 0 && !editing && activeTab !== 'Propostas' && !previewProposal && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur border-t border-border z-40 flex justify-center animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4 bg-card px-6 py-4 rounded-2xl shadow-lg border border-primary/20">
                  <span className="font-bold text-sm text-foreground">{selectedPlans.length} opção(ões) selecionada(s)</span>
                  <button onClick={() => setShowBuilder(true)} className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
                      Configurar Proposta
                  </button>
              </div>
          </div>
      )}

      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/85 backdrop-blur py-4 mb-8">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo />
          <div className="flex gap-3">
              <button onClick={() => { localStorage.removeItem('admin_token'); setToken(null); }} className="px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase transition-all flex items-center gap-2 text-muted-foreground hover:bg-secondary">
                  Sair
              </button>
              <button onClick={() => setEditing(!editing)} className={`px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase transition-all flex items-center gap-2 ${editing ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                {editing ? '💾 SALVAR ALTERAÇÕES' : '⚙️ CONFIGURAR DADOS'}
              </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 md:px-8 pb-12">
        {editing && (
            <div className="bg-card border border-border rounded-2xl p-7 md:p-10 mb-8 flex flex-col gap-4 shadow-sm animate-in fade-in">
                <h3 className="text-xl font-bold text-primary font-serif mb-2">Dados do Escritório</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">Nome da Empresa</label>
                        <input value={data.officeName} onChange={e => updateData({officeName: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">Responsável Técnico</label>
                        <input value={data.accountant} onChange={e => updateData({accountant: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">CRC</label>
                        <input value={data.crc} onChange={e => updateData({crc: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">E-mail</label>
                        <input value={data.email || ''} onChange={e => updateData({email: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">Telefone / WhatsApp</label>
                        <input value={data.phone || ''} onChange={e => updateData({phone: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">Site</label>
                        <input value={data.website || ''} onChange={e => updateData({website: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none" />
                    </div>
                </div>
                
                <div className="w-full border-t border-border pt-4 mt-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block flex items-center gap-2">
                        <Edit3 size={12} /> Modelo de Texto da Proposta (Padrão)
                    </label>
                    <textarea 
                        value={data.introTemplate || DEFAULT_DATA.introTemplate}
                        onChange={(e) => updateData(prev => ({...prev, introTemplate: e.target.value}))}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary outline-none min-h-[80px]"
                        placeholder="Use {{PLANO}} para o nome do plano e {{EMPRESA}} para o nome da contabilidade."
                    />
                    <p className="text-[9px] text-muted-foreground mt-1 opacity-60">Variáveis disponíveis: {'{{PLANO}}'}, {'{{EMPRESA}}'}</p>
                </div>
            </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-8 flex flex-col shadow-sm">
          <div className="flex gap-3 w-full justify-start md:justify-start flex-wrap overflow-x-auto pb-1">
            {data.categories.map((cat, idx) => (
              editing ? (
                 <input 
                    key={idx}
                    value={cat.label}
                    onChange={(e) => updateCategoryLabel(idx, e.target.value)}
                    className="px-4 py-3 rounded-xl text-[11px] font-bold uppercase bg-secondary text-secondary-foreground border border-primary focus:outline-none w-32 text-center"
                 />
              ) : (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`px-6 py-3 rounded-xl text-[11px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === cat.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>{cat.label}</button>
              )
            ))}
            {!editing && (
                <button onClick={() => {setActiveTab('Propostas'); fetchProposals();}} className={`px-6 py-3 rounded-xl text-[11px] font-bold uppercase transition-all whitespace-nowrap ml-auto ${activeTab === 'Propostas' ? 'bg-accent text-accent-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>Propostas Enviadas</button>
            )}
          </div>
        </div>

        {activeTab === 'Propostas' ? (
          <div className="max-w-5xl mx-auto space-y-4">
            {proposals.length > 0 ? proposals.map(p => {
                const pPlans = p.data.plans ? p.data.plans : (p.data.plan ? [p.data.plan] : []);
                const planNames = pPlans.map(pl => pl.name).join(' ou ');
                
                return (
                  <div key={p.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-primary/40 transition-all shadow-sm">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                          <p className="text-lg font-bold text-foreground">{p.data.clientName}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                              ${p.status === 'Aceita' ? 'bg-secondary text-primary' : 
                                p.status === 'Visualizada' ? 'bg-secondary text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                              {p.status}
                          </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-widest">
                        ID: {p.id} • {new Date(p.createdAt).toLocaleDateString('pt-BR')} • {planNames}
                      </p>
                      {p.status === 'Aceita' && (
                          <p className="text-[11px] text-primary font-semibold mt-2">
                              Aceito por: {p.acceptanceData && p.acceptanceData.name} em {new Date(p.acceptedAt).toLocaleString('pt-BR')}
                              {pPlans.length > 1 && p.acceptanceData && p.acceptanceData.selectedPlanId && (
                                  <span className="block mt-0.5 text-accent font-bold">
                                      Plano Escolhido: {pPlans.find(pl => pl.id === p.acceptanceData.selectedPlanId)?.name}
                                  </span>
                              )}
                              {p.acceptanceData && p.acceptanceData.selectedFeeLabel && (
                                  <span className="block mt-0.5 text-accent font-bold">
                                      Tipo de Abertura: {p.acceptanceData.selectedFeeLabel}
                                  </span>
                              )}
                          </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setPreviewProposal(p)} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-[10px] font-bold uppercase hover:bg-secondary/80 transition-all flex items-center gap-1">
                          <FileText size={14}/> Ver Detalhes
                      </button>
                      <button onClick={() => {navigator.clipboard.writeText(getProposalLink(p.id)); alert('Link copiado!');}} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-[10px] font-bold uppercase hover:bg-secondary/80 transition-all flex items-center gap-1">
                          <Copy size={14}/> Copiar Link
                      </button>
                    </div>
                  </div>
                )
            }) : <div className="text-center p-16 text-muted-foreground text-xs uppercase font-bold border border-dashed border-border rounded-2xl">Nenhuma proposta gerada ainda.</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {(currentCategory ? currentCategory.plans : []).map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-card border rounded-2xl p-7 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden group shadow-sm ${plan.isPopular ? 'border-primary ring-1 ring-primary/20 hover:shadow-primary/10' : 'border-border hover:border-primary/50'} ${selectedPlans.some(p => p.id === plan.id) ? 'ring-2 ring-accent border-accent bg-accent/5' : ''}`}
              >
                {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold px-3 py-1 rounded-bl-xl tracking-wider">POPULAR</div>
                )}
                
                <div className="mb-6">
                  {editing ? (
                    <div className="space-y-1">
                        <input value={plan.name} onChange={(e) => modifyPlan(activeTab, plan.id, p => p.name = e.target.value)} className="bg-transparent border-b border-border text-foreground font-bold text-2xl w-full outline-none focus:border-primary font-serif" placeholder="Nome do Plano" />
                        <input value={plan.subtitle} onChange={(e) => modifyPlan(activeTab, plan.id, p => p.subtitle = e.target.value)} className="bg-transparent border-b border-border text-muted-foreground text-xs uppercase tracking-[0.14em] font-semibold w-full outline-none focus:border-primary mt-2" placeholder="Subtítulo" />
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
                            <input type="number" value={plan.price} onChange={(e) => modifyPlan(activeTab, plan.id, p => p.price = e.target.value)} className="bg-secondary text-foreground font-bold text-xl w-24 px-2 py-1 rounded focus:bg-secondary/80 outline-none border border-primary" />
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
                                <button onClick={() => modifyPlan(activeTab, plan.id, p => p.features[i].included = !f.included)} className="cursor-pointer">
                                    {f.included ? <Check size={16} className="text-primary" /> : <X size={16} className="text-accent" />}
                                </button>
                                <input value={f.text} onChange={(e) => modifyPlan(activeTab, plan.id, p => p.features[i].text = e.target.value)} className="bg-transparent border-b border-border text-[13px] text-foreground flex-1 outline-none py-0.5 focus:border-primary" />
                                <button onClick={() => modifyPlan(activeTab, plan.id, p => p.features.splice(i, 1))} className="text-accent hover:text-accent/80">
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
                        <button onClick={() => modifyPlan(activeTab, plan.id, p => p.features.push({text:'Novo', included: true}))} className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold uppercase text-primary border border-dashed border-primary/30 rounded-lg py-2 hover:bg-primary/5 mt-2 transition-colors">
                            <Plus size={12} /> Adicionar Item
                        </button>
                   )}
                </ul>
                
                <div className="mt-auto pt-4">
                    {editing ? (
                        <button disabled className="w-full py-3 rounded-xl font-bold text-sm transition-colors tracking-[0.05em] uppercase opacity-20 cursor-not-allowed bg-secondary text-secondary-foreground">
                          Em Edição
                        </button>
                    ) : (
                        <button 
                            onClick={() => togglePlanSelection(plan)} 
                            className={`w-full py-3 rounded-xl font-bold text-sm transition-colors tracking-[0.05em] uppercase border-2 ${
                                selectedPlans.some(p => p.id === plan.id) 
                                ? 'bg-accent border-accent text-accent-foreground shadow-inner' 
                                : plan.isPopular 
                                    ? 'bg-primary border-primary text-primary-foreground hover:opacity-90 shadow-sm' 
                                    : 'bg-card border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                            }`}
                        >
                          {selectedPlans.some(p => p.id === plan.id) ? 'Selecionado ✓' : 'Adicionar à Proposta'}
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const AdminApp = () => {
    const [token, setToken] = useState(localStorage.getItem('admin_token'));
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = () => {
        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: loginPassword })
        }).then(r => r.json()).then(d => {
            if (d.token) {
                localStorage.setItem('admin_token', d.token);
                setToken(d.token);
            } else {
                setLoginError('Senha incorreta.');
            }
        }).catch(() => setLoginError('Erro de conexão.'));
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm bg-card border border-border p-8 rounded-2xl shadow-sm text-center animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-center mb-6"><Logo /></div>
                    <div className="mb-6 flex justify-center"><div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary"><Lock size={20}/></div></div>
                    <h2 className="text-xl font-bold text-primary font-serif mb-2">Acesso Restrito</h2>
                    <p className="text-sm text-muted-foreground mb-6">Digite a senha para acessar o gerador de propostas.</p>
                    
                    {loginError && <p className="text-accent text-sm mb-4 font-semibold">{loginError}</p>}
                    
                    <input 
                        type="password" 
                        value={loginPassword} 
                        onChange={e => setLoginPassword(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        placeholder="Sua senha..." 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none mb-4 text-center text-foreground"
                    />
                    <button onClick={handleLogin} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">
                        Acessar Sistema
                    </button>
                </div>
            </div>
        );
    }

    return <AdminDashboard token={token} setToken={setToken} />;
};

const Main = () => {
    const path = window.location.pathname;
    if (path.startsWith('/proposta/')) {
        const id = path.split('/')[2];
        return <PublicProposal id={id} />;
    }
    return <AdminApp />;
};

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
