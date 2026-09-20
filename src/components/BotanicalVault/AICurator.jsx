import axios from 'axios'
import { Bot, Send } from 'lucide-react'
import { useState } from 'react'

const AICurator = ({ plant }) => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('Ask me about this specimen’s habitat, rarity, or conservation story.')
  const [loading, setLoading] = useState(false)

  const askCurator = async (event) => {
    event.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    try {
      const response = await axios.post(`/api/vault/${plant.id}/curate`, { question })
      setAnswer(response.data.answer)
    } catch {
      setAnswer('The curator is between field notes. Please try that question again.')
    } finally {
      setLoading(false)
      setQuestion('')
    }
  }

  return <section className="curator-panel"><div className="curator-panel__heading"><span className="curator-icon"><Bot size={18} /></span><div><p className="vault-kicker">The AI curator</p><h2>Ask the archive.</h2></div></div><p className="curator-answer">{loading ? 'Consulting the botanical record...' : answer}</p><form onSubmit={askCurator} className="curator-form"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What makes this plant rare?" aria-label="Ask the AI curator" /><button type="submit" aria-label="Ask curator"><Send size={15} /></button></form></section>
}

export default AICurator
