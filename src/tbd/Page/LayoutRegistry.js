import ClassRegistry from "../ClassRegistry"

class LayoutRegistry extends ClassRegistry {
  registerLayout(layout) {
    super.registerClass(layout)
  }

  layoutFromDocument(document) {
    return super.classFromDocument(document,"layout")[0]
  }
}

export default LayoutRegistry
