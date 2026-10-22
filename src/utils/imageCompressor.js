/**
 * Client-Side Image Compressor Utility
 * Automatically scales down and compresses images using HTML5 Canvas.
 * Reduces 5MB-10MB photos down to ~30KB-80KB with no visible quality loss.
 */

export async function compressImage(source, options = {}) {
    const {
        maxWidth = 1280,
        maxHeight = 1280,
        quality = 0.75,
        mimeType = 'image/jpeg'
    } = options;

    return new Promise((resolve, reject) => {
        let srcUrl = '';
        let originalSize = 0;
        let originalName = 'image.jpg';

        if (source instanceof File || source instanceof Blob) {
            srcUrl = URL.createObjectURL(source);
            originalSize = source.size;
            if (source.name) originalName = source.name;
        } else if (typeof source === 'string') {
            srcUrl = source;
            originalSize = Math.round(source.length * 0.75); // approx base64 size
        } else {
            return reject(new Error('Invalid image source'));
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            try {
                let { width, height } = img;

                // Scale down while maintaining aspect ratio
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Fill white background for transparent PNGs converted to JPEG
                if (mimeType === 'image/jpeg') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, width, height);
                }

                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL(mimeType, quality);

                canvas.toBlob((blob) => {
                    if (source instanceof File || source instanceof Blob) {
                        URL.revokeObjectURL(srcUrl);
                    }

                    if (!blob) {
                        return reject(new Error('Canvas blob conversion failed'));
                    }

                    const cleanName = originalName.replace(/\.[^/.]+$/, "") + ".jpg";
                    const compressedFile = new File([blob], cleanName, { type: mimeType });

                    resolve({
                        file: compressedFile,
                        blob: blob,
                        dataUrl: dataUrl,
                        width: width,
                        height: height,
                        originalSize: originalSize,
                        compressedSize: blob.size,
                        savedPercent: originalSize > 0 ? Math.round((1 - blob.size / originalSize) * 100) : 0
                    });
                }, mimeType, quality);

            } catch (err) {
                if (source instanceof File || source instanceof Blob) {
                    URL.revokeObjectURL(srcUrl);
                }
                reject(err);
            }
        };

        img.onerror = (err) => {
            if (source instanceof File || source instanceof Blob) {
                URL.revokeObjectURL(srcUrl);
            }
            reject(new Error('Failed to load image for compression'));
        };

        img.src = srcUrl;
    });
}
