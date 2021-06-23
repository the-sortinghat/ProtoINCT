<template>
  <div class="container mx-auto flex flex-col p-2 h-screen">
    <ProtoHeader />

    <main class="flex flex-col lg:flex-row lg:">
      <Disclaimer class="order-2 lg:order-1 lg:w-1/2 lg:mr-2" />

      <RepoForm class="order-1 lg:order-2 lg:w-1/2" />
    </main>

    <Preconditions class="hidden md:block md:mx-auto md:mt-10" />
  </div>
</template>
