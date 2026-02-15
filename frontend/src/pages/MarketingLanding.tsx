import { useState } from 'react'
import { ChevronDown, Sparkles, Calendar, Bell, MessageCircle, RefreshCw, BarChart3, Check } from 'lucide-react'

export default function MarketingLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentLang, setCurrentLang] = useState<'en' | 'ru' | 'pl'>('en')

  const content = {
    en: {
      nav: { login: 'Log In', signup: 'Sign Up' },
      hero: {
        title: 'Your AI Receptionist',
        subtitle: 'Never Miss a Booking Again',
        description: 'SlotMe transforms your salon with an intelligent virtual assistant that handles bookings 24/7 across WhatsApp, Messenger, voice, and SMS.',
        cta: 'Get Started Free',
        ctaAlt: 'Watch Demo'
      },
      features: {
        title: 'Everything Your Salon Needs',
        subtitle: 'Powerful features designed for modern beauty businesses',
        items: [
          { title: 'AI Conversational Booking', desc: 'Natural language booking via WhatsApp, Messenger, voice calls, and SMS' },
          { title: 'Smart Calendar Management', desc: 'Intelligent scheduling prevents double-bookings and optimizes your time' },
          { title: 'Automated Reminders', desc: 'Reduce no-shows with personalized SMS and messaging reminders' },
          { title: 'Multi-Channel Support', desc: 'Meet clients on their preferred platform - all managed in one place' },
          { title: 'Intelligent Slot Rearrangement', desc: 'Automatically fill cancelled slots by reaching out to waitlisted clients' },
          { title: 'Business Analytics', desc: 'Track bookings, revenue, and client trends with real-time dashboards' }
        ]
      },
      howItWorks: {
        title: 'Simple Setup, Powerful Results',
        steps: [
          { title: 'Configure Your Salon', desc: 'Add your services, staff schedules, and business hours in minutes' },
          { title: 'Connect Your Channels', desc: 'Link WhatsApp, Messenger, and phone numbers to your SlotMe assistant' },
          { title: 'AI Takes Over', desc: 'Your virtual receptionist starts handling bookings automatically' },
          { title: 'Monitor & Grow', desc: 'Track everything from your dashboard and watch your business thrive' }
        ]
      },
      benefits: {
        title: 'Transform Your Salon',
        stats: [
          { value: '2-4 hours', label: 'Saved per day on admin tasks' },
          { value: '40%+', label: 'More cancelled slots filled' },
          { value: '24/7', label: 'Availability for bookings' },
          { value: '60%', label: 'Reduction in no-shows' }
        ]
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          { q: 'What is SlotMe?', a: 'SlotMe is an AI-powered virtual receptionist for beauty salons. It handles appointment bookings, reminders, and customer communications across multiple channels automatically.' },
          { q: 'How does the AI booking work?', a: 'Clients can book appointments using natural language via WhatsApp, Messenger, SMS, or voice calls. Our AI understands their requests, checks availability, and confirms bookings instantly.' },
          { q: 'Which messaging channels are supported?', a: 'SlotMe supports WhatsApp, Facebook Messenger, SMS, and voice calls. All conversations are managed from a single dashboard.' },
          { q: 'How much does it cost?', a: 'We offer flexible pricing plans starting with a free tier for small salons. Contact us or sign up to see detailed pricing options.' },
          { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade encryption and comply with GDPR and international data protection standards. Your salon and client data is always protected.' }
        ]
      },
      cta: {
        title: 'Ready to Transform Your Salon?',
        subtitle: 'Join hundreds of salons already using SlotMe',
        button: 'Start Free Trial'
      },
      footer: {
        tagline: 'AI-powered booking for modern salons',
        links: ['Features', 'How It Works', 'FAQ', 'Pricing'],
        legal: ['Privacy Policy', 'Terms of Service'],
        contact: 'support@slotme.ai'
      }
    },
    ru: {
      nav: { login: 'Войти', signup: 'Регистрация' },
      hero: {
        title: 'Ваш AI Администратор',
        subtitle: 'Больше Никаких Пропущенных Записей',
        description: 'SlotMe преображает ваш салон с интеллектуальным виртуальным ассистентом, который обрабатывает записи 24/7 через WhatsApp, Messenger, голосовые звонки и SMS.',
        cta: 'Начать Бесплатно',
        ctaAlt: 'Смотреть Демо'
      },
      features: {
        title: 'Всё Что Нужно Вашему Салону',
        subtitle: 'Мощные функции для современного бизнеса красоты',
        items: [
          { title: 'AI Диалоговая Запись', desc: 'Естественная запись через WhatsApp, Messenger, голосовые звонки и SMS' },
          { title: 'Умное Управление Календарём', desc: 'Интеллектуальное планирование предотвращает двойные записи и оптимизирует время' },
          { title: 'Автоматические Напоминания', desc: 'Уменьшайте пропуски с персонализированными SMS и сообщениями' },
          { title: 'Мультиканальная Поддержка', desc: 'Встречайте клиентов на их любимой платформе - всё в одном месте' },
          { title: 'Умная Перестановка Слотов', desc: 'Автоматически заполняйте отменённые слоты, связываясь с клиентами из листа ожидания' },
          { title: 'Бизнес Аналитика', desc: 'Отслеживайте записи, доход и тренды клиентов в реальном времени' }
        ]
      },
      howItWorks: {
        title: 'Простая Настройка, Мощные Результаты',
        steps: [
          { title: 'Настройте Салон', desc: 'Добавьте услуги, расписание сотрудников и часы работы за минуты' },
          { title: 'Подключите Каналы', desc: 'Свяжите WhatsApp, Messenger и номера телефонов с вашим SlotMe ассистентом' },
          { title: 'AI Берёт Управление', desc: 'Ваш виртуальный администратор начинает обрабатывать записи автоматически' },
          { title: 'Мониторинг и Рост', desc: 'Отслеживайте всё с панели управления и наблюдайте, как растёт ваш бизнес' }
        ]
      },
      benefits: {
        title: 'Преобразите Ваш Салон',
        stats: [
          { value: '2-4 часа', label: 'Экономии времени в день' },
          { value: '40%+', label: 'Больше заполненных слотов' },
          { value: '24/7', label: 'Доступность записи' },
          { value: '60%', label: 'Снижение пропусков' }
        ]
      },
      faq: {
        title: 'Часто Задаваемые Вопросы',
        items: [
          { q: 'Что такое SlotMe?', a: 'SlotMe - это виртуальный администратор на основе AI для салонов красоты. Он автоматически обрабатывает записи, напоминания и общение с клиентами через различные каналы.' },
          { q: 'Как работает AI запись?', a: 'Клиенты могут записываться используя естественный язык через WhatsApp, Messenger, SMS или голосовые звонки. Наш AI понимает их запросы, проверяет доступность и подтверждает записи мгновенно.' },
          { q: 'Какие каналы сообщений поддерживаются?', a: 'SlotMe поддерживает WhatsApp, Facebook Messenger, SMS и голосовые звонки. Все разговоры управляются с одной панели.' },
          { q: 'Сколько это стоит?', a: 'Мы предлагаем гибкие тарифные планы, начиная с бесплатного для небольших салонов. Свяжитесь с нами или зарегистрируйтесь для подробной информации о ценах.' },
          { q: 'Безопасны ли мои данные?', a: 'Абсолютно. Мы используем шифрование корпоративного уровня и соответствуем GDPR и международным стандартам защиты данных. Данные вашего салона и клиентов всегда защищены.' }
        ]
      },
      cta: {
        title: 'Готовы Преобразить Ваш Салон?',
        subtitle: 'Присоединяйтесь к сотням салонов, уже использующих SlotMe',
        button: 'Начать Бесплатный Период'
      },
      footer: {
        tagline: 'AI-запись для современных салонов',
        links: ['Функции', 'Как Это Работает', 'FAQ', 'Цены'],
        legal: ['Политика Конфиденциальности', 'Условия Использования'],
        contact: 'support@slotme.ai'
      }
    },
    pl: {
      nav: { login: 'Zaloguj się', signup: 'Rejestracja' },
      hero: {
        title: 'Twoja AI Recepcjonistka',
        subtitle: 'Nigdy Więcej Nie Przegap Rezerwacji',
        description: 'SlotMe przekształca Twój salon dzięki inteligentnemu wirtualnemu asystentowi, który obsługuje rezerwacje 24/7 przez WhatsApp, Messenger, telefon i SMS.',
        cta: 'Rozpocznij Za Darmo',
        ctaAlt: 'Zobacz Demo'
      },
      features: {
        title: 'Wszystko Czego Potrzebuje Twój Salon',
        subtitle: 'Potężne funkcje zaprojektowane dla nowoczesnych salonów',
        items: [
          { title: 'AI Rezerwacja Konwersacyjna', desc: 'Naturalna rezerwacja przez WhatsApp, Messenger, telefon i SMS' },
          { title: 'Inteligentne Zarządzanie Kalendarzem', desc: 'Inteligentne planowanie zapobiega podwójnym rezerwacjom i optymalizuje czas' },
          { title: 'Automatyczne Przypomnienia', desc: 'Zmniejsz absencje dzięki spersonalizowanym SMS-om i wiadomościom' },
          { title: 'Wsparcie Wielokanałowe', desc: 'Spotykaj klientów na ich ulubionej platformie - wszystko w jednym miejscu' },
          { title: 'Inteligentne Przenoszenie Terminów', desc: 'Automatycznie wypełniaj anulowane terminy kontaktując się z klientami z listy oczekujących' },
          { title: 'Analityka Biznesowa', desc: 'Śledź rezerwacje, przychody i trendy klientów z pulpitami w czasie rzeczywistym' }
        ]
      },
      howItWorks: {
        title: 'Prosta Konfiguracja, Potężne Rezultaty',
        steps: [
          { title: 'Skonfiguruj Salon', desc: 'Dodaj swoje usługi, harmonogramy personelu i godziny pracy w minuty' },
          { title: 'Połącz Kanały', desc: 'Połącz WhatsApp, Messenger i numery telefonów z Twoim asystentem SlotMe' },
          { title: 'AI Przejmuje Kontrolę', desc: 'Twoja wirtualna recepcjonistka zaczyna obsługiwać rezerwacje automatycznie' },
          { title: 'Monitoruj i Rozwijaj', desc: 'Śledź wszystko z pulpitu i obserwuj rozwój swojego biznesu' }
        ]
      },
      benefits: {
        title: 'Przekształć Swój Salon',
        stats: [
          { value: '2-4 godziny', label: 'Zaoszczędzone dziennie na zadaniach' },
          { value: '40%+', label: 'Więcej wypełnionych terminów' },
          { value: '24/7', label: 'Dostępność rezerwacji' },
          { value: '60%', label: 'Redukcja absencji' }
        ]
      },
      faq: {
        title: 'Najczęściej Zadawane Pytania',
        items: [
          { q: 'Czym jest SlotMe?', a: 'SlotMe to wirtualna recepcjonistka oparta na AI dla salonów piękności. Automatycznie obsługuje rezerwacje, przypomnienia i komunikację z klientami przez wiele kanałów.' },
          { q: 'Jak działa rezerwacja AI?', a: 'Klienci mogą rezerwować terminy używając naturalnego języka przez WhatsApp, Messenger, SMS lub telefon. Nasza AI rozumie ich prośby, sprawdza dostępność i potwierdza rezerwacje natychmiast.' },
          { q: 'Które kanały wiadomości są wspierane?', a: 'SlotMe wspiera WhatsApp, Facebook Messenger, SMS i połączenia głosowe. Wszystkie rozmowy są zarządzane z jednego pulpitu.' },
          { q: 'Ile to kosztuje?', a: 'Oferujemy elastyczne plany cenowe zaczynając od darmowego dla małych salonów. Skontaktuj się z nami lub zarejestruj się, aby zobaczyć szczegółowe opcje cenowe.' },
          { q: 'Czy moje dane są bezpieczne?', a: 'Absolutnie. Używamy szyfrowania klasy korporacyjnej i przestrzegamy GDPR oraz międzynarodowych standardów ochrony danych. Dane Twojego salonu i klientów są zawsze chronione.' }
        ]
      },
      cta: {
        title: 'Gotowy Przekształcić Swój Salon?',
        subtitle: 'Dołącz do setek salonów już używających SlotMe',
        button: 'Rozpocznij Darmowy Period'
      },
      footer: {
        tagline: 'AI-rezerwacje dla nowoczesnych salonów',
        links: ['Funkcje', 'Jak To Działa', 'FAQ', 'Cennik'],
        legal: ['Polityka Prywatności', 'Warunki Usługi'],
        contact: 'support@slotme.ai'
      }
    }
  }

  const t = content[currentLang]
  const features = t.features.items
  const steps = t.howItWorks.steps
  const stats = t.benefits.stats
  const faqs = t.faq.items

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.98_0.01_45)] via-white to-[oklch(0.97_0.015_320)]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .font-display {
          font-family: 'Cormorant', serif;
        }

        .font-body {
          font-family: 'DM Sans', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .gradient-shine {
          background: linear-gradient(90deg, transparent, oklch(1 0 0 / 0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[oklch(0.92_0_0)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.65_0.25_330)] to-[oklch(0.55_0.22_300)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-semibold text-[oklch(0.25_0_0)]">SlotMe</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="font-body text-sm font-medium text-[oklch(0.45_0_0)] hover:text-[oklch(0.25_0_0)] transition-colors">{t.footer.links[0]}</a>
              <a href="#how-it-works" className="font-body text-sm font-medium text-[oklch(0.45_0_0)] hover:text-[oklch(0.25_0_0)] transition-colors">{t.footer.links[1]}</a>
              <a href="#faq" className="font-body text-sm font-medium text-[oklch(0.45_0_0)] hover:text-[oklch(0.25_0_0)] transition-colors">{t.footer.links[2]}</a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-[oklch(0.97_0_0)] rounded-full p-1">
                {(['en', 'ru', 'pl'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCurrentLang(lang)}
                    className={`px-3 py-1 text-xs font-body font-semibold rounded-full transition-all ${
                      currentLang === lang
                        ? 'bg-white text-[oklch(0.25_0_0)] shadow-sm'
                        : 'text-[oklch(0.55_0_0)] hover:text-[oklch(0.35_0_0)]'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <a href="/login" className="font-body text-sm font-medium text-[oklch(0.45_0_0)] hover:text-[oklch(0.25_0_0)] transition-colors">
                {t.nav.login}
              </a>
              <a
                href="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-[oklch(0.65_0.25_330)] to-[oklch(0.55_0.22_300)] text-white font-body text-sm font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                {t.nav.signup}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[oklch(0.75_0.15_45)] rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[oklch(0.75_0.15_320)] rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-[oklch(0.97_0.02_330)]/80 backdrop-blur-sm rounded-full border border-[oklch(0.85_0.05_330)] animate-fadeIn">
              <span className="font-body text-xs font-semibold text-[oklch(0.55_0.20_330)] uppercase tracking-wider">AI-Powered Salon Management</span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-[oklch(0.20_0_0)] leading-[0.95] animate-fadeInUp">
              {t.hero.title}
            </h1>

            <p className="font-display text-3xl sm:text-4xl font-light text-[oklch(0.65_0.18_330)] animate-fadeInUp delay-100">
              {t.hero.subtitle}
            </p>

            <p className="font-body text-lg text-[oklch(0.45_0_0)] leading-relaxed max-w-xl animate-fadeInUp delay-200">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-300">
              <a
                href="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-[oklch(0.65_0.25_330)] to-[oklch(0.55_0.22_300)] text-white font-body text-base font-semibold rounded-full hover:shadow-2xl transition-all overflow-hidden"
              >
                <span className="relative z-10">{t.hero.cta}</span>
                <div className="absolute inset-0 gradient-shine opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <button className="px-8 py-4 bg-white border-2 border-[oklch(0.90_0_0)] text-[oklch(0.30_0_0)] font-body text-base font-semibold rounded-full hover:border-[oklch(0.70_0_0)] hover:shadow-lg transition-all">
                {t.hero.ctaAlt}
              </button>
            </div>
          </div>

          <div className="relative animate-fadeIn delay-400">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <div className="aspect-[4/3] bg-gradient-to-br from-[oklch(0.95_0.03_330)] via-[oklch(0.90_0.05_300)] to-[oklch(0.85_0.08_320)] flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[oklch(0.65_0.25_330)] to-[oklch(0.55_0.22_300)] shadow-xl">
                    <Calendar className="w-12 h-12 text-white" />
                  </div>
                  <p className="font-body text-sm text-[oklch(0.45_0_0)]">Interactive calendar preview</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[oklch(0.85_0.12_45)] to-[oklch(0.75_0.10_60)] rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-[oklch(0.85_0.12_320)] to-[oklch(0.75_0.10_300)] rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-5xl sm:text-6xl font-bold text-[oklch(0.20_0_0)]">
              {t.features.title}
            </h2>
            <p className="font-body text-lg text-[oklch(0.45_0_0)]">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const icons = [Sparkles, Calendar, Bell, MessageCircle, RefreshCw, BarChart3]
              const Icon = icons[idx]
              const colors = [
                'from-[oklch(0.75_0.20_330)] to-[oklch(0.65_0.22_310)]',
                'from-[oklch(0.75_0.18_280)] to-[oklch(0.65_0.20_260)]',
                'from-[oklch(0.75_0.18_45)] to-[oklch(0.65_0.20_60)]',
                'from-[oklch(0.75_0.18_200)] to-[oklch(0.65_0.20_180)]',
                'from-[oklch(0.75_0.18_150)] to-[oklch(0.65_0.20_130)]',
                'from-[oklch(0.75_0.18_90)] to-[oklch(0.65_0.20_110)]'
              ]

              return (
                <div
                  key={idx}
                  className="group relative p-8 bg-gradient-to-b from-[oklch(0.99_0_0)] to-[oklch(0.97_0_0)] rounded-3xl border border-[oklch(0.92_0_0)] hover:border-[oklch(0.85_0.05_330)] hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[idx]} shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[oklch(0.25_0_0)] mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-body text-[oklch(0.50_0_0)] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[oklch(0.98_0.01_330)] to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl sm:text-6xl font-bold text-[oklch(0.20_0_0)] mb-4">
              {t.howItWorks.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center space-y-6">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.75_0.15_330)] to-[oklch(0.65_0.18_300)] rounded-full blur-xl opacity-30" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[oklch(0.65_0.25_330)] to-[oklch(0.55_0.22_300)] flex items-center justify-center shadow-lg">
                      <span className="font-display text-3xl font-bold text-white">{idx + 1}</span>
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[oklch(0.25_0_0)]">
                    {step.title}
                  </h3>
                  <p className="font-body text-[oklch(0.50_0_0)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-[oklch(0.65_0.25_330)] to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Stats */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[oklch(0.30_0.05_330)] to-[oklch(0.20_0.03_300)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,oklch(1_0_0)_0%,transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              {t.benefits.title}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-3 p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                <div className="font-display text-5xl sm:text-6xl font-bold bg-gradient-to-br from-white to-[oklch(0.85_0.12_330)] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="font-body text-lg text-white/90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl sm:text-6xl font-bold text-[oklch(0.20_0_0)]">
              {t.faq.title}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[oklch(0.90_0_0)] rounded-2xl overflow-hidden hover:border-[oklch(0.80_0.05_330)] transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left bg-white hover:bg-[oklch(0.99_0_0)] transition-colors"
                >
                  <span className="font-display text-xl font-semibold text-[oklch(0.25_0_0)]">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[oklch(0.50_0_0)] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-8 py-6 bg-[oklch(0.98_0_0)] border-t border-[oklch(0.92_0_0)]">
                    <p className="font-body text-[oklch(0.40_0_0)] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[oklch(0.98_0.02_330)] via-[oklch(0.96_0.03_310)] to-[oklch(0.97_0.02_290)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[oklch(0.75_0.18_330)] to-[oklch(0.65_0.20_300)] rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[oklch(0.20_0_0)]">
            {t.cta.title}
          </h2>
          <p className="font-body text-xl text-[oklch(0.45_0_0)]">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="/register"
              className="group relative px-10 py-5 bg-gradient-to-r from-[oklch(0.65_0.25_330)] to-[oklch(0.55_0.22_300)] text-white font-body text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all overflow-hidden"
            >
              <span className="relative z-10">{t.cta.button}</span>
              <div className="absolute inset-0 gradient-shine opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="flex items-center gap-2 font-body text-sm text-[oklch(0.50_0_0)]">
              <Check className="w-4 h-4 text-[oklch(0.60_0.20_330)]" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-[oklch(0.15_0_0)] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.65_0.25_330)] to-[oklch(0.55_0.22_300)] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-2xl font-semibold">SlotMe</span>
              </div>
              <p className="font-body text-sm text-white/70">
                {t.footer.tagline}
              </p>
            </div>

            <div>
              <h4 className="font-body font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {t.footer.links.map((link, idx) => (
                  <li key={idx}>
                    <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="font-body text-sm text-white/70 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-body font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {t.footer.legal.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="font-body text-sm text-white/70 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-body font-semibold mb-4">Contact</h4>
              <a href={`mailto:${t.footer.contact}`} className="font-body text-sm text-white/70 hover:text-white transition-colors">
                {t.footer.contact}
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-body text-sm text-white/50">
              © 2026 SlotMe. All rights reserved.
            </p>
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
              {(['en', 'ru', 'pl'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLang(lang)}
                  className={`px-3 py-1 text-xs font-body font-semibold rounded-full transition-all ${
                    currentLang === lang
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
