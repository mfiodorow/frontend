/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <GridActionColumn>
        <GridTableCell
            editing-allowed
            :edit-key-code="32"
            :row="rowsOffset"
            :column="0"
            @mousedown.native="onSelectAllRows"
            @edit="onSelectAllRows">
            <GridCheckEditCell :value="rowsSelectionState" />
        </GridTableCell>
        <GridTableCell
            v-if="isBasicFilter"
            :locked="true"
            :row="rowsOffset + 1"
            :column="0">
            <GridCheckPlaceholderCell />
        </GridTableCell>
        <GridSelectRowEditCell
            v-for="(key, index) in dataCount"
            :key="key"
            :column="0"
            :row="rowsOffset + index + basicFiltersOffset + 1"
            :is="isSelectedAllRows
                || selectedRows[rowsOffset + index + basicFiltersOffset + 1]"
            @select="onSelectRow" />
    </GridActionColumn>
</template>

<script>
import GridCheckEditCell from '@Core/components/Grid/Layout/Table/Cells/Edit/GridCheckEditCell';
import GridSelectRowEditCell from '@Core/components/Grid/Layout/Table/Cells/Edit/GridSelectRowEditCell';
import GridTableCell from '@Core/components/Grid/Layout/Table/Cells/GridTableCell';
import GridActionColumn from '@Core/components/Grid/Layout/Table/Columns/GridActionColumn';

export default {
    name: 'GridSelectRowColumn',
    components: {
        GridActionColumn,
        GridTableCell,
        GridCheckEditCell,
        GridSelectRowEditCell,
        GridCheckPlaceholderCell: () => import('@Core/components/Grid/GridCheckPlaceholderCell'),
    },
    props: {
        /**
         * Column index of given component at the loop
         */
        columnIndex: {
            type: Number,
            required: true,
        },
        /**
         * Number of visible data
         */
        dataCount: {
            type: Number,
            default: 0,
        },
        /**
         * The number from which rows are enumerated
         */
        rowsOffset: {
            type: Number,
            default: 0,
        },
        /**
         * The drafts are unsaved changes, cached changed data at given time
         */
        drafts: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Determines if filters are visible
         */
        isBasicFilter: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            selectedRows: {},
            isSelectedAllRows: false,
        };
    },
    computed: {
        rowsSelectionState() {
            const rowsAreSelected = Boolean(Object.keys(this.selectedRows).length);

            if (!rowsAreSelected) {
                return +this.isSelectedAllRows;
            }

            return 2;
        },
        basicFiltersOffset() {
            return this.isBasicFilter ? 1 : 0;
        },
    },
    methods: {
        onSelectAllRows() {
            const anyRowsSelected = Object.entries(this.selectedRows).length;

            if (anyRowsSelected) {
                this.selectedRows = {};

                this.$emit('row-select', this.selectedRows);
            } else {
                this.isSelectedAllRows = !this.isSelectedAllRows;

                this.$emit('rows-select', this.isSelectedAllRows);
            }
        },
        onSelectRow({
            row,
            selected,
        }) {
            if (selected) {
                this.selectedRows[row] = true;
            } else {
                delete this.selectedRows[row];

                if (this.isSelectedAllRows) {
                    // If we had chosen option with selected all of the options, we need to remove it
                    // and mark visible rows as selected
                    const fixedIndex = this.isBasicFilter ? 2 : 1;

                    for (let i = fixedIndex; i < this.dataCount + fixedIndex; i += 1) {
                        if (i !== row) {
                            this.selectedRows[i] = true;
                        }
                    }

                    this.isSelectedAllRows = false;

                    this.$emit('rows-select', this.isSelectedAllRows);
                }
            }

            this.selectedRows = {
                ...this.selectedRows,
            };

            this.$emit('row-select', this.selectedRows);
        },
    },
};
</script>
