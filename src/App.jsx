import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './layout/Navbar'
import Hero from './sections/Hero'
import BrandStory from './sections/BrandStory'
import Categories from './sections/Categories'
import FeaturedPlants from './sections/FeaturedPlants'
import Newsletter from './sections/Newsletter'
import BotanicalVideo from './sections/BotanicalVideo'
import GardenJournal from './sections/GardenJournal'
import BloomGallery from './sections/BloomGallery'
import TestimonialsSocial from './sections/TestimonialsSocial'
import CustomCursor from './components/CustomCursor'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider } from './context/ThemeContext'
import SitePage from './pages/SitePage'
import CartPage from './pages/CartPage'
import ProductPage from './pages/ProductPage'
import PlantPassport from './pages/PlantPassport/PlantPassport'
import BotanicalVault from './pages/BotanicalVault'
import VaultPassport from './pages/PlantPassport'
import AuthPage from './pages/AuthPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import OrderConfirmedPage from './pages/OrderConfirmedPage'
import PublicProjectPage from './pages/PublicProjectPage'
import { StoreProvider } from './context/StoreContext'
import { AuthProvider } from './context/AuthContext'

const Foundation = () => <div className="min-h-screen overflow-hidden bg-ivory text-forest"><Navbar /><main><Hero /><BotanicalVideo /><BrandStory /><Categories /><FeaturedPlants /><GardenJournal /><BloomGallery /><TestimonialsSocial /><Newsletter /></main></div>

function App() {
	return <ThemeProvider><AuthProvider><StoreProvider><BrowserRouter><ScrollToTop /><CustomCursor /><Routes>
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
	</Routes></BrowserRouter></StoreProvider></AuthProvider></ThemeProvider>
}

export default App
