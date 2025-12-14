import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export function AIAssistantView() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = {
            role: 'user',
            content: input,
            id: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        // Mock AI response for demo - will be replaced with actual API
        setTimeout(() => {
            const mockResponses = {
                'maliyet': 'Maliyet hesaplaması için önce bir ürün seçmeniz gerekiyor. Maliyet/Teklif sekmesinden ürünü seçip, hammadde maliyeti ve işçilik saatini girebilirsiniz. Sistem otomatik olarak genel giderleri ve kar marjını ekleyerek önerilen satış fiyatını hesaplayacaktır.',
                'teklif': 'Teklif oluşturmak için: 1) Maliyet/Teklif sekmesinden ürünleri seçin ve sepete ekleyin. 2) Sepetteki teklif numarasını özelleştirebilirsiniz. 3) "Teklifi Tamamla" butonuna tıklayın. 4) Firma ve yetkili kişi bilgilerini doldurun. 5) Teklif numarası ve versiyonu otomatik oluşturulur veya özelleştirebilirsiniz.',
                'firma': 'Yeni firma eklemek için Firmalar sekmesine gidin ve "Yeni Firma Ekle" butonuna tıklayın. Firma bilgilerini ve yetkili kişileri ekleyebilirsiniz. Bir firmaya birden fazla yetkili kişi tanımlayabilirsiniz.',
                'ürün': 'Yeni ürün eklemek için Ürünler sekmesine gidin. "Manuel Ürün Ekle" ile sadece ürün kodu, adı ve notlar girerek hızlıca ürün ekleyebilirsiniz. Default ürünlerden farklı özelliklere sahip ürünler için notlar bölümünü kullanabilirsiniz.',
                'versiyon': 'Teklif versiyonları otomatik olarak yönetilir. Bir teklifi düzenlediğinizde versiyon otomatik olarak artırılır (v1.0 → v1.1 → v2.0). Versiyon numarasını manuel olarak da değiştirebilirsiniz.',
                'email': 'Teklif Arşivi\'nden PDF veya Word olarak export edebilirsiniz. Yakında email gönderimi özelliği eklenecek. Şu an için export edip manuel olarak gönderebilirsiniz.'
            };

            let response = 'Merhaba! Size nasıl yardımcı olabilirim? Maliyet hesaplama, teklif oluşturma, firma yönetimi veya ürün ekleme konularında sorularınızı cevaplayabilirim.';

            const lowerInput = currentInput.toLowerCase();
            for (const [key, value] of Object.entries(mockResponses)) {
                if (lowerInput.includes(key)) {
                    response = value;
                    break;
                }
            }

            const aiMessage = {
                role: 'assistant',
                content: response,
                id: Date.now() + 1,
            };

            setMessages((prev) => [...prev, aiMessage]);
            setLoading(false);
        }, 1000);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ background: 'hsl(var(--color-accent))', padding: '0.75rem', borderRadius: '12px' }}>
                        <Sparkles size={28} color="black" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>AI Teklif Asistanı</h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'hsl(var(--color-text-secondary))' }}>
                            Tekliflendirme sürecinizde size yardımcı olmak için buradayım
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                                <div style={{ background: 'hsl(var(--color-accent))', width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <Bot size={40} color="black" />
                                </div>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Merhaba! 👋</h3>
                                <p style={{ color: 'hsl(var(--color-text-secondary))', lineHeight: 1.6 }}>
                                    Size tekliflendirme sürecinizde yardımcı olabilirim. Maliyet hesaplama, teklif oluşturma,
                                    firma yönetimi veya ürün ekleme konularında sorularınızı sorabilirsiniz.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '2rem' }}>
                                    {[
                                        'Nasıl maliyet hesaplanır?',
                                        'Teklif nasıl oluşturulur?',
                                        'Yeni firma nasıl eklenir?',
                                        'Versiyon sistemi nasıl çalışır?'
                                    ].map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInput(suggestion)}
                                            style={{
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(255,255,255,0.1)';
                                                e.target.style.borderColor = 'hsl(var(--color-accent))';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(255,255,255,0.05)';
                                                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                            }}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                {message.role === 'assistant' && (
                                    <div style={{ background: 'hsl(var(--color-accent))', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Bot size={24} color="black" />
                                    </div>
                                )}
                                <div
                                    style={{
                                        maxWidth: '70%',
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        background: message.role === 'user'
                                            ? 'hsl(var(--color-accent))'
                                            : 'rgba(255,255,255,0.05)',
                                        color: message.role === 'user' ? 'black' : 'white',
                                        border: message.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    }}
                                >
                                    <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                        {message.content}
                                    </p>
                                </div>
                                {message.role === 'user' && (
                                    <div style={{ background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <User size={24} color="white" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {loading && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ background: 'hsl(var(--color-accent))', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={24} color="black" />
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <p style={{ margin: 0, color: 'hsl(var(--color-text-muted))' }}>Düşünüyorum...</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem' }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Sorunuzu yazın..."
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '1rem',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'hsl(var(--color-accent))',
                                border: 'none',
                                borderRadius: '10px',
                                color: 'black',
                                fontWeight: 'bold',
                                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                                opacity: loading || !input.trim() ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <Send size={20} />
                            Gönder
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
