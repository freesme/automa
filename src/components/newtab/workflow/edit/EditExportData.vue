<template>
  <div>
    <ui-textarea
      :model-value="data.description"
      class="w-full"
      :placeholder="t('common.description')"
      @change="updateData({ description: $event })"
    />
    <ui-select
      :model-value="data.dataToExport"
      :placeholder="t('workflow.blocks.export-data.dataToExport.placeholder')"
      class="w-full mt-2"
      @change="updateData({ dataToExport: $event })"
    >
      <option v-for="option in dataToExport" :key="option" :value="option">
        {{ t(`workflow.blocks.export-data.dataToExport.options.${option}`) }}
      </option>
    </ui-select>
    <ui-input
      :model-value="data.name"
      class="w-full mt-2"
      title="File name"
      placeholder="File name"
      @change="updateData({ name: $event })"
    />
    <ui-input
      v-if="data.dataToExport === 'google-sheets'"
      :model-value="data.refKey"
      :title="t('workflow.blocks.export-data.refKey')"
      :placeholder="t('workflow.blocks.export-data.refKey')"
      class="w-full mt-2"
      @change="updateData({ refKey: $event })"
    />
    <ui-select
      :model-value="data.type"
      :placeholder="t('workflow.blocks.export-data.exportAs')"
      class="w-full mt-2"
      @change="updateData({ type: $event })"
    >
      <option v-for="type in dataExportTypes" :key="type.id" :value="type.id">
        {{ type.name }}
      </option>
    </ui-select>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { dataExportTypes } from '@/utils/shared';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:data']);

const { t } = useI18n();
const dataToExport = ['data-columns', 'google-sheets'];

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
</script>
