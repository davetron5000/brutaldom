import BrutalJSBase from "../BrutalJSBase"
import View         from "./View"
import Layout       from "./Layout"
import TypeOf       from "../JunkDrawer/TypeOf"

class RenderView extends BrutalJSBase {
  render(window) {
    this.methodStart("render")
    const document = window.document

    const layoutClass = Layout.layoutRegistry.layoutFromDocument(document)
    const layout = new layoutClass(window)
    layout.layout().then( (...passToView) => {
      const [ viewClass, viewElement ] = View.viewRegistry.viewFromDocument(document)
      const view = new viewClass(viewElement)
      view.render(...passToView).finally( () => {
        this.methodDone("render"), { view: TypeOf.asString(view), layout: TypeOf.asString(layout) }
      })
    })
  }
}

export default RenderView
