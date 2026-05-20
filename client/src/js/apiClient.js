const URL_SERVER = 'http://localhost:3000'

// Wrapper unico per le chiamate HTTP al server Express.
export async function request(service, options = {}) {
    const res = await fetch(`${URL_SERVER}${service}`, {
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers ?? {})
        }
    })

    const contentType = res.headers.get('content-type') ?? ''
    const payload = contentType.includes('application/json')
        ? await res.json()
        : await res.text()

    if (!res.ok) {
        throw new Error(typeof payload === 'string' ? payload : payload?.error ?? 'Errore server')
    }

    return payload
}

export function getRequest(service) {
    return request(service)
}

export function postRequest(service, body) {
    return request(service, {
        method: 'POST',
        body: JSON.stringify(body)
    })
}
