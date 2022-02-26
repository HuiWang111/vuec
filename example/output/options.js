import { normalizeClass as _normalizeClass, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
const _hoisted_1 = {
  class: "dqse-anchor-bar"
};
export default {
  name: 'AnchorBar',
  data: () => {
    return {
      activeHash: ''
    };
  },
  watch: {
    $route({
      hash
    }) {
      if (hash) {
        this.activeHash = hash;
      }
    }

  },
  methods: {
    getClass(hash) {
      return hash === this.activeHash ? 'active' : '';
    }

  },
  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock("ul", _hoisted_1, [_createElementVNode("li", null, [_createElementVNode("a", {
      href: "#basic-info",
      class: _normalizeClass(_ctx.getClass('#basic-info'))
    }, "基本信息", 2
    /* CLASS */
    )]), _createElementVNode("li", null, [_createElementVNode("a", {
      href: "#attach-info",
      class: _normalizeClass(_ctx.getClass('#attach-info'))
    }, "附件列表", 2
    /* CLASS */
    )]), _createElementVNode("li", null, [_createElementVNode("a", {
      href: "#reference-from",
      class: _normalizeClass(_ctx.getClass('#reference-from'))
    }, "关联文件", 2
    /* CLASS */
    )]), _createElementVNode("li", null, [_createElementVNode("a", {
      href: "#referenced",
      class: _normalizeClass(_ctx.getClass('#referenced'))
    }, "被关联文件", 2
    /* CLASS */
    )]), _createElementVNode("li", null, [_createElementVNode("a", {
      href: "#approvement-history",
      class: _normalizeClass(_ctx.getClass('#approvement-history'))
    }, "审批历史", 2
    /* CLASS */
    )]), _createElementVNode("li", null, [_createElementVNode("a", {
      href: "#version-history",
      class: _normalizeClass(_ctx.getClass('#version-history'))
    }, "版本历史", 2
    /* CLASS */
    )]), _createElementVNode("li", null, [_createElementVNode("a", {
      href: "#factory-accept-status",
      class: _normalizeClass(_ctx.getClass('#factory-accept-status'))
    }, "工厂接受情况", 2
    /* CLASS */
    )]), _createElementVNode("li", null, [_createElementVNode("a", {
      href: "#reading-status",
      class: _normalizeClass(_ctx.getClass('#reading-status'))
    }, "阅读情况", 2
    /* CLASS */
    )])]);
  }
};