<script setup>
defineProps({
    notazione: {
        type: Array,
        required: true
    }
})

</script>

<template>
    <div class="tutorial-card">
        <img class="card-icon" aria-hidden="true" :src="notazione.imgpath"/>
        <span class="card-copy">
            <strong>{{ notazione.title }}</strong>
            <span>{{ notazione.description }}</span>
        </span>
    </div>
</template>

<style scoped>
.tutorial-card {
    min-height: 170px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    background: var(--color-background-soft);
    text-align: left;
    cursor: pointer;
    transition:
        border-color 0.2s,
        background-color 0.2s,
        transform 0.2s;
}

.tutorial-card:hover,
.tutorial-card:focus-visible {
    border-color: var(--vueGreen);
    background: hsla(160, 100%, 37%, 0.1);
    transform: translateY(-3px);
    outline: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card-icon {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: var(--vueGreen);
    border: 1px solid var(--color-border);
    background: var(--color-background);
    font-weight: 900;
    letter-spacing: 0;
}

.card-copy {
    display: grid;
    gap: 0.45rem;
}

strong {
    color: var(--color-heading);
    font-size: 1.25rem;
    text-align: center;
}

span span {
    line-height: 1.45;
    opacity: 0.82;
}
</style>
