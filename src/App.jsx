import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './layout/Navbar'
import Hero from './sections/Hero'
import BrandStory from './sections/BrandStory'
import Categories from './sections/Categories'
import FeaturedPlants from './sections/FeaturedPlants'
import BotanicalVideo from './sections/BotanicalVideo'
import GardenJournal from './sections/GardenJournal'
import BloomGallery from './sections/BloomGallery'
import TestimonialsSocial from './sections/TestimonialsSocial'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider } from './context/ThemeContext'
import { StoreProvider } from './context/StoreContext'
import { AuthProvider } from './context/AuthContext'

const SitePage = lazy(() => import('./pages/SitePage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const PlantPassport = lazy(() => import('./pages/PlantPassport/PlantPassport'))
const BotanicalVault = lazy(() => import('./pages/BotanicalVault'))
const VaultPassport = lazy(() => import('./pages/PlantPassport'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const OrderConfirmedPage = lazy(() => import('./pages/OrderConfirmedPage'))
const PublicProjectPage = lazy(() => import('./pages/PublicProjectPage'))

const Foundation = () => <div className="min-h-screen overflow-hidden bg-ivory text-forest"><Navbar /><main><Hero /><BotanicalVideo /><BrandStory /><Categories /><FeaturedPlants /><GardenJournal /><BloomGallery /><TestimonialsSocial /></main></div>
const RouteFallback = () => <div className="grid min-h-screen place-items-center bg-ivory text-sm text-forest/60">Loading your garden...</div>

function App() {
	return <ThemeProvider><AuthProvider><StoreProvider><BrowserRouter><ScrollToTop /><Suspense fallback={<RouteFallback />}><Routes>
		<Route path="/" element={<Foundation />} />
		<Route path="/shop" element={<><Navbar /><SitePage type="shop" /></>} />
		<Route path="/collections" element={<><Navbar /><SitePage type="collections" /></>} />
		<Route path="/about" element={<><Navbar /><SitePage type="about" /></>} />
		<Route path="/contact" element={<><Navbar /><SitePage type="contact" /></>} />
		<Route path="/cart" element={<><Navbar /><CartPage /></>} />
		<Route path="/product/:productId" element={<><Navbar /><ProductPage /></>} />
		<Route path="/passport/:productId" element={<><Navbar /><PlantPassport /></>} />
		<Route path="/login" element={<><Navbar /><AuthPage mode="login" /></>} />
		<Route path="/register" element={<><Navbar /><AuthPage mode="register" /></>} />
		<Route path="/forgot-password" element={<><Navbar /><ResetPasswordPage /></>} />
		<Route path="/reset-password" element={<><Navbar /><ResetPasswordPage /></>} />
		<Route path="/dashboard" element={<ProtectedRoute><><Navbar /><DashboardPage /></></ProtectedRoute>} />
		<Route path="/order-confirmed" element={<><Navbar /><OrderConfirmedPage /></>} />
		<Route path="/vault" element={<><Navbar /><BotanicalVault /></>} />
		<Route path="/vault/:plantId" element={<><Navbar /><VaultPassport /></>} />
		<Route path="/shared/project/:token" element={<PublicProjectPage />} />
		<Route path="*" element={<Foundation />} />
	</Routes></Suspense></BrowserRouter></StoreProvider></AuthProvider></ThemeProvider>
}

export default App
