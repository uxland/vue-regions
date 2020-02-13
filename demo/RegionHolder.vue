<template>
  <div ref="region-holder"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RegionHost } from '../src/region-host-mixin';
import Component from 'vue-class-component';
import { region } from '../src/region-decorator';
import { IRegion, ViewDefinition, regionManager } from '@uxland/regions';

const TestComponentImport = () => import('./TestComponent.vue');

@Component
export default class RegionHolder extends RegionHost(Vue) {
  @region({ name: 'regionHolder', targetId: 'region-holder' })
  regionHolder!: IRegion;
}

const viewFactory = (content: string): any => async () => {
  const component = await TestComponentImport();
  return Promise.resolve(component.default);
};

const spanFactory = content => async () => {
  let span = document.createElement('span');
  span.textContent = content;
  return Promise.resolve(<any>span);
};

regionManager.registerViewWithRegion('regionHolder', 'view1', {
  factory: spanFactory('view1'),
  options: { msg: 'span' },
});
regionManager.registerViewWithRegion('regionHolder', 'view2', {
  factory: viewFactory('view2'),
  options: { msg: 'vue' },
});
</script>
