<script setup>
import { ArraiPreview } from "@arrai-innovations/vitepress-theme";
</script>

<template>
    <ArraiPreview label="ContactList.vue">
        <pre><code>const contacts = useListInstance({
    props: { pkKey: "contactId" },
    handlers: { list: fetchContacts },
});

contacts.list();</code></pre>
    </ArraiPreview>
</template>

<style scoped>
pre {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.75rem;
    line-height: 1.6;
}
</style>
