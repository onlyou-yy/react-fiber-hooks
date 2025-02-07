/**表示文本元素 */
export const ELEMENT_TEXT = Symbol.for("ELEMENT_TEXT")
/**根元素 */
export const TAG_ROOT = Symbol.for("TAG_ROOT")
/**原生节点，span div p 函数组件，类组件 */
export const TAG_HOST = Symbol.for("TAG_HOST")
/**文本节点 */
export const TAG_TEXT = Symbol.for("TAG_TEXT")
/**新增节点 */
export const PLACEMENT = Symbol.for("PLACEMENT")
/**删除节点 */
export const DELETION = Symbol.for("DELETION")