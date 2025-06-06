import { Groq } from 'groq-sdk'

export const useGroq = () => {
    const config = useRuntimeConfig()
    const groq = new Groq({
        apiKey: config.public.groqApiKey || 'fallback-key-untuk-development'
    })

    const chat = async (prompt) => {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'mixtral-8x7b-32768'
            })
            return completion.choices[0]?.message?.content
        } catch (error) {
            console.error('Groq API Error:', error)
            return 'Maaf, terjadi kesalahan saat memproses permintaan Anda.'
        }
    }

    return { chat }
}