<template>
  <!-- 按钮组件 -->
  <!-- 可利用 slot 嵌入svg 图标，构成图标按钮-->
  <button class="button-icon">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'ButtonIcon',
};
</script>

<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: transparent;
  margin: 4px;
  border-radius: 25%;
  transition: 0.2s;
}
button .svg-icon {
  color: var(--color-text);
  height: 16px;
  width: 16px;
}
button:first-child {
  margin-left: 0;
}
button:hover {
  background: var(--color-secondary-bg-for-transparent);
}
button:active {
  transform: scale(0.92);
}
</style>
