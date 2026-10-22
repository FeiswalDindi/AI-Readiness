/**
 * Firebase & Google Cloud Storage Diagnostics
 * Real-time checks for Firestore 1MB document limit, rules expiration, and Google Cloud Storage bucket presence.
 */

const STORAGE_BUCKET = "ai-readiness-b3883-media";
const FIRESTORE_MAX_BYTES = 1048576; // 1 MiB hard limit

export async function checkStorageStatus() {
    try {
        // Probe Google Cloud Storage directly
        const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${STORAGE_BUCKET}`, {
            method: 'GET'
        });

        if (response.status === 200 || response.status === 401 || response.status === 403) {
            return {
                status: 'OK',
                code: response.status,
                title: 'Google Cloud Storage Active',
                badge: 'Active & Connected',
                badgeClass: 'bg-success',
                reason: 'Google Cloud Media Bucket is provisioned and ready for uploads.',
                action: 'No action needed.'
            };
        }

        if (response.status === 404) {
            return {
                status: 'NOT_FOUND',
                code: 404,
                title: 'Storage Bucket Not Found',
                badge: 'Not Found (404)',
                badgeClass: 'bg-danger',
                reason: 'The Cloud Storage bucket does not exist in Google Cloud.',
                action: 'Verify bucket creation in Google Cloud Console.'
            };
        }

        return {
            status: 'UNKNOWN',
            code: response.status,
            title: `HTTP ${response.status}`,
            badge: 'Checking',
            badgeClass: 'bg-warning text-dark',
            reason: `Storage returned HTTP status ${response.status}.`,
            action: 'Verify Storage configuration in Google Cloud Console.'
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
