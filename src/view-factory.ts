import { IRegion, ViewComponent, ViewDefinition, ViewFactory, viewFactory as viewFactoryBase } from '@uxland/regions';

const createViewFromFactory = (factory: ViewFactory, key: string, view: ViewDefinition, region: IRegion) =>
  factory().then((component: any) => {
    var element = new component();
    element.view = view;
    element.region = region;
    element.viewKey = key;
    element.$mount();
    return element.$el;
  });

export const viewFactory = async (
  view: ViewDefinition,
  parentRegion: IRegion,
  viewKey: any
): Promise<HTMLElement & ViewComponent> => {
  let element: any;
  if (view.element) element = view.element;
  else if (view.factory) element = await createViewFromFactory(view.factory, viewKey, view, parentRegion);
  else await viewFactoryBase(view, parentRegion, viewKey);
  element.view = view;
  element.region = parentRegion;
  element.viewKey = viewKey;
  return element;
};
