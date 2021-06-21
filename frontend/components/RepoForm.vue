<template>
  <section class="flex flex-col">
    <label for="githuburl">GitHub URL:</label>
    <input
      id="githuburl"
      v-model="repoURL"
      type="text"
      class="rounded shadow my-2 px-2 py-1 border-2 border-gray-300"
    />

    <p v-if="hasError" class="-mt-1 pl-2 text-sm text-red-400">
      {{ error }}
    </p>

    <button
      class="
        my-4
        py-2
        shadow-md
        rounded-md
        bg-blue-400
        text-gray-100
        font-bold
        text-lg
      "
      :disabled="isLoading"
      @click="submit"
    >
      submit
    </button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  public error: string = ''
  public repoURL: string = ''
  public isLoading: boolean = false

  get hasError() {
    return this.error.length > 0
  }

  submit() {
    this.isLoading = true

    const { isValid, reason } = this.validateURL(this.repoURL)

    if (!isValid) this.error = reason
    else this.error = ''

    this.isLoading = false
  }

  private validateURL(url: string) {
    const rgx = /^(https:\/\/)?(www\.)?github.com\/\w+\/\w+$/

    if (!rgx.test(url)) return { isValid: false, reason: 'Invalid URL' }

    return { isValid: true, reason: '' }
  }
}
</script>
