/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import {
    ALERT_TYPE,
} from '@Core/defaults/alerts';
import {
    getParsedFilters,
    getSortedColumnsByIDs,
} from '@Core/models/mappers/gridDataMapper';
import {
    getMappedObjectOptions,
} from '@Core/models/mappers/translationsMapper';

export const getGridData = async ({
    $route,
    $cookies,
    $axios,
    path,
    params,
}) => {
    const config = {
        params,
    };

    if (params.filter) {
        config.params.filter = getParsedFilters(params.filter);
    }

    const {
        collection,
        columns,
        info: {
            filtered,
        },
    } = await $axios.$get(path, config);

    const sortedColumns = params.columns
        ? getSortedColumnsByIDs(columns, params.columns)
        : columns;

    if (!$cookies.get(`GRID_CONFIG:${$route.name}`)) {
        $cookies.set(
            `GRID_CONFIG:${$route.name}`,
            sortedColumns
                .map(({
                    id,
                }) => id)
                .join(','),
        );
    }

    return {
        columns: sortedColumns,
        rows: collection,
        filtered,
    };
};

export const getAdvancedFiltersData = async ({
    $route,
    $cookies,
    $axios,
    $addAlert,
    path,
    params,
}) => {
    const {
        columns,
    } = await $axios.$get(path, {
        params,
    });

    const {
        length,
    } = columns;
    const advancedFilters = [];

    for (let i = 0; i < length; i += 1) {
        const {
            id,
            element_id,
            language,
            filter,
            label,
            parameters,
        } = columns[i];

        if (filter) {
            const mappedFilter = {
                id,
                attributeId: element_id || '',
                languageCode: language,
                type: filter.type,
                label,
                parameters,
            };

            if (filter.options) {
                mappedFilter.options = getMappedObjectOptions({
                    options: filter.options,
                    languageCode: language,
                });
            }

            advancedFilters.push(mappedFilter);
        } else {
            $addAlert({
                type: ALERT_TYPE.ERROR,
                message: 'Attribute has no filter',
            });
        }
    }

    if (!$cookies.get(`GRID_ADV_FILTERS_CONFIG:${$route.name}`)) {
        $cookies.set(
            `GRID_ADV_FILTERS_CONFIG:${$route.name}`,
            advancedFilters
                .map(({
                    id,
                }) => id)
                .join(','),
        );
    }

    return advancedFilters;
};
