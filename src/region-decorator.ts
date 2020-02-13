import { RegionDefinition } from '@uxland/regions';

export const regionsProperty = '__uxl_regions__';

export const region = (regionDefinition: RegionDefinition) => (proto: any, propName: string) => {
  proto.constructor[regionsProperty] = { ...proto.constructor[regionsProperty], [propName]: regionDefinition };
};
