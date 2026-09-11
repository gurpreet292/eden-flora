import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './layout/Navbar'
import Hero from './sections/Hero'
import BrandStory from './sections/BrandStory'
import Categories from './sections/Categories'
import FeaturedPlants from './sections/FeaturedPlants'
import Newsletter from './sections/Newsletter'
import BotanicalVideo from './sections/BotanicalVideo'
import GardenJournal from './sections/GardenJournal'
import CustomCursor from './components/CustomCursor'
import { ThemeProvider } from './context/ThemeContext'
import SitePage from './pages/SitePage'
import CartPage from './pages/CartPage'
import ProductPage from './pages/ProductPage'
import { StoreProvider } from './context/StoreContext'

const Foundation = () => <div className="min-h-screen overflow-hidden bg-ivory text-forest"><Navbar /><main><Hero /><BotanicalVideo /><BrandStory /><Categories /><FeaturedPlants /><GardenJournal /><Newsletter /></main></div>

function App() {
	return <ThemeProvider><StoreProvider><BrowserRouter><CustomCursor /><Routes>
		<Route path="/" element={<Foundation />} />
		<Route path="/shop" element={<><Navbar /><SitePage type="shop" /></>} />
		<Route path="/collections" element={<><Navbar /><SitePage type="collections" /></>} />
		<Route path="/about" element={<><Navbar /><SitePage type="about" /></>} />
		<Route path="/contact" element={<><Navbar /><SitePage type="contact" /></>} />
		<Route path="/cart" element={<><Navbar /><CartPage /></>} />
		<Route path="/product/:productId" element={<><Navbar /><ProductPage /></>} />
		<Route path="*" element={<Foundation />} />
	</Routes></BrowserRouter></StoreProvider></ThemeProvider>
}

export default App
