/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <GridViewTemplate>
        <template #sidebar>
            <VerticalTabBar :items="verticalTabs">
                <FadeTransition>
                    <DropZone
                        v-show="isDropZoneVisible"
                        :hover-background-color="graphiteLightColor"
                        title="REMOVE CONDITION">
                        <template #icon="{ color }">
                            <IconRemoveFilter :fill-color="color" />
                        </template>
                    </DropZone>
                </FadeTransition>
            </VerticalTabBar>
        </template>
        <template #grid>
            <ConditionSetWrapper
                :scope="scope"
                :change-values="changeValues"
                :errors="errors"
                :disabled="!isAllowedToUpdate" />
            <Button
                title="SAVE CHANGES"
                :floating="{ bottom: '24px', right: '24px' }"
                @click.native="onSubmit">
                <template
                    v-if="isSubmitting"
                    #prepend="{ color }">
                    <IconSpinner :fill-color="color" />
                </template>
            </Button>
        </template>
    </GridViewTemplate>
</template>

<script>
import ConditionSetWrapper from '@Conditions/components/ConditionSetDesigner/ConditionSetWrapper';
import {
    GRAPHITE_LIGHT,
} from '@Core/assets/scss/_js-variables/colors.scss';
import Button from '@Core/components/Button/Button';
import DropZone from '@Core/components/DropZone/DropZone';
import IconRemoveFilter from '@Core/components/Icons/Actions/IconRemoveFilter';
import IconSpinner from '@Core/components/Icons/Feedback/IconSpinner';
import GridViewTemplate from '@Core/components/Layout/Templates/GridViewTemplate';
import VerticalTabBar from '@Core/components/TabBar/VerticalTabBar';
import FadeTransition from '@Core/components/Transitions/FadeTransition';
import {
    ALERT_TYPE,
} from '@Core/defaults/alerts';
import {
    DRAGGED_ELEMENT,
} from '@Core/defaults/grid';
import tabFeedbackMixin from '@Core/mixins/tab/tabFeedbackMixin';
import PRIVILEGES from '@Statuses/config/privileges';
import {
    mapActions,
    mapState,
} from 'vuex';

export default {
    name: 'ConditionDesignerTab',
    components: {
        Button,
        IconSpinner,
        GridViewTemplate,
        IconRemoveFilter,
        DropZone,
        FadeTransition,
        VerticalTabBar,
        ConditionSetWrapper,
    },
    mixins: [
        tabFeedbackMixin,
    ],
    async fetch({
        store,
    }) {
        await store.dispatch('condition/getConditions', {
            group: 'workflow',
        });
    },
    data() {
        return {
            isSubmitting: false,
        };
    },
    computed: {
        ...mapState('draggable', [
            'isElementDragging',
        ]),
        ...mapState('statusTransition', [
            'conditionSetId',
        ]),
        isAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.WORKFLOW.update,
            ]);
        },
        verticalTabs() {
            return [
                {
                    title: 'Conditions',
                    component: () => import('@Conditions/components/Tabs/Lists/ConditionsListTab'),
                    iconComponent: () => import('@Core/components/Icons/Menu/IconCategory'),
                    props: {
                        disabled: !this.isAllowedToUpdate,
                    },
                },
            ];
        },
        isDropZoneVisible() {
            return this.isElementDragging === DRAGGED_ELEMENT.TEMPLATE;
        },
        graphiteLightColor() {
            return GRAPHITE_LIGHT;
        },
    },
    beforeDestroy() {
        this.__clearGridDesignerStorage();
        this.__clearConditionStorage();
    },
    methods: {
        ...mapActions('condition', [
            'createConditionSet',
            'updateConditionSet',
        ]),
        ...mapActions('gridDesigner', {
            __clearGridDesignerStorage: '__clearStorage',
        }),
        ...mapActions('statusTransition', [
            '__setState',
            'updateStatusTransition',
        ]),
        ...mapActions('condition', {
            __clearConditionStorage: '__clearStorage',
        }),
        onSubmit() {
            if (this.isSubmitting) {
                return;
            }
            this.isSubmitting = true;

            this.removeScopeErrors(this.scope);

            if (!this.conditionSetId) {
                this.createConditionSet({
                    scope: this.scope,
                    onSuccess: this.onUpdateSuccess,
                    onError: this.onUpdateError,
                });
            } else {
                this.updateConditionSet({
                    scope: this.scope,
                    onSuccess: this.onUpdateSuccess,
                    onError: this.onUpdateError,
                });
            }
        },
        async onUpdateSuccess(id) {
            this.__setState({
                key: 'conditionSetId',
                value: id,
            });

            await this.updateStatusTransition({
                scope: this.scope,
            });

            this.$addAlert({
                type: ALERT_TYPE.SUCCESS,
                message: 'Status transition conditions have been updated',
            });

            this.isSubmitting = false;

            this.markChangeValuesAsSaved(this.scope);
        },
        onUpdateError(errors) {
            this.onError(errors);

            this.isSubmitting = false;
        },
    },
};
</script>
