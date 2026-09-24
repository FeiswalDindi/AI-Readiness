import os

path = 'src/views/HomeView.vue'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add state variable
script_target = "const selectedMember = ref(null);"
script_replacement = "const selectedMember = ref(null);\nconst isPosterModalOpen = ref(false);"
if "isPosterModalOpen =" not in c:
    c = c.replace(script_target, script_replacement)

# 2. Modify poster-container HTML
html_target = """                            <div v-if="store.content.posterUrl" class="poster-container rounded overflow-hidden shadow">
                                <img :src="store.content.posterUrl" class="img-fluid" alt="Project Poster" />
                            </div>"""

html_replacement = """                            <div v-if="store.content.posterUrl" 
                                 class="poster-container rounded overflow-hidden shadow position-relative cursor-pointer poster-hover-group"
                                 @click="isPosterModalOpen = true">
                                <img :src="store.content.posterUrl" class="img-fluid w-100 transition-transform poster-img" alt="Project Poster" />
                                <div class="poster-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center opacity-0 transition-opacity">
                                     <span class="text-white fw-bold d-flex align-items-center bg-dark bg-opacity-75 px-3 py-2 rounded-pill shadow-lg">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="me-2 text-gold" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/><path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/><path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/></svg>
                                         View Full Poster
                                     </span>
                                </div>
                            </div>"""
if "poster-hover-group" not in c:
    c = c.replace(html_target, html_replacement)

# 3. Add Modal HTML to the bottom of the template
template_end = "</main>"
modal_html = """
    <!-- POSTER MODAL -->
    <transition name="fade">
        <div v-if="isPosterModalOpen" class="modal-overlay d-flex justify-content-center align-items-center p-3 z-3">
            <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75" @click="isPosterModalOpen = false"></div>
            <div class="position-relative bg-white border border-secondary shadow-lg d-flex flex-column align-items-center rounded-0" style="max-width: 900px; width: 100%; max-height: 95vh; overflow-y: auto; padding: 20px;">
                
                <!-- Close Button -->
                <button class="btn btn-dark position-absolute rounded-circle p-2 shadow-sm border-2 border-white z-3" style="top: 10px; right: 10px; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;" @click="isPosterModalOpen = false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>
                </button>

                <!-- Full Image -->
                <img :src="store.content.posterUrl" class="img-fluid border border-light shadow-sm mb-4" style="max-height: 65vh; object-fit: contain; width: auto;" alt="Full Project Poster" />
                
                <!-- Action Buttons -->
                <div class="d-flex flex-wrap gap-3 justify-content-center w-100 bg-light p-3 border-top">
                    <!-- Go to survey button -->
                    <button @click="store.startSurveyFlow(); isPosterModalOpen = false;" class="btn btn-gold btn-lg px-5 py-3 rounded-0 fw-bold shadow-sm text-uppercase ls-1 d-flex align-items-center">
                        Go to survey 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="ms-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>
                    </button>
                    
                    <!-- Download button -->
                    <a :href="store.content.posterUrl" download="Project_Poster.jpg" class="btn btn-outline-dark btn-lg px-4 py-3 rounded-0 fw-bold shadow-sm text-uppercase ls-1 d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="me-2" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                        Download Poster
                    </a>
                </div>
            </div>
        </div>
    </transition>
  </main>"""
if "<!-- POSTER MODAL -->" not in c:
    c = c.replace(template_end, modal_html)

# 4. Add custom CSS for hover state
css_target = ".cursor-pointer { cursor: pointer; }"
css_replacement = """.cursor-pointer { cursor: pointer; }
.poster-hover-group:hover .poster-overlay { opacity: 1 !important; }
.poster-hover-group:hover .poster-img { transform: scale(1.05); }
.transition-transform { transition: transform 0.4s ease; }
.transition-opacity { transition: opacity 0.3s ease; }"""
if "poster-hover-group" not in c:
    c = c.replace(css_target, css_replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("done")
