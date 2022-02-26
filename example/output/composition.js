import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
import { reactive, computed } from 'vue';

const _hoisted_1 = /*#__PURE__*/_createElementVNode("p", null, "Has published books:", -1
/* HOISTED */
);

export default {
  setup(__props, {
    expose
  }) {
    expose();
    const author = reactive({
      name: 'John Doe',
      books: ['Vue 2 - Advanced Guide', 'Vue 3 - Basic Guide', 'Vue 4 - The Mystery']
    }); // a computed ref

    const publishedBooksMessage = computed(() => {
      return author.books.length > 0 ? 'Yes' : 'No';
    });
    const __returned__ = {
      author,
      publishedBooksMessage,
      reactive,
      computed
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true
    });
    return __returned__;
  },

  render: function render(_ctx, _cache) {
    return _openBlock(), _createElementBlock(_Fragment, null, [_hoisted_1, _createElementVNode("span", null, _toDisplayString(_ctx.publishedBooksMessage), 1
    /* TEXT */
    )], 64
    /* STABLE_FRAGMENT */
    );
  }
};