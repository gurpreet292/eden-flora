import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

const PlantQrCode = ({ value }) => {
  const canvasRef = useRef(null)
  useEffect(() => { QRCode.toCanvas(canvasRef.current, value, { width: 104, margin: 1, color: { dark: '#1b3a2a', light: '#faf8f0' } }) }, [value])
  return <div className="passport-qr"><canvas ref={canvasRef} aria-label={`QR code for ${value}`} /><span>Scan registry</span></div>
}

export default PlantQrCode
