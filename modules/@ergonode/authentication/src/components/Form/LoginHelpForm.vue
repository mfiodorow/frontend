/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <LoginForm>
        <template #header>
            <div class="help-form__header">
                <Fab @click.native="onBack">
                    <template #icon="{ color }">
                        <IconArrowPointer :fill-color="color" />
                    </template>
                </Fab>
                <h2 v-text="helpHeader" />
            </div>
        </template>
        <template #body>
            <p
                v-text="helpInfo"
                class="help-form__info" />
            <LinkButton title="team@ergonode.com">
                <template #prepend>
                    <IconEmail class="email-icon" />
                </template>
            </LinkButton>
        </template>
        <template #proceedForm>
            <Button
                title="BACK TO LOG IN PAGE"
                type="submit"
                @click.stop.prevent.native="onBack" />
        </template>
    </LoginForm>
</template>

<script>
import LoginForm from '@Authentication/components/Form/LoginForm';
import {
    LOGIN_STATE,
} from '@Authentication/defaults/login-state';
import Button from '@Core/components/Button/Button';
import Fab from '@Core/components/Fab/Fab';
import IconArrowPointer from '@Core/components/Icons/Arrows/IconArrowPointer';
import IconEmail from '@Core/components/Icons/Others/IconEmail';
import LinkButton from '@Core/components/LinkButton/LinkButton';

export default {
    name: 'LoginHelpForm',
    components: {
        LoginForm,
        Fab,
        IconArrowPointer,
        LinkButton,
        IconEmail,
        Button,
    },
    computed: {
        helpHeader() {
            return 'Help';
        },
        helpInfo() {
            return 'If you have any problems with your account, please contact the system administrator';
        },
    },
    methods: {
        onBack() {
            this.$emit('back-to', LOGIN_STATE.CREDENTIALS);
        },
    },
};
</script>

<style lang="scss" scoped>
    .login-header {
        justify-content: flex-start;
    }

    .help-form {
        &__header {
            display: grid;
            align-items: center;
            grid-auto-flow: column;
            grid-column-gap: 16px;
            font: $FONT_SEMI_BOLD_20_24;
        }

        &__info {
            font: $FONT_MEDIUM_14_20;
        }

        &__info, &__header {
            color: $GRAPHITE_DARK;
        }
    }

    .email-icon {
        margin-right: 8px;
    }
</style>
