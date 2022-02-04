<template>
  <div :class="baseclass">
    <label :for="target + DS" class="form-label" :class="{required: req}">{{ label }}</label>
    <pop-help :content="help" v-if="content"></pop-help>
    <input :type="type" class="form-control" :name="target + DS" v-model.lazy="value" :step="step ? step : ''" v-if="type != 'radio' && type != 'checkbox'">
    <div class="form-check" v-else v-for="val in values">
      <input class="form-check-input" :type="type" :name="target + DS" :id="val + DS" :value="val" v-model="value">
      <label class="form-check-label" :for="val + DS">{{ val }}</label>
    </div>
  </div>
</template>

<script>
import PopHelp from './PopHelp.vue'
export default {
  name: 'InputType',
  components: {
    PopHelp,
  }, props: {
    content: Object,
    baseclass: {type: String, default: ''},
    DS: {type: String, default: ''},
  }, data () {
    return {
      target: '',
      req: '',
      label: '',
      help: '',
      type: 'text',
      step: '',
      value: '',
      values: [],
    }
  }, watch: {
    value: {
      handler(val) {
        this.$emit('update', val, this.target)
      }
    }
  }, mounted () {
    this.target = this.content.name
    this.req = this.content.req
    this.label = this.content.label
    this.help = this.content.help
    if (this.content.type != undefined) {
      this.type = this.content.type
      if (this.content.type == "checkbox" || this.content.type == "radio") {
        this.values = this.content.value
        if (this.content.type == "checkbox") {
          this.value = []
        }
      }
    }
    if (this.content.step != undefined) {
      this.step = this.content.step
    }

  }
}
</script>

<style>
</style>
