/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <FormSubsection
        :title="schema.title"
        :required="schema.isRequired">
        <FormFieldset>
            <CheckBox
                v-for="title in schema.items.enum_titles"
                :key="title"
                :value="localValue"
                :label="title"
                @input="onValueChange" />
        </FormFieldset>
    </FormSubsection>
</template>

<script>
import CheckBox from '@Core/components/CheckBox/CheckBox';
import FormFieldset from '@Core/components/Form/FormFieldset';
import FormSubsection from '@Core/components/Form/Subsection/FormSubsection';

export default {
    name: 'JSONSchemaFormArrayString',
    components: {
        FormSubsection,
        FormFieldset,
        CheckBox,
    },
    props: {
        /**
         * JSON schema
         */
        schema: {
            type: Object,
            required: true,
        },
        /**
         * Component value
         */
        value: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            localValue: this.getMappedTitles({
                key: 'enum',
                value: 'enum_titles',
                data: this.value,
            }),
        };
    },
    methods: {
        getMappedTitles({
            key, value, data,
        }) {
            const titles = [];

            for (let i = 0; i < data.length; i += 1) {
                const titleIndex = this.schema.items[key].findIndex(
                    option => option === data[i],
                );

                titles.push(this.schema.items[value][titleIndex]);
            }

            return titles;
        },
        onValueChange(value) {
            this.localValue = value;

            this.$emit('input', this.getMappedTitles({
                key: 'enum_titles',
                value: 'enum',
                data: value,
            }));
        },
    },
};
</script>
