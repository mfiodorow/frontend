/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <DropDownFooter
        :size="smallSize"
        :space-between="true">
        <Button
            :size="tinySize"
            title="OK"
            @click.native="onApply" />
        <Button
            :theme="secondaryTheme"
            :size="tinySize"
            title="CLEAR ALL"
            @click.native="onClear" />
    </DropDownFooter>
</template>

<script>
import Button from '@Core/components/Button/Button';
import DropDownFooter from '@Core/components/Select/DropDown/Footers/DropDownFooter';
import {
    SIZE,
    THEME,
} from '@Core/defaults/theme';

export default {
    name: 'MultiselectDropdownFooter',
    components: {
        DropDownFooter,
        Button,
    },
    computed: {
        smallSize() {
            return SIZE.SMALL;
        },
        tinySize() {
            return SIZE.TINY;
        },
        secondaryTheme() {
            return THEME.SECONDARY;
        },
    },
    methods: {
        onApply() {
            this.$emit('apply');
        },
        onClear() {
            this.$emit('clear');
        },
    },
};
</script>
