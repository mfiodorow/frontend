/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template functional>
    <div
        data-cy="pinned-section"
        :class="['pinned-section', { 'pinned-section--pinned': props.isPinned }]">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'GridTableLayoutPinnedSection',
    props: {
        /**
         * Determines the pinned state of section
         */
        isPinned: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style lang="scss" scoped>
    .pinned-section {
        position: sticky;
        right: 0;
        z-index: $Z_INDEX_LVL_3;
        display: flex;
        width: max-content;
        height: fit-content;

        &--pinned {
            box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
        }
    }
</style>
