<script setup>
import { ArraiPreview } from "@arrai-innovations/vitepress-theme";
import { VPImage } from "vitepress/theme-without-fonts";
</script>

<template>
    <ArraiPreview label="VUEDA" description="Example application">
        <VPImage :image="{ src: '/social-card.png', alt: 'VUEDA documentation preview' }" />
        <template #caption>
            <span>An image preview with a caption.</span>
            <a href="https://example.com">Explore the example</a>
        </template>
    </ArraiPreview>
</template>
