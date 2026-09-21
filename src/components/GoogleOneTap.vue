<script setup>
import { onMounted } from 'vue';
import { auth, googleProvider } from '../firebase';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

const initializeGoogleOneTap = () => {
  // 1. Check if the script is loaded
  if (!window.google) {
    console.warn("Google Script not loaded yet. Retrying...");
    setTimeout(initializeGoogleOneTap, 500); // Try again in 0.5s
    return;
  }

  // 2. Initialize One Tap
  window.google.accounts.id.initialize({
    // IMPORTANT: This must match the "Web client ID" from Firebase Authentication settings
    client_id: "563844962607-l97k6aknol8n3duh1bgi0k17tknf9atf.apps.googleusercontent.com", 
    
    // The callback when user clicks "Sign In"
    callback: handleCredentialResponse,
    
    // Debugging: Print errors to console
    cancel_on_tap_outside: false,
    context: 'signin',
  });

  // 3. Render the popup
  window.google.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed()) {
      console.error("One Tap blocked because:", notification.getNotDisplayedReason());
    } else if (notification.isSkippedMoment()) {
      console.warn("One Tap skipped because:", notification.getSkippedReason());
    } else {
      console.log("One Tap displayed successfully!");
    }
  });
};

const handleCredentialResponse = async (response) => {
  try {
    const credential = GoogleAuthProvider.credential(response.credential);
    await signInWithCredential(auth, credential);
    console.log("Logged in via One Tap!");
  } catch (error) {
    console.error("One Tap Login Error:", error);
  }
};

onMounted(() => {
  // Wait a moment for the page to settle, then load
  setTimeout(initializeGoogleOneTap, 1000);
});
</script>

<template>
  <div id="one-tap-container"></div>
</template>