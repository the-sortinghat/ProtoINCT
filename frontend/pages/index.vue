<template>
  <div class="container flex flex-col p-2 bg-gray-100 h-screen">
    <header>
      <h1 class="text-4xl font-bold text-center my-10">ProtoINCT</h1>
    </header>

    <main class="flex flex-col">
      <section
        class="
          order-2
          bg-gray-200
          pl-4
          py-5
          border-indigo-600 border-l-8
          rounded-md
          text-indigo-600
        "
      >
        <h2 class="font-bold text-lg">Disclaimer</h2>
        <p class="my-3 italic">
          This is still a prototype under constant evolution. There is a list of
          pre-condition we require to guarantee proper work.
        </p>
        <nuxt-link class="underline" to="/">learn more ></nuxt-link>
      </section>

      <section class="order-1 flex flex-col">
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
    </main>
  </div>
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
