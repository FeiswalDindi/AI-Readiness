<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store';

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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="text-gold mb-3" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5A.5.5 0 0 1 1.5 4z"/></svg>`,
        bgKey: 'focus_job'
    },
    'curriculum': {
        title: 'Curriculum Development',
        description: 'Partnering with universities to integrate emerging AI technologies into existing syllabuses, ensuring students remain competitive upon graduation.',
        points: [
            'Identifying skill gaps in current programs',
            'Syllabus modernization frameworks',
            'Faculty training and development'
        ],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="text-gold mb-3" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/></svg>`,
        bgKey: 'focus_curriculum'
    },
    'ai-tools': {
        title: 'AI Tool Adoption',
        description: 'Analyzing the adoption rates, utility, and ethical implications of generative AI tools among university students in East Africa.',
        points: [
            'Generative AI for academic research',
            'Ethical usage guidelines',
            'Impact on critical thinking'
        ],
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="text-gold mb-3" viewBox="0 0 16 16"><path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.889a28.24 28.24 0 0 1 3.972.515l.705.152c.22.047.416.146.58.29l2.414 2.415a1.5 1.5 0 0 1 0 2.122l-5.203 5.204a1.5 1.5 0 0 1-2.121 0l-2.415-2.415a1.5 1.5 0 0 1-.165-1.92l.965-1.637-.168-.168a2.5 2.5 0 0 1-.723-1.442l-.128-.683c-.112-.606-.237-1.206-.406-1.785A2.998 2.998 0 0 1 3 8.062Zm1.653 2.115.178.179a.5.5 0 0 1 .135.253l.13 1.037.494 3.955a.5.5 0 0 0 .497.438h3.826a.5.5 0 0 0 .497-.438l.494-3.955.13-1.037a.5.5 0 0 1 .135-.253l.178-.179c.655-.655 1.705-.655 2.36 0l1.326 1.326a.5.5 0 0 0 .707 0l2.652-2.652a.5.5 0 0 0 0-.707l-1.326-1.326a1.67 1.67 0 0 0-2.36 0l-.178.179a.5.5 0 0 1-.253.135l-1.037.13-3.955.494a.5.5 0 0 0-.438.497v3.826a.5.5 0 0 0 .438.497l3.955.494 1.037.13a.5.5 0 0 1 .253.135l.178.179c.655.655.655 1.705 0 2.36l-1.326 1.326a.5.5 0 0 1-.707 0l-2.652-2.652a.5.5 0 0 1 0-.707l1.326-1.326c.655-.655 1.705-.655 2.36 0l.178.179c.075.075.17.118.253.135l1.037.13 3.955.494c.264.033.438.272.438.497v3.826c0 .225-.174.464-.438.497l-3.955.494-1.037.13a.5.5 0 0 1-.253.135l-.178.179a1.67 1.67 0 0 0 0 2.36l1.326 1.326a.5.5 0 0 0 .707 0l2.652-2.652a.5.5 0 0 0 0-.707l-1.326-1.326a1.67 1.67 0 0 0-2.36 0l-.178.179a.5.5 0 0 1-.253.135l-1.037.13-3.955.494A.5.5 0 0 0 4.653 14.13Z"/></svg>`,
        bgKey: 'focus_tools'
    }
};

const currentContent = computed(() => {
    return contentMap[areaId.value] || contentMap['job-market'];
});
</script>

<template>
  <main class="focus-page bg-light min-vh-100 pb-5">
    
    <section class="page-header py-5 bg-navy text-white text-center position-relative overflow-hidden" 
             style="padding-top: 120px !important;"
             :style="store.content.pageBackgrounds?.[currentContent.bgKey] ? `background-image: linear-gradient(rgba(27, 44, 87, 0.85), rgba(27, 44, 87, 0.95)), url(${store.content.pageBackgrounds[currentContent.bgKey]}); background-size: cover; background-position: center;` : ''"
    >
      <div class="container py-5 position-relative z-2 mt-4">
        <h6 class="text-gold ls-2 text-uppercase mb-3 fw-bold">Research Vertical</h6>
        <h1 class="display-4 fw-bold mb-3">{{ currentContent.title }}</h1>
      </div>
    </section>

    <section class="py-5">
      <div class="container py-4">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm p-5 rounded-0 bg-white text-center">
                    
                    <div v-html="currentContent.icon"></div>

                    <p class="lead text-muted mb-5" style="line-height: 1.8;">
                        {{ currentContent.description }}
                    </p>
                    
                    <h5 class="fw-bold text-navy mb-4">Key Areas of Investigation</h5>
                    <ul class="list-unstyled d-flex flex-column gap-3 text-start mx-auto" style="max-width: 400px;">
                        <li v-for="(point, idx) in currentContent.points" :key="idx" class="d-flex align-items-center gap-3 p-3 bg-light rounded-0 border">
                            <span class="badge bg-gold text-navy rounded-0 px-3 py-2 fw-bold">0{{ idx + 1 }}</span>
                            <span class="fw-semibold text-navy">{{ point }}</span>
                        </li>
                    </ul>

                    <div class="mt-5 pt-4 border-top">
                        <router-link to="/insights" class="btn btn-navy rounded-0 px-5 py-3 fw-bold shadow-sm">
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
