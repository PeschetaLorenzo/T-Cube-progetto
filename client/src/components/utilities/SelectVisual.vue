<script setup>
    defineProps({
        labelText: {
            type: String,
            required: true
        },
        optionValues: {
            type: Array,
            required: true
        },
        optionTexts: {
            type: Array,
            required: true
        },
        modelValue: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <header>
        <p>{{ labelText }}</p>        
        <select :disabled="disabled" :value="modelValue" @input="emit('update:modelValue', $event.target.value)">
            <option v-for="(text, index) in optionTexts" :key="index" :value="optionValues[index]">
                {{ text }}
            </option>
        </select>
    </header>
</template>

<style scoped>
    header {
        margin-top: 20px;
        text-wrap-mode: nowrap;
        >p{
            text-align: center;
            margin-right: 10%;
            margin-bottom: 0px;
        }
   }

    select {
        border: none;
        border-bottom: 1pt solid var(--vueGreen);
        width: 100%;
        border-radius: 5%;
        height: 30px;
        margin-top: 3px;
        font-size: 15pt;
        text-align: center;
        font-weight: bold;
        color: var(--color-text);
        background-color: var(--color-background-mute);
    }

    @media (prefers-color-scheme: dark) {
        select {
            background-color: var(--color-background-mute);
        }
    }

    select:focus {
        outline: none;
        outline: 1pt solid var(--vueGreen);
        -moz-outline-radius: 50%;
    }

    select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--color-background);
    }
</style>
