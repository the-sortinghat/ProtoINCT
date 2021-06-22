<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Preconditions:</h2>
    <p>
      This work is a prototype, it has a narrow scope of implementation yet. The
      conditions under which this tool works are the following:
    </p>

    <ul class="list-disc list-inside m-2">
      <li>
        Only repositories hosted at
        <a target="_blank" href="github.com">GitHub</a>
      </li>

      <li>
        Projects must be configured to use
        <a target="_blank" href="https://docs.docker.com/compose/">
          Docker Compose
        </a>
        for development
      </li>

      <li>
        The <code class="text-red-300">docker-compose.yaml</code> must be named
        exactly like that and must be placed at the root of the repository
      </li>

      <li>
        As the prototype focus on <strong>Database per Service</strong>, there
        is a list of supported DBMS:

        <ul class="ml-8 list-disc list-inside">
          <li>MongoDB</li>

          <li>PostgreSQL</li>

          <li>MySQL</li>
        </ul>
      </li>
    </ul>
  </div>
</template>
