<template>
  <div class="col-lg-3 col-12 mb-4">
    <div class="d-flex card-info rounded p-3">
      <div class="top">
        <h5 class="card-info-title text-primary">
          {{ info.name }}
        </h5>
      </div>
      <div class="bottom">
        <span>
          {{ info.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileCard',
  props: {
    info: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="css" scoped>
.card-info {
  height: 120px;
  background-color: white;
  flex-direction: column;
}

.card-info-title {
  font-weight: 300;
}

.bottom {
  margin-top: auto;
}

.bottom span {
  word-break: break-all;
}
</style>
