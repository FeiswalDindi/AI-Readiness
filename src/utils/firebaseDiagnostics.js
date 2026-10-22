/**
 * Firebase Diagnostics & Storage Health Checker
 * Real-time checks for Firestore 1MB document limit, rules expiration, and Cloud Storage bucket presence.
 */

const STORAGE_BUCKET = "ai-readiness-b3883.firebasestorage.app";
const FIRESTORE_MAX_BYTES = 1048576; // 1 MiB hard limit

export async function checkStorageStatus() {
    try {
        const response = await fetch(`https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o`, {
            method: 'GET'
        });

        if (response.status === 404) {
            return {
                status: 'NOT_FOUND',
                code: 404,
                title: 'Storage Bucket Not Activated',
                badge: 'Not Activated',
                badgeClass: 'bg-danger',
                reason: 'The Cloud Storage bucket has not been initialized yet in Google Firebase Console.',
                action: 'Go to Firebase Console -> Storage -> Click "Get started" to create your bucket.'
            };
        }

        if (response.status === 401 || response.status === 403) {
            // Note: 401/403 on listing the whole bucket /o root is normal for standard rules,
            // but means the bucket DEFINITELY exists!
            return {
                status: 'BUCKET_EXISTS',
                code: response.status,
                title: 'Storage Bucket Active',
                badge: 'Active',
                badgeClass: 'bg-success',
                reason: 'Storage bucket is provisioned in Google Cloud.',
                action: 'Ensure Storage rules have allow read, write: if true;'
            };
        }

        if (response.status === 200) {
            return {
                status: 'OK',
                code: 200,
                title: 'Storage Ready',
                badge: 'Ready & Open',
                badgeClass: 'bg-success',
                reason: 'Storage is fully operational.',
                action: 'No action needed.'
            };
        }

        return {
            status: 'UNKNOWN',
            code: response.status,
            title: `HTTP ${response.status}`,
            badge: 'Warning',
            badgeClass: 'bg-warning text-dark',
            reason: `Storage returned HTTP status ${response.status}.`,
            action: 'Verify Storage configuration in Firebase Console.'
        };
    } catch (err) {
        return {
            status: 'NETWORK_ERROR',
            code: 0,
            title: 'Connection Error',
            badge: 'Offline',
            badgeClass: 'bg-secondary',
            reason: err.message,
            action: 'Check your internet connection.'
        };
    }
}

export function getDocSizeDetails(content) {
    try {
        const jsonStr = JSON.stringify(content || {});
        const sizeBytes = new Blob([jsonStr]).size;
        const sizeKB = (sizeBytes / 1024).toFixed(1);
        const percentUsed = Math.min(100, Math.round((sizeBytes / FIRESTORE_MAX_BYTES) * 100));

        let status = 'good';
        let badgeClass = 'bg-success';
        if (percentUsed >= 90) {
            status = 'critical';
            badgeClass = 'bg-danger';
        } else if (percentUsed >= 70) {
            status = 'warning';
            badgeClass = 'bg-warning text-dark';
        }

        return {
            sizeBytes,
            sizeKB,
            limitKB: 1024,
            remainingKB: Math.max(0, ((FIRESTORE_MAX_BYTES - sizeBytes) / 1024)).toFixed(1),
            percentUsed,
            status,
            badgeClass,
            isNearLimit: percentUsed >= 75
        };
    } catch (e) {
        return {
            sizeBytes: 0,
            sizeKB: '0',
            limitKB: 1024,
            remainingKB: '1024',
            percentUsed: 0,
            status: 'good',
            badgeClass: 'bg-success',
            isNearLimit: false
        };
    }
}

export function checkFirestoreExpiry() {
    const expiryDate = new Date('2026-10-24T00:00:00Z');
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
        expiryDate: 'October 24, 2026',
        daysLeft: Math.max(0, daysLeft),
        isExpiringSoon: daysLeft <= 5,
        isExpired: daysLeft <= 0
    };
}
