import { invariant } from '@uxland/functional';
import { Region, ViewDefinition } from '@uxland/regions';
import { viewFactory } from './view-factory';

export class VueRegion extends Region<any> {
  async activate(view: string | ViewDefinition) {
    let vw: ViewDefinition = view as ViewDefinition;
    if (typeof view === 'string') {
      vw = this.getView(view);
      invariant(vw, `Region does not contain a view with key ${view}`);
    } else
      invariant(
        Object.keys(this.views).some(key => typeof this.views[key] !== 'undefined'),
        'Region does not contain this view'
      );
    if (!this.activeViews.some(v => v === vw)) {
      if (!this.components.has(vw)) {
        let element = await viewFactory(vw, this, typeof view === 'string' ? view : this.getKey(vw));
        this.components.set(vw, element);
      }
      let element: Element | any = this.components.get(vw);
      this.activeViews.push(vw);
      if (element) {
        if (element.hasOwnProperty('__vue__')) element.__vue__.active = true;
        this.adapter.activateView(element);
      }
    }
    return this;
  }

  async deactivate(view: string | ViewDefinition) {
    let v: ViewDefinition = typeof view === 'string' ? this.getView(view) : (view as ViewDefinition);
    let index = this.activeViews.indexOf(v);
    if (index !== -1) this.activeViews.splice(index, 1);
    let component: Element | any = this.components.get(v);
    if (component) {
      if (component.hasOwnProperty('__vue__')) component.__vue__.active = false;
      await this.adapter.deactivateView(component);
    }
  }
}
