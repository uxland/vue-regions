import { invariant } from '@uxland/functional';
import { createAdapter, IRegionManager, RegionAdapterRegistry, RegionDefinition } from '@uxland/regions';
import { VueRegion } from './region';

export const regionFactory = async (
  definition: RegionDefinition,
  host: Vue,
  regionManager: IRegionManager,
  adapterRegistry: RegionAdapterRegistry
) => {
  await host.$nextTick();
  const target: any = host.$refs[definition.targetId] as Element;
  if (target) {
    const adapter = definition.adapterFactory
      ? definition.adapterFactory(definition, target)
      : createAdapter(definition, target, adapterRegistry);
    invariant(adapter, 'No region adapter found for the host');
    const targetRegionManager = definition.scoped ? regionManager.createRegionManager() : regionManager;
    const region = new VueRegion(definition.name, targetRegionManager, target, adapter, definition);
    targetRegionManager.add(definition.name, region);
    return region;
  } else console.warn(`region host with id ${definition.targetId} not found for region named ${definition.name}`);
  return undefined;
};
