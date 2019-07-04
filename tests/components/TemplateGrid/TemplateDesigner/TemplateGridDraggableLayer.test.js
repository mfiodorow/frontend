/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import { mount, createLocalVue } from "@vue/test-utils";
import TemplateGridDraggableLayer from '~/components/TemplateGrid/TemplateDesigner/TemplateGridDraggableLayer';
import { Store } from 'vuex-mock-store';

const localVue = createLocalVue();
const store = new Store({
    state: {
        draggable: {
            draggedElement: {},
        }
    }
});
const mocks = {
    $store: store,
};

describe('TemplateGrid/TemplateDesigner/TemplateGridDraggableLayer', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(TemplateGridDraggableLayer, {
            localVue,
            mocks,
            propsData: {
                columnsNumber: 4,
                rowsNumber: 4,
            },
        });
    });

    it("Component is rendered", () => {
        expect(wrapper.is(TemplateGridDraggableLayer)).toBe(true);
    });

    it('Component is named well', () => {
        expect(typeof TemplateGridDraggableLayer.name).toBe('string');
        expect(TemplateGridDraggableLayer.name).toEqual('TemplateGridDraggableLayer');
    });

    it('Interactive placeholder positions', () => {
        const positions = [
            {
                row: 1,
                column: 1,
            },
            {
                row: 1,
                column: 2,
            },
            {
                row: 1,
                column: 3,
            },
            {
                row: 1,
                column: 4,
            },
            {
                row: 2,
                column: 1,
            },
            {
                row: 2,
                column: 2,
            },
            {
                row: 2,
                column: 3,
            },
            {
                row: 2,
                column: 4,
            },
            {
                row: 3,
                column: 1,
            },
            {
                row: 3,
                column: 2,
            },
            {
                row: 3,
                column: 3,
            },
            {
                row: 3,
                column: 4,
            },
            {
                row: 4,
                column: 1,
            },
            {
                row: 4,
                column: 2,
            },
            {
                row: 4,
                column: 3,
            },
            {
                row: 4,
                column: 4,
            },
        ];

        expect(wrapper.vm.gridLayerPositions).toEqual(positions);
    });

    it('Get layout element position in draggable grid layer', function () {
        const bounds = {
            row: 1,
            column: 1,
            width: 2,
            height: 2,
        };

        expect(wrapper.vm.getItemPosition(bounds)).toEqual({
            gridArea: '1 / 1 / 3 / 3',
        });
    });
});