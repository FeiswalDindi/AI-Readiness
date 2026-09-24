import os

path = 'src/store.js'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_upload_image = False
upload_image_brace_count = 0

for line in lines:
    if "import { db, auth } from './firebase';" in line:
        new_lines.append("import { db, auth, storage } from './firebase';\n")
        new_lines.append("import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';\n")
        continue

    if "async uploadImage(file, path, onProgress) {" in line:
        in_upload_image = True
        
        new_upload = """  async uploadImage(file, pathStr, onProgress) {
        return new Promise((resolve, reject) => {
            const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const fullPath = `${pathStr}/${fileName}`;
            const fileRef = storageRef(storage, fullPath);
            const uploadTask = uploadBytesResumable(fileRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) onProgress(progress);
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    },
"""
        new_lines.append(new_upload)
        upload_image_brace_count = line.count('{') - line.count('}')
        continue

    if in_upload_image:
        upload_image_brace_count += line.count('{') - line.count('}')
        if upload_image_brace_count <= 0 and "}," in line:
            in_upload_image = False
        continue

    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)


# AdminDashboardView.vue
dash_path = 'src/views/AdminDashboardView.vue'
with open(dash_path, 'r', encoding='utf-8') as f:
    dash = f.read()

confetti_target = """              draftContent.value[fieldName] = url;
              saveSection(['countdownDate', 'posterUrl', 'logoUrl', 'phoneNumber']); // Just to be safe, save the whole settings section
          }
      } catch (e) {"""

confetti_replace = """              draftContent.value[fieldName] = url;
              saveSection(['countdownDate', 'posterUrl', 'logoUrl', 'phoneNumber']); // Just to be safe, save the whole settings section
          }
          
          confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#bea429', '#1b2c57', '#ffffff']
          });
      } catch (e) {"""

if 'confetti({' not in dash:
    dash = dash.replace(confetti_target, confetti_replace)

with open(dash_path, 'w', encoding='utf-8') as f:
    f.write(dash)

# AdminHeroEditor.vue
hero_path = 'src/components/admin/AdminHeroEditor.vue'
with open(hero_path, 'r', encoding='utf-8') as f:
    hero = f.read()

hero_confetti_target = """          props.slides[index].image = url;
      } catch (e) {"""

hero_confetti_replace = """          props.slides[index].image = url;
          confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#bea429', '#1b2c57', '#ffffff']
          });
      } catch (e) {"""

if 'import confetti from' not in hero:
    hero = hero.replace('<script setup>', "<script setup>\nimport confetti from 'canvas-confetti';")

if 'confetti({' not in hero:
    hero = hero.replace(hero_confetti_target, hero_confetti_replace)

with open(hero_path, 'w', encoding='utf-8') as f:
    f.write(hero)

print("Restored!")
