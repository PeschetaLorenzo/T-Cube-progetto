<script setup>
import { computed, ref, watch } from 'vue'
import { tutorialCategories } from '@/data/tutorial/categories'
import { tutorialSections } from '@/data/tutorial/sections'
import { findSection, getSectionsByCategory } from '@/js/tutorial'
import TutorialBreadcrumb from './TutorialBreadcrumb.vue'
import TutorialHome from './TutorialHome.vue'
import TutorialNavigation from './TutorialNavigation.vue'
import TutorialSidebar from './TutorialSidebar.vue'
import TutorialStep from './TutorialStep.vue'
import SolverPanel from './solver/SolverPanel.vue'

const emit = defineEmits(['openTraining'])

const props = defineProps({
    selectedCategoryId: {
        type: String,
        default: ''
    }
})

const activeCategoryId = ref('')
const activeSectionId = ref('')
const sidebarOpen = ref(false)

const activeCategory = computed(() => {
    return tutorialCategories.find(category => category.id === activeCategoryId.value) ?? null
})

const categorySections = computed(() => {
    if (!activeCategory.value) return []
    return getSectionsByCategory(tutorialSections, activeCategory.value.id)
})

const activeSection = computed(() => {
    return findSection(categorySections.value, activeSectionId.value) ?? categorySections.value[0] ?? null
})

const activeSectionIndex = computed(() => {
    if (!activeSection.value) return -1
    return categorySections.value.findIndex(section => section.id === activeSection.value.id)
})

const previousSection = computed(() => categorySections.value[activeSectionIndex.value - 1] ?? null)
const nextSection = computed(() => categorySections.value[activeSectionIndex.value + 1] ?? null)

function selectCategory(categoryId) {
    console.log(categoryId)
    emit('changeSelectedCategory', categoryId)
    activeCategoryId.value = categoryId
    const firstSection = getSectionsByCategory(tutorialSections, categoryId)[0]
    activeSectionId.value = firstSection?.id ?? ''
    sidebarOpen.value = false
}

function selectSection(sectionId) {
    activeSectionId.value = sectionId
    sidebarOpen.value = false
}

function goHome() {
    emit('changeSelectedCategory', '')
    activeCategoryId.value = ''
    activeSectionId.value = ''
    sidebarOpen.value = false
}

function goCategory() {
    if (activeCategory.value && categorySections.value.length > 0) {
        activeSectionId.value = categorySections.value[0].id
        
    }
}

function goPrevious() {
    if (previousSection.value) {
        selectSection(previousSection.value.id)
    }
}

function goNext() {
    if (nextSection.value) {
        selectSection(nextSection.value.id)
    }
}

function openTraining(trainingLink) {
    emit('openTraining', trainingLink)
}

watch(
    () => props.selectedCategoryId,
    (categoryId) => {

        if (categoryId && categoryId !== activeCategoryId.value) {
            selectCategory(categoryId)
        }
    },
    { immediate: true }
)
</script>

<template>
    <main class="tutorial-page">
        <TutorialHome
            v-if="!activeCategory"
            :categories="tutorialCategories"
            @select="selectCategory"
        />

        <section v-else-if="activeCategory.id === 'solver'" class="tutorial-content">
            <div class="content-head">
                <TutorialBreadcrumb :category="activeCategory" @home="goHome" @category="goCategory" />
            </div>
            <SolverPanel />
        </section>

        <section v-else class="tutorial-layout">
            <div v-if="sidebarOpen" class="drawer-backdrop" @click="sidebarOpen = false"></div>

            <TutorialSidebar
                :category="activeCategory"
                :sections="categorySections"
                :activeSectionId="activeSection?.id"
                :open="sidebarOpen"
                @select="selectSection"
                @close="sidebarOpen = false"
            />

            <article v-if="activeSection" class="tutorial-content">
                <div class="content-head">
                    <TutorialBreadcrumb
                        :category="activeCategory"
                        :section="activeSection"
                        @home="goHome"
                        @category="goCategory"
                    />
                    <button
                        type="button"
                        class="sections-toggle"
                        aria-label="Apri menu sezioni"
                        @click="sidebarOpen = true"
                    >
                        Sezioni
                    </button>
                </div>

                <header class="section-hero">
                    <span>{{ activeCategory.title }}</span>
                    <h2>{{ activeSection.title }}</h2>
                    <p>{{ activeSection.description }}</p>
                </header>

                <div class="steps-list">
                    <TutorialStep
                        v-for="(step, index) in activeSection.steps"
                        :key="step.id"
                        :step="step"
                        :index="index"
                        @training="openTraining"
                    />
                </div>

                <TutorialNavigation
                    :previousSection="previousSection"
                    :nextSection="nextSection"
                    @previous="goPrevious"
                    @next="goNext"
                />
            </article>

            <section v-else class="empty-state" role="status">
                <h2>Tutorial non trovato</h2>
                <p>La sezione richiesta non esiste o non contiene ancora dati.</p>
                <button type="button" @click="goHome">Torna al menu</button>
            </section>
        </section>
    </main>
</template>

<style scoped>
.tutorial-page {
    width: 100%;
    height: 100%;
    min-height: 0;
    color: var(--color-text);
}

.tutorial-content,
.tutorial-layout {
    height: 100%;
    min-height: 0;
}

.section-hero {
    display: grid;
    gap: 0.35rem;
}

.section-hero span {
    color: var(--vueGreen);
    font-size: 0.8rem;
    font-weight: 900;
    text-transform: uppercase;
}

h2 {
    margin: 0;
    color: var(--color-heading);
    font-size: clamp(1.6rem, 2.4vw, 2.3rem);
}

p {
    margin: 0;
    line-height: 1.55;
}

.tutorial-layout {
    display: grid;
    grid-template-columns: minmax(270px, 320px) minmax(0, 1fr);
    gap: 1.25rem;
}

.tutorial-content {
    min-width: 0;
    display: grid;
    align-content: start;
    gap: 1rem;
    overflow-y: auto;
    padding: 0.25rem 0.25rem 1rem;
}

.content-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.sections-toggle {
    display: none;
}

.section-hero {
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background-soft);
}

.steps-list {
    display: grid;
    gap: 1rem;
}

.empty-state {
    display: grid;
    place-items: center;
    gap: 0.75rem;
    min-height: 18rem;
    text-align: center;
}

.empty-state button,
.sections-toggle {
    min-height: 2.2rem;
    padding: 0 0.8rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    background: var(--color-background-soft);
    font-weight: 800;
    cursor: pointer;
}

.empty-state button:hover,
.empty-state button:focus-visible,
.sections-toggle:hover,
.sections-toggle:focus-visible {
    border-color: var(--vueGreen);
    color: var(--vueGreen);
    outline: none;
}

.drawer-backdrop {
    display: none;
}

@media (max-width: 850px) {
    .tutorial-layout {
        display: block;
    }

    .sections-toggle {
        display: inline-flex;
        align-items: center;
    }

    .drawer-backdrop {
        position: fixed;
        inset: 0;
        z-index: 30;
        display: block;
        background: rgba(0, 0, 0, 0.42);
    }
}

@media (max-width: 620px) {
    .content-head {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>
