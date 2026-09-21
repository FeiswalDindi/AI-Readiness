<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps(['logs']);

const analytics = computed(() => {
    const data = props.logs || [];
    return {
        total: data.length,
        logins: data.filter(l => l.action === 'Login').length,
        views: data.filter(l => l.action === 'Page View').length
    };
});

const chartData = computed(() => {
    const daysMap = {};
    const today = new Date();
    
    const getLocalKey = (d) => {
        return d.getFullYear() + '-' + 
               String(d.getMonth() + 1).padStart(2, '0') + '-' + 
               String(d.getDate()).padStart(2, '0');
    };

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = getLocalKey(d);
        daysMap[key] = {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: 0
        };
    }

    if (props.logs) {
        props.logs.forEach(log => {
            let logDate = null;
            if (log.timestamp && log.timestamp.seconds) {
                logDate = new Date(log.timestamp.seconds * 1000);
            } else if (log.rawDate) {
                logDate = new Date(log.rawDate);
            }

            if (logDate) {
                const key = getLocalKey(logDate);
                if (daysMap[key]) {
                    daysMap[key].count++;
                }
            }
        });
    }

    const sortedKeys = Object.keys(daysMap).sort();
    const maxVal = Math.max(...sortedKeys.map(k => daysMap[k].count), 1); 

    return sortedKeys.map(key => ({ 
        date: daysMap[key].date, 
        count: daysMap[key].count, 
        height: (daysMap[key].count / maxVal) * 100 + '%' 
    }));
});
</script>

<template>
  <div class="row g-4 mb-4">
    <div class="col-lg-4">
      <div class="row g-3 h-100">
        <div class="col-12">
            <div class="p-3 bg-light-navy rounded border border-navy h-100 d-flex flex-column justify-content-center position-relative overflow-hidden">
              <h2 class="fw-bold text-navy mb-0 position-relative z-2">{{ analytics.total }}</h2>
              <small class="text-muted fw-bold text-uppercase position-relative z-2">Total Activity</small>
              <svg class="position-absolute end-0 bottom-0 mb-n2 me-n2 text-navy opacity-10" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2zm3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.64a.5.5 0 0 1 .495.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 4.36 6H6v1.5a.5.5 0 0 0 1 0V6h3z"/>
              </svg>
            </div>
        </div>
        <div class="col-6">
            <div class="p-3 bg-light rounded border h-100">
              <h4 class="fw-bold text-success mb-0">{{ analytics.logins }}</h4>
              <small class="text-muted small">Logins</small>
            </div>
        </div>
        <div class="col-6">
            <div class="p-3 bg-light rounded border h-100">
              <h4 class="fw-bold text-gold mb-0">{{ analytics.views }}</h4>
              <small class="text-muted small">Views</small>
            </div>
        </div>
      </div>
    </div>

    <div class="col-lg-8">
      <div class="p-3 border rounded bg-white h-100 d-flex flex-column">
        <div class="d-flex justify-content-between align-items-center mb-3">
             <small class="fw-bold text-muted text-uppercase ls-2">7-Day Engagement Trend</small>
             <div class="d-flex align-items-center gap-2">
                 <span class="status-dot"></span>
                 <small class="text-muted" style="font-size: 0.7rem;">Live</small>
             </div>
        </div>
        
        <div class="d-flex align-items-end justify-content-between flex-grow-1" style="min-height: 150px;">
          <div v-for="day in chartData" :key="day.date" class="d-flex flex-column align-items-center" style="width: 12%;">
            
            <div class="bg-navy rounded-top w-100 position-relative chart-bar" :style="{ height: day.height, minHeight: '4px' }">
                <div class="bar-tooltip">{{ day.count }} Events</div>
            </div>
            
            <small class="text-muted mt-2 fw-bold" style="font-size: 0.65rem;">{{ day.date }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* STRICT HEX CODES APPLIED */
.text-navy { color: #1b2c57; }
.bg-navy { background-color: #1b2c57; }
.text-gold { color: #bea429; }
.border-navy { border-color: #1b2c57 !important; }

.bg-light-navy { background-color: #f4f6fa; }
.ls-2 { letter-spacing: 2px; }
.opacity-10 { opacity: 0.1; }

.status-dot { width: 6px; height: 6px; background-color: #bea429; border-radius: 50%; animation: blink 2s infinite; }
@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

.chart-bar { transition: height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; opacity: 0.8; }
/* Changed hover from sky blue to gold */
.chart-bar:hover { background-color: #bea429; opacity: 1; transform: scaleY(1.05); transform-origin: bottom; }

.bar-tooltip { 
    position: absolute; 
    top: -30px; 
    left: 50%; 
    transform: translateX(-50%); 
    background: #1b2c57; 
    color: white; 
    padding: 4px 8px; 
    border-radius: 4px; 
    font-size: 0.7rem; 
    opacity: 0; 
    transition: 0.2s; 
    pointer-events: none; 
    white-space: nowrap;
    z-index: 5;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.chart-bar:hover .bar-tooltip { opacity: 1; top: -35px; }
</style>