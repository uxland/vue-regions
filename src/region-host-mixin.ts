import {
  IRegionBehavior,
  IRegionManager,
  multipleActiveAdapterFactory as factory,
  RegionAdapterRegistry,
  regionAdapterRegistry,
  RegionDefinition,
  regionManager
} from '@uxland/regions';
import Vue from 'vue';
import { VueClass } from 'vue-class-component/lib/declarations';
import { Mixin } from 'vue-mixin-decorator';
import { regionsProperty } from './region-decorator';
import { regionFactory } from './region-factory';

declare type MixinFunction<T1 extends VueClass<any> = VueClass<any>, T2 extends VueClass<Vue> = VueClass<Vue>> = (
  superClass: T2
) => VueClass<T1 & T2>;

export interface RegionHostMixin extends VueClass<Vue> {}

export interface RegionHostMixinConstructor extends VueClass<Vue> {
  new (...args: any[]): RegionHostMixin & VueClass<Vue>;
}

const getUxlRegions: (item: any) => { [key: string]: RegionDefinition } = item =>
  item.constructor[regionsProperty] || {};

export type RegionHostMixinFunction = MixinFunction<RegionHostMixinConstructor>;
export const RegionHostMixin: (
  RegionManager: IRegionManager,
  adapterRegistry: RegionAdapterRegistry
) => RegionHostMixinFunction = (regionManager, adapterRegistry) => (superClass: VueClass<Vue>) => {
  @Mixin
  class RegionHostMixinClass extends superClass {
    mounted() {
      //@ts-ignore
      if (super.mounted) super.mounted();
      let regions = getUxlRegions(this);
      Object.keys(regions).forEach(async name => {
        const selector = (id: string): Element => this.$refs[id] as Element;
        let region = await regionFactory(regions[name], <any>this, regionManager, adapterRegistry, selector);
        (this as any)[name] = region;
        let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
        behaviors.forEach(b => b.attach());
      });
    }
    unmounted() {
      //@ts-ignore
      if (super.unmounted) super.unmounted();
      let regions = getUxlRegions(this);
      Object.keys(regions).forEach(name => {
        let region = (this as any)[name];
        if (region) {
          region.regionManager.remove(region);
          let behaviors = region.adapter ? region.adapter.behaviors || [] : [];
          behaviors.forEach((b: IRegionBehavior) => b.detach());
        }
      });
    }
  }
  return <any>RegionHostMixinClass;
};
regionAdapterRegistry.registerDefaultAdapterFactory(factory);
export const RegionHost: RegionHostMixinFunction = RegionHostMixin(regionManager, regionAdapterRegistry);
