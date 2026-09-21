<script setup>
// Official Client Categories from the Document
const clientTypes = [
    { 
        name: 'National & County Governments', 
        icon: '<path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z"/>' 
    },
    { 
        name: 'State Corporations & Agencies', 
        icon: '<path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 1.172 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"/>' 
    },
    { 
        name: 'Development Partners & NGOs', 
        icon: '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>' 
    },
    { 
        name: 'Financial Institutions', 
        icon: '<path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/><path d="M1 5h12v9H1V5zm1 1v7h10V6H2z"/><path d="M3 7h1v4H3V7zm3 0h1v4H6V7zm3 0h1v4H9V7z"/>' 
    },
    { 
        name: 'Private Sector Organizations', 
        icon: '<path d="M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V16h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H3Zm1 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Z"/>' 
    }
];

const clients = [
    { name: 'Africa Nazarene University', logo: '/logo/Africa-Nazarene-University.png' },
    { name: 'Farsight Africa Group', logo: '/logo/Farsight-Africa-Group.png' },
    { name: 'Fortress Engineering', logo: '/logo/Fortress-Engineering-Ltd.jpg' },
    { name: 'Kenya Export Promotion', logo: '/logo/Kenya-Export-Promotion.jpg' },
    { name: 'KCAU Welfare', logo: '/logo/KCAU-Welfare.png' },
    { name: 'Green World', logo: '/logo/Green-World.png' },
    { name: 'Ebullient Agencies', logo: '/logo/Ebullient-Agencies-Ltd.png' },
    { name: 'Pivot Assets', logo: '/logo/Pivot-Assets.jpg' },
    { name: 'Digital Storytelling Africa', logo: '/logo/Digital-Storytelling-Africa.png' },
    { name: 'ThinkLab', logo: '/logo/ThinkLab_SVG.svg' },
    { name: 'Global Strategic Pillars', logo: '/logo/Global-Strategic-Pillars.jpg' },
    { name: 'All In Store', logo: '/logo/All-in_Store.png' }
];
</script>

<template>
  <section class="clients-section py-5 border-top border-bottom">
    <div class="container-fluid overflow-hidden px-4">
      
      <div class="row justify-content-center text-center mb-5" v-scroll-reveal>
          <div class="col-lg-8">
              <h6 class="text-uppercase text-gold ls-2 small fw-bold mb-2">Our Footprint</h6>
              <h2 class="display-6 fw-bold text-navy">Who We Serve</h2>
              <div class="divider mx-auto mt-3 bg-gold"></div>
              <p class="text-muted mt-4" style="max-width: 600px; margin: 0 auto;">
                  We partner with diverse institutions to drive sustainable impact, robust governance, and strategic clarity across the region.
              </p>
          </div>
      </div>

      <div class="row justify-content-center g-4 mb-5 pb-4" v-scroll-reveal="{ delay: 200 }">
         <div class="col-12 col-sm-6 col-md-4 col-xl-2 text-center" v-for="(type, index) in clientTypes" :key="index">
             <div class="client-type-card p-4 h-100 bg-white shadow-sm rounded-4 border">
                 <div class="icon-circle bg-navy text-gold mx-auto mb-3">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" v-html="type.icon"></svg>
                 </div>
                 <h6 class="fw-bold text-navy small mb-0 lh-base">{{ type.name }}</h6>
             </div>
         </div>
      </div>

      <div class="row justify-content-center text-center mb-4 mt-4">
          <div class="col-lg-8">
              <h6 class="text-uppercase text-muted ls-2 small fw-bold">Trusted by Industry Leaders</h6>
          </div>
      </div>

      <div class="marquee-wrapper">
        <div class="marquee-track">
            <div v-for="(client, index) in clients" :key="index" class="client-logo mx-4">
                <img :src="client.logo" :alt="client.name" class="img-fluid">
            </div>
            <div v-for="(client, index) in clients" :key="'dup-'+index" class="client-logo mx-4">
                 <img :src="client.logo" :alt="client.name" class="img-fluid">
            </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* STRICT COLORS */
.clients-section { background: #F8FAFC; } /* Very light blue-grey for professionalism */
.text-navy { color: #1b2c57 !important; }
.bg-navy { background-color: #1b2c57 !important; }
.text-gold { color: #bea429 !important; }
.bg-gold { background-color: #bea429 !important; }

.ls-2 { letter-spacing: 2px; }
.divider { width: 60px; height: 3px; border-radius: 2px; }

/* CLIENT TYPE CARDS */
.client-type-card {
    transition: all 0.3s ease;
    border-color: rgba(27, 44, 87, 0.05) !important;
}
.client-type-card:hover {
    transform: translateY(-8px);
    border-color: #bea429 !important;
    box-shadow: 0 15px 30px rgba(190, 164, 41, 0.1) !important;
}

.icon-circle {
    width: 60px; height: 60px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
}

.client-type-card:hover .icon-circle {
    background-color: #bea429 !important;
    color: #1b2c57 !important;
    transform: scale(1.1);
}

/* MARQUEE STYLES */
.marquee-wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;
    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

.marquee-track {
    display: flex;
    align-items: center;
    width: max-content;
    animation: scroll 50s linear infinite; 
}

.client-logo {
    width: 140px; 
    height: 90px;
    display: flex; align-items: center; justify-content: center;
}

.client-logo img {
    max-width: 100%; max-height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
}

.client-logo img:hover { transform: scale(1.1); }

@keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); } 
}
</style>