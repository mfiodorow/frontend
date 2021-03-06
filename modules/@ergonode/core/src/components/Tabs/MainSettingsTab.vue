/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <CenterViewTemplate :fixed="true">
        <template #centeredContent>
            <MainSettingsForm
                submit-title="SAVE CHANGES"
                :is-submitting="isSubmitting"
                :scope="scope"
                :change-values="changeValues"
                :errors="errors"
                @submit="onSubmit" />
        </template>
    </CenterViewTemplate>
</template>

<script>
import MainSettingsForm from '@Core/components/Forms/MainSettingsForm';
import CenterViewTemplate from '@Core/components/Layout/Templates/CenterViewTemplate';
import {
    ALERT_TYPE,
} from '@Core/defaults/alerts';
import {
    MODAL_TYPE,
} from '@Core/defaults/modals';
import tabFeedbackMixin from '@Core/mixins/tab/tabFeedbackMixin';
import {
    mapActions,
    mapState,
} from 'vuex';

export default {
    name: 'MainSettingsTab',
    components: {
        MainSettingsForm,
        CenterViewTemplate,
    },
    mixins: [
        tabFeedbackMixin,
    ],
    data() {
        return {
            isSubmitting: false,
        };
    },
    computed: {
        ...mapState('core', [
            'languagesTree',
            'languages',
        ]),
    },
    methods: {
        ...mapActions('core', [
            'getLanguages',
            'updateLanguages',
        ]),
        onSubmit(selectedLanguages) {
            if (this.isSubmitting) {
                return;
            }

            if (selectedLanguages.length < 1) {
                this.$addAlert({
                    type: ALERT_TYPE.ERROR,
                    message: 'At least one language is required',
                });

                return;
            }

            const isUsedOnTree = this.languagesTree.find(
                ({
                    id,
                }) => selectedLanguages.indexOf(id) === -1,
            );

            if (isUsedOnTree) {
                this.$addAlert({
                    type: ALERT_TYPE.ERROR,
                    message: 'You cannot deactivate languages used on the language tree',
                });

                return;
            }

            this.$openModal({
                key: MODAL_TYPE.GLOBAL_CONFIRM_MODAL,
                message: 'Changes in language settings will affect the entire application.',
                confirmCallback: () => this.onConfirm(this.languages
                    .filter(language => selectedLanguages.some(id => language.id === id))
                    .map(({
                        code,
                    }) => code)),
            });
        },
        async onConfirm(selectedLanguages) {
            this.isSubmitting = true;

            this.removeScopeErrors(this.scope);

            await this.updateLanguages({
                languages: selectedLanguages,
                scope: this.scope,
                onError: this.onUpdateError,
                onSuccess: this.onUpdateSuccess,
            });
        },
        async onUpdateSuccess() {
            await this.getLanguages();

            this.$addAlert({
                type: ALERT_TYPE.SUCCESS,
                message: 'Languages have been updated',
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
