<template>
  <div class="d-flex align-items-center">
    <hr class="flex-grow-1 my-0 hr" />
    <span class="mx-2 text-truncate span"><slot /></span>
    <hr class="flex-grow-1 my-0 hr" />
  </div>
</template>

<style scoped>
.hr {
  min-width: 12px;
}
.span {
  min-width: 0;
}
</style>
