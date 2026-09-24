<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const areaId = computed(() => route.params.area);

const contentMap = {
    'job-market': {
        title: 'Job Market Analysis',
        description: 'Exploring how Artificial Intelligence shapes modern recruitment processes and impacts recent graduates seeking employment in competitive markets.',
        points: [
            'Resume optimization algorithms',
            'AI-driven interview screening',
            'Employer expectations for digital skills'
        ],
        icon: '💼'
    },
    'curriculum': {
        title: 'Curriculum Development',
        description: 'Partnering with universities to integrate emerging AI technologies into existing syllabuses, ensuring students remain competitive upon graduation.',
        points: [
            'Identifying skill gaps in current programs',
            'Syllabus modernization frameworks',
            'Faculty training and development'
        ],
        icon: '📚'
    },
    'ai-tools': {
        title: 'AI Tool Adoption',
        description: 'Analyzing the adoption rates, utility, and ethical implications of generative AI tools among university students in East Africa.',
        points: [
            'Generative AI for academic research',
            'Ethical usage guidelines',
            'Impact on critical thinking'
        ],
        icon: '🤖'
    }
};

const currentContent = computed(() => {
    return contentMap[areaId.value] || {
        title: 'Project Focus Area',
        description: 'Detailed insights on our specific research verticals.',
        points: ['Research', 'Analysis', 'Policy'],
        icon: '🔍'
    };
});
</script>

<template>
  <main class="focus-page bg-light min-vh-100 pb-5">
    
    <section class="page-header py-5 bg-navy text-white text-center position-relative overflow-hidden" style="padding-top: 120px !important;">
      <div class="container py-5 position-relative z-2 mt-4">
        <div class="display-1 mb-3">{{ currentContent.icon }}</div>
        <h6 class="text-gold ls-2 text-uppercase mb-3 fw-bold">Research Vertical</h6>
        <h1 class="display-4 fw-bold mb-3">{{ currentContent.title }}</h1>
      </div>
    </section>

    <section class="py-5">
      <div class="container py-4">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm p-5 rounded-4 bg-white text-center">
                    <p class="lead text-muted mb-5" style="line-height: 1.8;">
                        {{ currentContent.description }}
                    </p>
                    
                    <h5 class="fw-bold text-navy mb-4">Key Areas of Investigation</h5>
                    <ul class="list-unstyled d-flex flex-column gap-3 text-start mx-auto" style="max-width: 400px;">
                        <li v-for="(point, idx) in currentContent.points" :key="idx" class="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border">
                            <span class="badge bg-gold text-navy rounded-pill px-3 py-2 fw-bold">0{{ idx + 1 }}</span>
                            <span class="fw-semibold text-navy">{{ point }}</span>
                        </li>
                    </ul>

                    <div class="mt-5 pt-4 border-top">
                        <router-link to="/insights" class="btn btn-navy rounded-pill px-5 py-3 fw-bold shadow-sm">
                            Read Latest Findings
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
.bg-navy { background-color: #1b2c57 !important; }
.text-navy { color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }
.bg-gold { background-color: #bea429 !important; }
.btn-navy { background-color: #1b2c57; color: white; transition: 0.3s; }
.btn-navy:hover { background-color: #121e3a; color: white; transform: translateY(-2px); }
.ls-2 { letter-spacing: 2px; }
</style>
