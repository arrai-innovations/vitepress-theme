<script setup>
defineProps({
    label: { type: String, default: "" },
    description: { type: String, default: "" },
});
</script>

<template>
    <figure class="ArraiPreview" :aria-label="label || undefined">
        <div class="frame">
            <div v-if="label" class="bar">
                <span class="dot" aria-hidden="true"></span>
                <span>{{ label }}</span>
                <span v-if="description" class="description">{{ description }}</span>
            </div>
            <slot />
        </div>
        <figcaption v-if="$slots.caption" class="caption"><slot name="caption" /></figcaption>
    </figure>
</template>

<style scoped>
.ArraiPreview {
    min-width: 0;
    margin: 0;
    text-align: left;
}
.frame {
    overflow: hidden;
    border: 0.0625rem solid var(--vp-c-divider);
    border-radius: 0.625rem;
    background: var(--vp-code-block-bg);
}
.bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 0.0625rem solid var(--vp-c-divider);
    color: var(--vp-c-text-2);
    font-size: 0.75rem;
    line-height: 1.6;
}
.dot {
    flex-shrink: 0;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--arrai-docs-brand);
}
.description {
    margin-left: auto;
}
.caption {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
    color: var(--vp-c-text-2);
    font-size: 0.75rem;
    line-height: 1.6;
}
.caption :deep(a) {
    color: var(--vp-c-brand-1);
    font-weight: 500;
}
.caption :deep(a:hover) {
    text-decoration: underline;
    text-underline-offset: 0.25rem;
}
@media (max-width: 39.9375rem) {
    .description {
        display: none;
    }
}
</style>
