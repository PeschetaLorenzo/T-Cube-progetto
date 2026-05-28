export function normalizeTutorialText(value) {
    return String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
}

export function splitAlgorithm(algorithm) {
    if (typeof algorithm !== 'string' || algorithm.trim() === '') {
        return []
    }

    return algorithm
        .trim()
        .split(/\s+/)
        .filter(Boolean)
}

export function resolvePublicPath(path) {
    if (!path) {
        return ''
    }

    if (/^(https?:|data:|blob:|\/)/.test(path)) {
        return path
    }

    return `/${path.replace(/^\.?\//, '')}`
}

export function findSection(sections, sectionId) {
    return sections.find(section => section.id === sectionId) ?? null
}

export function getSectionsByCategory(sections, categoryId) {
    return sections.filter(section => section.categoryId === categoryId)
}
