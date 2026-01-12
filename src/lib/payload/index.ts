// Re-export from graphql client
export { getPayloadPage, getPayloadNavigation } from './graphql'



const PAYLOAD_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

export async function getPayloadGlobal(slug: string) {
    try {
        const res = await fetch(`${PAYLOAD_URL}/api/globals/${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { tags: [`global_${slug}`] },
        })
        
        if (!res.ok) return null
        
        return res.json()
    } catch (error) {
        console.error(`Error fetching global ${slug}:`, error)
        return null
    }
}
