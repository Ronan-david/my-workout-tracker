<script setup lang="ts">
interface Feature {
  name: string
  description: string
  url?: string
}

const features: Feature[] = [
  {
    name: 'Vue 3',
    description: 'The latest version of Vue.js with improved performance and new features',
    url: 'https://vuejs.org/',
  },
  {
    name: 'TypeScript',
    description: 'Type-safe JavaScript that compiles to plain JavaScript',
    url: 'https://www.typescriptlang.org/',
  },
  {
    name: 'SCSS',
    description: 'CSS preprocessor with variables, nesting, and mixins',
    url: 'https://sass-lang.com/',
  },
  {
    name: 'Vite',
    description: 'Fast build tool and development server',
    url: 'https://vitejs.dev/',
  },
]
</script>

<template>
  <div class="about">
    <div class="card">
      <h1>About This Project</h1>
      <p>
        This Vue.js 3 Single Page Application was created with modern web development tools and best
        practices in mind. It provides a solid foundation for building scalable and maintainable web
        applications.
      </p>
    </div>

    <div class="card">
      <h2>Technologies Used</h2>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.name" class="feature-card">
          <h3>{{ feature.name }}</h3>
          <p>{{ feature.description }}</p>
          <a v-if="feature.url" :href="feature.url" target="_blank" rel="noopener" class="btn">
            Learn More
          </a>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Project Structure</h2>
      <ul>
        <li><code>src/</code> - Source code directory</li>
        <li><code>src/assets/</code> - Static assets and styles</li>
        <li><code>src/views/</code> - Vue components for different pages</li>
        <li><code>src/router/</code> - Vue Router configuration</li>
        <li><code>public/</code> - Public static files</li>
        <li><code>e2e/</code> - End-to-end tests</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about {
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .feature-card {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #42b883;

    h3 {
      margin-top: 0;
      color: #35495e;
    }

    p {
      margin-bottom: 1rem;
    }
  }

  ul {
    text-align: left;

    li {
      margin: 0.5rem 0;

      code {
        background: #f4f4f4;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }
    }
  }
}
</style>
