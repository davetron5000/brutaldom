import ClassRegistry from "../ClassRegistry"
class ViewRegistry extends ClassRegistry {
  registerView(view) {
    super.registerClass(view)
  }

  viewFromDocument(document) {
    return super.classFromDocument(document,"view")
  }
}

export default ViewRegistry
