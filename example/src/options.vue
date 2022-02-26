<template>
  <ul class="dqse-anchor-bar">
    <li><a href="#basic-info" :class="getClass('#basic-info')">基本信息</a></li>
    <li><a href="#attach-info" :class="getClass('#attach-info')">附件列表</a></li>
    <li><a href="#reference-from" :class="getClass('#reference-from')">关联文件</a></li>
    <li><a href="#referenced" :class="getClass('#referenced')">被关联文件</a></li>
    <li><a href="#approvement-history" :class="getClass('#approvement-history')">审批历史</a></li>
    <li><a href="#version-history" :class="getClass('#version-history')">版本历史</a></li>
    <li><a href="#factory-accept-status" :class="getClass('#factory-accept-status')">工厂接受情况</a></li>
    <li><a href="#reading-status" :class="getClass('#reading-status')">阅读情况</a></li>
  </ul>
</template>

<script>
export default {
  name: 'AnchorBar',
  data: () => {
    return {
      activeHash: ''
    }
  },
  watch: {
    $route({ hash }) {
      if (hash) {
        this.activeHash = hash
      }
    }
  },
  methods: {
    getClass(hash) {
      return hash === this.activeHash
        ? 'active'
        : ''
    }
  }
}
</script>

<style lang="less">
  .dqse-file-detail .dqse-anchor-bar {
    position: fixed;
    right: 86px;
    bottom: 68px;
    width: 140px;
    height: 344px;
    background-color: #fff;
    padding: 14px;
    padding-left: 35px;
    box-shadow: 0px 0px 12px 1px #F1F1F1;
    list-style: none;
    margin: 0;

    li a {
      font-size: 14px;
      color: #646464;
      height: 38px;
      line-height: 38px;
      cursor: pointer;

      &:hover {
        color: #eb7652;
      }
      &.active {
        color: #eb7652;
      }
    }
  }
</style>
