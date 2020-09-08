<template>
  <div class="footer row">
    <div class="col-lg align-self-center">
      <JoinBtn />
    </div>
  </div>
</template>

<script>
import JoinBtn from '@/components/JoinBtn'

export default {
  name: 'Footer',
  components: {
    JoinBtn
  }
}
</script>

<style lang="css" scoped>
.footer {
  height: 80px;
}
</style>
