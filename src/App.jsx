import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// SafeIcon Component - renders Lucide icons dynamically
const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const [IconComponent, setIconComponent] = useState(null)

  useEffect(() => {
    import('lucide-react').then((icons) => {
      const pascalName = name.split('-').map(part =>
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join('')
      const Icon = icons[pascalName] || icons.HelpCircle
      setIconComponent(() => Icon)
    })
  }, [name])

  if (!IconComponent) return <div style={{ width: size, height: size }} className={className} />

  return <IconComponent size={size} className={className} color={color} />
}

// Theme Provider Hook
const useTheme = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle('dark', saved === 'dark')
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return { theme, toggleTheme }
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// Product Card Component
const ProductCard = ({ product, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-300 brick-shadow"
    >
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {product.price} ₽
        </div>
        {product.badge && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
            {product.badge}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <SafeIcon name="star" size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
            {product.pieces} деталей
          </span>
          <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition-all transform hover:scale-110 active:scale-95">
            <SafeIcon name="shopping-cart" size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Category Card Component
const CategoryCard = ({ category, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleIn}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative overflow-hidden rounded-3xl cursor-pointer group"
    >
      <div className={`h-80 bg-gradient-to-br ${category.gradient} p-8 flex flex-col justify-end relative`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="relative z-10">
          <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
            <SafeIcon name={category.icon} size={28} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
          <p className="text-white/80 text-sm">{category.count} наборов</p>
        </div>
      </div>
    </motion.div>
  )
}

// Feature Component
const Feature = ({ feature, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay: index * 0.15 }}
      className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-yellow-400/50 transition-all duration-300"
    >
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 brick-shadow`}
      >
        <SafeIcon name={feature.icon} size={40} className="text-white" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
    </motion.div>
  )
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const heroRef = useRef(null)
  const productsRef = useRef(null)
  const categoriesRef = useRef(null)
  const featuresRef = useRef(null)

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const products = [
    {
      id: 1,
      name: "LEGO Technic Ferrari Daytona",
      price: "45 990",
      pieces: 3778,
      rating: "4.9 (128)",
      badge: "Бестселлер",
      description: "Воссоздай легендарный суперкар с невероятной детализацией двигателя V12.",
      image: "https://images.unsplash.com/photo-1585366119957-f973043d4561?w=600&q=80"
    },
    {
      id: 2,
      name: "LEGO Star Wars Millennium Falcon",
      price: "52 490",
      pieces: 7541,
      rating: "5.0 (256)",
      badge: "Premium",
      description: "Самый большой набор LEGO Star Wars с минифигурками персонажей саги.",
      image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80"
    },
    {
      id: 3,
      name: "LEGO Architecture Empire State",
      price: "12 990",
      pieces: 1767,
      rating: "4.8 (89)",
      badge,
      description: "Икона Нью-Йорка в миниатюре. Идеально для коллекционеров.",
      image: "https://images.unsplash.com/photo-1560964645-6c9e845f6e23?w=600&q=80"
    },
    {
      id: 4,
      name: "LEGO Ideas Dinosaur Fossils",
      price: "8 490",
      pieces: 910,
      rating: "4.7 (342)",
      badge: "Новинка",
      description: "Музейная коллекция динозавров для юных палеонтологов.",
      image: "https://images.unsplash.com/photo-1560769629-975e13f0c470?w=600&q=80"
    }
  ]

  const categories = [
    { name: "Technic", count: 124, icon: "cog", gradient: "from-red-600 to-red-800" },
    { name: "Star Wars", count: 89, icon: "rocket", gradient: "from-slate-700 to-slate-900" },
    { name: "City", count: 156, icon: "building-2", gradient: "from-blue-500 to-blue-700" },
    { name: "Architecture", count: 45, icon: "landmark", gradient: "from-amber-500 to-amber-700" }
  ]

  const features = [
    {
      title: "Оригинальная продукция",
      description: "Только официальные наборы LEGO с гарантией качества и сертификатами.",
      icon: "shield-check",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Быстрая доставка",
      description: "Доставка по всей России от 1 дня. Бесплатно при заказе от 5000 ₽.",
      icon: "truck",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Безопасная оплата",
      description: "Принимаем карты, Apple Pay, Google Pay. Полная защита транзакций.",
      icon: "credit-card",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Подарочная упаковка",
      description: "Праздничная упаковка и открытки для особенных моментов.",
      icon: "gift",
      gradient: "from-pink-500 to-rose-600"
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 mobile-safe-container">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800">
        <nav className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center brick-shadow">
              <SafeIcon name="box" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Brick<span className="text-red-600">Master</span>
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection(heroRef)} className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
              Главная
            </button>
            <button onClick={() => scrollToSection(productsRef)} className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
              Каталог
            </button>
            <button onClick={() => scrollToSection(categoriesRef)} className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
              Категории
            </button>
            <button onClick={() => scrollToSection(featuresRef)} className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
              Доставка
            </button>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <SafeIcon name="sun" size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                  >
                    <SafeIcon name="moon" size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold items-center gap-2 transition-colors brick-shadow"
            >
              <SafeIcon name="shopping-cart" size={20} />
              <span>Корзина</span>
            </motion.button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              <SafeIcon name={isMenuOpen ? "x" : "menu"} size={24} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                <button onClick={() => scrollToSection(heroRef)} className="w-full text-left px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800">Главная</button>
                <button onClick={() => scrollToSection(productsRef)} className="w-full text-left px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800">Каталог</button>
                <button onClick={() => scrollToSection(categoriesRef)} className="w-full text-left px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800">Категории</button>
                <button onClick={() => scrollToSection(featuresRef)} className="w-full text-left px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800">Доставка</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-4 md:px-6 min-h-screen flex items-center">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold text-sm">
                <SafeIcon name="sparkles" size={16} />
                <span>Новая коллекция 2024</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tight">
                СОБЕРИ<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
                  МЕЧТУ
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                Официальные LEGO наборы по лучшим ценам. Открой мир безграничного творчества.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(productsRef)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all brick-shadow"
                >
                  <span>Смотреть каталог</span>
                  <SafeIcon name="arrow-right" size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all"
                >
                  <SafeIcon name="play-circle" size={20} />
                  <span>Видеообзор</span>
                </motion.button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">50K+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Наборов</div>
                </div>
                <div className="w-px h-12 bg-gray-300 dark:bg-slate-700" />
                <div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">15K+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Клиентов</div>
                </div>
                <div className="w-px h-12 bg-gray-300 dark:bg-slate-700" />
                <div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">4.9</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Рейтинг</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-yellow-500/20 rounded-full blur-3xl" />
              <motion.img
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                src="https://images.unsplash.com/photo-1585366119957-f973043d4561?w=800&q=80"
                alt="LEGO Constructor"
                className="relative z-10 w-full rounded-3xl shadow-2xl brick-shadow"
              />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <SafeIcon name="check-circle" size={24} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">В наличии</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Доставка завтра</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="py-20 px-4 md:px-6 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Популярные <span className="text-red-600">наборы</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Лучшие конструкторы этого месяца по мнению наших клиентов
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 transition-all"
            >
              <span>Все наборы</span>
              <SafeIcon name="arrow-right" size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Категории
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-400">
              Выбери свою тематику
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.name} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 md:px-6 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Почему <span className="text-red-600">мы?</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Feature key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-red-800 p-12 md:p-20 text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-black text-white mb-6"
              >
                Готов начать строить?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl text-red-100 mb-8"
              >
                Присоединяйся к 15,000+ строителей. Получи скидку 10% на первый заказ.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold text-lg brick-shadow"
                >
                  Получить скидку
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-700 text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-800 transition-colors"
                >
                  Связаться с нами
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 md:px-6 border-t border-gray-800 telegram-safe-bottom">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <SafeIcon name="box" size={24} className="text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight">
                  Brick<span className="text-red-600">Master</span>
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Официальный магазин LEGO конструкторов с доставкой по всей России.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors">
                  <SafeIcon name="instagram" size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors">
                  <SafeIcon name="youtube" size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors">
                  <SafeIcon name="send" size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Каталог</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-500 transition-colors">Technic</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Star Wars</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">City</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Architecture</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Информация</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-500 transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Оплата</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Контакты</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Контакты</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <SafeIcon name="phone" size={16} />
                  <span>8 (800) 123-45-67</span>
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon name="mail" size={16} />
                  <span>hello@brickmaster.ru</span>
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon name="map-pin" size={16} />
                  <span>Москва, ул. Строителей 1</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© 2024 BrickMaster. LEGO® является товарным знаком компании LEGO Group.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App